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

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const read = file => readFileSync(resolve(root, file), "utf8");

// The look, straight out of the app's style library so there is only ever one copy of it.
const styles = read("src/lib/styles.ts");
const neonoireStyle = styles.slice(styles.indexOf('id: "neonoire"'));
const styleBlock = neonoireStyle.match(/prompt: "([^"]+)"/)[1].replace(/\\"/g, '"');
const negative = neonoireStyle.match(/negative: "([^"]+)"/)[1].replace(/\\"/g, '"');

/** The studio keys each scene is measured against — see docs/neonoire/studio-brief.md. */
const KEYS = {
  s1: ["01-the-doorway.jpg", "07-the-rain-scene.jpg", "08-ozu-cutaway.jpg"],
  s2: ["03-the-bar.jpg"],
  s3: ["06-the-block.jpg"],
  s4: ["04-veras-apartment.jpg"],
  s5: ["05-the-police-station.jpg"],
  s6: ["05-the-police-station.jpg"],
  s7: ["05-the-police-station.jpg"],
};

const PASS_SIZE = 10;
const board = SCENES.flatMap(scene => parseBoard(readBoard(root, scene), scene));
const pending = board.filter(shot => !existsSync(resolve(root, `public${imagePath(shot.scene, shot)}`)));
const sheets = new Map([
  ["Mara Voss", "public/images/neonoire/sheets/mara.jpg  (face crop: mara-face.jpg)"],
  ["Vera Voss", "public/images/neonoire/sheets/vera.jpg  (face crop: vera-face.jpg)"],
  ["Jack Voss", "public/images/neonoire/sheets/vera.jpg  (he is in the photograph in scene 4; no sheet of his own yet)"],
  ["The Young Officer", "public/images/neonoire/sheets/young-officer.jpg  (face crop: young-officer-face.jpg)"],
  ["Detective Ishida", "public/images/neonoire/sheets/ishida.jpg  (face crop: ishida-face.jpg)"],
]);

const passOf = n => Math.ceil(n / PASS_SIZE);
const passes = [...new Set(pending.map(shot => passOf(shot.n)))].sort((a, b) => a - b);

function shotBrief(shot) {
  const scene = shot.scene;
  const referenceKeys = KEYS[scene.key].map(key => `public/images/neonoire/keys/${key}`).filter(file => existsSync(resolve(root, file)));
  const castLines = shot.cast.map(name => `- ${name} — ${sheets.get(name) || "no continuity sheet yet (unnamed role: keep them unremarkable and unspecified)"}`);
  const note = shot.note.split("\n\n")[0];
  return [
    `### Shot ${shot.n} — ${shot.title}`,
    "",
    `**Scene ${scene.n} · ${scene.location} — ${scene.time}**`,
    "",
    `- **File**: \`${imagePath(scene, shot).replace(/^\//, "public/")}\` — write it exactly here, ${shot.image}, JPEG, 2.39:1 anamorphic (anything from 1600×669 up; the repo standard is 1912×800), no embedded text or watermark.`,
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
    "- Every frame is **2.39:1 anamorphic**: generate widescreen, then normalise exactly with",
    "  ```bash",
    "  convert FILE.jpg -resize \"1912x800^\" -gravity center -extent 1912x800 -quality 92 -strip FILE.jpg",
    "  ```",
    "- Attach the continuity sheet (or its face crop) for every named character in the shot, and the studio keys listed for the scene — they are the look the film is already being generated in.",
    "- Where the generator supports a negative prompt, use the AVOID list; where it does not, keep those things out of frame yourself.",
    "- The film explains nothing. No captions, no readable signage invented for the plot, no reaction emphasis, no glamour.",
    "- British/American spelling is irrelevant here; **no text at all** unless the board quotes a super.",
    "- When the frame is on disk, run `npm run build:neonoire` and `npm run verify:neonoire` from the repository root. The builder will tell you if a file is missing or misnamed.",
    "",
    ...shots.map(shotBrief),
  ].join("\n");
}

