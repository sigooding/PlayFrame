// Verifies the two features this branch added:
//   1. AI image + video prompt models   (src/lib/prompt.ts)
//   2. Screenplay undo / redo           (src/components/screenplay.tsx)
//
// The app's sources are TypeScript with `@/` path aliases and JSX, which plain Node cannot
// import, so the modules under test are bundled with esbuild first. The undo/redo half
// mounts the REAL component in jsdom and drives it with real events — it is not a
// re-implementation of the history logic.
//
//   node scripts/verify-undo-and-prompts.mjs
//   node scripts/verify-undo-and-prompts.mjs --no-server   # skip the HTTP render check
import assert from "node:assert";
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as esbuild from "esbuild";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "node_modules", ".cache", "verify-undo-and-prompts");
mkdirSync(outDir, { recursive: true });

const wantsServer = !process.argv.includes("--no-server");

/**
 * Maps the app's `@/...` alias onto src/. esbuild only applies tsconfig "paths" to files
 * outside node_modules, and the bundles below are written there, so the alias is resolved
 * explicitly instead of relying on tsconfig.
 */
const atAliasPlugin = {
  name: "at-alias",
  setup(build) {
    build.onResolve({ filter: /^@\// }, args => {
      const rel = args.path.slice(2);
      for (const ext of [".ts", ".tsx", "/index.ts", "/index.tsx", ""]) {
        const candidate = join(root, "src", `${rel}${ext}`);
        if (existsSync(candidate) && !candidate.endsWith("/")) return { path: candidate };
      }
      throw new Error(`Could not resolve ${args.path} under src/`);
    });
  },
};

/** Bundle a TS/TSX entry so Node can import it, then hand back the module namespace. */
async function loadBundled(entrySource, name, extraExternal = []) {
  const entry = join(outDir, `${name}-entry.mjs`);
  const { writeFileSync } = await import("node:fs");
  writeFileSync(entry, entrySource);
  const outfile = join(outDir, `${name}.mjs`);
  await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    format: "esm",
    platform: "node",
    outfile,
    tsconfig: join(root, "tsconfig.json"),
    jsx: "automatic",
    external: ["jsdom", "react", "react-dom", "react-dom/client", ...extraExternal],
    // lucide-react resolves to a CJS build, which needs a require() in ESM output.
    banner: { js: "import{createRequire as __cr}from'module';const require=__cr(import.meta.url);" },
    plugins: [atAliasPlugin],
    logLevel: "warning",
  });
  return import(pathToFileURL(outfile).href);
}

console.log("=== Verifying Screenplay Undo / Redo & AI Image Prompt Models ===");

// ---------------------------------------------------------------------------
// 1. AI image + video prompt models
// ---------------------------------------------------------------------------
console.log("\n1. Prompt models");

const prompt = await loadBundled(
  `export * from "@/lib/prompt";\nexport * from "@/lib/styles";\nexport * from "@/lib/structure";\nexport { starterProjects } from "@/lib/seed";\n`,
  "prompt-shim",
);
const { PLATFORMS, buildFramePrompt, buildScenePrompt, extractPositivePrompt, extractNegativePrompt, VISUAL_STYLES, visualStyle, negativeFor, DEFAULT_STYLE_ID, starterProjects, scenesInScript } = prompt;

const project = starterProjects[0];
const frame = project.frames[0];
const scene = project.scenes[0];

assert(Array.isArray(PLATFORMS), "PLATFORMS should be an array");
assert(PLATFORMS.length >= 15, `Expected at least 15 models, got ${PLATFORMS.length}`);

const imageModels = PLATFORMS.filter(p => p.kind === "image");
const videoModels = PLATFORMS.filter(p => p.kind === "video");
assert(imageModels.length >= 9, `Expected at least 9 image models, got ${imageModels.length}`);
assert(videoModels.length >= 6, `Expected at least 6 video models, got ${videoModels.length}`);
console.log(`  PASS  ${PLATFORMS.length} models available (${imageModels.length} image, ${videoModels.length} video)`);

