// Exports one episode of a series project to a self-contained folder: a single JSON
// (episode, scenes, shots, keyframes, screenplay, cast, mood boards, image manifest)
// plus copies of every keyframe / cast image and the screenplay sources it references.
//
//   node scripts/export-episode.mjs                       # episode 1 → exports/episode-1/
//   node scripts/export-episode.mjs --episode 4           # any other episode (act) of the project
//   node scripts/export-episode.mjs --out /tmp/ep1        # choose the folder
//   node scripts/export-episode.mjs --project my.json     # an exported project backup instead of the bundle
//   node scripts/export-episode.mjs --json-only           # write the JSON, skip copying files
//   node scripts/export-episode.mjs --clean               # wipe a previous export in --out first
//   node scripts/export-episode.mjs --reel                # one self-contained reel.json, images embedded
//   node scripts/export-episode.mjs --reel --reel-width 1376 --reel-quality 85
//   node scripts/export-episode.mjs --reel --reel-full    # embed the untouched originals (~1.33x their size)
//
// `--reel` writes a single file (`reel.json` by default, `--name` to rename) with no images/ or
// screenplay/ folder beside it: every keyframe, cast sheet and mood board image is embedded as a
// base64 `data:` URI, and the screenplay text that used to be written to disk is inlined. Images
// are re-encoded smaller first (max width 800px, JPEG quality 62, about 7 MB for episode 1) so the
// file stays handable; `--reel-width`, `--reel-quality` and `--reel-full` control that. The images
// are still cross-referenced by their `source` app path (and each shot by `imageIndex`) so nothing
// is duplicated inside the file. Re-encoding needs ImageMagick (`magick` or `convert`) on PATH;
// without it the script embeds the untouched originals and says so as a warning.
//
// Episodes are the project's acts. The exported JSON references every copied file by a path
// relative to the export folder, and keeps the original app path (`source`) next to it so
// the export can always be traced back to public/ and docs/.
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve } from "node:path";

const root = process.cwd();

// ---------------------------------------------------------------- arguments
const args = process.argv.slice(2);
const flag = name => args.includes(`--${name}`);
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  const value = args[i + 1];
  if (value === undefined || value.startsWith("--")) { console.error(`--${name} needs a value`); process.exit(2); }
  return value;
};
if (flag("help") || flag("h")) {
  const header = [];
  for (const line of readFileSync(new URL(import.meta.url), "utf8").split("\n")) { if (!line.startsWith("//")) break; header.push(line.slice(3)); }
  console.log(header.join("\n"));
  process.exit(0);
}
const episodeNumber = Number.parseInt(option("episode", "1"), 10);
if (!Number.isInteger(episodeNumber) || episodeNumber < 1) { console.error("--episode must be a positive integer"); process.exit(2); }
const projectPath = resolve(root, option("project", "public/projects/let-the-raptures-commence.json"));
const outDir = resolve(root, option("out", `exports/episode-${episodeNumber}`));
const jsonOnly = flag("json-only");
const clean = flag("clean");
const reel = flag("reel");
const reelFull = flag("reel-full");
const intOption = (name, fallback, min, max) => {
  const value = Number.parseInt(option(name, String(fallback)), 10);
  if (!Number.isInteger(value) || value < min || value > max) { console.error(`--${name} must be an integer between ${min} and ${max}`); process.exit(2); }
  return value;
};
const reelWidth = intOption("reel-width", 800, 0, 8192);   // 0 = keep the original size, still re-encoded
const reelQuality = intOption("reel-quality", 62, 1, 100);
const jsonName = option("name", reel ? "reel.json" : `episode-${episodeNumber}.json`);
/** In reel mode nothing is written beside the JSON: images go in as data URIs, screenplay as text. */
const copyFiles = !jsonOnly && !reel;
const publicDir = join(root, "public");
const sceneSourcesDir = join(root, "docs", "rapture", "scenes");

