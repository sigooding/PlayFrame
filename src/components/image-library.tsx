"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, History, Search } from "lucide-react";
import { onImageError } from "@/lib/image";
import { Modal } from "./ui";

export interface LibraryImage {
  src: string;
  group: "shots" | "earlier" | "alternates" | "sheets" | "props" | "keys" | "other";
  scene?: string;
  name: string;
  bytes: number;
  replaces?: string;
  version?: number;
  of?: number;
  date?: string;
  note?: string;
  current?: boolean;
}

const LIBRARY_URL = "/images/neonoire/library.json";
let cache: Promise<LibraryImage[]> | null = null;

/** The film's image library is a static file, so it works wherever the app is hosted. */
export function loadImageLibrary(): Promise<LibraryImage[]> {
  cache ||= fetch(LIBRARY_URL)
    .then(response => (response.ok ? response.json() : { images: [] }))
    .then(data => (Array.isArray(data.images) ? data.images : []))
    .catch(() => []);
  return cache;
}

export function useImageLibrary() {
  const [images, setImages] = useState<LibraryImage[]>([]);
  useEffect(() => {
    let live = true;
    void loadImageLibrary().then(list => { if (live) setImages(list); });
    return () => { live = false; };
  }, []);
  return images;
}

const GROUPS: { id: LibraryImage["group"] | "all"; label: string }[] = [
  { id: "all", label: "Everything" },
  { id: "shots", label: "Current shots" },
  { id: "earlier", label: "Earlier versions" },
  { id: "alternates", label: "Unused alternates" },
  { id: "sheets", label: "Cast & location sheets" },
  { id: "props", label: "Props" },
  { id: "keys", label: "Style keys" },
];

const label = (image: LibraryImage) => image.group === "earlier"
  ? `Scene ${image.scene} · ${image.name.replace(/--v\d+\.\w+$/, "")} · v${image.version} of ${image.of}${image.date ? ` · ${image.date}` : ""}`
  : `${image.scene ? `Scene ${image.scene} · ` : ""}${image.name}`;

/** Exact older takes for a shot, plus any previously selected images not yet in the static library. */
export function frameImageVersions(
  library: LibraryImage[],
  selected: string,
  imageOriginal?: string,
  imageHistory: string[] = [],
  scene?: string,
): LibraryImage[] {
  const sources = [selected, imageOriginal, ...imageHistory].filter((src): src is string => Boolean(src));
  const sourceEntries = sources.map(src => library.find(image => image.src === src)).filter((image): image is LibraryImage => !!image);
  const baseEntry = sourceEntries.find(image => image.replaces || image.group === "shots");
  const base = baseEntry?.replaces || baseEntry?.src;
  const versions = base
    ? library.filter(image => image.src === base || image.replaces === base)
      .sort((a, b) => (a.version ?? Number.MAX_SAFE_INTEGER) - (b.version ?? Number.MAX_SAFE_INTEGER))
    : [];
  const result = new Map(versions.map(image => [image.src, image]));

  for (const [index, src] of [...new Set(sources)].entries()) {
    if (!result.has(src)) {
      const inLibrary = library.find(image => image.src === src);
      result.set(src, inLibrary || {
        src,
        group: "other",
        scene,
        name: src.split("/").at(-1)?.replace(/[-_]/g, " ") || `Previously selected image ${index + 1}`,
        bytes: 0,
        note: "Previously selected for this shot",
      });
    }
  }
  return [...result.values()];
}

/** Unused images filed under the scene's own image folder. */
export function sceneImageAlternates(library: LibraryImage[], scene?: string): LibraryImage[] {
  if (!scene) return [];
  const wanted = scene.toUpperCase();
  return library
    .filter(image => image.group === "alternates" && image.scene?.toUpperCase() === wanted)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
}

type BrowserView = "versions" | "scene" | "all";

