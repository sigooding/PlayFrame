// Optional real-browser smoke test. Needs a running app and `npx playwright install chromium`.
// Set BROWSER_EXECUTABLE_PATH for an existing Chromium. All edits use a disposable imported copy.
import assert from "node:assert/strict";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, expect, request } from "@playwright/test";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const project = JSON.parse(readFileSync(join(root, "public/projects/let-the-raptures-commence.json"), "utf8"));
const baseURL = process.env.TEST_BASE_URL || "http://127.0.0.1:3000";
const api = await request.newContext({ baseURL });
const browser = await chromium.launch({
  executablePath: process.env.BROWSER_EXECUTABLE_PATH || undefined,
  args: ["--no-sandbox", "--disable-dev-shm-usage"], headless: true,
});
const errors = [];
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on("pageerror", error => errors.push(error.message));
mkdirSync(join(root, "artifacts"), { recursive: true });
let copyId;
const go = (id, tab) => page.goto(`${baseURL}/?project=${id}&tab=${tab}`);
const tabs = () => page.getByRole("navigation", { name: "Project sections" });
const assertNoOverflow = async target => assert(await target.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), "Page must not overflow horizontally");

try {
  // Explicitly open the bundled workspace once; the endpoint must never overwrite existing work.
  const opened = await api.post("/api/projects/rapture");
  assert.equal(opened.status(), 200);
  await go(project.id, "storyboard");
  await expect(page.locator(".frame-card")).toHaveCount(210);
  await expect(page.locator(".frame-card h3").first()).toHaveText("Cold open — board 01");
  await expect(page.locator(".frame-card h3").last()).toHaveText("The unfinished complaint");
  await page.getByLabel("Filter by scene").selectOption("rapture-ep4-number-fourteen");
  await expect(page.locator(".frame-card")).toHaveCount(13);
  await page.locator(".frame-card").last().scrollIntoViewIfNeeded();
  await page.locator(".frame-card").first().scrollIntoViewIfNeeded();
  await expect(page.locator('.frame-card h3').filter({ hasText: /— reference$/ })).toHaveCount(0);
  await expect(page.locator(".frame-duration").first()).toContainText("~5s");
  await assertNoOverflow(page);
  const images = page.locator(".frame-card img");
  await expect.poll(() => images.evaluateAll(nodes => nodes.every(image => image.complete && image.naturalWidth > 0 && image.dataset.fallback !== "1"))).toBe(true);
  await page.screenshot({ path: join(root, "artifacts/rapture-board.png"), fullPage: true });

  // Prompt Studio opens on the first boarded scene; the red-light board is one selection away.
  await tabs().getByRole("button", { name: /Prompt Studio/ }).click();
  await expect(page.getByLabel("Scene for prompts")).toHaveValue("rapture-ep1-mugging");
  await expect(page.locator(".studio-shot-item")).toHaveCount(19);
  await page.getByLabel("Scene for prompts").selectOption("rapture-ep4-number-fourteen");
  await expect(page.locator(".studio-shot-item")).toHaveCount(13);
  await expect(page.getByLabel("Combined prompts for the selected shots")).toContainText("Red practical sources only");
  console.log("PASS desktop storyboard, 210 frames in story order, prompts, visible estimate labels, images and layout");

  // Disposable copy for real form persistence and import/export exercises.
  const response = await api.post("/api/projects/import", { data: { ...project, title: "Rapture browser verification — disposable" } });
  assert.equal(response.status(), 201);
  copyId = (await response.json()).id;
  assert.notEqual(copyId, project.id);
  await go(copyId, "storyboard");
  await page.getByRole("button", { name: "Edit frame 204: Brown, then clear", exact: true }).click();
  const modal = page.getByRole("dialog", { name: "Frame 204", exact: true });
  await expect(modal.getByLabel("Working duration estimate (not locked)")).toBeChecked();
  await modal.getByLabel("Working duration estimate (not locked)").uncheck();
  await modal.getByLabel("Duration (seconds)").fill("12");
  // Empty on-camera cast remains empty even when changing scenes and back.
  await modal.getByLabel("Scene", { exact: true }).selectOption("rapture-ep1-st-judes");
  await expect(modal.locator(".frame-fields .chip-active")).toHaveCount(0);
  await modal.getByLabel("Scene", { exact: true }).selectOption("rapture-ep4-number-fourteen");
  await expect(modal.locator(".frame-fields .chip-active")).toHaveCount(0);
  await modal.getByRole("button", { name: "Shot design", exact: true }).click();
  await expect(modal.getByLabel("Lighting direction")).toHaveAttribute("placeholder", /Red practical sources only/);
  await modal.getByLabel("Lighting direction").fill("Red kettle indicator only. No white fill.");
  await modal.getByRole("button", { name: "Save changes", exact: true }).click();
  await expect(modal).toBeHidden();
  await page.reload();
  await page.getByRole("button", { name: "Edit frame 204: Brown, then clear", exact: true }).click();
  await expect(modal.getByLabel("Duration (seconds)")).toHaveValue("12");
  await expect(modal.getByLabel("Working duration estimate (not locked)")).not.toBeChecked();
  await modal.getByRole("button", { name: "Shot design", exact: true }).click();
  await expect(modal.getByLabel("Lighting direction")).toHaveValue("Red kettle indicator only. No white fill.");
  await modal.getByRole("button", { name: "AI prompt", exact: true }).click();
  const prompt = await modal.getByLabel("Generated video prompt").inputValue();
  assert(prompt.includes("Red kettle indicator only"));
  assert(!prompt.includes("Danny Crane") && !prompt.includes("Jodie Crane"));
  await modal.getByRole("button", { name: "Close dialog" }).click();

  await tabs().getByRole("button", { name: /^Screenplay/ }).click();
  await expect(page.getByLabel("Screenplay editor")).toHaveValue(project.script);
  await expect(page.locator(".scene-nav-item.selected strong")).toHaveText("Number Fourteen");
  await page.getByRole("button", { name: "Edit scene Number Fourteen", exact: true }).click();
  await page.getByRole("dialog").getByLabel("Lighting direction").fill("Red letterbox practical only. No white or blue fill.");
  await page.getByRole("button", { name: "Save scene", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await page.reload();
  await page.getByRole("button", { name: "Edit scene Number Fourteen", exact: true }).click();
  await expect(page.getByRole("dialog").getByLabel("Lighting direction")).toHaveValue("Red letterbox practical only. No white or blue fill.");
  await page.getByRole("button", { name: "Close dialog" }).click();
  const saved = await (await api.get(`/api/projects/${copyId}`)).json();
  assert.equal(saved.frames[203].lightingNotes, "Red kettle indicator only. No white fill.");
  assert.equal(saved.frames[203].durationIsEstimate, false);
  assert.equal(saved.script, project.script);
  console.log("PASS real frame and scene form saves, reload, lighting inheritance/override, empty cast and unchanged script");

  await page.getByRole("navigation", { name: "Workspace navigation" }).getByRole("button", { name: /Templates/ }).click();
  await page.getByRole("button", { name: "Open series workspace", exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`project=${project.id}`));
  await expect(page.locator(".frame-card")).toHaveCount(210);
  const restored = await (await api.get(`/api/projects/${project.id}`)).json();
  assert.equal(restored.script, (await opened.json()).script, "Template action must preserve the existing series");
  console.log("PASS template opens the saved series without duplicates or replacing its screenplay");

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  mobile.on("pageerror", error => errors.push(error.message));
  await mobile.goto(`${baseURL}/?project=${project.id}&tab=storyboard`);
  await expect(mobile.locator(".frame-card")).toHaveCount(210);
  await assertNoOverflow(mobile);
  await mobile.getByRole("button", { name: "Open navigation", exact: true }).click();
  await expect(mobile.getByRole("navigation", { name: "Workspace navigation" })).toBeVisible();
  await mobile.getByRole("button", { name: "Close navigation", exact: true }).click();
  await mobile.screenshot({ path: join(root, "artifacts/rapture-mobile.png"), fullPage: false });
  await mobile.close();
  assert.deepEqual(errors, [], "No runtime or hydration errors");
  console.log("PASS mobile layout/navigation and no browser runtime errors");
} finally {
  if (copyId) {
    const deleted = await api.delete(`/api/projects/${copyId}`);
    assert(deleted.ok(), "Disposable test project cleanup failed");
  }
  await browser.close();
  await api.dispose();
}