// ---------------------------------------------------------------- helpers
const slugify = title => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "untitled";
const pad = n => String(n).padStart(2, "0");
const ORDINALS = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12 };
/** "Episode 4 — The old lady", "EPISODE FOUR — SCENE 5", "Episode One" → 4 / 4 / 1; anything else → null. */
const episodeNumberOf = text => {
  const m = /^\s*episode\s+([a-z]+|\d+)\b/i.exec(text || "");
  if (!m) return null;
  const token = m[1].toLowerCase();
  return /^\d+$/.test(token) ? Number(token) : ORDINALS[token] ?? null;
};
/** Sluglines compare loosely: any dash, any spacing, any case. */
const normalise = text => (text || "").replace(/[\u2012-\u2015]/g, "-").replace(/\s+/g, " ").trim().toUpperCase();
const sceneHeadings = scene => [normalise(`${scene.location} — ${scene.time}`), normalise(scene.location)];
/** "INT. POLICE CAR — NIGHT (PARKED)" already carries its time; don't print it twice. */
const sluglineOf = scene => normalise(scene.location).includes(`- ${normalise(scene.time)}`) ? scene.location : `${scene.location} — ${scene.time}`;

/** Pixel size of a JPEG or PNG without an image library; null for anything else. */
function imageSize(buffer) {
  if (buffer.length > 24 && buffer.readUInt32BE(0) === 0x89504e47) return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  if (buffer.length > 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset++; continue; }
      const marker = buffer[offset + 1];
      if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) { offset += 2; continue; }
      const length = buffer.readUInt16BE(offset + 2);
      const isFrameHeader = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
      if (isFrameHeader) return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
      offset += 2 + length;
    }
  }
  return null;
}

// ---------------------------------------------------------------- image re-encoding (--reel)
const MIME_BY_EXT = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif", ".avif": "image/avif", ".svg": "image/svg+xml" };
const RESIZABLE = new Set(["image/jpeg", "image/png", "image/webp"]);
const mimeOf = file => MIME_BY_EXT[extname(file).toLowerCase()] ?? "application/octet-stream";
const reelWarnings = [];
let resizeTool;
/** ImageMagick 7 (`magick`) or 6 (`convert`); null when neither is on PATH. */
function findResizeTool() {
  if (resizeTool !== undefined) return resizeTool;
  resizeTool = null;
  for (const cmd of ["magick", "convert"]) {
    const probe = spawnSync(cmd, ["-version"], { encoding: "utf8" });
    if (!probe.error && probe.status === 0 && /ImageMagick/i.test(probe.stdout || "")) { resizeTool = cmd; break; }
  }
  return resizeTool;
}
/** Re-encodes a file to a stripped JPEG, or returns null if the tool is missing or failed. */
function reencode(file) {
  const cmd = findResizeTool();
  if (!cmd) return null;
  const args = reelWidth > 0
    ? [file, "-strip", "-resize", `${reelWidth}x${reelWidth}>`, "-quality", String(reelQuality), "jpeg:-"]
    : [file, "-strip", "-quality", String(reelQuality), "jpeg:-"];
  const run = spawnSync(cmd, args, { encoding: "buffer", maxBuffer: 128 * 1024 * 1024 });
  if (run.status !== 0 || !run.stdout?.length) return null;
  return run.stdout;
}
/** The bytes a --reel export inlines for one file, as a data URI plus its real dimensions. */
function embedImage(file, buffer) {
  const sourceMime = mimeOf(file);
  let out = buffer;
  let mime = sourceMime;
  let reencoded = false;
  if (!reelFull && RESIZABLE.has(sourceMime)) {
    const encoded = reencode(file);
    if (encoded) { out = encoded; mime = "image/jpeg"; reencoded = true; }
    else if (!reelWarnings.length) reelWarnings.push("ImageMagick (`magick` / `convert`) is unavailable or failed — images are embedded at their original size and quality. Use --reel-width / --reel-quality to change the target, or --reel-full to skip re-encoding deliberately.");
  }
  const size = imageSize(out);
  return {
    mime,
    reencoded,
    bytes: out.length,
    width: size?.width ?? null,
    height: size?.height ?? null,
    sha256: createHash("sha256").update(out).digest("hex"),
    dataUri: `data:${mime};base64,${out.toString("base64")}`,
  };
}

