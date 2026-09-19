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
  `export * from "@/lib/prompt";\nexport { starterProjects } from "@/lib/seed";\n`,
  "prompt-shim",
);
const { PLATFORMS, buildFramePrompt, buildScenePrompt, extractPositivePrompt, extractNegativePrompt, starterProjects } = prompt;

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
// 3. The screenplay tab still server-renders
// ---------------------------------------------------------------------------
console.log("\n3. Server rendering");

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
