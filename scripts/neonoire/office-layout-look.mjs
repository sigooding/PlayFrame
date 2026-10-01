// Jack's office is boarded in five scenes and was generated as a *chain*: n10 followed s77/85, n11's
// wide followed s10/164, n11's call followed s11/243, and n21's coverage followed s21/194. Every link
// re-drew the room from the picture before it, so the desk shrank a little at each step (1.6 m → 1.2 m
// → 0.9 m), the wood went walnut → honey → reddish, and s77/85 came out mirrored with the sofa on the
// wrong wall. From 1 October 2026 the room is locked once, as prose any generator can be handed, and
// every Jack's office frame carries it in its notes and its prompt. s10/164-depends-whos-calling.jpg is
// the single room master; s77/85 was retaken to agree with it and no longer leads.
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
  "permanently at the RIGHT back corner, and nothing else the scene has not put there; the lamp is off unless the scene turns it on. " +
  `BEHIND IT: a wide aluminium-framed window with venetian blinds on rain and the elevated railway, centred on the back wall, and under it a low grey ` +
  "two-door steel cupboard with ring binders and a folder stack at its right end and NOTHING on top of it. RIGHT WALL: a grey four-drawer filing " +
  "cabinet with a small CRT television on top — muted black-and-white samurai film, on and never static — and the brown sofa with a rumpled grey " +
  "blanket beyond it. LEFT OF THE WINDOW: the grey door hand-lettered with the whole word JACK, frosted-glass corridor panel beside it. Grey " +
  "commercial carpet, tired pale grey-green paint. Jack sits behind the long side; a visitor stands or sits at the left end. The room master is " +
  `${officeRoomMaster}. AI-generated draft studies, not approved coverage.`;

// The queue this pass leaves open, so a later session inherits the list and not the archaeology:
// s21/194 and s21/271 (already pinned RETAKE PENDING for the 30 September rewrite), s77/87 and s77/86,
// s11/250 (a tight insert: the desktop's warm tone is the lamp pool, its edge is out of frame), and
// s18/283 — each must be drawn against this lock, never against the frame next to it in the file list.
export const officeLayoutQueued = ["neonoire-shot-196", "neonoire-shot-271", "neonoire-shot-88", "neonoire-shot-89", "neonoire-shot-252", "neonoire-shot-283"];