const requiredIds = ["sdxl", "sd15", "sd35", "krea2", "flux", "midjourney", "dalle3", "leonardo", "ideogram"];
for (const id of requiredIds) {
  const m = PLATFORMS.find(p => p.id === id);
  assert(m, `Missing required image model: ${id}`);
  assert.strictEqual(m.kind, "image", `${id} should have kind 'image'`);
}
console.log("  PASS  every requested image model present (SDXL, SD 1.5, SD 3.5, Krea 2, FLUX, Midjourney, DALL-E, Leonardo, Ideogram)");

for (const model of PLATFORMS) {
  const fp = buildFramePrompt(project, frame, model.id);
  assert(fp && fp.length > 30, `Frame prompt for ${model.id} is too short or empty`);
  assert(!fp.includes("undefined") && !fp.includes("NaN"), `Frame prompt for ${model.id} contains undefined/NaN`);

  const sp = buildScenePrompt(project, scene, model.id);
  assert(sp && sp.length > 30, `Scene prompt for ${model.id} is too short or empty`);
  assert(!sp.includes("undefined") && !sp.includes("NaN"), `Scene prompt for ${model.id} contains undefined/NaN`);
}
console.log(`  PASS  all ${PLATFORMS.length} models generate clean frame and scene prompts`);

// MiniMax H3: <Picture 1> is reserved for real keyframe art. Built-in library
// references (shot diagrams, lighting/style swatches) are storyboard aids, not
// first frames, so they must never trigger the I2VA first-frame instruction.
const hailuoStarter = buildFramePrompt(project, frame, "hailuo");
assert(!hailuoStarter.includes("<Picture 1>") && !hailuoStarter.includes("fully referenced"), "MiniMax H3 must not treat built-in library reference images as I2VA keyframes");
assert(hailuoStarter.includes("integrated_multimodal_description:") && hailuoStarter.includes("overall_soundscape:") && hailuoStarter.includes("non_diegetic_music:"), "MiniMax H3 prompts use the guide's three core fields");
console.log("  PASS  MiniMax H3 three-field format with library references excluded from <Picture 1>");

const sdxlPrompt = buildFramePrompt(project, frame, "sdxl");
assert(sdxlPrompt.includes("NEGATIVE PROMPT:"), "SDXL prompt should contain a negative prompt section");
assert(sdxlPrompt.includes("1344x768"), "SDXL prompt should specify 16:9 parameters");
assert(extractPositivePrompt(sdxlPrompt)?.includes("cinematic film still"), "SDXL positive extraction failed");
assert(extractNegativePrompt(sdxlPrompt)?.includes("blurry"), "SDXL negative extraction failed");

const sd15Prompt = buildFramePrompt(project, frame, "sd15");
assert(sd15Prompt.includes("masterpiece:1.2"), "SD 1.5 prompt should include weighted quality tokens");
assert(sd15Prompt.includes("NEGATIVE PROMPT:"), "SD 1.5 prompt should include a negative prompt");

const kreaPrompt = buildFramePrompt(project, frame, "krea2");
assert(/Krea|Photoreal|AI Strength/.test(kreaPrompt), "Krea 2 prompt should include style parameters");

const mjPrompt = buildFramePrompt(project, frame, "midjourney");
assert(mjPrompt.includes("--ar 16:9") && mjPrompt.includes("--v 6.1"), "Midjourney prompt should include parameter flags");

const fluxPrompt = buildFramePrompt(project, frame, "flux");
assert(fluxPrompt.includes("35mm") && fluxPrompt.includes("16:9"), "FLUX prompt should include cinematic 35mm prose");
console.log("  PASS  model-specific syntax, parameters and negative prompts verified");

// ---------------------------------------------------------------------------
// 1b. Visual style library (anime, realistic, comic, ...)
// ---------------------------------------------------------------------------
console.log("\n1b. Visual style library");

