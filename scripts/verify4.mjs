import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const base = process.env.TEST_BASE_URL || 'http://localhost:3000';
const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 1441, height: 1000 } });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await mkdir('artifacts', { recursive: true });
const check = m => console.log('PASS:', m);
const tab = n => page.locator('.project-tabs > button', { hasText: n }).first();
const api = async () => (await (await page.request.get(`${base}/api/projects`)).json()).find(p => p.title === 'The Last Light');
const original = await api();
const id = original.id;

try {
  await page.goto(base, { waitUntil: 'networkidle' });

  // ---------- Shot design: picker + auto image ----------
  await page.getByRole('button', { name: 'Add frame' }).click();
  await page.getByLabel('Frame title').fill('Shot picker test');
  await page.getByLabel('Scene', { exact: true }).selectOption({ index: 2 });
  await expect(page.locator('.frame-preview img')).toHaveAttribute('src', /\/images\/shots\/wide\.jpg/);
  check('New frame starts with the Wide shot example image');
  await page.getByRole('button', { name: 'Shot design', exact: true }).click();
  await expect(page.locator('.shot-option')).toHaveCount(14);
  check('Shot picker shows all 14 shot types with reference visuals');
  await page.getByRole('button', { name: 'Extreme close-up shot' }).click();
  await expect(page.locator('.shot-summary')).toContainText('single detail');
  await page.getByLabel('Camera angle').selectOption('Low angle');
  await page.getByLabel('Lens').selectOption('85mm');
  await page.getByLabel('Lighting').selectOption('Golden hour');
  await page.getByLabel('Cut into this shot').selectOption('Match cut');
  await page.getByLabel('Mood in a few words').fill('Tense stillness');
  await page.getByRole('button', { name: 'Frame', exact: true }).click();
  await expect(page.locator('.frame-preview img')).toHaveAttribute('src', /extreme-close-up\.jpg/);
  check('Choosing a shot type automatically swaps the frame image to its example');

  // ---------- AI prompt tab ----------
  await page.getByRole('button', { name: 'AI prompt', exact: true }).click();
  const promptBox = page.getByLabel('Generated video prompt');
  await expect(promptBox).toHaveValue(/\[Static shot\]/);
  await expect(promptBox).toHaveValue(/extreme close-up/i);
  await expect(promptBox).toHaveValue(/85mm/);
  await expect(promptBox).toHaveValue(/low angle/i);
  await expect(promptBox).toHaveValue(/coastal road/i);
  await expect(promptBox).toHaveValue(/Ella Voss/);
  check('Hailuo prompt includes camera bracket, shot, lens, angle, setting, and cast');
  await page.getByRole('tab', { name: 'Seedance' }).click();
  await expect(promptBox).toHaveValue(/Shot \d+ of \d+/);
  await expect(promptBox).toHaveValue(/Match cut from the previous shot/);
  check('Seedance prompt includes shot index and cut continuity');
  await page.getByRole('tab', { name: 'Kling' }).click();
  await expect(promptBox).toHaveValue(/Negative prompt:/);
  await page.getByRole('tab', { name: 'Universal' }).click();
  await expect(promptBox).toHaveValue(/CONTINUITY:/);
  await expect(promptBox).toHaveValue(/Tense stillness/);
  check('Kling and Universal formats render with mood and negatives');
  await page.getByRole('button', { name: 'Add to storyboard' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect.poll(async () => (await api()).frames.find(f => f.title === 'Shot picker test')?.lens).toBe('85mm');
  check('Shot design metadata (lens, angle, lighting, transition, mood) persists');
  await expect(page.locator('.frame-card', { hasText: 'Shot picker test' }).locator('.frame-transition')).toHaveText(/Match cut/);
  check('Transition badge visible on storyboard card');

  // ---------- Scene prompt studio ----------
  await page.getByRole('button', { name: 'AI prompts' }).click();
  await page.getByLabel('Scene for prompts').selectOption({ index: 1 });
  await expect(page.getByLabel('Scene sequence prompt')).toHaveValue(/SCENE: THE ROAD BACK/);
  await expect(page.getByLabel('Scene sequence prompt')).toHaveValue(/SHOT 2 \(/);
  await expect(page.locator('.prompt-shot')).toHaveCount(2);
  await page.getByRole('tab', { name: 'MiniMax Hailuo' }).click();
  await expect(page.getByLabel('Scene sequence prompt')).toHaveValue(/one shot at a time/);
  check('Scene prompt studio builds a multi-shot sequence and per-shot prompts');
  await page.getByRole('button', { name: 'Done' }).click();

  // ---------- Shot list inline shot-type auto image ----------
  await tab('Shot list').click();
  await page.getByLabel('Shot type for Shot picker test').selectOption('Aerial');
  await expect.poll(async () => (await api()).frames.find(f => f.title === 'Shot picker test')?.image).toMatch(/shots\/aerial\.svg/);
  check('Changing shot type in the shot list also swaps the example image');
  await page.getByLabel('Transition into Shot picker test').selectOption('Dissolve');
  await expect.poll(async () => (await api()).frames.find(f => f.title === 'Shot picker test')?.transition).toBe('Dissolve');
  check('Cut-in transition editable inline in the shot list');
  // cleanup test frame
  await page.request.patch(`${base}/api/projects/${id}`, { data: { frames: original.frames } });
  await page.reload({ waitUntil: 'networkidle' });

  // ---------- Acts ----------
  await tab('Overview').click();
  await expect(page.getByRole('heading', { name: 'Act I — The Road' })).toBeVisible();
  await expect(page.locator('.act-block')).toHaveCount(4);
  check('Overview groups scenes into cold open plus three acts');
  await page.getByRole('button', { name: /Acts & sequences|Edit acts/ }).click();
  await page.getByRole('button', { name: 'Add an act' }).click();
  await page.getByLabel('Act 4 title').fill('Act IV — Epilogue');
  await page.getByRole('button', { name: 'Save structure' }).click();
  await expect.poll(async () => (await api()).acts.length).toBe(4);
  check('Acts can be added and saved');
  await tab('Screenplay').click();
  await expect(page.locator('.act-header', { hasText: 'Cold open' })).toBeVisible();
  await expect(page.locator('.act-header', { hasText: 'The arrival' })).toBeVisible();
  await expect(page.locator('.act-header').filter({ hasText: 'Act IV — Epilogue' })).toHaveCount(0);
  check('Screenplay navigator groups scenes under act and sequence headers');
  await page.locator('.scene-nav-item', { hasText: 'The road back' }).locator('.scene-edit-button').click();
  await expect(page.locator('.act-select-row select').first()).toHaveValue('act-1');
  await page.locator('.act-select-row select').selectOption({ label: 'IV · Act IV — Epilogue' });
  await page.getByRole('button', { name: 'Save scene' }).click();
  await expect.poll(async () => (await api()).scenes.find(s => s.title === 'The road back').actId).toBeTruthy();
  await expect.poll(async () => (await api()).scenes.find(s => s.title === 'The last transmission').actId).toBe(null);
  check('Scenes can be reassigned to an act');
  await page.request.patch(`${base}/api/projects/${id}`, { data: { acts: original.acts, scenes: original.scenes, script: original.script } });
  await expect.poll(async () => (await api()).acts.length).toBe(original.acts.length);
  await page.reload({ waitUntil: 'networkidle' });

  // ---------- Brainstorm connections ----------
  await tab('Brainstorm').click();
  await expect(page.locator('.brain-links path')).toHaveCount(3);
  check('Seeded connections render as 3 bezier links');
  await page.getByRole('button', { name: 'Add idea' }).click();
  await page.getByLabel('Title').fill('The Brass Key');
  await page.getByRole('button', { name: 'Keep this thought' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  // drag port from new node onto The Letter
  const key = page.getByRole('button', { name: 'Edit idea: The Brass Key' });
  const letter = page.getByRole('button', { name: 'Edit idea: The Letter' });
  const port = key.getByRole('button', { name: /Drag to connect/ });
  await key.hover();
  const pb = await port.boundingBox();
  const lb = await letter.boundingBox();
  await page.mouse.move(pb.x + pb.width / 2, pb.y + pb.height / 2);
  await page.mouse.down();
  await page.mouse.move(lb.x + lb.width / 2, lb.y + lb.height / 2, { steps: 12 });
  await page.mouse.up();
  await expect(page.locator('.brain-links path')).toHaveCount(4);
  await expect.poll(async () => (await api()).brainstorm.find(n => n.title === 'The Brass Key')?.connections.length).toBe(1);
  check('Drag-to-link port creates a persisted connection');
  // link mode
  await page.getByRole('button', { name: 'Connect ideas' }).click();
  await page.getByRole('button', { name: 'Edit idea: The Brass Key' }).click();
  await expect(page.locator('.link-banner')).toContainText('Connecting');
  await page.getByRole('button', { name: 'Edit idea: The Road Back' }).click();
  await expect(page.locator('.brain-links path')).toHaveCount(5);
  check('Click-to-connect mode links two ideas');
  await page.getByRole('button', { name: 'Exit connect mode' }).click();
  // remove a connection
  await page.locator('.node-canvas').hover();
  await page.getByRole('button', { name: /Remove connection between The Brass Key and The Letter|Remove connection between The Letter and The Brass Key/ }).click({ force: true });
  await expect(page.locator('.brain-links path')).toHaveCount(4);
  check('Connections can be removed from the map');
  // dialog chips reflect connections
  await page.getByRole('button', { name: 'Edit idea: The Brass Key' }).click();
  await expect(page.locator('.chip-toggle.chip-active', { hasText: 'The Road Back' })).toBeVisible();
  check('Idea dialog shows connected ideas as active chips');
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.screenshot({ path: 'artifacts/v4-brainstorm.png', fullPage: true });
  // drag node -> single persisted update, no dialog opens
  const before = (await api()).brainstorm.find(n => n.title === 'The Brass Key');
  const kb = await page.getByRole('button', { name: 'Edit idea: The Brass Key' }).boundingBox();
  await page.mouse.move(kb.x + 60, kb.y + 20); await page.mouse.down();
  await page.mouse.move(kb.x + 260, kb.y + 200, { steps: 10 }); await page.mouse.up();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect.poll(async () => (await api()).brainstorm.find(n => n.title === 'The Brass Key')?.x).toBeGreaterThan(before.x + 100);
  check('Dragging a node moves it without opening the editor and persists on release');
  await page.request.patch(`${base}/api/projects/${id}`, { data: { brainstorm: original.brainstorm } });

  // ---------- CSV includes new columns ----------
  await page.reload({ waitUntil: 'networkidle' });
  await tab('Shot list').click();
  const dl = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  const path = await (await dl).path();
  const csv = (await import('node:fs')).readFileSync(path, 'utf8');
  expect(csv.split('\n')[0]).toMatch(/Camera angle.*Lens.*Lighting.*Cut in/);
  check('Shot list CSV includes act, angle, lens, lighting, cut, cast, mood');

  await tab('Storyboard').click();
  await page.getByRole('button', { name: /Edit frame 1/ }).click();
  await page.getByRole('button', { name: 'Shot design', exact: true }).click();
  await page.screenshot({ path: 'artifacts/v4-shot-design.png' });
  await page.getByRole('button', { name: 'Cancel' }).click();

  const mob = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  await mob.goto(base, { waitUntil: 'networkidle' });
  expect(await mob.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
  await mob.close();
  check('Mobile layout still fits');

  expect(errors).toEqual([]);
  check('No uncaught browser errors');
} finally {
  await page.request.patch(`${base}/api/projects/${id}`, { data: { frames: original.frames, scenes: original.scenes, acts: original.acts, brainstorm: original.brainstorm, script: original.script } });
  await browser.close();
}