/** Copies one public/ asset into the export (once) and returns its manifest entry. */
const manifest = new Map();
function exportImage(appPath, target, meta) {
  if (!appPath) return null;
  if (manifest.has(appPath)) {
    const entry = manifest.get(appPath);
    for (const [key, value] of Object.entries(meta)) if (entry[key] == null) entry[key] = value;
    return entry;
  }
  const sourceFile = join(publicDir, appPath);
  const entry = { file: copyFiles ? target.split("\\").join("/") : null, source: appPath, kind: meta.kind, present: existsSync(sourceFile), bytes: null, width: null, height: null, sha256: null, ...meta };
  entry.index = manifest.size; // position in the output's `images` array
  if (entry.present) {
    const buffer = readFileSync(sourceFile);
    const size = imageSize(buffer);
    const original = { bytes: buffer.length, width: size?.width ?? null, height: size?.height ?? null, sha256: createHash("sha256").update(buffer).digest("hex") };
    if (reel) {
      Object.assign(entry, embedImage(sourceFile, buffer), {
        originalBytes: original.bytes,
        originalWidth: original.width,
        originalHeight: original.height,
        originalSha256: original.sha256,
        originalMime: mimeOf(appPath),
      });
    } else {
      Object.assign(entry, original);
    }
    if (copyFiles) { mkdirSync(dirname(join(outDir, target)), { recursive: true }); copyFileSync(sourceFile, join(outDir, target)); }
  }
  manifest.set(appPath, entry);
  return entry;
}
/** Where an image lives in this export: `images[imageIndex]` carries the file path or the data URI. */
const imageRef = (entry, source = entry?.source ?? null) => ({
  file: entry?.present && copyFiles ? entry.file : null,
  source,
  imageIndex: entry?.index ?? null,
  present: entry?.present ?? false,
  mime: entry?.mime ?? (source ? mimeOf(source) : null),
});

const SCRIPT_MARKER = /NUMBERED SCRIPT — dialogue and action remain in sequence:\n/;
/** The numbered source lines the build script stores on each studied shot, or null for outline/legacy boards. */
const shotScript = notes => { const parts = (notes || "").split(SCRIPT_MARKER); return parts.length > 1 ? parts.slice(1).join("").trim() : null; };

// ---------------------------------------------------------------- load the project
if (!existsSync(projectPath)) { console.error(`Project file not found: ${projectPath}`); process.exit(1); }
const project = JSON.parse(readFileSync(projectPath, "utf8"));
const act = project.acts.find(a => episodeNumberOf(a.title) === episodeNumber) || project.acts[episodeNumber - 1];
if (!act) {
  console.error(`No episode ${episodeNumber} in "${project.title}". Acts: ${project.acts.map((a, i) => `${i + 1}. ${a.title}`).join(" | ")}`);
  process.exit(1);
}
const actIndex = project.acts.indexOf(act);
const character = id => project.characters.find(c => c.id === id);
const castRefs = ids => (ids || []).map(id => ({ id, name: character(id)?.name || null }));

// ---------------------------------------------------------------- output folder
if (clean && existsSync(outDir)) {
  const looksLikeAnExport = readdirSync(outDir).some(name => /^episode-\d+\.json$/.test(name) || /^reel(-.*)?\.json$/.test(name));
  if (!looksLikeAnExport) { console.error(`Refusing to --clean ${outDir}: it does not look like a previous export (no episode-N.json inside).`); process.exit(1); }
  rmSync(outDir, { recursive: true, force: true });
}
mkdirSync(outDir, { recursive: true });

// ---------------------------------------------------------------- scenes and shots
const scenes = project.scenes.filter(s => s.actId === act.id);
const sceneIds = new Set(scenes.map(s => s.id));
const frameIndex = new Map(project.frames.map((f, i) => [f.id, i + 1]));
let episodeShotNumber = 0;

