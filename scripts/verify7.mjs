// Frame — verification pass 7.
//
// Covers the three things this pass is about, without needing a browser:
//   1. every reference image the app can show is really on disk and served with a 200
//   2. the fourteen shot types each have their own correct reference image
//   3. the character-relationship screens render real sentences, on every card and on the map
//
//   node scripts/verify7.mjs            (expects `npm run dev` on http://localhost:3000)
//
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const base = process.env.TEST_BASE_URL || "http://localhost:3000";
const root = fileURLToPath(new URL("..", import.meta.url));

let failures = 0;
const pass = message => console.log(`  PASS  ${message}`);
const fail = message => { failures += 1; console.log(`  FAIL  ${message}`); };
const check = (condition, message) => (condition ? pass(message) : fail(message));
const section = title => console.log(`\n${title}`);

/* ------------------------------- source scanning ------------------------------- */

const files = [];
const walk = dir => { for (const name of readdirSync(dir)) { const p = join(dir, name); if (statSync(p).isDirectory()) walk(p); else if (/\.(tsx?|css)$/.test(name)) files.push(p); } };
walk(join(root, "src"));
const source = files.map(file => ({ file, text: readFileSync(file, "utf8") }));

async function head(url) {
  try {
    const response = await fetch(url, { method: "GET", redirect: "follow" });
    return response.status;
  } catch (error) { return `error: ${error.message}`; }
}

/* --------------------------- 1. every image resolves --------------------------- */

