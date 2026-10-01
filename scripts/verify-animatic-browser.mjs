// FFmpeg-enabled live app required. Only disposable imported projects are edited/deleted.
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, expect, request } from "@playwright/test";

const root = process.cwd(), baseURL = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const project = JSON.parse(readFileSync("public/projects/neonoire-opening.json"));
const api = await request.newContext({ baseURL, timeout: 60000 });
const browser = await chromium.launch({ executablePath: process.env.BROWSER_EXECUTABLE_PATH || undefined, headless: true, args: ["--no-sandbox", "--disable-dev-shm-usage", "--no-zygote"] });
const page = await browser.newPage({ viewport: { width: 1440, height: 1050 } });
const errors = [];
page.on("pageerror", error => errors.push(error.message));
mkdirSync("artifacts/director-corrections", { recursive: true });
let copyId, cancelId;
const pass = text => console.log(`  PASS  ${text}`);
try {
  const imported = await api.post("/api/projects/import", { data: { ...project, title: "Animatic export verification — disposable" } });
  assert.equal(imported.status(), 201); copyId = (await imported.json()).id;
  const jobs = `/api/projects/${copyId}/animatic`;
  await page.goto(`${baseURL}/?project=${copyId}&tab=storyboard`);
  await page.getByRole("button", { name: "Export", exact: true }).click();
  const modal = page.getByRole("dialog");
  await modal.getByRole("button", { name: /Animatic playback/ }).click();
  await modal.getByLabel("Animatic scope").selectOption("scene");
  await modal.getByLabel("Scene to export").selectOption("neonoire-s7");
  await modal.getByLabel("Video resolution").selectOption("720p");
  await expect(modal.getByLabel("Animatic timing")).toHaveValue("playback");
  await expect(modal.locator(".animatic-summary")).toContainText("6 shots");
  await modal.getByRole("button", { name: "Render animatic MP4", exact: true }).click();
  const download = modal.getByRole("link", { name: "Download MP4", exact: true });
  await expect(download).toBeVisible({ timeout: 90000 });
  const waiting = page.waitForEvent("download");
  await download.click();
  const file = await waiting;
  assert(file.suggestedFilename().endsWith("-animatic.mp4"));
  const output = resolve(root, "artifacts/director-corrections/browser-scene7.mp4");
  await file.saveAs(output);
  const bytes = readFileSync(output);
  assert(bytes.length > 10000 && bytes.subarray(4, 8).toString() === "ftyp", "The download is an actual MP4 container");
  const href = await download.getAttribute("href");
  const response = await api.get(href);
  assert.equal(response.status(), 200);
  assert.equal(response.headers()["content-type"], "video/mp4");
  assert(response.headers()["content-disposition"].includes("attachment"));
  await page.screenshot({ path: resolve(root, "artifacts/director-corrections/animatic-export-desktop.png") });
  pass("real Export → Animatic playback renders saved scene 7, updates progress and downloads a valid 720p MP4");

  await modal.getByRole("button", { name: "Close", exact: true }).click();
  await page.getByRole("button", { name: "Export", exact: true }).click();
  await modal.getByRole("button", { name: /Animatic playback/ }).click();
  await expect(modal.getByRole("link", { name: "Download MP4", exact: true })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await modal.getByLabel("Animatic scope").selectOption("range");
  await modal.getByLabel("First scene").selectOption("neonoire-s73");
  await modal.getByLabel("Last scene").selectOption("neonoire-s75");
  await expect(modal.locator(".animatic-summary")).toContainText("14 shots");
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await page.screenshot({ path: resolve(root, "artifacts/director-corrections/animatic-export-mobile.png") });
  pass("completed exports resume after closing; scene-range controls work on mobile without overflow");

  for (const body of [{ resolution: "1080p;touch /tmp/test" }, { output: "../../.env" }, { sceneId: "unknown" }]) {
    assert.equal((await api.post(jobs, { data: body })).status(), 400);
  }
  const wrongOwner = await api.get(href.replace(copyId, project.id));
  assert.equal(wrongOwner.status(), 404);
  const queued = await api.post(jobs, { data: { sceneId: "neonoire-s73", resolution: "720p" } });
  assert.equal(queued.status(), 202); cancelId = (await queued.json()).id;
  const cancelled = await api.delete(`${jobs}/jobs/${cancelId}`);
  assert.equal(cancelled.status(), 200); assert.equal((await cancelled.json()).status, "cancelled");
  await expect.poll(async () => (await (await api.get(`${jobs}/jobs/${cancelId}`)).json()).status).toBe("cancelled");
  assert.equal((await api.get(`${jobs}/jobs/${cancelId}/download`)).status(), 409);
  pass("unsafe settings are rejected; cross-project downloads denied; cancellation stops a render and never exposes an incomplete file");

  // A stored uploaded image is materialised safely; it is not silently exported as a black frame.
  const uploaded = { ...project.frames[0], duration: 1, audio: [], image: `data:image/jpeg;base64,${readFileSync("public/images/neonoire/s7/65-the-evidence-bag.jpg").toString("base64")}` };
  assert.equal((await api.patch(`/api/projects/${copyId}`, { data: { frames: [uploaded] } })).status(), 200);
  const started = await api.post(jobs, { data: { resolution: "720p", audio: false } });
  assert.equal(started.status(), 202);
  const uploadedId = (await started.json()).id;
  await expect.poll(async () => (await (await api.get(`${jobs}/jobs/${uploadedId}`)).json()).status, { timeout: 60000, intervals: [300, 750, 1500] }).toBe("complete");
  const uploadVideo = await api.get(`${jobs}/jobs/${uploadedId}/download`);
  assert.equal(uploadVideo.status(), 200);
  writeFileSync("artifacts/director-corrections/uploaded-image.mp4", await uploadVideo.body());
  pass("uploaded JPEGs render correctly from an isolated media snapshot");
  assert.deepEqual(errors, [], "No browser or hydration errors");
  console.log("Animatic browser checks passed.");
} finally {
  if (copyId) await api.delete(`/api/projects/${copyId}`);
  await browser.close(); await api.dispose();
}