/** Exact slugline match first, then the longest scene heading the slugline starts or ends with (sources may carry a title or extra direction). */
const boundary = ch => ch === undefined || /[\s.,;:()\-]/.test(ch);
const sceneForSlugline = (slugline, { exactOnly = false, among = scenes } = {}) => {
  if (!slugline) return undefined;
  const exact = among.find(sc => sceneHeadings(sc).includes(slugline));
  if (exact || exactOnly) return exact;
  const candidates = scenes.flatMap(sc => sceneHeadings(sc).filter(Boolean).map(h => ({ sc, h })))
    .filter(({ h }) => (slugline.startsWith(h) && boundary(slugline[h.length])) || (slugline.endsWith(h) && boundary(slugline[slugline.length - h.length - 1])))
    .sort((a, b) => b.h.length - a.h.length);
  return candidates[0]?.sc;
};

// Every numbered scene document is a candidate (file names can lag behind a scene moving episodes);
// those with this episode's ep<N>- prefix are tried first so a stale name never steals a match.
const prefix = `ep${episodeNumber}-`;
const sceneSourceFiles = existsSync(sceneSourcesDir)
  ? readdirSync(sceneSourcesDir).filter(name => name.endsWith(".md")).sort((a, b) => Number(b.startsWith(prefix)) - Number(a.startsWith(prefix)) || a.localeCompare(b))
  : [];
