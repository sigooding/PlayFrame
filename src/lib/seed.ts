import type { Act, BrainstormNode, Character, MoodBoard, ProjectNote, Scene, StoryFrame } from "./types";

export const sampleCharacters: Character[] = [
  { id: "char-1", name: "Ella Voss", role: "Protagonist", age: "29", description: "A documentary photographer returning to the coast after a decade away. She carries her father's old brass key and his final letter.", traits: ["Quiet", "Resilient", "Observant"], color: "sage", image: "/images/woman-car.jpg", createdAt: "2026-06-10T09:00:00.000Z" },
  { id: "char-2", name: "Thomas Voss", role: "Mentor / Father", age: "58 (deceased)", description: "A lighthouse keeper who raised Ella on the edge of the ocean. His presence lives on through objects and the memories tied to the lighthouse.", traits: ["Steady", "Quiet", "Devoted"], color: "clay", image: "/images/lighthouse.jpg", createdAt: "2026-06-10T09:15:00.000Z" },
];

export const sampleActs: Act[] = [
  { id: "act-1", title: "Act I — The Road", description: "Ella returns to the coast she left behind. The letter sets everything in motion.", parts: [{ id: "part-1", title: "The arrival", description: "The drive in. The town unchanged, she is not." }, { id: "part-2", title: "What she brought", description: "The letter, the key, and the reason she came back." }] },
  { id: "act-2", title: "Act II — The Edge", description: "Between the cliffs and the lighthouse path, Ella stops running from the past.", parts: [{ id: "part-3", title: "The cliff", description: "The moment she lets herself stop." }, { id: "part-4", title: "The walk", description: "Every step remembers her." }] },
  { id: "act-3", title: "Act III — The Light", description: "The lighthouse, the key, the door. She chooses to stay." },
];

export const sampleMoodboards: MoodBoard[] = [
  {
    id: "board-1",
    title: "The look of the film",
    description: "Pale gold, sea mist, olive grass. Natural light only. Nothing performed — we observe.",
    items: [
      { id: "mi-1", image: "/images/woman-car.jpg", caption: "Window light on a face — no fill, no score yet" },
      { id: "mi-2", image: "/images/coastal-road.jpg", caption: "The road as a leading line" },
      { id: "mi-3", image: "/images/shots/insert.jpg", caption: "Prop texture: aged paper, soft edges" },
      { id: "mi-4", image: "/images/lighthouse.jpg", caption: "The reveal — hold it longer than feels right" },
    ],
    createdAt: "2026-06-14T09:00:00.000Z",
  },
  {
    id: "board-2",
    title: "Act II — weather and scale",
    description: "Small figures, big landscape. Wind in the frame, sound in the mix.",
    actId: "act-2",
    items: [
      { id: "mi-5", image: "/images/cliffside.jpg", caption: "Keep her tiny in the frame" },
      { id: "mi-6", image: "/images/lighthouse-path.jpg", caption: "Handheld, at walking pace" },
      { id: "mi-7", image: "/images/shots/extreme-wide.jpg", caption: "Reference for the wide on the cliff" },
    ],
    createdAt: "2026-06-14T09:30:00.000Z",
  },
];

export const sampleBrainstorm: BrainstormNode[] = [
  { id: "brain-1", x: 90, y: 70, title: "The Lighthouse", content: "White walls. Red door. A loose step that has been there since Ella's childhood. The lighthouse as a memory, not just a structure.", color: "sage", tags: ["Setting", "Symbol"], connections: ["brain-2", "brain-3"], createdAt: "2026-06-12T09:00:00.000Z" },
  { id: "brain-2", x: 460, y: 40, title: "The Letter", content: "A folded cream envelope with edges softened by time. The handwritten letter inside holds words that are both gentle and incomplete.", color: "rose", tags: ["Prop", "Emotion"], connections: ["brain-1", "brain-3"], createdAt: "2026-06-12T09:05:00.000Z" },
  { id: "brain-3", x: 270, y: 330, title: "The Road Back", content: "The coastal road is both a physical path and a journey through memory. A vintage station wagon carries Ella toward something she hasn't finished yet.", color: "clay", tags: ["Visual", "Theme"], connections: ["brain-1", "brain-2"], createdAt: "2026-06-12T09:10:00.000Z" },
];

