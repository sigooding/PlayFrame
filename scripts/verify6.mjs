// Character relationships, the lighting library, and shot-type reference images.
// Run with the dev server up:  node scripts/verify6.mjs
import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'], executablePath: process.env.CHROMIUM_PATH });
const context = await browser.newContext({ viewport: { width: 1441, height: 1000 } });
const page = await context.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await mkdir('artifacts', { recursive: true });
const check = m => console.log('PASS:', m);
/** Wait for a rendered <img> to actually decode — lazy images need a moment. */
async function imageLoaded(locator, timeout = 5000) {
  await locator.scrollIntoViewIfNeeded().catch(() => {});
  const handle = await locator.elementHandle();
  if (!handle) return false;
  try { await page.waitForFunction(el => el.complete && el.naturalWidth > 0, handle, { timeout }); return true; }
  catch { return false; }
}
const tab = n => page.locator('.project-tabs > button', { hasText: n }).first();
const api = async () => (await (await page.request.get(`${base}/api/projects`)).json()).find(p => p.title === 'The Last Light');
const original = await api();
const id = original.id;

try {
  await page.goto(base, { waitUntil: 'networkidle' });

  // ---------- reference images for every shot type ----------
  await tab('Storyboard').click();
  await page.getByRole('button', { name: /Edit frame 1/ }).click();
  await page.getByRole('button', { name: 'Shot design', exact: true }).click();
  await expect(page.locator('.shot-option')).toHaveCount(14);
  const broken = [];
  for (const type of ['Establishing', 'Extreme wide', 'Wide', 'Full', 'Medium wide', 'Medium', 'Medium close-up', 'Close-up', 'Extreme close-up', 'Over the shoulder', 'Two-shot', 'POV', 'Insert', 'Aerial']) {
    const img = page.locator(`[aria-label="${type} shot"]`).locator('.shot-thumb img').first();
    const src = await img.getAttribute('src');
    const slug = type.toLowerCase().replace(/ /g, '-');
    if (!src?.includes(slug)) broken.push(`${type} → ${src}`);
    if (!(await imageLoaded(img))) broken.push(`${type} → ${src} did not load`);
  }
  expect(broken).toEqual([]);
  check('All 14 shot types show the reference image that matches their name');

  // ---------- lighting library ----------
  await expect(page.locator('.lighting-option')).toHaveCount(9);
  const { existsSync } = await import('node:fs');
  const lightingPending = [];
  const lightingBroken = [];
  for (const name of ['Natural daylight', 'Golden hour', 'Blue hour', 'Overcast soft', 'Low key', 'High key', 'Practical night', 'Backlit silhouette']) {
    const slug = name.toLowerCase().replace(/ /g, '-');
    const onDisk = existsSync(`public/images/lighting/${slug}.jpg`);
    const tile = page.locator(`[aria-label="${name} lighting"]`);
    await tile.scrollIntoViewIfNeeded();
    await page.waitForTimeout(350); // let the photo load, or its fallback settle
    const img = tile.locator('img');
    if (!(await img.count())) {
      if (onDisk) lightingBroken.push(`${name} → the file exists but the tile fell back to a swatch`);
      else lightingPending.push(name);
      continue;
    }
    const src = await img.getAttribute('src');
    if (!src?.includes(slug)) lightingBroken.push(`${name} → wrong image (${src})`);
    else if (!(await imageLoaded(img))) lightingBroken.push(`${name} → ${src} did not load`);
  }
  expect(lightingBroken).toEqual([]);
  if (lightingPending.length) console.log('   pending photos (tile shows its colour swatch): ' + lightingPending.join(', '));
  if (lightingBroken.length) console.log('   missing lighting photos (fall back to a colour swatch):\n   ' + lightingBroken.join('\n   '));
  await page.getByLabel('Low key lighting').click();
  await expect(page.locator('.lighting-summary')).toContainText('Mostly darkness');
  await page.screenshot({ path: 'artifacts/v6-light-picker.png' });
  check('Lighting library renders eight looks plus the scene default');

  // ---------- lighting flows into the frame and the prompt ----------
  await page.getByRole('button', { name: 'AI prompt', exact: true }).click();
  await expect(page.getByLabel('Generated video prompt')).toHaveValue(/low key lighting, deep blacks/);
  check('Chosen lighting is written into the AI prompt');
  await page.getByRole('button', { name: 'Save changes' }).click();
  await expect.poll(async () => (await api()).frames.find(f => f.id === original.frames[0].id)?.lighting).toBe('Low key');
  check('Lighting choice persists on the frame');
  await page.request.patch(`${base}/api/projects/${id}`, { data: { frames: original.frames } });

  // ---------- relationships on cast cards + map ----------
  await tab('Characters').click();
  await expect(page.locator('.note-card', { hasText: 'Ella Voss' }).locator('.relation-chip').first()).toContainText('Parent');
  check('Cast cards show relationship chips');
  await tab('Relationships').click();
  await expect(page.locator('.cast-node')).toHaveCount(3);
  await expect(page.locator('.cast-link')).toHaveCount(3);
  await expect(page.locator('.cast-link-row')).toHaveCount(3);
  await expect(page.locator('.cast-link-row').first()).toContainText("Thomas Voss is Ella Voss's parent");
  await expect(page.locator('.cast-link-row').first()).toContainText("Ella Voss is Thomas Voss's child");
  await page.screenshot({ path: 'artifacts/v6-relationships.png', fullPage: true });
  check('Relationship map draws one node per character and one link per pair');

  // clicking a node opens that character
  await page.locator('.cast-node', { hasText: 'Ella Voss' }).click();
  await expect(page.getByLabel('Character name')).toHaveValue('Ella Voss');
  await expect(page.locator('.relation-row')).toHaveCount(2);
  await expect(page.locator('.relation-incoming .chip', { hasText: 'Thomas Voss' })).toBeVisible();
  await page.screenshot({ path: 'artifacts/v6-relation-editor.png' });
  check('Character dialog lists both sides of a relationship');

  // change a relationship and confirm both cards stay in step
  await page.getByLabel('Relationship with Elias Voss', { exact: true }).selectOption('Mentor');
  await page.getByRole('button', { name: 'Save character' }).click();
  const elias = async () => (await api()).characters.find(c => c.id === 'char-3');
  await expect.poll(async () => (await elias()).relations.find(r => r.targetId === 'char-1')?.kind).toBe('Student');
  check('Editing one side mirrors the other side of the relationship');

  // the pair is not offered twice: the other card shows it as set from the other side
  await page.locator('.cast-node', { hasText: 'Elias Voss' }).click();
  await expect(page.getByLabel('Add a relationship with').locator('option', { hasText: 'Ella Voss' })).toHaveCount(0);
  await expect(page.locator('.relation-incoming .chip', { hasText: 'Ella Voss' })).toBeVisible();

  // removing a link clears it for both people, and it can be created again from either card
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.locator('.cast-node', { hasText: 'Ella Voss' }).click();
  await page.getByRole('button', { name: 'Remove relationship with Elias Voss' }).click();
  await page.getByRole('button', { name: 'Save character' }).click();
  await expect.poll(async () => (await elias()).relations.find(r => r.targetId === 'char-1')).toBeUndefined();
  await page.locator('.cast-node', { hasText: 'Elias Voss' }).click();
  await page.getByLabel('Add a relationship with').selectOption({ label: 'Ella Voss' });
  await page.getByLabel("They are this character's").selectOption('Mentor');
  await page.getByRole('button', { name: 'Link' }).click();
  await page.getByRole('button', { name: 'Save character' }).click();
  await expect.poll(async () => (await api()).characters.find(c => c.id === 'char-1').relations.find(r => r.targetId === 'char-3')?.kind).toBe('Student');
  check('A relationship can be created, mirrored and removed from either card');

  // ---------- relationships reach the prompt ----------
  await tab('Storyboard').click();
  await page.locator('.frame-card', { hasText: 'One step closer' }).locator('.frame-image-button').click();
  await page.getByRole('button', { name: 'AI prompt', exact: true }).click();
  await expect(page.getByLabel('Generated video prompt')).toHaveValue(/Elias Voss is Ella Voss's (student|mentor)|Ella Voss is Elias Voss's (mentor|student)/);
  await expect(page.getByLabel('Generated video prompt')).toHaveValue(/Elias Voss \(54/);
  await page.getByRole('button', { name: 'Cancel' }).click();
  const mine = (await api()).scenes.find(s => s.title === 'One step closer');
  await page.request.patch(`${base}/api/projects/${id}`, { data: { characters: original.characters, scenes: original.scenes } });
  expect(mine.lighting).toBe('Natural daylight');
  check('Prompts describe how the people in the shot know each other');

  // ---------- scene default lighting is inherited by new shots ----------
  await tab('Overview').click();
  await page.locator('.scene-overview-row', { hasText: 'A new beginning' }).click();
  await expect(page.locator('.lighting-option.selected')).toContainText('High key');
  await page.getByLabel('Blue hour lighting').click();
  await page.getByRole('button', { name: 'Save scene' }).click();
  await expect.poll(async () => (await api()).scenes.find(s => s.title === 'A new beginning')?.lighting).toBe('Blue hour');
  await tab('Storyboard').click();
  await page.getByRole('button', { name: 'Add frame' }).click();
  await page.getByLabel('Scene', { exact: true }).selectOption({ index: 1 });
  await page.getByRole('button', { name: 'Shot design', exact: true }).click();
  await expect(page.locator('.lighting-option.selected')).toContainText('Practical night');
  await page.getByRole('button', { name: 'Frame', exact: true }).click();
  await page.getByLabel('Scene', { exact: true }).selectOption({ index: 7 });
  await page.getByRole('button', { name: 'Shot design', exact: true }).click();
  await expect(page.locator('.lighting-option.selected')).toContainText('Blue hour');
  await page.getByRole('button', { name: 'Cancel' }).click();
  check('New shots inherit the scene’s default lighting');

  // ---------- shot list CSV + look book carry the new fields ----------
  await tab('Shot list').click();
  const dl = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const csv = (await import('node:fs')).readFileSync(await (await dl).path(), 'utf8');
  expect(csv.split('\n')[0]).toMatch(/Lighting.*Cut in.*Duration \(s\).*Cast.*Relationships/);
  expect(csv).toMatch(/Thomas Voss is Ella Voss's parent/);
  check('Shot list CSV includes the Relationships column');

  // ---------- storyboard still renders with the new reference images ----------
  await tab('Storyboard').click();
  await expect(page.locator('.frame-card')).toHaveCount(original.frames.length);
  await page.screenshot({ path: 'artifacts/v6-storyboard.png', fullPage: true });

  // ---------- mobile holds up ----------
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mob.goto(base, { waitUntil: 'networkidle' });
  await mob.locator('.project-tabs > button', { hasText: 'Relationships' }).first().click();
  await mob.waitForTimeout(300);
  expect(await mob.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  await mob.screenshot({ path: 'artifacts/v6-mobile-relations.png', fullPage: true });
  await mob.close();
  check('Relationship map holds up on mobile');

  await page.waitForTimeout(200);
  expect(errors).toEqual([]);
  check('No uncaught browser errors');
} finally {
  const live = await api();
  if (live && original) await page.request.patch(`${base}/api/projects/${id}`, { data: { characters: original.characters, scenes: original.scenes, frames: original.frames } });
  await browser.close();
}