const wantsStdout = process.argv.includes("--stdout");
const only = process.argv.includes("--pass") ? Number(process.argv[process.argv.indexOf("--pass") + 1]) : null;
const targets = only ? passes.filter(pass => pass === only) : passes;

if (!targets.length) {
  console.log(only ? `Pass ${only} has no shots left to generate.` : "Every keyframe in the opening is on disk — nothing to generate.");
} else if (wantsStdout) {
  console.log(passFile(targets[0]));
} else {
  const outDir = resolve(root, "docs/neonoire/passes");
  mkdirSync(outDir, { recursive: true });
  for (const pass of targets) {
    const file = resolve(outDir, `pass-${pass}.md`);
    writeFileSync(file, passFile(pass));
    const count = pending.filter(shot => passOf(shot.n) === pass).length;
    console.log(`wrote docs/neonoire/passes/pass-${pass}.md (${count} shot${count === 1 ? "" : "s"})`);
  }
  const done = board.length - pending.length;
  const index = [
    "# NEONOIRE — the remaining keyframe passes",
    "",
    `Generated by \`node scripts/neonoire/pass-prompts.mjs\`, from the numbered boards in [../scenes](../scenes) and the style block in [../studio-brief.md](../studio-brief.md). Each file is self-contained: filenames, framing, cast sheets, the prompt, and the negative prompt for every shot in that pass.`,
    "",
    `**${done} of ${board.length} keyframes are on disk.** ${pending.length} remain, in ${passes.length} pass${passes.length === 1 ? "" : "es"} of at most ten frames.`,
    "",
    "| pass | shots | scenes | file |",
    "| --- | --- | --- | --- |",
    ...passes.map(pass => {
      const shots = pending.filter(shot => passOf(shot.n) === pass);
      const scenes = [...new Set(shots.map(shot => `Sc ${shot.scene.n}`))].join(", ");
      return `| ${pass} | ${shots[0].n}–${shots[shots.length - 1].n} | ${scenes} | [pass-${pass}.md](pass-${pass}.md) |`;
    }),
    "",
    "## The cast sheets, and what must not drift",
    "",
    "- **Mara Voss (24)** — American, long wavy ash-blonde hair (soaked flat for the whole opening), pale blue eyes, indigo denim jacket, heather-grey tee, black jeans, white trainers, thin black cord necklace. Sheet: `public/images/neonoire/sheets/mara.jpg`, face crop `mara-face.jpg`.",
    "- **Vera Voss (29)** — American, shoulder-length ash-blonde hair with a soft fringe, pale blue eyes, charcoal wool coat over a cream high-neck knit, navy trousers, brown ankle boots. Sheet: `public/images/neonoire/sheets/vera.jpg`, face crop `vera-face.jpg`. She carries Mara's pale-blue umbrella, bone dry until the police station.",
    "- **Jack Voss** — the girls' American father, in one framed photograph in scene 4 (rumpled suit, both daughters' hands in his, twenty years ago). No sheet of his own yet.",
    "- Unnamed roles keep their faces out of it: the masked men (masks, shoes, gloved hands), the old man (plastic raincoat, seen mostly from behind or at a distance), the journalist (ordinary, forties, never a hero).",
    "",
    "## What good looks like",
    "",
    "The studio keys in `public/images/neonoire/keys/` are the bar: rain reading as rain, practical light doing all the work, blacks crushed but never muddy, faces lit by the city rather than by a fill light, and the figure small in a patient frame. If a generation looks glossier, more saturated or more cyberpunk than those keys, it is wrong — drop \"neon\", add \"1990s, ordinary, worn, documentary realism\", and try again.",
    "",
  ].join("\n");
  writeFileSync(resolve(outDir, "README.md"), index);
  console.log(`wrote docs/neonoire/passes/README.md — ${done}/${board.length} keyframes on disk, ${pending.length} to go`);
}