export const sampleScenes: Scene[] = [
  { id: "scene-0", title: "The last transmission", location: "INT. LIGHTHOUSE CONTROL ROOM", time: "NIGHT", description: "Cold open. A radio crackles in a dark room. A man's hand switches it off, then back on. He listens for a voice that does not come.", characters: ["char-2"], kind: "Cold open" },
  { id: "scene-1", title: "The road back", location: "EXT. COASTAL ROAD", time: "DAWN", description: "An empty road follows the edge of the Pacific. After ten years, a familiar car is coming home.", characters: ["char-1"], actId: "act-1", partId: "part-1" },
  { id: "scene-2", title: "Things we carry", location: "INT. ELLA'S CAR", time: "DAWN", description: "Ella drives in silence. A letter on the passenger seat holds the words she never got to hear.", characters: ["char-1"], actId: "act-1", partId: "part-2" },
  { id: "scene-3", title: "The edge of everything", location: "EXT. CLIFFSIDE", time: "MORNING", description: "At the edge of the ocean, Ella lets herself stop running.", characters: ["char-1", "char-2"], actId: "act-2", partId: "part-3" },
  { id: "scene-4", title: "One step closer", location: "EXT. LIGHTHOUSE PATH", time: "MORNING", description: "She follows the old path. Every step feels like a memory.", characters: ["char-1"], actId: "act-2", partId: "part-4" },
  { id: "scene-5", title: "Where the light lives", location: "EXT. LIGHTHOUSE", time: "MORNING", description: "The lighthouse emerges from the mist, unchanged by the years.", characters: ["char-1", "char-2"], actId: "act-3" },
  { id: "scene-6", title: "A new beginning", location: "INT. LIGHTHOUSE", time: "MORNING", description: "Ella opens the door. This time, she is ready to stay.", characters: ["char-1", "char-2"], actId: "act-3" },
];

export const sampleFrames: StoryFrame[] = [
  { id: "frame-0", sceneId: "scene-0", title: "The last transmission", description: "The lamp turns over black water. A keeper listens to static.", image: "/images/shots/low-key.jpg", shotType: "Medium close-up", movement: "Dolly in", duration: 5, status: "Ready", notes: "Cold open. Practical lamp only. Let the radio run under the titles.", characters: ["char-2"], angle: "Eye level", lens: "50mm", lighting: "Practical night", transition: "Fade in", mood: "Patient, waiting." },
  { id: "frame-1", sceneId: "scene-1", title: "The road back", description: "A quiet coastal road. One car, heading home.", image: "/images/coastal-road.jpg", shotType: "Establishing", movement: "Tracking", duration: 6, status: "Ready", notes: "Open with ocean ambience. No score until we see the car. Shoot just before sunrise.", characters: ["char-1"], angle: "High angle", lens: "24mm", lighting: "Golden hour", transition: "Cut", mood: "Quiet anticipation. The world is waking up." },
  { id: "frame-2", sceneId: "scene-2", title: "A familiar stranger", description: "Ella watches the coastline slip past her window.", image: "/images/woman-car.jpg", shotType: "Medium close-up", movement: "Static", duration: 4, status: "Ready", notes: "Passenger-side profile. Let the changing light carry the emotion.", characters: ["char-1"], angle: "Eye level", lens: "50mm", lighting: "Golden hour", transition: "Cut", mood: "Held breath. Something unresolved." },
  { id: "frame-3", sceneId: "scene-2", title: "Words left unsaid", description: "An old letter. A lifetime between the lines.", image: "/images/shots/insert.jpg", shotType: "Insert", movement: "Static", duration: 3, status: "Needs review", notes: "Use the handwritten prop letter, with the photo barely visible. Check continuity.", characters: ["char-1"], angle: "High angle", lens: "85mm", lighting: "Natural daylight", transition: "Match cut", mood: "Tender, fragile, intimate." },
  { id: "frame-4", sceneId: "scene-3", title: "The edge of everything", description: "For a moment, the whole world stands still.", image: "/images/cliffside.jpg", shotType: "Extreme wide", movement: "Dolly in", duration: 8, status: "Ready", notes: "Keep Ella small in the frame. Slow, almost imperceptible push. Wind in the sound design.", characters: ["char-1", "char-2"], angle: "Eye level", lens: "35mm", lighting: "Golden hour", transition: "Dissolve", mood: "Release. Vast and still." },
  { id: "frame-5", sceneId: "scene-4", title: "One step closer", description: "She knows this path. It still remembers her.", image: "/images/lighthouse-path.jpg", shotType: "Medium wide", movement: "Tracking", duration: 5, status: "Draft", notes: "Follow at walking pace. A little handheld texture is welcome here.", characters: ["char-1"], angle: "Low angle", lens: "35mm", lighting: "Natural daylight", transition: "Cut", mood: "Memory rising with every step." },
  { id: "frame-6", sceneId: "scene-5", title: "Where the light lives", description: "Some things wait for you to find your way back.", image: "/images/lighthouse.jpg", shotType: "Establishing", movement: "Crane up", duration: 7, status: "Draft", notes: "The reveal. Hold on the lighthouse for a beat before cutting inside.", characters: ["char-1", "char-2"], angle: "Low angle", lens: "24mm", lighting: "Golden hour", transition: "Cut", mood: "Reverent. The reveal." },
];

