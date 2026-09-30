// Writes the remaining keyframes of the NEONOIRE board out as per-pass briefs, ready for an image
// generator: every shot's filename, framing, cast sheets, the studio brief's style block, the
// draft's own words for it, and the negative prompt.
//
//   node scripts/neonoire/pass-prompts.mjs             # every pass that still has shots to generate
//   node scripts/neonoire/pass-prompts.mjs --pass 3    # just pass 3
//   node scripts/neonoire/pass-prompts.mjs --stdout 3  # print instead of writing files
//
// Output: docs/neonoire/passes/pass-N.md, plus docs/neonoire/passes/README.md as the index.
// Pure Node: no build step, no dependencies.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { SCENES, grammar, imagePath, parseBoard, readBoard } from "./plan.mjs";

import { frontCounterLook, frameFormat } from "./front-counter-look.mjs";
import { apartmentBuildingLook, apartmentLook } from "./apartment-look.mjs";
import { interviewLook } from "./interview-look.mjs";
import { detectivesLook } from "./detectives-look.mjs";
import { coldOpenLook, isColdOpenScene } from "./cold-open-look.mjs";
import { freshColdOpenShots, freshColdOpenGenerated, freshColdOpenPrompt } from "./cold-open-fresh.mjs";
import { kandaBarLook, kandaBarScenes, kandaBarSheet } from "./bar-look.mjs";
import { aftermathLook, streetsLook, streetsScenes } from "./streets-look.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const read = file => readFileSync(resolve(root, file), "utf8");

// The look, straight out of the app's style library so there is only ever one copy of it.
const styles = read("src/lib/styles.ts");
const neonoireStyle = styles.slice(styles.indexOf('id: "neonoire"'));
const styleBlock = neonoireStyle.match(/prompt: "([^"]+)"/)[1].replace(/\\"/g, '"');
const negative = neonoireStyle.match(/negative: "([^"]+)"/)[1].replace(/\\"/g, '"');

/** The studio keys each scene is measured against — see public/images/neonoire/keys/. */
const KEYS = {
  s1: ["01-the-doorway.jpg", "07-the-rain-scene.jpg", "08-ozu-cutaway.jpg"],
  s2: ["03-the-bar.jpg"],
  // Vera's apartment building is an ordinary old four-storey concrete block beside the elevated
  // railway, never the Hive (keys/06-the-block.jpg).
  s3: [],
  s4: ["04-veras-apartment.jpg"],
  s5: ["05-the-police-station.jpg"],
  s6: ["05-the-police-station.jpg"],
  s7: ["05-the-police-station.jpg"],
  // The requested revision ignores old street images, including the legacy style keys.
  s72: [],
  s73: [],
  s74: [],
  s75: [],
  s76: ["04-veras-apartment.jpg"],
};

const PASS_SIZE = 10;
const board = SCENES.flatMap(scene => parseBoard(readBoard(root, scene), scene));
const pending = board.filter(shot => !existsSync(resolve(root, `public${imagePath(shot.scene, shot)}`)));
const sheets = new Map([
  ["Mara Voss", "public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg; keep the cheap enamel red-bird clip in her soaked hair wherever visible)"],
  ["Vera Voss", "public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)"],
  ["Jack", "public/images/neonoire/sheets/jack.jpg  (face crop: jack-face.jpg; new 48-year-old former-detective design, not the father)"],
  ["Daniel Voss", "public/images/neonoire/s4/35-the-photograph.jpg  (Daniel with his small daughters, twenty years ago, not Jack)"],
  ["The Young Officer", "public/images/neonoire/sheets/young-officer.jpg  (face crop: young-officer-face.jpg)"],
  ["Detective Ishida", "public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)"],
]);

const passOf = n => Math.ceil(n / PASS_SIZE);
const passes = [...new Set(pending.map(shot => passOf(shot.n)))].sort((a, b) => a - b);

function freshBrief(shot) {
  return `### Shot ${shot.n} — ${shot.title}

File: public${imagePath(shot.scene, shot)}

Image references: NONE. Text-to-image only.

${freshColdOpenPrompt(shot.n)}

---
`;
}

// A separate queue: existing legacy files must not make fresh retakes appear complete.
if (process.argv.includes("--cold-open-fresh")) {
  const queue = board.filter(shot => freshColdOpenShots.has(shot.n) && !freshColdOpenGenerated.has(shot.n));
  console.log(`# Fresh cold open — ${queue.length} ungenerated shots

No image references. See the fresh-pass ledger for generated shots needing correction.

` + queue.map(freshBrief).join("\n"));
  process.exit(0);
}