const sceneSources = sceneSourceFiles.map(name => {
  const text = readFileSync(join(sceneSourcesDir, name), "utf8");
  const lines = text.split("\n");
  const heading = (lines.find(line => /^#{1,2}\s+episode/i.test(line)) || "").replace(/^#+\s*/, "").trim();
  const sceneLine = (/^Scene:\s*(.+)$/m.exec(text) || [])[1] || lines.find(line => /^(INT|EXT)\b/i.test(line.trim())) || "";
  const slugline = normalise(sceneLine);
  const named = name.startsWith(prefix);
  // A file named for another episode is only adopted on an exact slugline match.
  const scene = sceneForSlugline(slugline, { exactOnly: !named });
  return { file: `screenplay/${name}`, sourcePath: relative(root, join(sceneSourcesDir, name)).split("\\").join("/"), heading, slugline, text, sceneId: scene?.id || null, named };
}).filter((source, i, all) => (source.sceneId && all.findIndex(o => o.sceneId === source.sceneId) === i) || (!source.sceneId && source.named));
/** Where a stale ep<N>- file really belongs, for the warning. */
const elsewhere = slugline => {
  const scene = sceneForSlugline(slugline, { exactOnly: true, among: project.scenes.filter(sc => sc.actId !== act.id) });
  const owner = scene && project.acts.find(a => a.id === scene.actId);
  return scene ? ` — its slugline is scene "${scene.title}" in ${owner ? owner.title : "another act"}` : "";
};

const exportedScenes = scenes.map((scene, i) => {
  const number = i + 1;
  const folder = `images/keyframes/${pad(number)}-${slugify(scene.title)}`;
  const frames = project.frames.filter(f => f.sceneId === scene.id);
  const source = sceneSources.find(s => s.sceneId === scene.id);

  const shots = frames.map((frame, j) => {
    episodeShotNumber += 1;
    const keyframe = frame.image
      ? exportImage(frame.image, `${folder}/${basename(frame.image)}`, { kind: "keyframe", sceneId: scene.id, shotId: frame.id })
      : null;
    return {
      number: j + 1,
      episodeShotNumber,
      projectShotNumber: frameIndex.get(frame.id),
      id: frame.id,
      sceneId: scene.id,
      title: frame.title,
      description: frame.description,
      shotType: frame.shotType,
      angle: frame.angle || "Eye level",
      lens: frame.lens || null,
      movement: frame.movement,
      lighting: frame.lighting || scene.lighting || null,
      lightingNotes: frame.lightingNotes || scene.lightingNotes || null,
      style: frame.style || scene.style || null,
      transition: frame.transition || "Cut",
      duration: frame.duration,
      durationIsEstimate: Boolean(frame.durationIsEstimate),
      status: frame.status,
      mood: frame.mood || null,
      cast: castRefs(frame.characters),
      notes: frame.notes || "",
      script: shotScript(frame.notes),
      keyframe: keyframe
        ? { ...imageRef(keyframe), width: keyframe.width, height: keyframe.height, bytes: keyframe.bytes, sha256: keyframe.sha256 }
        : null,
    };
  });

  const boards = project.moodboards.filter(b => b.sceneId === scene.id).map(b => b.id);
  return {
    number,
    id: scene.id,
    title: scene.title,
    location: scene.location,
    time: scene.time,
    slugline: sluglineOf(scene),
    kind: scene.kind || "Standard",
    description: scene.description,
    lighting: scene.lighting || null,
    lightingNotes: scene.lightingNotes || null,
    style: scene.style || null,
    cast: castRefs(scene.characters),
    boarded: shots.length > 0,
    shotCount: shots.length,
    keyframesOnDisk: shots.filter(s => s.keyframe?.present).length,
    estimatedDurationSeconds: shots.reduce((sum, s) => sum + (Number(s.duration) || 0), 0),
    allDurationsAreEstimates: shots.length > 0 && shots.every(s => s.durationIsEstimate),
    screenplay: source ? { file: copyFiles ? source.file : null, sourcePath: source.sourcePath, heading: source.heading } : null,
    moodboards: boards,
    keyframesFolder: shots.length ? folder : null,
    shots,
  };
});

// ---------------------------------------------------------------- screenplay (the app's Screenplay tab, this episode only)
function screenplaySections(script) {
  const lines = (script || "").split("\n");
  const starts = [];
  lines.forEach((line, i) => {
    if (episodeNumberOf(line) === null) return;
    const previous = lines[i - 1];
    starts.push(previous && previous.trim() && previous.trim() === previous.trim().toUpperCase() && !/^EPISODE\b/i.test(previous) ? i - 1 : i);
  });
  return starts.map((start, k) => {
    const block = lines.slice(start, starts[k + 1] ?? lines.length);
    const headingLine = block.find(line => episodeNumberOf(line) !== null) || "";
    const slugline = normalise(block.slice(1).find(line => /^(INT|EXT)\b/i.test(line.trim())) || "");
    return { heading: headingLine.trim(), episode: episodeNumberOf(headingLine), slugline, text: block.join("\n").trim() };
  });
}
const sections = screenplaySections(project.script).filter(s => s.episode === episodeNumber).map(section => {
  const scene = sceneForSlugline(section.slugline);
  return { heading: section.heading, sceneId: scene?.id || null, text: section.text };
});
const episodeText = sections.map(s => s.text).join("\n\n\n");
const episodeTextFile = `screenplay/episode-${episodeNumber}.txt`;
if (copyFiles) {
  mkdirSync(join(outDir, "screenplay"), { recursive: true });
  writeFileSync(join(outDir, episodeTextFile), episodeText ? `${episodeText}\n` : "");
  for (const source of sceneSources) writeFileSync(join(outDir, source.file), source.text);
}
for (const section of sections) {
  const scene = exportedScenes.find(s => s.id === section.sceneId);
  if (scene) scene.screenplay = { ...(scene.screenplay || { file: null, sourcePath: null, heading: section.heading }), inProjectScript: true };
}

// ---------------------------------------------------------------- cast, mood boards
const castIds = [...new Set([...scenes.flatMap(s => s.characters || []), ...exportedScenes.flatMap(s => s.shots.flatMap(shot => shot.cast.map(c => c.id)))])];
const cast = castIds.map(character).filter(Boolean).map(c => {
  const image = c.image ? exportImage(c.image, `images/cast/${basename(c.image)}`, { kind: "cast", characterId: c.id }) : null;
  return {
    id: c.id,
    name: c.name,
    role: c.role,
    age: c.age || null,
    description: c.description,
    traits: c.traits || [],
    image: image ? imageRef(image) : null,
    relations: (c.relations || []).map(r => ({ kind: r.kind, targetId: r.targetId, targetName: character(r.targetId)?.name || null, note: r.note || null, inEpisode: castIds.includes(r.targetId) })),
    scenes: exportedScenes.filter(s => s.cast.some(x => x.id === c.id) || s.shots.some(shot => shot.cast.some(x => x.id === c.id))).map(s => s.id),
    shotCount: exportedScenes.reduce((n, s) => n + s.shots.filter(shot => shot.cast.some(x => x.id === c.id)).length, 0),
  };
});
const unknownCast = castIds.filter(id => !character(id));

const moodboards = project.moodboards.filter(b => b.actId === act.id || sceneIds.has(b.sceneId)).map(b => ({
  id: b.id,
  title: b.title,
  description: b.description || "",
  sceneId: b.sceneId || null,
  items: b.items.map(item => {
    const image = exportImage(item.image, `images/moodboards/${slugify(b.title)}/${basename(item.image)}`, { kind: "moodboard", moodboardId: b.id });
    return { id: item.id, caption: item.caption || "", ...imageRef(image, item.image) };
  }),
}));

// ---------------------------------------------------------------- write the JSON
const shots = exportedScenes.flatMap(s => s.shots);
const images = [...manifest.values()];
const missing = images.filter(i => !i.present);
const embedded = reel ? images.filter(i => i.present && i.dataUri) : [];
const embeddedBytes = embedded.reduce((n, i) => n + (i.bytes || 0), 0);
const PATHS_NOTE = reel
  ? "Self-contained: no files beside this one. Every image is embedded as a `dataUri` on its `images[]` entry (shots, cast and mood boards point at it with `imageIndex`, or by `source`); `bytes`/`width`/`height`/`sha256` describe the embedded image and `originalBytes`/`originalWidth`/`originalHeight`/`originalSha256` the file under public/. `source` is always the path the app serves it from."
  : "Every `file` is relative to this folder; every `source` is the path the app serves it from under public/ (or the repo path for screenplay sources).";
// ---------------------------------------------------------------- README (a file for folder exports, inlined for a reel)
const generatedAt = new Date().toISOString();
const projectSource = relative(root, projectPath).split("\\").join("/");
const keyframesOnDisk = shots.filter(s => s.keyframe?.present).length;
const readme = `# ${project.title} — ${act.title}

Exported ${generatedAt} by \`scripts/export-episode.mjs\` from \`${projectSource}\`.

${reel ? `- \`${jsonName}\` — the whole export in one self-contained file: episode, scenes, shots, keyframes, screenplay, cast, mood boards and the image manifest, with every image embedded as a base64 data URI (${embedded.length} images, ${reelFull ? "originals" : `max width ${reelWidth || "original"}px, JPEG quality ${reelQuality}`}).`
      : `- \`${jsonName}\` — everything below in one file: episode, scenes, shots, keyframes, screenplay, cast, mood boards and an image manifest (relative \`file\` paths plus the original \`source\` app paths).
- \`images/keyframes/<scene>/\` — one keyframe per shot, one folder per scene, in shot order (${keyframesOnDisk} files).
- \`images/cast/\` — character sheets for the ${cast.length} cast members who appear in this episode.
- \`screenplay/episode-${episodeNumber}.txt\` — this episode's part of the project's Screenplay tab; \`screenplay/*.md\` are the numbered scene sources the storyboard was built from.`}

${exportedScenes.map(s => `${s.number}. **${s.title}** — ${s.slugline} (${s.kind}) — ${s.shotCount ? `${s.shotCount} shots, ~${s.estimatedDurationSeconds}s estimated` : "outline only, not boarded"}${s.screenplay ? "" : " — no screenplay yet"}`).join("\n")}

Durations marked as estimates are working animatic totals, not locked shooting lengths. Legacy "board" shots (status *Needs review*) are ordered reference keyframes, not approved coverage.
`;

const output = {
  format: "playframe-episode-export",
  variant: reel ? "reel" : "folder",
  selfContained: reel,
  version: 1,
  generatedAt,
  generator: "scripts/export-episode.mjs",
  paths: { note: PATHS_NOTE, imagesCopied: copyFiles, imagesEmbedded: reel },
  project: { id: project.id, title: project.title, description: project.description, genre: project.genre, format: project.format, status: project.status, source: projectSource },
  episode: {
    number: episodeNumber,
    actIndex,
    id: act.id,
    title: act.title,
    description: act.description,
    parts: act.parts || [],
    sceneCount: exportedScenes.length,
    boardedSceneCount: exportedScenes.filter(s => s.boarded).length,
    shotCount: shots.length,
    keyframesOnDisk,
    estimatedDurationSeconds: shots.reduce((sum, s) => sum + (Number(s.duration) || 0), 0),
    scenes: exportedScenes.map(s => ({ number: s.number, id: s.id, title: s.title, kind: s.kind, shotCount: s.shotCount })),
  },
  scenes: exportedScenes,
  shots,
  keyframes: shots.filter(s => s.keyframe).map(s => ({ shotId: s.id, sceneId: s.sceneId, sceneNumber: exportedScenes.find(sc => sc.id === s.sceneId).number, shotNumber: s.number, episodeShotNumber: s.episodeShotNumber, title: s.title, ...s.keyframe })),
  screenplay: {
    note: "`episodeText` is this episode's part of the project's Screenplay tab. `sources` are the numbered scene documents the storyboard was built from; scenes marked outline-only have no screenplay yet.",
    episodeTextFile: copyFiles ? episodeTextFile : null,
    episodeText,
    sections,
    sources: sceneSources.map(s => ({ file: copyFiles ? s.file : null, sourcePath: s.sourcePath, heading: s.heading, sceneId: s.sceneId, text: s.text })),
  },
  cast,
  moodboards,
  images,
  imageEncoding: reel ? { maxWidth: reelWidth || null, quality: reelQuality, reencoded: !reelFull, embeddedCount: embedded.length, embeddedBytes } : null,
  readme: reel ? readme : undefined,
  warnings: [
    ...reelWarnings,
    ...missing.map(i => `Missing on disk: ${i.source} (${i.kind})`),
    ...unknownCast.map(id => `Cast id "${id}" is referenced but not in the project's characters`),
    ...sceneSources.filter(s => !s.sceneId).map(s => `Screenplay source ${s.sourcePath} is named for this episode but matches none of its scenes${elsewhere(s.slugline)}`),
    ...sections.filter(s => !s.sceneId).map(s => `Screenplay section "${s.heading}" could not be matched to a scene by its slugline`),
  ],
};