export const sampleScript = `THE LAST LIGHT

Written by Jamie Parker


COLD OPEN:

1. INT. LIGHTHOUSE CONTROL ROOM - NIGHT

Darkness. A radio crackles with static and wind.

THOMAS (58), a keeper in a heavy wool sweater, switches the set off. Waits. Switches it back on.

                         THOMAS
                   (quietly)
             Still there, then.

He looks out at the black water. Holds.

                         TITLE: THE LAST LIGHT


2. EXT. COASTAL ROAD - DAWN

The Pacific is a sheet of hammered silver. A narrow road cuts through the cliffs, empty except for a sage-green station wagon.

Inside, someone is coming home.

3. INT. ELLA'S CAR - DAWN

ELLA (29) drives with the window cracked. Dark hair tangled by the sea air. Her hands hold the wheel a little too tightly.

On the passenger seat: an envelope, its edges softened by time.

She glances at it. Back to the road.

                         ELLA (V.O.)
             You said the light would always be on.

She pulls into a turnout and stops the engine. In the sudden quiet, she opens the letter.

                         THOMAS (V.O.)
             I wasn't very good at the important
             things. Saying them, I mean.

A faded photograph falls into her lap. A little girl on a man's shoulders. A white lighthouse behind them.

4. EXT. CLIFFSIDE - MORNING

Ella stands at the edge. The ocean moves below her, patient and endless.

                         THOMAS (V.O.)
             But every morning, I looked down
             that road. Every single morning.

She closes her eyes. For the first time in a long time, she breathes.

5. EXT. LIGHTHOUSE PATH - MORNING

A narrow path through wild grass. Ella walks slowly, one hand brushing the tall stems.

The lighthouse appears between the dunes.

6. EXT. LIGHTHOUSE - MORNING

White walls. A red door. The same loose step.

Ella stops. Reaches into her pocket for an old brass key.

                         ELLA
                   (a whisper)
             I'm here, Dad.

7. INT. LIGHTHOUSE - MORNING

The door opens. Warm light falls across a small table. Two cups. One empty chair.

Ella sets the letter down. Opens the curtains.

The room fills with light.

FADE OUT.

                         THE END`;

export const sampleNotes: ProjectNote[] = [
  { id: "note-1", title: "The feeling we're chasing", content: "Quiet, not empty. Nostalgic, not sad. This is a film about the courage it takes to come home. Let the landscape do some of the talking.", color: "sage", createdAt: "2026-06-12T10:00:00.000Z", tags: ["Theme", "Mood"], connections: [{ targetId: "brain-1", label: "Lighthouse" }] },
  { id: "note-2", title: "Visual language", content: "Natural light. Muted greens, warm creams, ocean blues. Wider frames when Ella feels lost; move closer as she begins to reconnect. Reference: Past Lives, Nomadland.", color: "sand", createdAt: "2026-06-12T11:00:00.000Z", tags: ["Cinematography", "Reference"] },
  { id: "note-3", title: "Before the location scout", content: "Check sunrise direction at the lighthouse. Photograph the path at 6:30am. Ask about access to the interior. Record 2 minutes of clean ocean ambience.", color: "rose", createdAt: "2026-06-13T09:00:00.000Z", tags: ["Production", "Location"] },
];

export const starterProjects = [
  { id: "3c7bfa6f-0f9a-4dce-a861-51e58f9a5001", title: "The Last Light", description: "Some journeys lead you back to yourself.", genre: "Drama", format: "Short film", status: "In development", coverImage: "/images/coastal-road.jpg", acts: sampleActs, scenes: sampleScenes, frames: sampleFrames, script: sampleScript, notes: sampleNotes, characters: sampleCharacters, brainstorm: sampleBrainstorm, moodboards: sampleMoodboards },
  { id: "3c7bfa6f-0f9a-4dce-a861-51e58f9a5002", title: "Paper Planes", description: "A little imagination can take you a long way.", genre: "Coming of age", format: "Short film", status: "First draft", coverImage: "/images/cliffside.jpg", acts: [], scenes: [{ id: "paper-scene-1", title: "A small beginning", location: "INT. CLASSROOM", time: "DAY", description: "A paper plane lands on an empty desk." }], frames: [], script: "PAPER PLANES\n\nWritten by Jamie Parker\n\nFADE IN:\n\n1. INT. CLASSROOM - DAY\n\nSunlight falls across rows of empty desks. A paper plane glides into frame.\n", notes: [], characters: [], brainstorm: [], moodboards: [] },
  { id: "3c7bfa6f-0f9a-4dce-a861-51e58f9a5003", title: "A Place in Between", description: "A documentary about the places we call home.", genre: "Documentary", format: "Documentary", status: "Idea", coverImage: "/images/lighthouse.jpg", acts: [], scenes: [], frames: [], script: "A PLACE IN BETWEEN\n\nDocumentary outline\n\nWhat makes a place feel like home?\n", notes: [], characters: [], brainstorm: [], moodboards: [] },
];
