// Jack's office is boarded in five scenes and was generated as a *chain*: n10 followed s77/85, n11's
// wide followed s10/164, n11's call followed s11/243, and n21's coverage followed s21/194. Every link
// re-drew the room from the picture before it, so the desk shrank a little at each step (1.6 m → 1.2 m
// → 0.9 m), the wood went walnut → honey → reddish, and s77/85 came out mirrored with the sofa on the
// wrong wall. From 1 October 2026 the room is locked once, as prose any generator can be handed, and
// every Jack's office frame carries it in its notes and its prompt. s10/164-depends-whos-calling.jpg is
// the single room master; s77/85 was retaken to agree with it and no longer leads.
// Two clauses were corrected against that master on 1 October 2026, because the prose had over-specified the
// picture it claims to describe: the phone sits on the back edge right of the lamp in s10/164 (not pinned to the
// corner), and the cupboard's top does carry its binders and folder stack (the rule was always about the BOX).
// Wording moved to match the master rather than the master being retaken to match the wording — one picture
// twelve frames already agree with beats retaking twelve frames.
// See docs/neonoire/passes/office-desk-lock-2026-10-01.md
export const officeLayoutScenes = new Set(["s10", "s11", "s18", "s21", "s77"]);
export const officeLayoutLock = "DESK — LOCKED";
export const officeRoomMaster = "s10/164-depends-whos-calling.jpg";

export const officeLayoutLook =
  `${officeLayoutLock} (1 October 2026). One room, shot from any side but NEVER mirrored, and ONE table only. ` +
  "THE DESK: free-standing in the middle of the room, its long side parallel to the window wall, 1.60 m wide x 0.75 m deep x 0.73 m high; " +
  "worn dark walnut with a satin lacquer top scarred by cup rings and a pale scuff field at the left end; square-section legs, a modesty panel, " +
  "two shallow drawers at the right end of the riding rail. Never honey-blond, never a narrow table, never pushed against a wall, never a second " +
  "table or side table in the room. ON IT: the green-shaded brass banker's lamp permanently at the LEFT end, exactly ONE black rotary telephone " +
  "permanent on the BACK edge of the top, right of the lamp and at or toward the right back corner — never a second one, never on the near edge — " +
  "and nothing else the scene has not put there; the lamp is off unless the scene turns it on. " +
  `BEHIND IT: a wide aluminium-framed window with venetian blinds on rain and the elevated railway, centred on the back wall, and under it a low grey ` +
  "two-door steel cupboard whose top carries ONLY a row of ring binders and a flat folder stack at its right end — never a box, never a lamp, never "
  +"anything a scene has to reach up for (that is the whole point of the scene 11 cupboard: the box comes out of INSIDE it). RIGHT WALL: a grey four-drawer filing " +
  "cabinet with a small CRT television on top — muted black-and-white samurai film, on and never static — and the brown sofa with a rumpled grey " +
  "blanket beyond it. LEFT OF THE WINDOW: the grey door hand-lettered with the whole word JACK, frosted-glass corridor panel beside it. Grey " +
  "commercial carpet, tired pale grey-green paint. Jack sits behind the long side; a visitor stands or sits at the left end. The room master is " +
  `${officeRoomMaster}. AI-generated draft studies, not approved coverage.`;

// The 1 October queue is closed: 11/252, 77/88, 77/89, 18/283 and scene 21's 196 and 271 were retaken onto this
// lock in the follow-up session the same day (ten calls again, two of them corrective — a second pair of hands
// inside a "man alone" frame, and a third coffee cup in a two-cup scene). This list is how a future pass
// declares a frame knowingly unfinished: name it here, say QUEUED in its board note, and the verifier holds
// both honest. Correction to the first ledger draft, recorded here so it cannot be re-invented: shots 196 and
// 271 were never RETAKE PENDING — the 30 September pin list holds scene 20's 193 and 194, not scene 21's.
// A third pass added the two scene-11 desk inserts (246, 169): an audit of the five office frames this lock
// never retouched found them showing the pre-lock wood, which no check could see — the guard reads NOTES, and
// their notes had carried the lock correctly since 1 October. Frames lie; notes lie; only looking lies less.
// One caveat survives into production rather than into another image: Jack's hands still read older than 48 in
// 196. The coat, which an earlier draft of this comment said 196 had "dropped from the chair back", was not
// dropped — both scene-21 frames wear it, checked at full size, and the script never says where it hangs.
export const officeLayoutQueued = [];
// Every frame this lock has rebuilt, in the order the two passes ran them. Stable paths throughout: nothing was
// renamed, renumbered, or replaced by a scene master.
export const officeLayoutRetakes = ["neonoire-shot-62", "neonoire-shot-245", "neonoire-shot-251", "neonoire-shot-246", "neonoire-shot-169",
  "neonoire-shot-166", "neonoire-shot-167", "neonoire-shot-191", "neonoire-shot-87",
  "neonoire-shot-252", "neonoire-shot-88", "neonoire-shot-89", "neonoire-shot-283",
  "neonoire-shot-196", "neonoire-shot-271"];