/** Browse every picture the film owns, including a shot's earlier versions and scene alternates. */
export function ImageBrowser({
  library,
  selected,
  onPick,
  sceneNumber,
  imageOriginal,
  imageHistory,
  includeAll = true,
}: {
  library: LibraryImage[];
  selected: string;
  onPick: (src: string) => void;
  sceneNumber?: string;
  imageOriginal?: string;
  imageHistory?: string[];
  /** The storyboard card offers the two relevant scopes; the frame editor may browse the full library. */
  includeAll?: boolean;
}) {
  const versions = useMemo(
    () => frameImageVersions(library, selected, imageOriginal, imageHistory, sceneNumber),
    [library, selected, imageOriginal, imageHistory, sceneNumber],
  );
  const alternates = useMemo(() => sceneImageAlternates(library, sceneNumber), [library, sceneNumber]);
  const [view, setView] = useState<BrowserView>("versions");
  const [group, setGroup] = useState<(typeof GROUPS)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(60);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return library.filter(image =>
      (group === "all" || image.group === group) &&
      (!q || `${image.name} scene ${image.scene || ""} ${image.note || ""}`.toLowerCase().includes(q)),
    );
  }, [library, group, query]);

  const grid = (items: LibraryImage[]) => <div className="reference-grid reference-grid-wide">
    {items.map(image => (
      <button
        type="button"
        key={image.src}
        title={label(image)}
        aria-label={`Use ${label(image)}`}
        className={selected === image.src ? "selected" : ""}
        aria-pressed={selected === image.src}
        onClick={() => onPick(image.src)}
      >
        <img src={image.src} alt="" loading="lazy" onError={onImageError} />
        {selected === image.src && <span><Check size={12} /></span>}
      </button>
    ))}
  </div>;

  return <div className="image-browser">
    <div className="image-browser-tabs" role="tablist" aria-label="Image choices">
      <button type="button" role="tab" aria-selected={view === "versions"} className={`prompt-category-pill ${view === "versions" ? "active" : ""}`} onClick={() => setView("versions")}>
        <History size={13} /> This shot&apos;s versions ({versions.length})
      </button>
      {sceneNumber && <button type="button" role="tab" aria-selected={view === "scene"} className={`prompt-category-pill ${view === "scene" ? "active" : ""}`} onClick={() => setView("scene")}>
        Scene {sceneNumber} alternates ({alternates.length})
      </button>}
      {includeAll && <button type="button" role="tab" aria-selected={view === "all"} className={`prompt-category-pill ${view === "all" ? "active" : ""}`} onClick={() => setView("all")}>
        All images ({library.length})
      </button>}
    </div>

    {view === "versions" && <>
      {versions.length ? grid(versions) : <p className="eyebrow reference-label">No saved image versions for this shot yet.</p>}
      <p className="eyebrow reference-label">The original and previous selections stay available here. Pick an image to preview it, then use it for this shot.</p>
    </>}

    {view === "scene" && <>
      {alternates.length ? grid(alternates) : <p className="eyebrow reference-label">No unused alternate images are filed under scene {sceneNumber}.</p>}
    </>}

    {view === "all" && includeAll && <>
      <div className="fields-row">
        <label className="field"><span>Search</span><span className="image-search"><Search size={14} /><input type="search" placeholder="scene number, name…" value={query} onChange={event => { setQuery(event.target.value); setLimit(60); }} /></span></label>
        <label className="field"><span>Show</span><select value={group} onChange={event => { setGroup(event.target.value as typeof group); setLimit(60); }}>{GROUPS.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      </div>
      {grid(shown.slice(0, limit))}
      {shown.length > limit && <button type="button" className="button" onClick={() => setLimit(limit + 60)}>Show more ({shown.length - limit} left)</button>}
      {!shown.length && <p className="eyebrow reference-label">Nothing matches.</p>}
    </>}
  </div>;
}

/** A shot-card action for restoring a take or choosing an unused alternate from that scene. */
export function FrameImageChooser({
  frame,
  sceneNumber,
  shotNumber,
  saving,
  onClose,
  onChoose,
}: {
  frame: { title: string; image: string; imageOriginal?: string; imageHistory?: string[] };
  sceneNumber: string;
  shotNumber: number;
  saving: boolean;
  onClose: () => void;
  onChoose: (image: string) => Promise<boolean>;
}) {
  const library = useImageLibrary();
  const [choice, setChoice] = useState(frame.image);
  const choiceName = choice.split("/").at(-1) || "Selected image";

  return <Modal wide title="Choose an alternate image" subtitle={`Shot ${shotNumber} · Scene ${sceneNumber} · ${frame.title}. Your current image is kept as the original.`} onClose={onClose} className="alternate-image-modal">
    <div className="alternate-image-dialog">
      <div className="alternate-image-preview">
        <span className="eyebrow">PREVIEW</span>
        {choice ? <img src={choice} alt={`Preview for ${frame.title}`} onError={onImageError} /> : <div className="image-placeholder">No image selected</div>}
        <small>{choiceName}</small>
      </div>
      <ImageBrowser
        library={library}
        selected={choice}
        imageOriginal={frame.imageOriginal}
        imageHistory={frame.imageHistory}
        sceneNumber={sceneNumber}
        includeAll={false}
        onPick={setChoice}
      />
    </div>
    <div className="modal-footer">
      <button type="button" className="button" onClick={onClose} disabled={saving}>Cancel</button>
      <button type="button" className="button button-primary" onClick={() => void onChoose(choice)} disabled={saving || !choice || choice === frame.image}>
        {saving ? "Saving…" : choice === frame.image ? "Current image selected" : "Use this image"}
      </button>
    </div>
  </Modal>;
}
