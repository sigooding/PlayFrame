// Real browser regression; requires a running app and Playwright Chromium (or BROWSER_EXECUTABLE_PATH).
// All edits use a disposable imported copy, deleted in finally; the actual film is never edited.
import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, expect, request } from "@playwright/test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const project = JSON.parse(readFileSync(join(root, "public/projects/neonoire-opening.json"), "utf8"));
const baseURL = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const api = await request.newContext({ baseURL });
const browser = await chromium.launch({
  executablePath: process.env.BROWSER_EXECUTABLE_PATH || undefined,
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--no-zygote"], headless: true,
});
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", error => errors.push(error.message));
mkdirSync(join(root, "artifacts"), { recursive: true });
const pass = text => console.log(`  PASS  ${text}`);
const tabs = () => page.getByRole("navigation", { name: "Project sections" });
const boardNumbers = () => page.locator(".frame-card .frame-number").evaluateAll(nodes => nodes.map(node => Number(node.textContent)));
const tableNumbers = () => page.locator(".shot-number").evaluateAll(nodes => nodes.map(node => Number(node.textContent)));
const byScene = id => project.frames.filter(frame => frame.sceneId === id);
const sourceNumbers = project.frames.map(frame => frame.shotNumber);
let copyId;
const go = tab => page.goto(`${baseURL}/?project=${copyId}&tab=${tab}`);
const saved = async () => (await (await api.get(`/api/projects/${copyId}`)).json());

