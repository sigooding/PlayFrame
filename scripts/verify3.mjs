import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH, headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1441, height: 1000 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await mkdir('artifacts', { recursive: true });
const check = m => console.log('PASS:', m);
const tab = n => page.locator('.project-tabs > button', { hasText: n }).first();

try {
  await page.goto(base, { waitUntil: 'networkidle' });

  // ------- Characters tab renders seeded cast -------
  await page.locator('.project-tabs > button', { hasText: 'Characters' }).first().click();
  await expect(page.getByText('Ella Voss')).toBeVisible();
  await expect(page.getByText('Thomas Voss')).toBeVisible();
  check('Cast tab renders both seeded characters');
  await page.screenshot({ path: 'artifacts/shot-characters.png', fullPage: true });

  // ------- Create a character with traits (tag input) -------
  await page.getByRole('button', { name: 'Add character' }).click();
  await page.fill('input[placeholder*="name that fits"]', 'Marion the Ferryman');
  await page.fill('textarea[placeholder*="who they are"]', 'An old fisherman who knew Thomas well.');
  const traitInput = page.locator('.tag-input-row input').first();
  await traitInput.fill('Weathered');
  await traitInput.press('Enter');
  await traitInput.fill('Talkative');
  await traitInput.press('Enter');
  await expect(page.locator('.chip', { hasText: 'Weathered' })).toHaveCount(1);
  await expect(page.locator('.chip', { hasText: 'Talkative' })).toHaveCount(1);
  check('Trait chips add via Enter key');
  // remove one trait
  await page.locator('.chip', { hasText: 'Talkative' }).locator('button').click();
  await expect(page.locator('.chip', { hasText: 'Talkative' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Add to cast' }).click();
  await expect(page.getByText('Marion the Ferryman').first()).toBeVisible();
  check('New character saved with trait chips');

  // ------- Screenplay: cast dropdown inserts character cue -------
  await page.locator('.project-tabs > button', { hasText: 'Screenplay' }).first().click();
  const scriptBox = page.getByRole('textbox', { name: 'Screenplay editor' });
  await expect(scriptBox).toBeVisible();
  await scriptBox.click();
  await page.keyboard.press('Control+End');
  await page.getByLabel('Insert a character from your cast').selectOption('Marion the Ferryman');
  await expect(scriptBox).toHaveValue(/MARION THE FERRYMAN/);
  check('Cast dropdown inserts formatted character cue');
  // scene cast chips visible
  await expect(page.locator('.scene-cast').first()).toBeVisible();
  check('Scene navigator shows cast initials');
  // restore script via API to keep seed clean
  const projects = await (await page.request.get(`${base}/api/projects`)).json();
  const tll = projects.find(p => p.title === 'The Last Light');
  await page.request.patch(`${base}/api/projects/${tll.id}`, { data: { script: tll.script.replace(/\n\n\s+MARION THE FERRYMAN\n\s+$/,'') } });

  // ------- Scene dialog cast assignment -------
  await page.reload({ waitUntil: 'networkidle' });
  await tab('Screenplay').click();
  await page.locator('.scene-nav-item', { hasText: 'The road back' }).locator('.scene-edit-button').click();
  const marionChip = page.locator('.chip-toggle', { hasText: 'Marion the Ferryman' }).first();
  await marionChip.click();
  await expect(marionChip).toHaveClass(/chip-active/);
  check('Scene dialog cast assignment toggles');
  await page.getByRole('button', { name: 'Cancel' }).click();

  // ------- Delete test character -------
  await page.locator('.project-tabs > button', { hasText: 'Characters' }).first().click();
  await page.locator('.note-card', { hasText: 'Marion the Ferryman' }).click();
  await page.getByRole('button', { name: 'Remove from cast' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByText('Marion the Ferryman')).toHaveCount(0);
  check('Character deletion works');

  // ------- Brainstorm tab: nodes render, tags work -------
  await page.locator('.project-tabs > button', { hasText: 'Brainstorm' }).first().click();
  await expect(page.getByRole('button', { name: 'Edit idea: The Lighthouse' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Edit idea: The Letter' })).toBeVisible();
  check('Brainstorm map renders seeded nodes');
  await page.screenshot({ path: 'artifacts/shot-brainstorm.png', fullPage: true });

  // edit node and add tag
  await page.getByRole('button', { name: 'Edit idea: The Lighthouse' }).click();
  const tagInput = page.locator('.tag-input-row input').first();
  await expect(tagInput).toBeVisible();
  await expect(page.locator('.chip', { hasText: 'Setting' })).toHaveCount(1);
  check('Existing node tags render as chips');
  await tagInput.fill('Director');
  await tagInput.press('Enter');
  await expect(page.locator('.chip', { hasText: 'Director' })).toHaveCount(1);
  // remove the new tag via chip button
  await page.locator('.chip', { hasText: 'Director' }).locator('button').click();
  await expect(page.locator('.chip', { hasText: 'Director' })).toHaveCount(0);
  check('Brainstorm tags add and remove correctly');
  await page.getByRole('button', { name: 'Save idea' }).click();
  await expect(page.locator('.modal-backdrop')).toHaveCount(0);
  check('Brainstorm idea saves and dialog closes');

  // node drag persists
  const node = page.getByRole('button', { name: 'Edit idea: The Letter' });
  await node.hover();
  await page.mouse.down();
  await page.mouse.move((await node.boundingBox()).x + 260, (await node.boundingBox()).y + 160, { steps: 12 });
  await page.mouse.up();
  await page.waitForTimeout(600);
  const updated = await (await page.request.get(`${base}/api/projects/${tll.id}`)).json();
  const letter = updated.brainstorm.find(n => n.title === 'The Letter');
  expect(letter.x).toBeGreaterThan(340);
  check('Node drag persists position to database');
  await page.request.patch(`${base}/api/projects/${tll.id}`, { data: { brainstorm: tll.brainstorm } });

  // ------- Storyboard screenshot with larger text -------
  await page.locator('.project-tabs > button', { hasText: 'Storyboard' }).first().click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'artifacts/shot-storyboard.png', fullPage: true });
  check('Storyboard renders with increased text size');

  // ------- Frame dialog cast tags -------
  await page.getByRole('button', { name: /Edit frame \d+: The road back/ }).click();
  await expect(page.locator('.field', { hasText: 'Who is in this shot?' }).first()).toBeVisible();
  await expect(page.locator('.chip-toggle', { hasText: 'Ella Voss' })).toHaveClass(/chip-active/);
  check('Frame dialog shows inherited cast tags');
  await page.getByRole('button', { name: 'Cancel' }).click();

  // ------- Mobile check -------
  const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mob.goto(base, { waitUntil: 'networkidle' });
  await mob.screenshot({ path: 'artifacts/shot-mobile.png', fullPage: true });
  const overflow = await mob.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await mob.close();
  check('Mobile layout fits without horizontal overflow');

  expect(errors).toEqual([]);
  check('No uncaught browser errors');
} finally {
  try { const list = await (await page.request.get(`${base}/api/projects`)).json(); const t = list.find(p => p.title === 'The Last Light'); if (t) await page.request.patch(`${base}/api/projects/${t.id}`, { data: { characters: t.characters.filter(c => c.name !== 'Marion the Ferryman') } }); } catch {}
  await browser.close();
}