assert(Array.isArray(VISUAL_STYLES), "VISUAL_STYLES should be an array");
assert.strictEqual(VISUAL_STYLES.length, 31, `Expected exactly 31 styles, got ${VISUAL_STYLES.length}`);
const ids = new Set(VISUAL_STYLES.map(s => s.id));
assert.strictEqual(ids.size, 31, "style ids must be unique");

for (const s of VISUAL_STYLES) {
  assert(s.name && s.prompt && s.finish && s.swatch, `style ${s.id} is missing metadata`);
  assert(s.image.startsWith("/images/styles/"), `style ${s.id} image should live in /images/styles/`);
  assert(existsSync(join(root, "public", s.image)), `style example image not on disk: ${s.image}`);
}
console.log(`  PASS  31 styles, each with a unique id, tokens, and an example image on disk`);

// The looks the user named across the requests must exist.
for (const id of ["cinematic", "anime", "comic", "classic-cartoon", "documentary", "rotoscoped", "ghibli", "manga", "hanna-barbera", "neonoire"]) {
  assert(VISUAL_STYLES.find(s => s.id === id), `missing style ${id}`);
}
console.log("  PASS  all user-named looks present (incl. ghibli, manga, hanna-barbera)");

// Default stays photoreal so existing prompts keep their meaning.
const def = visualStyle(DEFAULT_STYLE_ID);
assert(def.photoreal === true, "default style must be photoreal");
assert(visualStyle(undefined).id === DEFAULT_STYLE_ID, "missing style falls back to the default");
assert(visualStyle("nope").id === DEFAULT_STYLE_ID, "unknown style falls back to the default");

// Negative-prompt conflict handling.
const anime = visualStyle("anime");
assert(anime.photoreal === false, "anime must not be photoreal");
const animeNeg = negativeFor("blurry, low quality, cartoon, anime, illustration, photorealistic", anime);
assert(!/\banime\b|\bcartoon\b|\billustration\b/.test(animeNeg), `anime negative should drop its own style tokens: ${animeNeg}`);
assert(animeNeg.includes("photorealistic") || animeNeg.includes("live action"), "anime negative should guard against collapsing to realism");
const keepNeg = negativeFor("blurry, cartoon, anime", def);
assert(keepNeg.includes("cartoon") && keepNeg.includes("anime"), "photoreal default should keep anti-cartoon negatives");

// Prompts actually change with the style.
for (const model of PLATFORMS) {
  const base = buildFramePrompt(project, frame, model.id);
  const styled = buildFramePrompt(project, frame, model.id, "anime");
  assert(styled !== base, `${model.id} prompt should differ when a style is applied`);
  assert(/anime/i.test(styled), `${model.id} prompt should carry the anime style`);
  assert(!/undefined|NaN|\[object Object\]/.test(styled), `${model.id} styled prompt has a leaked value`);
}
console.log(`  PASS  every one of the ${PLATFORMS.length} models applies the style to its prompt`);

const animeFlux = buildFramePrompt(project, frame, "flux", "anime");
assert(!/35mm film still/i.test(animeFlux), "anime FLUX prompt should not call itself a film still");
const animeSdxlNeg = extractNegativePrompt(buildFramePrompt(project, frame, "sdxl", "anime"));
assert(animeSdxlNeg && !/\bcartoon\b/.test(animeSdxlNeg), "anime SDXL negative should not forbid cartoon");
const animeSdxlPos = extractPositivePrompt(buildFramePrompt(project, frame, "sdxl", "anime"));
assert(/anime/.test(animeSdxlPos), "anime SDXL positive should carry the style");
console.log("  PASS  image-model finish + negative prompts adapt to the style");

const sceneAnime = buildScenePrompt(project, scene, "midjourney", "anime");
assert(/anime/i.test(sceneAnime), "scene prompt should carry the style");
console.log("  PASS  scene-level prompts carry the style too");