function shotBrief(shot) {
  if (freshColdOpenShots.has(shot.n)) return freshBrief(shot);
  const scene = shot.scene;
  const referenceKeys = (KEYS[scene.key] || []).map(key => `public/images/neonoire/keys/${key}`).filter(file => existsSync(resolve(root, file)));
  if (kandaBarScenes.has(scene.key)) referenceKeys.push(`public${kandaBarSheet}`);
  if (scene.key === "s3") referenceKeys.push("public/images/neonoire/s3/29-apartment-block.jpg", "public/images/neonoire/s3/31-the-lit-window.jpg", "public/images/neonoire/s78/88-the-walkway.jpg");
  if (scene.key === "s6") referenceKeys.push("public/images/neonoire/s6/51-the-interview-room.jpg", "public/images/neonoire/s6/56-three-days-ago.jpg");
  if (scene.key === "s7") referenceKeys.push("public/images/neonoire/s7/63-the-detectives-room.jpg", "public/images/neonoire/s7/64-the-bottom-drawer.jpg", "public/images/neonoire/s1/18-the-flashlight.jpg", "public/images/neonoire/s5/43-the-front-counter.jpg");
  if (scene.key === "s72") referenceKeys.push("public/images/neonoire/s72/69-the-wait.jpg");
  if (scene.key === "s73") referenceKeys.push("public/images/neonoire/s72/69-the-wait.jpg", "public/images/neonoire/s73/70-not-elegantly-badly.jpg", "public/images/neonoire/s73/72-the-lost-heel.jpg");
  if (scene.key === "s74") referenceKeys.push("public/images/neonoire/s74/74-twenty-metres-apart.jpg", "public/images/neonoire/s74/73-two-small-figures.jpg", "public/images/neonoire/s72/69-the-wait.jpg");
  if (scene.key === "s75") referenceKeys.push("public/images/neonoire/s73/70-not-elegantly-badly.jpg", "public/images/neonoire/s73/72-the-lost-heel.jpg", "public/images/neonoire/s75/77-the-red-shoe.jpg", "public/images/neonoire/s72/69-the-wait.jpg");
  if (scene.key === "s76") referenceKeys.push("public/images/neonoire/s4/33-the-apartment.jpg");
  if (isColdOpenScene(scene.key)) referenceKeys.push("public/images/neonoire/s1/01-backstreet.jpg", "public/images/neonoire/s1/03-mara-walks.jpg", "public/images/neonoire/s1/07-old-man.jpg", "public/images/neonoire/s1/08-sedan-arrives.jpg");
  const castLines = shot.n === 35
    ? ["- Daniel Voss, Vera (9), Mara (4) — public/images/neonoire/s4/35-the-photograph.jpg; use the childhood photograph, not adult wardrobe/hair references."]
    : shot.cast.map(name => `- ${name} — ${sheets.get(name) || "no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)"}`);
  const note = shot.note.split("\n\n")[0];
  const continuity = shot.cast.includes("Mara Voss") && scene.key !== "s4"
    ? "CONTINUITY — Mara's hair is soaked flat and held back by a cheap enamel clip shaped like a small red bird; in the final screenplay it slips loose between the crates inside the bar (scene 2), and is gone from that beat onward."
    : "";
  return [
    `### Shot ${shot.n} — ${shot.title}`,
    "",
    `**Scene ${scene.n} · ${scene.location} — ${scene.time}**`,
    "",
    `- **File**: \`${imagePath(scene, shot).replace(/^\//, "public/")}\` — write it exactly here, ${shot.image}, JPEG, ${frameFormat(scene)}, no embedded text or watermark.`,
    `- **Stable frame ID**: \`${shot.id}\`; displayed board number ${shot.n}. Asset prefixes predate the added scene 72; do not derive the board order from filenames.`,
    `- **Framing**: ${shot.shotType}, ${shot.lens}, ${shot.movement}, ${shot.angle}. Lighting: ${shot.lighting}. Working duration ${shot.duration}s (not a locked time).`,
    `- **Continuity references to attach**: ${referenceKeys.map(k => "`" + k + "`").join(", ")}${castLines.length ? "" : " — none, the city carries the shot"}`,
    ...castLines,
    "",
    "**Prompt**",
    "",
    "```",
    styleBlock,
    "",
    `SUBJECT — ${shot.description} ${note}`,
    continuity,
    isColdOpenScene(scene.key) ? `CONTINUITY — ${coldOpenLook}` : "",
    kandaBarScenes.has(scene.key) ? `LOCATION — ${kandaBarLook}` : "",
    streetsScenes.has(scene.key) ? `CONTINUITY — ${streetsLook}` : "",
    scene.key === "s76" ? `CONTINUITY — ${aftermathLook}` : "",
    scene.key === "s7" ? `CONTINUITY — ${detectivesLook}` : "",
    scene.key === "s6" ? `CONTINUITY — ${interviewLook}` : "",
    scene.key === "s3" ? `CONTINUITY — ${apartmentBuildingLook}` : "",
    scene.key === "s4" ? `CONTINUITY — ${apartmentLook}` : "",
    scene.key === "s5" ? `CONTINUITY — ${frontCounterLook}` : "",
    `FRAMING — ${shot.shotType}, ${shot.lens}, ${shot.movement}, ${shot.angle}, lit by ${shot.lighting.toLowerCase()}.`,
    shot.script ? `DRAFT — the draft's own words for this shot: "${shot.script}"` : "DRAFT — no dialogue in this shot; it is carried by the frame and the sound.",
    "",
    `AVOID — ${negative}`,
    "```",
    "",
    `Scene grammar: ${scene.grammar}`,
    "",
    "---",
    "",
  ].join("\n");
}

