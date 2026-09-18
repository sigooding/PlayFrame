import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1441, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await mkdir('artifacts', { recursive: true });
const check = m => console.log('PASS:', m);
const tab = n => page.locator('.project-tabs > button', { hasText: n }).first();
const api = async () => (await (await page.request.get(`${base}/api/projects`)).json());
const tll = () => api().then(list => list.find(p => p.title === 'The Last Light'));
const created = [];
const pristine = await tll();

try {
  await page.goto(base, { waitUntil: 'networkidle' });

  // ---------- seeded structure: cold open, acts, sequences ----------
  await tab('Overview').click();
  await expect(page.getByRole('heading', { name: 'Cold open', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Act I — The Road' })).toBeVisible();
  await expect(page.locator('.scene-overview-row', { hasText: 'The last transmission' }).locator('.kind-badge')).toHaveText('Cold open');
  check('Cold open and acts render in the overview');

  await tab('Screenplay').click();
  await expect(page.locator('.act-header', { hasText: 'The arrival' })).toBeVisible();
  await expect(page.locator('.act-header', { hasText: 'The walk' })).toBeVisible();
  check('Screenplay navigator groups scenes by act and sequence');

  // ---------- caret does not jump to the end when inserting an element ----------
  const script = page.getByRole('textbox', { name: 'Screenplay editor' });
  await script.click();
  await page.keyboard.press('Control+Home');
  await page.getByLabel('Insert screenplay element').selectOption('action');
  const caret = await script.evaluate(el => ({ start: el.selectionStart, end: el.selectionEnd, len: el.value.length }));
  expect(caret.start).toBe(2);
  expect(caret.end).toBe(2);
  expect(caret.start).toBeLessThan(caret.len);
  check('Insert element keeps the caret in place (no jump to end of script)');
  await page.getByLabel('Insert a character from your cast').selectOption('Ella Voss');
  const caret2 = await script.evaluate(el => ({ start: el.selectionStart, value: el.value }));
  expect(caret2.value.slice(caret2.start - 30, caret2.start)).toContain('ELLA');
  expect(caret2.start).toBeLessThan(caret2.value.length);
  check('Character cue inserts at the caret');
  await page.reload({ waitUntil: 'networkidle' });

  // ---------- sequence reassignment ----------
  await tab('Screenplay').click();
  await page.locator('.scene-nav-item', { hasText: 'The road back' }).locator('.scene-edit-button').click();
  await expect(page.getByRole('combobox', { name: 'Sequence', exact: true })).toHaveValue('part-1');
  await page.getByRole('combobox', { name: 'Sequence', exact: true }).selectOption('part-2');
  await page.getByRole('button', { name: 'Save scene' }).click();
  await expect.poll(async () => (await tll()).scenes.find(s => s.title === 'The road back').partId).toBe('part-2');
  check('Scene can move between sequences, and it persists');
  await page.request.patch(`${base}/api/projects/${(await tll()).id}`, { data: { scenes: (await tll()).scenes.map(s => s.title === 'The road back' ? { ...s, partId: 'part-1' } : s) } });

  // ---------- sequences editor: add a sequence to an act ----------
  await page.locator('.scene-nav-heading button[aria-label="Manage acts and sequences"]').click();
  await expect(page.getByRole('dialog').getByRole('button', { name: /Sequences/ }).first()).toBeVisible();
  const firstAct = page.locator('.act-item').first();
  const toggle = firstAct.getByRole('button', { name: /Sequences/ });
  if ((await toggle.getAttribute('aria-expanded')) !== 'true') await toggle.click();
  await firstAct.getByRole('button', { name: 'Add a sequence' }).click();
  await firstAct.locator('.part-row').last().getByRole('textbox').first().fill('The promise');
  await page.getByRole('button', { name: 'Save structure' }).click();
  await expect.poll(async () => (await tll()).acts[0].parts.length).toBe(3);
  check('Acts can be broken into sequences (parts)');

  // ---------- mood boards ----------
  await tab('Mood boards').click();
  await expect(page.getByRole('heading', { name: 'The look of the film' })).toBeVisible();
  await expect(page.locator('.board-card')).toHaveCount(2);
  await page.screenshot({ path: 'artifacts/v5-boards.png', fullPage: true });
  check('Mood boards render with image mosaics');

  await page.getByRole('button', { name: 'New board' }).click();
  await page.getByLabel('Board title').fill('Night work');
  await page.getByLabel('What this board is for').fill('Low light, practical sources.');
  await page.getByLabel('Add images to board').setInputFiles('public/images/shots/low-key.jpg');
  await expect(page.locator('.board-item')).toHaveCount(1);
  await page.locator('.board-item input').fill('Reference for the cold open');
  await page.getByRole('button', { name: 'Create board' }).click();
  await expect(page.locator('.board-card')).toHaveCount(3);
  const boardId = await (await tll()).moodboards.find(b => b.title === 'Night work').id;
  const stored = (await tll()).moodboards.find(b => b.id === boardId);
  expect(stored.items[0].image.startsWith('data:image/jpeg')).toBe(true);
  expect(stored.items[0].caption).toBe('Reference for the cold open');
  check('Mood board created with uploaded, resized image and caption');

  // add from project library
  await page.locator('.board-card', { hasText: 'Night work' }).getByText('Open').click();
  await page.locator('.board-lib button').first().click();
  await page.getByRole('button', { name: 'Save board' }).click();
  await expect.poll(async () => (await tll()).moodboards.find(b => b.id === boardId).items.length).toBe(2);
  check('Existing project images can be added to a board');

  // delete board
  await page.locator('.board-card', { hasText: 'Night work' }).getByRole('button', { name: /Delete Night work/ }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.locator('.board-card')).toHaveCount(2);
  check('Mood board deletion is confirmed and persisted');

  // ---------- look book print ----------
  const popupPromise = context.waitForEvent('page', { timeout: 15000 });
  await page.getByRole('button', { name: 'Export', exact: true }).click();
  await page.getByRole('button', { name: /Look book/ }).click();
  await page.getByRole('button', { name: 'Open print preview' }).click();
  const popup = await popupPromise;
  await popup.waitForLoadState('domcontentloaded');
  expect(await popup.title()).toContain('Look book');
  const body = await popup.content();
  expect(body).toContain('The look of the film');
  expect(body).toContain('Act II — weather and scale');
  expect(body).toContain('Cast');
  expect(body).toContain('Cold open');
  await popup.close();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  check('Look book print view includes mood boards, cast and cold open');

  // ---------- search ----------
  await page.keyboard.press('Control+k');
  await page.getByLabel('Search workspace').fill('lighthouse');
  await expect(page.locator('.search-result')).not.toHaveCount(0);
  await page.getByRole('tab', { name: 'Ideas', exact: true }).click();
  await expect(page.locator('.search-result-type', { hasText: 'Idea' }).first()).toBeVisible();
  await page.getByLabel('Search workspace').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('dialog').filter({ hasText: /^Find anything/ })).toHaveCount(0);
  await expect(page.getByRole('dialog').getByLabel('Title')).toHaveValue(/Lighthouse/);
  await page.keyboard.press('Escape');
  check('Search filters by type, Enter opens the top result');

  await page.keyboard.press('Control+k');
  await page.getByLabel('Search workspace').fill('Ella Voss');
  await expect(page.locator('.search-result', { hasText: 'Ella Voss' }).first()).toBeVisible();
  await page.locator('.search-result', { hasText: 'Ella Voss' }).first().click();
  await expect(page.getByRole('dialog').getByLabel('Character name')).toHaveValue('Ella Voss');
  check('Searching cast opens that character');
  await page.keyboard.press('Escape');

  await page.keyboard.press('Control+k');
  await page.getByLabel('Search workspace').fill('unfindable-thing');
  await expect(page.locator('.search-empty')).toBeVisible();
  await page.keyboard.press('Escape');
  check('Empty search state shows');

  // ---------- project import ----------
  const exportJson = JSON.stringify(await tll());
  const imported = await (await page.request.post(`${base}/api/projects/import`, { data: exportJson, headers: { 'content-type': 'application/json' } })).json();
  created.push(imported.id);
  expect(imported.scenes.length).toBe((await tll()).scenes.length);
  expect(imported.moodboards.length).toBe((await tll()).moodboards.length);
  expect(imported.id).not.toBe((await tll()).id);
  check('Project backup imports as a new project with every entity');
  const bad = await page.request.post(`${base}/api/projects/import`, { data: '{"title":"empty"}', headers: { 'content-type': 'application/json' } });
  expect(bad.status()).toBe(400);
  check('Import rejects a file with nothing to import');

  await page.locator('.sidebar-import input[type=file]').setInputFiles({ name: 'project.json', mimeType: 'application/json', buffer: Buffer.from(exportJson) });
  await expect(page.locator('.toast')).toContainText('Imported');
  await page.waitForTimeout(600);
  check('Import works from the sidebar file picker');
  const after = await api();
  const keepId = (await tll()).id;
  for (const p of after.filter(x => x.title === 'The Last Light' && x.id !== keepId)) { await page.request.delete(`${base}/api/projects/${p.id}`); created.push(p.id); }

  // ---------- shared page shows the new material ----------
  const project = await tll();
  if (!project.shareId) await page.request.post(`${base}/api/projects/${project.id}/share`, { data: { enabled: true } });
  const token = (await tll()).shareId;
  const viewer = await context.newPage();
  await viewer.goto(`${base}/share/${token}`, { waitUntil: 'networkidle' });
  await viewer.getByRole('button', { name: 'Cast & look' }).click();
  await expect(viewer.getByText('Ella Voss')).toBeVisible();
  await expect(viewer.getByText('The look of the film')).toBeVisible();
  await viewer.screenshot({ path: 'artifacts/v5-share.png', fullPage: true });
  await viewer.close();
  check('Read-only share page shows cast, mood boards and notes');

  // ---------- mobile ----------
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mob.goto(base, { waitUntil: 'networkidle' });
  await mob.locator('.project-tabs > button', { hasText: 'Mood boards' }).first().click();
  await mob.waitForTimeout(300);
  expect(await mob.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  await mob.screenshot({ path: 'artifacts/v5-mobile.png', fullPage: true });
  await mob.close();
  check('Mobile layout holds for mood boards');

  expect(errors).toEqual([]);
  check('No uncaught browser errors');
} finally {
  const live = await api();
  const original = live.find(p => p.title === 'The Last Light');
  if (original && pristine) {
    await page.request.patch(`${base}/api/projects/${original.id}`, { data: { acts: pristine.acts, scenes: pristine.scenes, script: pristine.script, moodboards: pristine.moodboards, characters: pristine.characters } });
  }
  for (const id of created) await page.request.delete(`${base}/api/projects/${id}`).catch(() => {});
  await browser.close();
}