section("1. Every image the app can show resolves");
const referenced = new Set();
for (const { text } of source) {
  for (const match of text.matchAll(/["'`]\/(images|fonts)\/([^"'`\s)]+)["'`]/g)) referenced.add(`/${match[1]}/${match[2]}`);
}
// Paths that only exist to migrate older projects (lib/image.ts) are deliberately not on disk,
// and a trailing slash is a prefix check rather than a file.
const imageSource = source.find(entry => entry.file.endsWith("lib/image.ts"))?.text || "";
const RETIRED_BLOCK_RE = new RegExp("const RETIRED_IMAGES[\\s\\S]*?\\n" + "\\};");
const retiredBlock = RETIRED_BLOCK_RE.exec(imageSource)?.[0] || "";
const retired = new Set([...retiredBlock.matchAll(/"([^"]+)":\s*"/g)].map(m => m[1]));
for (const path of [...referenced]) {
  if (path.endsWith("/") || retired.has(path)) referenced.delete(path);
}
const missingOnDisk = [...referenced].filter(path => !existsSync(join(root, "public", path)));
const brokenOverHttp = [];
for (const path of referenced) {
  const status = await head(base + path);
  if (status !== 200) brokenOverHttp.push(`${path} → ${status}`);
}
check(missingOnDisk.length === 0, `${referenced.size} referenced assets exist under public/`);
if (missingOnDisk.length) fail(`missing on disk: ${missingOnDisk.join(", ")}`);
check(brokenOverHttp.length === 0, "all of them are served by the app with HTTP 200");
if (brokenOverHttp.length) fail(`not served: ${brokenOverHttp.join(", ")}`);

/* ------------------------- 2. shot types match their images ------------------------- */

section("2. Shot types carry the reference image that matches the name");
const shotsSource = source.find(entry => entry.file.endsWith("lib/shots.ts"))?.text || "";
const shotEntries = [...shotsSource.matchAll(/"([^"]+)": \{ image: "([^"]+)"(.*?)\},/g)].map(m => ({ type: m[1], image: m[2], rest: m[3] }));
check(shotEntries.length === 14, `the shot library still lists ${shotEntries.length} of 14 shot types`);

const slugOf = type => type.toLowerCase().replace(/[^a-z0-9]+/g, "-");
const wrongImage = shotEntries.filter(entry => !entry.image.includes(slugOf(entry.type))).map(entry => `${entry.type} → ${entry.image}`);
check(wrongImage.length === 0, "each shot type names its own reference file");
if (wrongImage.length) fail(`mismatched files: ${wrongImage.join(", ")}`);

const photographic = shotEntries.filter(entry => !entry.image.endsWith(".svg"));
const diagramOnly = shotEntries.filter(entry => entry.image.endsWith(".svg"));
check(photographic.length >= 12, `${photographic.length} shot types use a photographic reference`);
check(diagramOnly.every(entry => entry.rest.includes('diagram: true')), `diagram fallbacks are labelled as diagrams (${diagramOnly.map(e => e.type).join(", ") || "none"})`);
const cameraPosition = shotEntries.filter(entry => ["Over the shoulder", "Two-shot", "POV", "Aerial"].includes(entry.type));
check(cameraPosition.every(entry => entry.image.endsWith(".jpg") || entry.rest.includes("framing:") || entry.rest.includes("diagram: true")), "camera-position shots show a photo and/or a framing diagram");

const uniqueImages = new Set(shotEntries.map(entry => entry.image));
check(uniqueImages.size === shotEntries.length, `all ${shotEntries.length} references are distinct images`);
const shotStatuses = await Promise.all([...uniqueImages].map(async image => `${image} → ${await head(base + image)}`));
const shotBroken = shotStatuses.filter(line => !line.endsWith("→ 200"));
check(shotBroken.length === 0, "every shot reference is on disk and served");
if (shotBroken.length) fail(shotBroken.join(", "));

/* ------------------------------ 2b. lighting library ------------------------------ */

section("2b. The lighting library is complete and each look has its own picture");
const lightingSource = source.find(entry => entry.file.endsWith("lib/lighting.ts"))?.text || "";
const lightingEntries = [...lightingSource.matchAll(/"([^"]+)": \{\s*image: "([^"]+)"([\s\S]*?)prompt: "([^"]+)"/g)]
  .map(m => ({ name: m[1], image: m[2], prompt: m[4] }));
check(lightingEntries.length === 8, `all eight lighting looks are described (${lightingEntries.length})`);
const lightingSlugMismatch = lightingEntries.filter(entry => !entry.image.includes(slugOf(entry.name)));
check(lightingSlugMismatch.length === 0, "each look points at a picture named after it");
if (lightingSlugMismatch.length) fail(lightingSlugMismatch.map(entry => `${entry.name} → ${entry.image}`).join(", "));
check(new Set(lightingEntries.map(entry => entry.image)).size === lightingEntries.length, "no two looks share a picture");
check(lightingEntries.every(entry => entry.prompt.length > 30), "every look describes itself for the AI prompts");
const lightingStatuses = await Promise.all(lightingEntries.map(async entry => `${entry.name} → ${await head(base + entry.image)}`));
check(lightingStatuses.every(line => line.endsWith("→ 200")), "every lighting photograph is on disk and served");
check(lightingEntries.every(entry => (lightingSource.match(new RegExp(`swatch:`, "g")) || []).length >= 8), "each look keeps a colour swatch as a fallback");

/* ---------------- 2c. frames use the shot reference that matches their type ---------------- */

section("2c. Frames show the reference that matches their shot type");
{
  const library = /\/images\/shots\//;
  const projectList = await (await fetch(`${base}/api/projects`)).json();
  const mismatched = [];
  let libraryFrames = 0;
  for (const project of projectList) {
    for (const frame of project.frames || []) {
      if (!library.test(frame.image || "")) continue;
      libraryFrames += 1;
      const file = (frame.image || "").split("/").pop() || "";
      if (!file.includes(slugOf(frame.shotType))) mismatched.push(`${project.title} "${frame.title}" ${frame.shotType} → ${file}`);
    }
  }
  check(mismatched.length === 0, `${libraryFrames} storyboard frames use the reference for their own shot type`);
  if (mismatched.length) fail(mismatched.join(" | "));
}

/* ------------------------ 3. relationships render correctly ------------------------ */

section("3. Relationships render as sentences, on every surface");
const charactersSource = source.find(entry => entry.file.endsWith("components/character-views.tsx"))?.text || "";
const relationsSource = source.find(entry => entry.file.endsWith("components/relations.tsx"))?.text || "";
check(/relatedCast/.test(charactersSource), "cast cards read relationships from either card, so nothing goes uncounted");
check(/relatedCast/.test(relationsSource) && /castRelations/.test(relationsSource), "the relationship page uses the same shared helpers");

const tabs = ["relationships", "characters", "storyboard", "notes", "shot-list", "overview", "screenplay", "brainstorm", "mood-boards"];
const pages = {};
for (const tab of tabs) {
  const response = await fetch(`${base}/?tab=${tab}`);
  pages[tab] = await response.text();
  check(response.status === 200, `/?tab=${tab} renders (${response.status})`);
}

const projects = await (await fetch(`${base}/api/projects`)).json();
const project = projects.find(entry => entry.characters?.length > 1);
const relationships = pages.relationships;
check(Boolean(project), "a seeded project with a cast is available");

const people = project.characters.length;
const nodeCount = (relationships.match(/data-cast-node="/g) || []).length;
check(nodeCount === people, `the map draws one node per character (${nodeCount}/${people})`);

const pairIds = new Set();
for (const character of project.characters) {
  for (const relation of character.relations || []) {
    if (character.id === relation.targetId) continue;
    pairIds.add([character.id, relation.targetId].sort().join("|"));
  }
}
const linkCount = (relationships.match(/data-relation-pair="/g) || []).length;
check(linkCount === pairIds.size, `the map draws one link per pair of people (${linkCount}/${pairIds.size})`);
const cardCount = (relationships.match(/data-relation-card="/g) || []).length;
check(cardCount === pairIds.size, `each pair also gets a readable card (${cardCount}/${pairIds.size})`);

const gists = [...relationships.matchAll(/data-relation-gist="([^"]*)"/g)].map(m => m[1].replace(/&#x27;/g, "'").replace(/&amp;/g, "&"));
check(gists.length === pairIds.size, "every pair card states the relationship in words");
const weakGist = gists.filter(gist => gist.length < 12 || /^(undefined|NaN|and )/.test(gist) || !/( is | are )/.test(gist));
check(weakGist.length === 0, `no placeholder or malformed sentences (${gists.slice(0, 2).join(" | ")})`);
if (weakGist.length) fail(`weak sentences: ${weakGist.join(" | ")}`);

const storylines = (relationships.match(/class="storyline-card/g) || []).length;
check(storylines === people, `every character gets a storyline card (${storylines}/${people})`);
const emptyStorylines = (relationships.match(/storyline-empty/g) || []).length;
const linkedPeople = new Set(pairIds.size ? project.characters.filter(c => (c.relations || []).some(r => r.targetId !== c.id)).map(c => c.id) : []);
check(emptyStorylines <= people - linkedPeople.size, `storylines are filled in, not placeholders (${emptyStorylines} empty of ${people})`);

const chipsInCast = ((pages.characters.match(/class="relation-chip/g) || []).length);
check(chipsInCast >= pairIds.size, `the cast cards show their links too (${chipsInCast} chips for ${pairIds.size} pairs)`);
check(!/No links yet<\/span><\/div><\/div><\/button><\/div>/.test(pages.characters), "no cast card is silently blank about relationships");

const castPeopleCount = (pages.characters.match(/class="note-card cast-card"/g) || []).length;
check(castPeopleCount === people, `the cast tab lists all ${people} characters`);

/* ------------------------- 3b. the map is legible, not overlapping ------------------------- */

section("3b. Map geometry: nodes and labels stay clear of each other");
const nodes = [...relationships.matchAll(/data-cast-node="([^"]+)"[^>]*style="left:([\d.]+)%;top:([\d.]+)%"/g)]
  .map(m => ({ id: m[1], x: Number(m[2]), y: Number(m[3]) }));
check(nodes.length === people, `every character has a position on the map (${nodes.length}/${people})`);

// Two layouts that the page has to work in: a wide desktop card and a narrow one.
const layouts = [{ name: "desktop 980×380", w: 980, h: 380, nodeW: 134, nodeH: 76 }, { name: "narrow 560×380", w: 560, h: 380, nodeW: 96, nodeH: 62 }];
for (const layout of layouts) {
  const clashes = [];
  for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
    const dx = Math.abs(nodes[i].x - nodes[j].x) / 100 * layout.w;
    const dy = Math.abs(nodes[i].y - nodes[j].y) / 100 * layout.h;
    if (dx < layout.nodeW && dy < layout.nodeH) clashes.push(`${nodes[i].id} / ${nodes[j].id}`);
  }
  check(clashes.length === 0, `no two character nodes overlap on ${layout.name}`);
  if (clashes.length) fail(`overlapping: ${clashes.join(", ")}`);
}
const offMap = nodes.filter(node => node.x < 6 || node.x > 94 || node.y < 8 || node.y > 92).map(node => `${node.id} (${node.x}%, ${node.y}%)`);
check(offMap.length === 0, "no node is pushed off the edge of the map");
if (offMap.length) fail(offMap.join(", "));

const labels = [...relationships.matchAll(/class="cast-link-label tone-[a-z]+" style="left:([\d.]+)%;top:([\d.]+)%"/g)]
  .map(m => ({ x: Number(m[1]), y: Number(m[2]) }));
check(labels.length === linkCount, `one relationship label per link (${labels.length}/${linkCount})`);
const labelClashes = [];
for (const node of nodes) for (const label of labels) {
  const dx = Math.abs(node.x - label.x) / 100 * 980;
  const dy = Math.abs(node.y - label.y) / 100 * 380;
  if (dx < 70 && dy < 52) labelClashes.push(`${node.id} label`);
}
check(labelClashes.length === 0, "no relationship label sits on top of a name");

/* --------------- 3c. the map holds together at every cast size --------------- */

section("3c. The map stays legible from two people to sixteen");
const KIND_CYCLE = ["Parent", "Child", "Sibling", "Friend", "Rival", "Mentor", "Student", "Colleague", "Ally", "Neighbour"];
const CONVERSE = { Parent: "Child", Child: "Parent", Sibling: "Sibling", Friend: "Friend", Rival: "Rival", Mentor: "Student", Student: "Mentor", Colleague: "Colleague", Ally: "Ally", Neighbour: "Neighbour" };
const NAMES = ["Ada", "Bram", "Cleo", "Dmitri", "Esme", "Farid", "Greta", "Hugo", "Iris", "Jonas", "Kira", "Lars", "Mira", "Nils", "Oona", "Piet"];

/** A chain of `size` people, written on both cards exactly the way the app writes it. */
function probeCast(size) {
  const cast = NAMES.slice(0, size).map((name, index) => ({ id: `probe-${index}`, name, role: "Supporting", age: "30", description: "Layout probe.", traits: ["Quiet"], color: "sage", createdAt: "2026-01-01T00:00:00.000Z", relations: [] }));
  cast.forEach((character, index) => { character.relations = [{ id: `probe-out-${index}`, targetId: cast[(index + 1) % size].id, kind: KIND_CYCLE[index % KIND_CYCLE.length] }]; });
  cast.forEach((character, index) => {
    const previous = (index - 1 + size) % size;
    character.relations.push({ id: `probe-in-${index}`, targetId: cast[previous].id, kind: CONVERSE[KIND_CYCLE[previous % KIND_CYCLE.length]] });
  });
  return cast;
}

async function probeLayout(size) {
  const created = await (await fetch(`${base}/api/projects`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: `Layout probe ${size}`, description: "Temporary project used by scripts/verify7.mjs.", genre: "Drama", format: "Short film" }) })).json();
  try {
    await fetch(`${base}/api/projects/${created.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ characters: probeCast(size) }) });
    const html = await (await fetch(`${base}/?project=${created.id}&tab=relationships`)).text();
    const nodes = [...html.matchAll(/data-cast-node="probe-(\d+)"[^>]*style="left:([\d.]+)%;top:([\d.]+)%"/g)].map(m => ({ id: Number(m[1]), x: Number(m[2]), y: Number(m[3]) }));
    const links = (html.match(/data-relation-pair="probe-/g) || []).length;
    const warnings = (html.match(/one card carries this link/g) || []).length;
    const gists = [...html.matchAll(/data-relation-gist="([^"]*)"/g)].map(m => m[1]).filter(gist => !/ is | are /.test(gist));
    return { nodes, links, warnings, badGists: gists.length };
  } finally {
    await fetch(`${base}/api/projects/${created.id}`, { method: "DELETE" });
  }
}

/** Map dimensions the page uses: 380px up to six people, then taller for bigger casts. */
const mapHeight = size => (size > 10 ? 520 : size > 6 ? 460 : 380);

for (const size of [2, 4, 6, 7, 10, 12, 16]) {
  const { nodes, links, warnings, badGists } = await probeLayout(size);
  if (nodes.length !== size) { fail(`${size} people: only ${nodes.length} placed on the map`); continue; }
  const expectedPairs = size <= 2 ? 1 : size; // two people make one pair, however you write it
  if (links !== expectedPairs) fail(`${size} people: ${links} links drawn, expected ${expectedPairs}`);
  if (warnings) fail(`${size} people: ${warnings} links read as one-sided even though both cards hold them`);
  if (badGists) fail(`${size} people: ${badGists} relationship sentences are not worded`);
  const H = mapHeight(size);
  let worst = Infinity; let worstPair = "";
  for (const [name, W, nodeW, nodeH] of [["desktop", 980, 134, 76], ["narrow", 560, 96, 62]]) {
    for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
      const dx = Math.abs(nodes[i].x - nodes[j].x) / 100 * W;
      const dy = Math.abs(nodes[i].y - nodes[j].y) / 100 * H;
      const clearance = Math.max(dx / nodeW, dy / nodeH);
      if (clearance < worst) { worst = clearance; worstPair = `${name} #${nodes[i].id}/#${nodes[j].id}`; }
    }
  }
  const onEdge = nodes.filter(node => node.x < 6 || node.x > 94 || node.y < 8 || node.y > 92).length;
  check(worst >= 1 && onEdge === 0, `${size} people: nothing overlaps and nothing leaves the map (worst clearance ×${worst.toFixed(2)}${onEdge ? `, ${onEdge} off-map` : ""})`);
}

/* --------------------------- undefined values and misc --------------------------- */

section("4. Nothing half-rendered leaked into the HTML");
for (const [tab, html] of Object.entries(pages)) {
  // The Next.js flight payload legitimately contains "$undefined"; only the visible markup matters.
  const markup = html.replace(/<script[\s\S]*?<\/script>/g, "");
  const bad = /(^|[>"\s])(undefined|NaN|\[object Object\])([<"\s]|$)/.test(markup);
  check(!bad, `/?tab=${tab} has no undefined/NaN in its markup`);
}
check(!/data-relation-gist=""/.test(pages.relationships), "no relationship renders without a sentence");

section(failures ? `${failures} check(s) failed` : "All checks passed");
process.exit(failures ? 1 : 0);