function passFile(pass) {
  const shots = pending.filter(shot => passOf(shot.n) === pass);
  const scenes = [...new Set(shots.map(shot => shot.scene))];
  return [
    `# NEONOIRE — keyframe pass ${pass}`,
    "",
    `${shots.length} shot${shots.length === 1 ? "" : "s"} still to generate: shots ${shots[0].n}–${shots[shots.length - 1].n}, from ${scenes.map(s => `scene ${s.n} (${s.location})`).join(" and ")}.`,
    "",
    "**Before you start**",
    "",
    "- **Every image in the film is 16:9 full-bleed, 1920×1080** — the final screenplay's frame rule (September 2026), covering scenes 1–100 as the board reaches them. Follow apartment-look.mjs (no paper pendant), front-counter-look.mjs, interview-look.mjs and detectives-look.mjs for the revised scenes, and cold-open-look.mjs for the pre-title shots: 1–10 are rebuilt in 16:9, while 11–28 and scene 3 still hold legacy 2.39:1 studies awaiting the same revision — regenerate them at the new shape, never crop them to scope. Normalise every fresh frame with:",
    "  ```bash",
    "  convert FILE.jpg -resize \"1920x1080^\" -gravity center -extent 1920x1080 -quality 92 -strip FILE.jpg",
    "  ```",
    "- COLD-OPEN EXCEPTION: scenes 1–2 (including 280–282) use fresh text-only briefs with NO image references; ignore the old reference instructions for those shots. Elsewhere attach the listed cast sheets and studio keys.",
    "- Where the generator supports a negative prompt, use the AVOID list; where it does not, keep those things out of frame yourself.",
    "- The film explains nothing. No captions, no readable signage invented for the plot, no reaction emphasis, no glamour.",
    "- British/American spelling is irrelevant here; **no added captions**; only include readable text explicitly required by the board (for example MARA VOSS on the monitor).",
    "- When the frame is on disk, run `npm run build:neonoire` and `npm run verify:neonoire` from the repository root. The builder will tell you if a file is missing or misnamed.",
    "",
    ...shots.map(shotBrief),
  ].join("\n");
}

const wantsStdout = process.argv.includes("--stdout");
const only = process.argv.includes("--pass") ? Number(process.argv[process.argv.indexOf("--pass") + 1]) : null;
const targets = only ? passes.filter(pass => pass === only) : passes;