// ---------------------------------------------------------------- write the JSON
const jsonFile = jsonName;
writeFileSync(join(outDir, jsonFile), `${JSON.stringify(output, null, 2)}\n`);
if (copyFiles) writeFileSync(join(outDir, "README.md"), readme);

// ---------------------------------------------------------------- report
const mb = bytes => `${(bytes / 1024 / 1024).toFixed(1)} MB`;
const where = relative(root, outDir) || ".";
console.log(`${project.title} — ${act.title}`);
console.log(`  ${exportedScenes.length} scenes (${output.episode.boardedSceneCount} boarded), ${shots.length} shots, ${output.episode.keyframesOnDisk} keyframes, ~${output.episode.estimatedDurationSeconds}s estimated`);
console.log(`  ${sections.length} screenplay section${sections.length === 1 ? "" : "s"} from the project script, ${sceneSources.length} scene source file${sceneSources.length === 1 ? "" : "s"}, ${cast.length} cast, ${moodboards.length} mood board${moodboards.length === 1 ? "" : "s"}`);
if (reel) {
  const shrink = images.filter(i => i.originalBytes).reduce((n, i) => n + i.originalBytes, 0);
  console.log(`  ${embedded.length} images embedded (${mb(embeddedBytes)} as data URIs, from ${mb(shrink)} of originals)` +
    (reelFull ? " — originals, not re-encoded" : ` — re-encoded to max width ${reelWidth || "original"}px, JPEG quality ${reelQuality}`));
  console.log(`  self-contained: no images/, screenplay/ or README.md written beside the JSON`);
} else {
  console.log(`  ${jsonOnly ? "JSON only — no files copied" : `${images.filter(i => i.present).length} images copied (${mb(images.reduce((n, i) => n + (i.bytes || 0), 0))})`}`);
}
console.log(`  → ${where}/${jsonFile}${reel ? ` (${mb(Buffer.byteLength(JSON.stringify(output)))} on disk)` : ""}`);
for (const warning of output.warnings) console.log(`  ! ${warning}`);