console.log("=== Browser shot order, installed images and persistence ===");
try {
  // Deliberately interleave the imported frame array: the last scene arrives first in storage.
  const response = await api.post("/api/projects/import", { data: {
    ...project, title: "Shot-order browser verification — disposable", shareId: null,
    frames: [...byScene("neonoire-s100"), ...project.frames.filter(frame => frame.sceneId !== "neonoire-s100")],
  } });
  assert.equal(response.status(), 201);
  copyId = (await response.json()).id;
  assert.notEqual(copyId, project.id);
  await go("storyboard");
  await expect(page.locator(".frame-card")).toHaveCount(project.frames.length);
  assert.deepEqual(await boardNumbers(), sourceNumbers);
  await expect(page.locator(".frame-card h3").last()).toHaveText(project.frames.at(-1).title);
  await page.getByRole("button", { name: "List view", exact: true }).click();
  await expect(page.locator(".shot-number")).toHaveCount(project.frames.length);
  assert.deepEqual(await tableNumbers(), sourceNumbers);
  await page.getByRole("button", { name: "Grid view", exact: true }).click();
  const sceneFilter = page.getByLabel("Filter by scene");
  await expect(sceneFilter.locator('option[value="neonoire-s53a"]')).toContainText("53A");
  for (const sceneId of ["neonoire-s51", "neonoire-s53a", "neonoire-s71", "neonoire-s75", "neonoire-s82a", "neonoire-s100"]) {
    await sceneFilter.selectOption(sceneId);
    const frames = byScene(sceneId);
    await expect(page.locator(".frame-card")).toHaveCount(frames.length);
    assert.deepEqual(await boardNumbers(), frames.map(frame => frame.shotNumber));
    // Load every image including cards below the fold and reject the UI's silent image fallback.
    for (const image of await page.locator(".frame-card img").all()) {
      await image.scrollIntoViewIfNeeded();
      await expect.poll(() => image.evaluate(node => node.complete && node.naturalWidth === 1920 && node.naturalHeight === 1080 && !node.dataset.fallback)).toBe(true);
    }
  }
  pass(`${project.frames.length} grid/list cards stay in screenplay order; all nine new images load full-size without fallbacks`);

  await page.getByRole("button", { name: "Play storyboard", exact: true }).click();
  const player = page.getByRole("dialog", { name: "Storyboard presentation" });
  await player.getByRole("button", { name: "Pause", exact: true }).click();
  for (const [index, number] of [320, 160, 265, 260, 161].entries()) {
    await expect(player.locator(".player-caption h3")).toContainText(`Shot ${number} ·`);
    if (index < 4) await player.getByRole("button", { name: "Next frame", exact: true }).click();
  }
  await expect(player.getByRole("button", { name: "Next frame", exact: true })).toBeDisabled();
  await player.getByRole("button", { name: "Close presentation", exact: true }).click();
  await tabs().getByRole("button", { name: /^Shot list/ }).click();
  await expect(page.locator(".shot-number")).toHaveCount(project.frames.length);
  assert.deepEqual(await tableNumbers(), sourceNumbers);
  await tabs().getByRole("button", { name: /^Prompt Studio/ }).click();
  await page.getByLabel("Scene for prompts").selectOption("neonoire-s100");
  const combined = await page.getByLabel("Combined prompts for the selected shots").inputValue();
  assert.deepEqual([...combined.matchAll(/=== SHOT (\d+):/g)].map(match => Number(match[1])), [320, 160, 265, 260, 161]);
  pass("player holds the actual ending last; shot list and real prompt batches have matching production numbers");

  await tabs().getByRole("button", { name: /^Storyboard/ }).click();
  await page.getByLabel("Filter by scene").selectOption("neonoire-s53a");
  await page.locator(".frame-card").first().getByRole("button", { name: `Options for ${byScene("neonoire-s53a")[0].title}`, exact: true }).click();
  await page.getByRole("button", { name: "Duplicate", exact: true }).click();
  await expect(page.locator(".frame-card")).toHaveCount(4);
  await expect.poll(async () => (await saved()).frames.length).toBe(project.frames.length + 1);
  let current = await saved();
  const duplicate = current.frames.find(frame => frame.title.endsWith("(copy)"));
  assert.equal(duplicate.shotNumber, 344);
  assert.equal(duplicate.sceneId, "neonoire-s53a");
  await page.getByRole("button", { name: "Add frame", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Frame title", { exact: true }).fill("Number allocation regression");
  await dialog.getByLabel("Scene", { exact: true }).selectOption("neonoire-s53a");
  await dialog.getByRole("button", { name: "Add to storyboard", exact: true }).click();
  await expect(dialog).toBeHidden();
  await expect.poll(async () => (await saved()).frames.length).toBe(project.frames.length + 2);
  current = await saved();
  assert.equal(current.frames.find(frame => frame.title === "Number allocation regression").shotNumber, 345);
  assert.equal(new Set(current.frames.map(frame => frame.shotNumber)).size, project.frames.length + 2);
  await page.reload();
  await page.getByLabel("Filter by scene").selectOption("neonoire-s53a");
  await expect(page.locator(".frame-card")).toHaveCount(5);
  pass("duplicate and new-frame forms assign unique 344/345 identities and survive reload");

  // Browser HTML drag events exercise the actual component callback, not only the pure sorter.
  const drag = async (from, to) => page.evaluate(({ from, to }) => {
    const cards = [...document.querySelectorAll(".frame-card")];
    const card = number => cards.find(node => Number(node.querySelector(".frame-number").textContent) === number);
    const source = card(from), target = card(to), dataTransfer = new DataTransfer();
    source.dispatchEvent(new DragEvent("dragstart", { bubbles: true, dataTransfer }));
    target.dispatchEvent(new DragEvent("dragover", { bubbles: true, cancelable: true, dataTransfer }));
    target.dispatchEvent(new DragEvent("drop", { bubbles: true, cancelable: true, dataTransfer }));
    source.dispatchEvent(new DragEvent("dragend", { bubbles: true, dataTransfer }));
  }, { from, to });
  await drag(298, 299);
  await expect.poll(async () => (await saved()).frames.filter(frame => frame.sceneId === "neonoire-s53a").map(frame => frame.shotNumber)).toEqual([297, 344, 299, 298, 345]);
  await page.reload();
  await expect(page.locator(".frame-card")).toHaveCount(project.frames.length + 2);
  const beforeCrossScene = (await saved()).frames.map(frame => frame.id);
  await drag(298, 1);
  assert.deepEqual((await saved()).frames.map(frame => frame.id), beforeCrossScene);
  await page.getByLabel("Filter by scene").selectOption("neonoire-s53a");
  assert.deepEqual(await boardNumbers(), [297, 344, 299, 298, 345]);
  pass("within-scene drag persists without renumbering; cross-scene drop cannot scramble the screenplay");

  const shared = await api.post(`/api/projects/${copyId}/share`, { data: { enabled: true } });
  assert.equal(shared.status(), 200);
  await page.goto(`${baseURL}/share/${(await shared.json()).shareId}`);
  await expect(page.locator(".shared-frame")).toHaveCount(project.frames.length + 2);
  const sharedNumbers = await page.locator(".shared-frame .frame-number").evaluateAll(nodes => nodes.map(node => Number(node.textContent)));
  assert.equal(sharedNumbers[0], 1);
  assert.equal(sharedNumbers.at(-1), 161);
  assert(sharedNumbers.indexOf(299) < sharedNumbers.indexOf(298));
  pass("shared playback respects the saved manual shot order and fixed ending");

  await page.setViewportSize({ width: 390, height: 844 });
  await go("storyboard");
  await page.getByLabel("Filter by scene").selectOption("neonoire-s51");
  await expect(page.locator(".frame-card")).toHaveCount(2);
  assert.deepEqual(await boardNumbers(), [310, 311]);
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1));
  await page.screenshot({ path: join(root, "artifacts/neonoire-order-mobile.png"), fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: join(root, "artifacts/neonoire-order-desktop.png"), fullPage: true });
  assert.deepEqual(errors, [], "No browser exceptions or hydration failures");
  pass("desktop/mobile scene controls and image cards work without horizontal overflow or browser errors");
  console.log("Browser shot-order checks passed.");
} finally {
  if (copyId) await api.delete(`/api/projects/${copyId}`);
  await browser.close();
  await api.dispose();
}
