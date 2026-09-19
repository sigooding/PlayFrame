// Mounts the REAL <Screenplay> component from src/components/screenplay.tsx inside jsdom
// and drives its undo/redo with genuine browser events.
//
// Deliberately plain JavaScript with no JSX: this file lives under scripts/ so the app's
// tsconfig (include: ["**/*.ts", "**/*.tsx"]) never type-checks it, and it is bundled by
// esbuild at verify time (see scripts/verify-undo-and-prompts.mjs).
//
// Every scenario gets a FRESH mount so its history array starts in a known state —
// undo/redo expectations are only unambiguous when you know the whole stack.
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", { url: "http://localhost:3000/" });

const g = globalThis;
g.window = dom.window;
g.document = dom.window.document;
// Node >= 21 exposes `navigator` as a getter-only global, so it must be redefined.
Object.defineProperty(g, "navigator", { value: dom.window.navigator, configurable: true, writable: true });
g.HTMLElement = dom.window.HTMLElement;
g.HTMLTextAreaElement = dom.window.HTMLTextAreaElement;
g.HTMLSelectElement = dom.window.HTMLSelectElement;
g.Element = dom.window.Element;
g.Node = dom.window.Node;
g.Event = dom.window.Event;
g.KeyboardEvent = dom.window.KeyboardEvent;
g.MouseEvent = dom.window.MouseEvent;
g.getComputedStyle = dom.window.getComputedStyle;
g.requestAnimationFrame = cb => setTimeout(() => cb(Date.now()), 0);
g.cancelAnimationFrame = id => clearTimeout(id);
g.IS_REACT_ACT_ENVIRONMENT = true;

// React's "not wrapped in act(...)" advisory fires for the component's debounced autosave
// timer, which by design resolves outside an act() scope. Filter only that advisory.
const realConsoleError = console.error;
console.error = (...args) => {
  const msg = typeof args[0] === "string" ? args[0] : String(args[0] ?? "");
  if (msg.includes("not wrapped in act")) return;
  realConsoleError(...args);
};

const React = (await import("react")).default;
const { act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { Screenplay } = await import("@/components/screenplay");

const sleep = ms => new Promise(r => setTimeout(r, ms));

// React installs a value-setter override on each input instance to power its change
// tracker. Writing through the PROTOTYPE setter bypasses that override so the tracker
// sees a real change and onChange genuinely fires — otherwise nothing happens at all.
const nativeTextAreaValueSetter = Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype, "value").set;
const nativeSelectValueSetter = Object.getOwnPropertyDescriptor(dom.window.HTMLSelectElement.prototype, "value").set;

const SCRIPT = "EXT. PIER - NIGHT\n\nThe lighthouse blinks.";

function makeProject(script) {
  return {
    id: "p1",
    title: "The Last Light",
    description: "A keeper's daughter goes home.",
    genre: "Drama",
    format: "Short film",
    status: "In development",
    coverImage: "/images/lighting/blue-hour.jpg",
    acts: [],
    scenes: [{ id: "s1", title: "The Pier", location: "EXT. PIER - NIGHT", time: "Night", kind: "Standard", characters: [] }],
    frames: [],
    script,
    notes: [],
    moodboards: [],
    characters: [{ id: "c1", name: "Ella Voss", age: 34, traits: ["guarded"], description: "A keeper's daughter." }],
    brainstorm: [],
  };
}

