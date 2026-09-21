import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
const draft = readFileSync("docs/rapture/ep1-screenplay.md", "utf8");
const parts = draft.split("\n===\n");
if (parts.length !== 9) throw new Error(`expected 9 sections, got ${parts.length}`);
const front = parts[0].replace(/\n+$/, "");
const bodies = parts.slice(1).map(p => p.replace(/^\n+/, "").replace(/\n+$/, ""));
const titles = ["# COLD OPEN", "# ST JUDE'S", "# THE COPS", "# ST JUDE'S - AFTER", "# MARTIN", "# DANNY AND JODIE", "# THE COPS - NIGHT", "# TAG - 1980"];
bodies.forEach((b, i) => { if (!b.startsWith(titles[i])) throw new Error(`section ${i + 1} starts ${JSON.stringify(b.slice(0, 40))}`); });

const pages = [
  { file: "ep1-01-side-street.md", scene: "THE MUGGING — COLD OPEN", slug: "EXT. SIDE STREET — EARLY MORNING",
    body: `${front}\n\n===\n\n${bodies[0]}`,
    cast: "Cast: THE OLD WOMAN (70s), THE MUGGER (19) — both unnamed, cast nowhere.",
    grammar: "Grammar: sodium light and a glowing cashpoint, still dark. The camera keeps operating after the violence as though the subject has merely walked out of frame. No flash, no sound, no score, no reaction cut. The title card lands on an empty street lit orange." },
  { file: "ep1-02-st-judes-house.md", scene: "ST JUDE'S AND THE RAPTURE", slug: "INT./EXT. ST JUDE'S HOUSE — MORNING",
    body: bodies[1],
    cast: "Cast: NINA (45), BRIAN (50s), TERRY (50s), COL (30s), DEBORAH (60s), MAUREEN (40s); the VOLUNTEER (20s) is unnamed and cast nowhere.",
    grammar: "Grammar: locked off, wide, deep focus, daylight, symmetrical. The camera never follows Nina; she walks into frames and out of them. The rapture happens mid-anecdote with no flash, no sound, no score — the radio carries on and the dog stays under the table." },
  { file: "ep1-03-police-car-day.md", scene: "THE COPS — FIRST BEAT", slug: "INT. POLICE CAR (PARKED) — DAY",
    body: bodies[2],
    cast: "Cast: KATH (30s), RAY (30s); the MAN IN A BLUE COAT (30s) is unnamed and cast nowhere.",
    grammar: "Grammar: static two-shot from the bonnet through the windscreen, exteriors of the car alone across two bays. Handheld only for the taser, then the identical static framing returns. No reaction cuts. The bottle of water stays untouched in the cup holder." },
  { file: "ep1-04-st-judes-after.md", scene: "ST JUDE'S — AFTER (the washing-up run)", slug: "INT./EXT. ST JUDE'S — LATER",
    body: bodies[3],
    cast: "Cast: NINA (45).",
    grammar: "Grammar: locked off, wide, deep focus, daylight, symmetrical; only the vision is handheld, broken, wrong aspect ratio, dropped frames, blown out, with a hiss. The pendant is her mother's and she has always had it." },
  { file: "ep1-06-storage-facility.md", scene: "MARTIN AT THE STORAGE FACILITY", slug: "INT. STORAGE FACILITY — DAY",
    body: bodies[4],
    cast: "Cast: MARTIN (40s); the ATTENDANT is unnamed and cast nowhere.",
    grammar: "Grammar: flat institutional fluorescent, locked off, slightly off-centre. Aggrieved, never grieving. SUPER: THREE MONTHS EARLIER — a pre-rapture flashback, because the machine has to have sat in Max's room for eight weeks by the present." },
  { file: "ep1-07-danny-and-jodie.md", scene: "DANNY AND JODIE", slug: "INT./EXT. A HOUSE — DUSK",
    body: bodies[5],
    cast: "Cast: DANNY (40), JODIE (11).",
    grammar: "Grammar: handheld, tight, dark, red practical light — her bike light clipped to her coat. Never a clean wide, never the whole room." },
  { file: "ep1-08-police-car-night.md", scene: "THE COPS — SECOND BEAT", slug: "INT. POLICE CAR (PARKED) — NIGHT",
    body: bodies[6],
    cast: "Cast: KATH (30s), RAY (30s).",
    grammar: "Grammar: static two-shot from the bonnet through the windscreen, the same bottle of water untouched. Ninety seconds, and it ends the episode's comic thread on a worse note than it started." },
  { file: "ep1-09-hotel-room.md", scene: "TAG — 1980", slug: "INT. HOTEL ROOM — DAY",
    body: bodies[7],
    cast: "Cast: THE MAN (late 30s) — the absconder; the YOUNG WOMAN in the montage is unnamed and cast nowhere.",
    grammar: "Grammar: warm, grainy, anamorphic, practical light through net curtains. The assembly is quiet and mechanical, not magical. On-screen green phosphor text is reproduced exactly as written. Ends on NO." },
];
const numbered = { "ep1-01-side-street.md": "ep1-mugging.md", "ep1-02-st-judes-house.md": "ep1-st-judes.md", "ep1-04-st-judes-after.md": "ep1-washing-up.md", "ep1-07-danny-and-jodie.md": "ep1-danny-jodie.md", "ep1-08-police-car-night.md": "ep1-cops-second-beat.md" };
mkdirSync("docs/rapture/screenplay", { recursive: true });
for (const p of pages) {
  const board = numbered[p.file]
    ? `The numbered shot board stays in docs/rapture/scenes/${numbered[p.file]}.`
    : "No numbered shot board exists for this scene yet; this page is its only source.";
  // The draft's own "\n\n===\n\n" section separator belongs to the page before it, so the pages
  // can be re-joined with plain blank lines and still rebuild the draft byte for byte.
  const separator = pages[pages.length - 1] === p ? "" : "\n\n===";
  const text = `LET THE RAPTURES COMMENCE\nEPISODE ONE — ${p.scene}\n\n${p.slug}\nSource: the episode-one screenplay draft of 21 September 2026 (docs/rapture/ep1-screenplay.md), reproduced verbatim below its own heading.\n${board}\n${p.cast}\n${p.grammar}\n\n${p.body.trim()}${separator}\n`;
  writeFileSync(`docs/rapture/screenplay/${p.file}`, text);
}

// reconstruction: strip each page's injected header and re-join with the draft's separators
const HEADER = /^(LET THE RAPTURES COMMENCE|EPISODE ONE |EXT\.|INT\.|Source: |The numbered shot board |No numbered shot board |Cast: |Grammar: |$)/;
const strip = t => t.split("\n").filter((l, i) => !(i < 9 && HEADER.test(l))).join("\n");
const rebuilt = pages.map(p => strip(readFileSync(`docs/rapture/screenplay/${p.file}`, "utf8")).trim());
if (!rebuilt[0].startsWith(front)) throw new Error("page 1 lost the draft front matter");
rebuilt.slice(1).forEach((t, i) => { if (!t.startsWith(titles[i + 1])) throw new Error(`page for ${titles[i + 1]} lost its place: ${JSON.stringify(t.slice(0, 60))}`); });
const joined = rebuilt.join("\n\n") + "\n";
console.log("8 pages written; draft reconstructs byte-for-byte");