// The index is kept truthful even when the board is complete: a finished board still records
// that every keyframe is on disk instead of leaving a stale "shots remain" count behind.
const outDir = resolve(root, "docs/neonoire/passes");
const writeIndex = () => {
  const done = board.length - pending.length;
  const index = [
    "# NEONOIRE — the remaining keyframe passes",
    "",
    `**Cold-open exception (30 September 2026):** ${freshColdOpenGenerated.size}/31 fresh images generated; ${freshColdOpenShots.size - freshColdOpenGenerated.size} still await regeneration despite having old files on disk. All are unapproved. Use \`node scripts/neonoire/pass-prompts.mjs --cold-open-fresh\`, with NO image references. The old cast-sheet, style-key and location-master instructions below do not apply to scenes 1–2 or shots 280–282. [Fresh-pass ledger](cold-open-fresh-2026-09-30.md).`,
    "",
    `Generated by \`node scripts/neonoire/pass-prompts.mjs\`, from the numbered boards in [../scenes](../scenes) and the neonoire style in src/lib/styles.ts. Each file is self-contained: filenames, framing, cast sheets, the prompt, and the negative prompt for every shot in that pass.`,
    "",
    `**${done} of ${board.length} keyframes are on disk.** ${pending.length ? `${pending.length} remain, in ${passes.length} pass${passes.length === 1 ? "" : "es"} of at most ten frames.` : "Every active shot has been generated. The remaining revision work — cold-open shots 11–28 and scene 3 — is legacy 2.39:1 studies awaiting regeneration, tracked in [cold-open-revision.md](cold-open-revision.md)."}`,
    "",
    ...(passes.length ? [
      "| pass | shots | scenes | file |",
      "| --- | --- | --- | --- |",
      ...passes.map(pass => {
        const shots = pending.filter(shot => passOf(shot.n) === pass);
        const scenes = [...new Set(shots.map(shot => `Sc ${shot.scene.n}`))].join(", ");
        return `| ${pass} | ${shots[0].n}–${shots[shots.length - 1].n} | ${scenes} | [pass-${pass}.md](pass-${pass}.md) |`;
      }),
      "",
    ] : []),
    "The Tokyo Story colour revision of scenes 72–75 completed in two sessions on 25 September 2026: ten generation calls (Jack's sheet plus nine shot studies), then eight (the six remaining replacements plus the lost-heel and twenty-metre continuity replacements), two slots deliberately unused. Read [the revision handoff](tokyo-streets-revision.md). Older pass files are historical briefs, not a request to regenerate finished images. Cold-open shots 11–28 and scene 3 separately remain legacy 2.39:1 studies pending their own revision; see [cold-open-revision.md](cold-open-revision.md).",
    "",
    "## The cast sheets, and what must not drift",
    "",
    "- **Mara Voss (24)** — American, long wavy ash-blonde hair (soaked flat for the whole opening), pale blue eyes, indigo denim jacket, heather-grey tee, black jeans, white trainers, thin black cord necklace. Sheet: `public/images/neonoire/sheets/mara.jpg`, face crop `mara-face.jpg`.",
    "- **Vera Voss (29)** — American, shoulder-length ash-blonde hair with a soft fringe, pale blue eyes, charcoal wool coat over a cream high-neck knit, navy trousers, brown ankle boots. Sheet: `public/images/neonoire/sheets/vera.jpg`, face crop `vera-face.jpg`. She carries Mara's pale-blue umbrella, bone dry until the police station.",
    "- **Jack (48)** — former police detective/private investigator, no surname in the screenplay. Recast 25 September 2026 as a white American: long angular tired face, grey-green eyes, dark brown hair greying at the temples, salt-and-pepper stubble, charcoal coat, off-white open collar. Sheet: `public/images/neonoire/sheets/jack.jpg`; face crop: `jack-face.jpg`.",
    "- **Daniel Voss (41, twenty years ago)** — the American father in `s4/35-the-photograph.jpg`. Father links belong to Daniel, not Jack.",
    "- **Scenes 72–75:** [Tokyo Story colour revision](tokyo-streets-revision.md) overrides the old street studies and keys. Vera is pretty and dry in the hotel; mascara runs only in the rain. RIGHT shoe lost, LEFT shoe retained. All cameras static, low and level, not heroic upward angles.",
    "- Unnamed roles keep their faces out of it: the masked men (masks, shoes, gloved hands), the old man (plastic raincoat, seen mostly from behind or at a distance), the journalist (ordinary, forties, never a hero).",
    "",
    "## What good looks like",
    "",
    "For scenes 72–75, use ONLY the new named masters and cast sheets, never the superseded street studies or style keys. Elsewhere, the studio keys in `public/images/neonoire/keys/` are the bar: rain reading as rain, practical light doing all the work, blacks crushed but never muddy, faces lit by the city rather than by a fill light, and the figure small in a patient frame. If a generation looks glossier, more saturated or more cyberpunk than those keys, it is wrong — drop \"neon\", add \"1990s, ordinary, worn, documentary realism\", and try again.",
    "",
  ].join("\n");
  writeFileSync(resolve(outDir, "README.md"), index);
  console.log(`wrote docs/neonoire/passes/README.md — ${done}/${board.length} keyframes on disk, ${pending.length} to go`);
};

if (!targets.length) {
  if (only || wantsStdout) {
    console.log(only ? `Pass ${only} has no shots left to generate.` : "Every active keyframe is on disk — nothing missing (legacy revision status is separate).");
  } else {
    writeIndex();
  }
} else if (wantsStdout) {
  console.log(passFile(targets[0]));
} else {
  mkdirSync(outDir, { recursive: true });
  for (const pass of targets) {
    const file = resolve(outDir, `pass-${pass}.md`);
    writeFileSync(file, passFile(pass));
    const count = pending.filter(shot => passOf(shot.n) === pass).length;
    console.log(`wrote docs/neonoire/passes/pass-${pass}.md (${count} shot${count === 1 ? "" : "s"})`);
  }
  writeIndex();
}