export async function run() {
  const results = [];
  const check = (name, pass, detail) => {
    results.push({ name, pass, detail: detail || "" });
    console.log(`  ${pass ? "PASS" : "FAIL"}  ${name}${detail ? `  -> ${detail}` : ""}`);
  };

  /** Mount a fresh editor. Returns the handles the scenarios drive. */
  async function mount(script = SCRIPT) {
    document.body.innerHTML = "<div id='root'></div>";
    const saved = { script };
    const saveCalls = [];
    const root = createRoot(document.getElementById("root"));
    const props = () => ({
      project: makeProject(saved.script),
      onSave: async next => { saveCalls.push(next); saved.script = next; return true; },
      onAddScene: () => {},
      onEditScene: () => {},
      onImport: async () => true,
      notify: () => {},
      onManageActs: () => {},
      jump: null,
    });
    const rerender = () => act(async () => { root.render(React.createElement(Screenplay, props())); });
    await rerender();

    const api = {
      saved,
      saveCalls,
      rerender,
      unmount: () => act(async () => { root.unmount(); }),
      text: () => document.querySelector("textarea.screenplay-text").value,
      words: () => {
        const m = /([\d,]+)\s*words/.exec(document.querySelector(".script-status")?.textContent || "");
        return m ? parseInt(m[1].replace(/,/g, ""), 10) : NaN;
      },
      undoDisabled: () => document.querySelector("button[aria-label^='Undo']").disabled,
      redoDisabled: () => document.querySelector("button[aria-label^='Redo']").disabled,
      /** A real keystroke burst ending at `value`. */
      type: async value => {
        const el = document.querySelector("textarea.screenplay-text");
        await act(async () => {
          nativeTextAreaValueSetter.call(el, value);
          el.setSelectionRange(value.length, value.length);
          el.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
        });
      },
      clickUndo: () => act(async () => {
        document.querySelector("button[aria-label^='Undo']").dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
      }),
      clickRedo: () => act(async () => {
        document.querySelector("button[aria-label^='Redo']").dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
      }),
      keys: (key, opts = {}) => act(async () => {
        document.querySelector("textarea.screenplay-text")
          .dispatchEvent(new dom.window.KeyboardEvent("keydown", { key, bubbles: true, cancelable: true, ...opts }));
      }),
      insertElement: value => act(async () => {
        const sel = document.querySelector("select[aria-label='Insert screenplay element']");
        nativeSelectValueSetter.call(sel, value);
        sel.dispatchEvent(new dom.window.Event("change", { bubbles: true }));
      }),
    };
    return api;
  }

  const tail = s => JSON.stringify(String(s).slice(-14));

  // -------------------------------------------------------------------------
  console.log(`\n  scenario A: typing, undo, redo  (script: ${tail(SCRIPT)})`);
  {
    const ed = await mount();
    const initial = ed.text();
    const initialWords = ed.words();

    check("undo starts disabled", ed.undoDisabled() === true, `disabled=${ed.undoDisabled()}`);
    check("redo starts disabled", ed.redoDisabled() === true, `disabled=${ed.redoDisabled()}`);

    await ed.type(`${initial} ONE`);
    check("keystrokes reach React state (onChange fired)", ed.words() === initialWords + 1, `${initialWords} -> ${ed.words()} words`);

    // Pause past the 650ms coalescing window so this becomes its own history entry.
    await sleep(750);
    await ed.type(`${initial} ONE TWO`);
    await sleep(750);
    const latest = ed.text();
    check("undo enables after typing", ed.undoDisabled() === false, `disabled=${ed.undoDisabled()}`);

    await ed.clickUndo();
    check("undo #1 -> 'ONE' snapshot", ed.text() === `${initial} ONE`, `got ${tail(ed.text())}`);
    await ed.clickUndo();
    check("undo #2 -> original script", ed.text() === initial, `got ${tail(ed.text())}`);
    check("undo disables at the bottom of history", ed.undoDisabled() === true, `disabled=${ed.undoDisabled()}`);
    check("redo enables after undoing", ed.redoDisabled() === false, `disabled=${ed.redoDisabled()}`);

    await ed.clickRedo();
    await ed.clickRedo();
    check("redo x2 -> latest text", ed.text() === latest, `got ${tail(ed.text())}`);
    check("redo disables at the top of history", ed.redoDisabled() === true, `disabled=${ed.redoDisabled()}`);

    await ed.unmount();
  }

  // -------------------------------------------------------------------------
  console.log("\n  scenario B: typing after an undo discards the redo branch");
  {
    const ed = await mount();
    const initial = ed.text();
    await ed.type(`${initial} ONE`);
    await sleep(750);
    await ed.type(`${initial} ONE TWO`);
    await sleep(750);
    // history: [initial, ONE, ONE TWO], index 2

    await ed.clickUndo();                                  // index 1 -> "ONE"
    check("undo lands on 'ONE'", ed.text() === `${initial} ONE`, `got ${tail(ed.text())}`);

    await ed.type(`${initial} BRANCH`);
    await sleep(750);
    // history: [initial, ONE, BRANCH], index 2 — the "ONE TWO" entry is gone
    check("redo branch is cleared by new typing", ed.redoDisabled() === true, `disabled=${ed.redoDisabled()}`);

    await ed.clickUndo();
    check("undo from the new branch -> 'ONE'", ed.text() === `${initial} ONE`, `got ${tail(ed.text())}`);
    await ed.clickUndo();
    check("undo again -> original", ed.text() === initial, `got ${tail(ed.text())}`);

    await ed.unmount();
  }

  // -------------------------------------------------------------------------
  console.log("\n  scenario C: keyboard shortcuts");
  {
    const ed = await mount();
    const initial = ed.text();
    await ed.type(`${initial} KEYED`);
    await sleep(750);
    // history: [initial, KEYED], index 1

    await ed.keys("z", { ctrlKey: true });
    check("Ctrl+Z undoes", ed.text() === initial, `got ${tail(ed.text())}`);
    await ed.keys("z", { ctrlKey: true, shiftKey: true });
    check("Ctrl+Shift+Z redoes", ed.text() === `${initial} KEYED`, `got ${tail(ed.text())}`);
    await ed.keys("y", { ctrlKey: true });
    check("Ctrl+Y is a no-op at the top of history", ed.text() === `${initial} KEYED`, `got ${tail(ed.text())}`);
    await ed.keys("z", { metaKey: true });
    check("Cmd+Z undoes", ed.text() === initial, `got ${tail(ed.text())}`);
    await ed.keys("z", { metaKey: true, shiftKey: true });
    check("Cmd+Shift+Z redoes", ed.text() === `${initial} KEYED`, `got ${tail(ed.text())}`);

    await ed.unmount();
  }

  // -------------------------------------------------------------------------
  console.log("\n  scenario D: the 900ms autosave round-trip keeps history usable");
  {
    const ed = await mount();
    const initial = ed.text();
    await ed.type(`${initial} SAVED`);
    await sleep(1300);                                   // let the debounced autosave fire
    check("autosave fired", ed.saveCalls.length >= 1, `onSave called ${ed.saveCalls.length}x`);

    // The parent re-renders with the persisted script, exactly as the app does.
    await ed.rerender();
    await sleep(80);
    check("script survives the save round-trip", ed.text() === `${initial} SAVED`, `got ${tail(ed.text())}`);
    check("history was not wiped by the round-trip", ed.undoDisabled() === false, `undo disabled=${ed.undoDisabled()}`);

    await ed.clickUndo();
    check("undo after a save returns to the original", ed.text() === initial, `got ${tail(ed.text())}`);

    await ed.unmount();
  }

  // -------------------------------------------------------------------------
  console.log("\n  scenario E: toolbar inserts are undoable");
  {
    const ed = await mount();
    const before = ed.text();
    await ed.insertElement("transition");
    const after = ed.text();
    check("insert changes the script", after !== before, `${tail(before)} -> ${tail(after)}`);
    check("insert records a history entry", ed.undoDisabled() === false, `undo disabled=${ed.undoDisabled()}`);
    await ed.clickUndo();
    check("undo reverts the insert", ed.text() === before, `got ${tail(ed.text())}`);
    await ed.clickRedo();
    check("redo restores the insert", ed.text() === after, `got ${tail(ed.text())}`);

    await ed.unmount();
  }

  // -------------------------------------------------------------------------
  console.log("\n  scenario F: a fast burst is one undo step, not one per character");
  {
    const ed = await mount();
    const initial = ed.text();
    // First keystroke of the burst starts a new entry (last typing time is 0 on mount);
    // the rest land inside the 650ms window and coalesce into it.
    for (const suffix of [" A", " AB", " ABC", " ABCD"]) {
      await ed.type(`${initial}${suffix}`);
      await sleep(40);
    }
    const afterBurst = ed.text();
    check("burst produced the full text", afterBurst === `${initial} ABCD`, `got ${tail(afterBurst)}`);
    await ed.clickUndo();
    check("one undo reverts the whole burst", ed.text() === initial, `got ${tail(ed.text())}`);
    await ed.clickRedo();
    check("one redo restores the whole burst", ed.text() === afterBurst, `got ${tail(ed.text())}`);

    await ed.unmount();
  }

  // -------------------------------------------------------------------------
  console.log("\n  scenario G: the 150-entry history cap");
  {
    const ed = await mount();
    // Toolbar inserts push immediately, so 170 of them reliably blow past the 150 cap.
    // (Keystrokes would coalesce and never reach it.)
    const INSERTS = 170;
    for (let i = 0; i < INSERTS; i++) await ed.insertElement("action");

    let steps = 0;
    while (!ed.undoDisabled() && steps < INSERTS + 50) { await ed.clickUndo(); steps++; }
    check(`history is capped at 150 entries (${INSERTS} inserts -> 149 undo steps)`, steps === 149, `${steps} undo steps`);
    check("undo bottoms out at a real script", ed.text().length > 0, `len=${ed.text().length}`);

    let redos = 0;
    while (!ed.redoDisabled() && redos < INSERTS + 50) { await ed.clickRedo(); redos++; }
    check("redo walks the whole retained history", redos === 149, `${redos} redo steps`);

    await ed.unmount();
  }

  const failed = results.filter(r => !r.pass);
  console.log(`\n  ${results.length - failed.length}/${results.length} undo/redo checks passed`);
  if (failed.length) {
    console.log("\n  Failures:");
    for (const f of failed) console.log(`    - ${f.name}: ${f.detail}`);
  }
  return { total: results.length, failed: failed.length };
}
