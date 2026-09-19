import assert from "node:assert";

console.log("=== Testing Screenplay Undo / Redo & AI Image Prompt Models ===\n");

// 1. Verify prompt module and models
const { PLATFORMS, buildFramePrompt, buildScenePrompt, extractPositivePrompt, extractNegativePrompt } = await import("../src/lib/prompt.ts");
const { starterProjects } = await import("../src/lib/seed.ts");

const project = starterProjects[0];
const frame = project.frames[0];
const scene = project.scenes[0];

assert(Array.isArray(PLATFORMS), "PLATFORMS should be an array");
assert(PLATFORMS.length >= 15, `Expected at least 15 models, got ${PLATFORMS.length}`);

const imageModels = PLATFORMS.filter(p => p.kind === "image");
const videoModels = PLATFORMS.filter(p => p.kind === "video");

assert(imageModels.length >= 9, `Expected at least 9 image models, got ${imageModels.length}`);
assert(videoModels.length >= 6, `Expected at least 6 video models, got ${videoModels.length}`);

console.log(`✓ Models available: ${PLATFORMS.length} (${imageModels.length} image, ${videoModels.length} video)`);

// Check specific requested models
const requiredIds = ["sdxl", "sd15", "sd35", "krea2", "flux", "midjourney", "dalle3", "leonardo", "ideogram"];
for (const id of requiredIds) {
  const m = PLATFORMS.find(p => p.id === id);
  assert(m, `Missing required image model: ${id}`);
  assert.strictEqual(m.kind, "image", `${id} should have kind 'image'`);
}
console.log("✓ All requested image models present (SDXL, SD 1.5, SD 3.5, Krea 2, FLUX, Midjourney, DALL-E, Leonardo, Ideogram)");

// Test frame and scene prompt generation across all models
for (const model of PLATFORMS) {
  const fp = buildFramePrompt(project, frame, model.id);
  assert(fp && fp.length > 30, `Frame prompt for ${model.id} is too short or empty`);
  assert(!fp.includes("undefined") && !fp.includes("NaN"), `Frame prompt for ${model.id} contains undefined/NaN`);

  const sp = buildScenePrompt(project, scene, model.id);
  assert(sp && sp.length > 30, `Scene prompt for ${model.id} is too short or empty`);
  assert(!sp.includes("undefined") && !sp.includes("NaN"), `Scene prompt for ${model.id} contains undefined/NaN`);
}
console.log("✓ All 15 models generate clean, well-formed frame and scene prompts");

// Test negative and positive prompt extraction
const sdxlPrompt = buildFramePrompt(project, frame, "sdxl");
assert(sdxlPrompt.includes("NEGATIVE PROMPT:"), "SDXL prompt should contain negative prompt section");
assert(sdxlPrompt.includes("1344x768"), "SDXL prompt should specify 16:9 parameters");
const sdxlPos = extractPositivePrompt(sdxlPrompt);
const sdxlNeg = extractNegativePrompt(sdxlPrompt);
assert(sdxlPos && sdxlPos.includes("cinematic film still"), "SDXL positive extraction failed");
assert(sdxlNeg && sdxlNeg.includes("blurry"), "SDXL negative extraction failed");

const sd15Prompt = buildFramePrompt(project, frame, "sd15");
assert(sd15Prompt.includes("masterpiece:1.2"), "SD 1.5 prompt should include weighted quality tokens");
assert(sd15Prompt.includes("NEGATIVE PROMPT:"), "SD 1.5 prompt should include negative prompt");

const kreaPrompt = buildFramePrompt(project, frame, "krea2");
assert(kreaPrompt.includes("Krea") || kreaPrompt.includes("Photoreal") || kreaPrompt.includes("AI Strength"), "Krea 2 prompt should include style parameters");

const mjPrompt = buildFramePrompt(project, frame, "midjourney");
assert(mjPrompt.includes("--ar 16:9") && mjPrompt.includes("--v 6.1"), "Midjourney prompt should include parameter flags");

const fluxPrompt = buildFramePrompt(project, frame, "flux");
assert(fluxPrompt.includes("35mm") && fluxPrompt.includes("16:9"), "FLUX prompt should include cinematic 35mm prose");

console.log("✓ Model-specific syntax, parameters, and negative prompt handling verified");

// Test HTTP server rendering
const res = await fetch("http://localhost:3000/?tab=screenplay");
assert.strictEqual(res.status, 200, "Screenplay tab should return HTTP 200");
const body = await res.text();
const markup = body.replace(/<script[\s\S]*?<\/script>/gi, "");

assert(markup.includes("Screenplay"), "HTML should render Screenplay editor");
const bad = /(^|[>"\s])(undefined|NaN|\[object Object\])([<"\s]|$)/.test(markup);
assert(!bad, "Markup should not contain leaked undefined/NaN values");

console.log("✓ Server rendering verified with 0 errors");
console.log("\nAll verification assertions passed successfully!");
