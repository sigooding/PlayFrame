import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true, args: ['--no-sandbox'] });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const initial = await (await context.request.get(`${base}/api/projects`)).json();
const original = initial.find(p => p.title === 'The Last Light');
const createdIds = [];
const endpoint = `${base}/api/projects/${original.id}`;
const getProject = async () => (await context.request.get(endpoint)).json();
const tab = name => page.locator('.project-tabs > button').filter({ hasText: name }).first();
const check = message => console.log(`PASS: ${message}`);
await mkdir('artifacts', { recursive: true });

try {
  await page.goto(base, { waitUntil: 'networkidle' });
  await expect(page.locator('.frame-card')).toHaveCount(7);
  await expect(page.getByRole('heading', { name: 'The Last Light', exact: true })).toBeVisible();
  await page.screenshot({ path: 'artifacts/frame-desktop.png', fullPage: true });
  check('Initial storyboard renders six connected cinematic frames');

  await page.getByLabel('Filter by scene', { exact: true }).selectOption('scene-2');
  await expect(page.locator('.frame-card')).toHaveCount(2);
  await page.getByLabel('Filter by scene', { exact: true }).selectOption('all');
  await page.getByRole('button', { name: 'Filter', exact: true }).click();
  await page.getByLabel('Status', { exact: true }).selectOption('Ready');
  await expect(page.locator('.frame-card')).toHaveCount(4);
  await page.getByRole('button', { name: 'Reset filters', exact: true }).click();
  await page.getByRole('button', { name: 'Show 7 frames', exact: true }).click();
  await page.getByRole('button', { name: 'List view', exact: true }).click();
  await expect(page.locator('.shot-table tbody tr')).toHaveCount(7);
  await page.getByRole('button', { name: 'Grid view', exact: true }).click();
  check('Scene and status filters and list/grid toggles work');

  await page.getByRole('button', { name: /Edit frame \d+: The road back/ }).click();
  await page.getByLabel('What happens in this frame?', { exact: true }).fill('A persistence test on the coastal road.');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.reload({ waitUntil: 'networkidle' });
  await expect(page.locator('.frame-card', { hasText: 'The road back' }).first()).toContainText('A persistence test on the coastal road.');
  check('Editing a frame persists across a full reload');

  await page.getByRole('button', { name: 'Add frame', exact: true }).click();
  await page.getByLabel('Frame title', { exact: true }).fill('Browser test frame');
  await page.getByLabel('Upload reference image', { exact: true }).setInputFiles('public/images/letter.jpg');
  await expect(page.getByRole('button', { name: 'Upload image', exact: true })).toBeEnabled();
  await page.getByLabel('What happens in this frame?', { exact: true }).fill('An uploaded visual reference, linked to the scene.');
  await page.getByRole('button', { name: 'Add to storyboard', exact: true }).click();
  await expect(page.locator('.frame-card')).toHaveCount(8);
  await expect.poll(async () => (await getProject()).frames.find(f => f.title === 'Browser test frame')?.image.startsWith('data:image/jpeg')).toBe(true);
  await page.getByRole('button', { name: 'Options for Browser test frame', exact: true }).click();
  await page.locator('.card-menu').getByRole('button', { name: 'Delete frame', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.locator('.frame-card')).toHaveCount(7);
  check('New frames, image uploads, and confirmed deletion work');

  await page.getByRole('button', { name: 'Options for The road back', exact: true }).click();
  await page.locator('.card-menu').getByRole('button', { name: 'Duplicate', exact: true }).click();
  await expect(page.locator('.frame-card')).toHaveCount(8);
  await page.getByRole('button', { name: 'Options for The road back (copy)', exact: true }).click();
  await page.locator('.card-menu').getByRole('button', { name: 'Move later', exact: true }).click();
  await expect.poll(async () => (await getProject()).frames[3]?.title).toBe('The road back (copy)');
  await context.request.patch(endpoint, { data: { frames: original.frames } });
  await page.reload({ waitUntil: 'networkidle' });
  check('Duplication and accessible frame reordering persist');

  await tab('Screenplay').click();
  const screenplay = page.getByRole('textbox', { name: 'Screenplay editor', exact: true });
  await screenplay.fill(original.script + '\n\nAUTOSAVE BROWSER CHECK');
  await expect.poll(async () => (await getProject()).script.endsWith('AUTOSAVE BROWSER CHECK')).toBe(true);
  await page.screenshot({ path: 'artifacts/frame-screenplay.png', fullPage: true });
  await page.reload({ waitUntil: 'networkidle' });
  await tab('Screenplay').click();
  await expect(page.getByRole('textbox', { name: 'Screenplay editor', exact: true })).toHaveValue(original.script + '\n\nAUTOSAVE BROWSER CHECK');
  await page.getByRole('textbox', { name: 'Screenplay editor', exact: true }).fill(original.script + '\n\nIMMEDIATE TAB SWITCH CHECK');
  await tab('Storyboard').click();
  await expect.poll(async () => (await getProject()).script.endsWith('IMMEDIATE TAB SWITCH CHECK')).toBe(true);
  await context.request.patch(endpoint, { data: { script: original.script } });
  await page.reload({ waitUntil: 'networkidle' });
  check('Script autosave survives reload and an immediate tab switch');

  await tab('Screenplay').click();
  await page.getByLabel('Import screenplay file', { exact: true }).setInputFiles({ name: 'test.fountain', mimeType: 'text/plain', buffer: Buffer.from('BROWSER IMPORT\n\n1. EXT. TEST LOCATION - DAY\n\nA new scene begins.') });
  await expect.poll(async () => (await getProject()).script.startsWith('BROWSER IMPORT')).toBe(true);
  const scriptDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export script', exact: true }).click();
  expect((await scriptDownload).suggestedFilename()).toBe('the-last-light.fountain');
  await context.request.patch(endpoint, { data: { script: original.script } });
  await page.reload({ waitUntil: 'networkidle' });
  check('Fountain import and screenplay download work');

  await tab('Notes').click();
  await page.getByRole('button', { name: 'Add a note', exact: true }).click();
  await page.getByLabel('Title', { exact: true }).fill('Browser test note');
  await page.getByLabel('Your note', { exact: true }).fill('A saved thought for the next production day.');
  await page.getByRole('button', { name: 'sand note color', exact: true }).click();
  await page.getByRole('button', { name: 'Keep this thought', exact: true }).click();
  await expect(page.locator('.note-card')).toHaveCount(4);
  await expect.poll(async () => (await getProject()).notes.length).toBe(4);
  await page.locator('.note-card').filter({ hasText: 'Browser test note' }).click();
  await page.getByRole('button', { name: 'Delete note', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.locator('.note-card')).toHaveCount(3);
  check('Color-coded production notes can be created and removed');

  await tab('Shot list').click();
  await page.getByLabel('Shot type for The road back', { exact: true }).selectOption('Medium');
  await expect.poll(async () => (await getProject()).frames.find(f => f.title === 'The road back').shotType).toBe('Medium');
  const csvDownload = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV', exact: true }).click();
  expect((await csvDownload).suggestedFilename()).toBe('the-last-light-shot-list.csv');
  await context.request.patch(endpoint, { data: { frames: original.frames } });
  await page.reload({ waitUntil: 'networkidle' });
  check('Inline shot-list editing and CSV export work');

  await page.getByRole('button', { name: 'Play storyboard', exact: true }).click();
  await page.locator('.player-play').click();
  await page.getByRole('button', { name: 'Next frame', exact: true }).click();
  await expect(page.locator('.player-caption h3')).toHaveText('The road back');
  await page.keyboard.press('Escape');
  await expect(page.locator('.player')).toHaveCount(0);
  check('Storyboard playback, pause, navigation, and Escape work');

  await page.getByRole('button', { name: 'Share project', exact: true }).click();
  if (!(await getProject()).shareId) await page.getByRole('switch', { name: 'Enable public share link', exact: true }).click();
  const link = page.getByRole('textbox', { name: 'Share link', exact: true });
  await expect(link).toBeVisible();
  const shareUrl = await link.inputValue();
  const viewer = await context.newPage();
  await viewer.goto(shareUrl, { waitUntil: 'networkidle' });
  await expect(viewer.locator('.shared-frame')).toHaveCount(7);
  await viewer.getByRole('button', { name: 'Screenplay', exact: true }).click();
  await expect(viewer.locator('.shared-script')).toContainText('THE LAST LIGHT');
  await page.getByRole('switch', { name: 'Enable public share link', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Share link', exact: true })).toHaveCount(0);
  expect((await context.request.get(shareUrl)).status()).toBe(404);
  await viewer.close();
  await page.getByRole('button', { name: 'Done', exact: true }).click();
  check('Read-only public sharing works and revoked links return 404');

  await page.keyboard.press('Control+k');
  await page.getByLabel('Search workspace').fill('Words left');
  await page.locator('.search-result').first().click();
  await expect(page.getByLabel('Frame title', { exact: true })).toHaveValue('Words left unsaid');
  await page.keyboard.press('Escape');
  check('Keyboard workspace search opens the matching frame');

  await page.locator('.sidebar-new-project').click();
  await page.getByLabel('Project title', { exact: true }).fill('Browser test film');
  await page.getByLabel('Logline', { exact: true }).fill('A film made to verify a real creative workflow.');
  await page.getByLabel('Starting point', { exact: true }).selectOption('short-film');
  await page.getByRole('button', { name: 'Create project', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Browser test film', exact: true })).toBeVisible();
  const all = await (await context.request.get(`${base}/api/projects`)).json();
  const newProject = all.find(p => p.title === 'Browser test film');
  expect(newProject.scenes.length).toBe(3);
  createdIds.push(newProject.id);
  await page.getByRole('button', { name: 'Edit project details', exact: true }).click();
  await page.getByRole('button', { name: 'Delete project', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Stories waiting to be told.', exact: true })).toBeVisible();
  expect((await context.request.get(`${base}/api/projects/${newProject.id}`)).status()).toBe(404);
  check('Project creation, professional starter templates, and deletion work');

  const invalid = await context.request.patch(endpoint, { data: { frames: [{ ...original.frames[0], duration: -1 }] } });
  expect(invalid.status()).toBe(400);
  check('Server rejects invalid shot duration');

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true });
  mobile.on('pageerror', error => errors.push(error.message));
  await mobile.goto(base, { waitUntil: 'networkidle' });
  await mobile.screenshot({ path: 'artifacts/frame-mobile.png', fullPage: true });
  expect(await mobile.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await mobile.getByRole('button', { name: 'Open navigation', exact: true }).click();
  await expect(mobile.locator('.sidebar')).toHaveClass(/mobile-open/);
  await mobile.getByRole('button', { name: 'Templates', exact: false }).first().click();
  await expect(mobile.getByRole('heading', { name: 'Less setup. More storytelling.', exact: true })).toBeVisible();
  await mobile.close();
  check('Mobile layout fits the viewport and drawer navigation works');

  expect(errors).toEqual([]);
  check('No uncaught browser errors');
} finally {
  await context.request.patch(endpoint, { data: { title: original.title, description: original.description, scenes: original.scenes, frames: original.frames, notes: original.notes, script: original.script } });
  await context.request.post(`${endpoint}/share`, { data: { enabled: !!original.shareId } });
  for (const id of createdIds) await context.request.delete(`${base}/api/projects/${id}`);
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'artifacts/frame-desktop.png', fullPage: true });
  await browser.close();
}