// ---------------------------------------------------------------------------
// 2. Screenplay undo / redo — the real component, driven in jsdom
// ---------------------------------------------------------------------------
console.log("\n2. Screenplay undo / redo (real <Screenplay> component in jsdom)");

const harness = await loadBundled(
  `export { run } from ${JSON.stringify(relative(outDir, join(root, "scripts", "lib", "undo-redo-harness.mjs")).split(sep).join("/"))};\n`,
  "undo-harness",
);
const undoResult = await harness.run();
assert.strictEqual(undoResult.failed, 0, `${undoResult.failed} undo/redo check(s) failed`);

// ---------------------------------------------------------------------------
// 3. Scene ↔ screenplay: the navigator can find every written scene
// ---------------------------------------------------------------------------
console.log("\n3. Scene → screenplay map");

// A hand-typed or imported screenplay has no episode blocks, so the free-text path is what most
// projects rely on; the series bundle exercises the one-block-per-scene path in verify:rapture.
for (const project of starterProjects) {
  const map = scenesInScript(project, project.script);
  const written = project.scenes.filter(scene => !scene.description.trim().startsWith("OUTLINE ONLY"));
  assert.strictEqual(map.size, written.length, `${project.title}: the screenplay should carry exactly its ${written.length} written scenes, found ${map.size}`);
  for (const scene of written) {
    const hit = map.get(scene.id);
    assert(hit, `${project.title}: "${scene.title}" was not found in the screenplay`);
    const line = project.script.slice(project.script.lastIndexOf("\n", hit.start) + 1, hit.end);
    assert(line.toUpperCase().includes(scene.location.toUpperCase()), `${project.title}: "${scene.title}" should select its own heading, got ${JSON.stringify(line)}`);
  }
  console.log(`  PASS  ${project.title}: ${map.size}/${project.scenes.length} scenes found, each selecting its own heading${written.length < project.scenes.length ? ` (${project.scenes.length - written.length} outlines have no page)` : ""}`);
}

// An outline — a scene with no page — must not borrow a neighbour's block.
const outlineProject = { ...starterProjects[0], scenes: [...starterProjects[0].scenes, { id: "outline-1", title: "The raid", location: "INT. LIGHTHOUSE CONTROL ROOM", time: "NIGHT", description: "OUTLINE ONLY — not a numbered shooting script." }] };
const outlineMap = scenesInScript(outlineProject, outlineProject.script);
assert(!outlineMap.has("outline-1"), "A scene with no page must not match a block that belongs to another scene");
assert.deepEqual([...outlineMap.keys()], [...outlineProject.scenes.filter(s => s.id !== "outline-1").map(s => s.id)].filter(id => outlineMap.has(id)), "Every written scene must still be found when an outline shares its location");
console.log("  PASS  an outline sharing a written scene's location does not steal its page");

// ---------------------------------------------------------------------------
// 4. The screenplay tab still server-renders
// ---------------------------------------------------------------------------
console.log("\n4. Server rendering");

if (!wantsServer) {
  console.log("  SKIP  --no-server given");
} else {
  const base = process.env.BASE_URL || "http://localhost:3000";
  let res;
  try {
    res = await fetch(`${base}/?tab=screenplay`);
  } catch {
    console.log(`  SKIP  no dev server answering on ${base} — start one with "npm run dev", or pass --no-server`);
    res = null;
  }
  if (res) {
    assert.strictEqual(res.status, 200, "Screenplay tab should return HTTP 200");
    const markup = (await res.text()).replace(/<script[\s\S]*?<\/script>/gi, "");
    assert(markup.includes("Screenplay"), "HTML should render the Screenplay editor");
    assert(!/(^|[>"\s])(undefined|NaN|\[object Object\])([<"\s]|$)/.test(markup), "Markup should not contain leaked undefined/NaN values");
    console.log("  PASS  /?tab=screenplay renders 200 with no leaked undefined/NaN");
  }
}

console.log("\nAll verification assertions passed.");
