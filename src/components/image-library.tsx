"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, History, Search } from "lucide-react";
import { onImageError } from "@/lib/image";

export interface LibraryImage {
  src: string; group: "shots" | "earlier" | "alternates" | "sheets" | "props" | "keys" | "other";
  scene?: string; name: string; bytes: number; replaces?: string; version?: number; of?: number; date?: string; note?: string; current?: boolean;
}
const LIBRARY_URL = "/images/neonoire/library.json";
let cache: Promise<LibraryImage[]> | null = null;
/** The film's image library (a static file, so it works wherever the app is hosted). Empty when a project has none. */
export function loadImageLibrary(): Promise<LibraryImage[]> {
  cache ||= fetch(LIBRARY_URL).then(r => (r.ok ? r.json() : { images: [] })).then(d => (Array.isArray(d.images) ? d.images : [])).catch(() => []);
  return cache;
}
export function useImageLibrary() {
  const [images, setImages] = useState<LibraryImage[]>([]);
  useEffect(() => { let live = true; void loadImageLibrary().then(list => { if (live) setImages(list); }); return () => { live = false; }; }, []);
  return images;
}

const GROUPS: { id: LibraryImage["group"] | "all"; label: string }[] = [
  { id: "all", label: "Everything" }, { id: "shots", label: "Current shots" }, { id: "earlier", label: "Earlier versions" },
  { id: "alternates", label: "Unused alternates" }, { id: "sheets", label: "Cast & location sheets" }, { id: "props", label: "Props" }, { id: "keys", label: "Style keys" },
];
const label = (i: LibraryImage) => i.group === "earlier" ? `Scene ${i.scene} · ${i.name.replace(/--v\d+\.\w+$/, "")} · v${i.version} of ${i.of}${i.date ? ` · ${i.date}` : ""}` : `${i.scene ? `Scene ${i.scene} · ` : ""}${i.name}`;

/** Browse every picture the film owns, including earlier versions of retaken shots, and pick one for this shot. */
export function ImageBrowser({ library, selected, onPick }: { library: LibraryImage[]; selected: string; onPick: (src: string) => void }) {
  const base = useMemo(() => { const hit = library.find(i => i.src === selected); return hit?.replaces || selected; }, [library, selected]);
  const versions = useMemo(() => library.filter(i => i.replaces === base || i.src === base).sort((a, b) => (a.version ?? 999) - (b.version ?? 999)), [library, base]);
  const [view, setView] = useState<"versions" | "all">(versions.length > 1 ? "versions" : "all");
  const [group, setGroup] = useState<(typeof GROUPS)[number]["id"]>("all");
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(60);
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return library.filter(i => (group === "all" || i.group === group) && (!q || `${i.name} scene ${i.scene || ""} ${i.note || ""}`.toLowerCase().includes(q)));
  }, [library, group, query]);
  const grid = (items: LibraryImage[]) => <div className="reference-grid reference-grid-wide">{items.map(i => <button type="button" key={i.src} title={label(i)} aria-label={`Use ${label(i)}`} className={selected === i.src ? "selected" : ""} onClick={() => onPick(i.src)}><img src={i.src} alt="" loading="lazy" onError={onImageError} />{selected === i.src && <span><Check size={12} /></span>}</button>)}</div>;
  return <div className="image-browser">
    <div className="image-actions">
      <button type="button" className={`prompt-category-pill ${view === "versions" ? "active" : ""}`} onClick={() => setView("versions")}><History size={13} /> This shot&apos;s versions ({versions.length})</button>
      <button type="button" className={`prompt-category-pill ${view === "all" ? "active" : ""}`} onClick={() => setView("all")}>All images ({library.length})</button>
    </div>
    {view === "versions" ? (versions.length > 1
      ? <>{grid(versions)}<p className="eyebrow reference-label">{versions.map(v => v.src === selected ? label(v) : null).filter(Boolean)[0] || "Pick a version to preview it, then save the shot."}</p></>
      : <p className="eyebrow reference-label">No earlier versions of this image.</p>)
      : <>
        <div className="fields-row"><label className="field"><span>Search</span><span style={{ display: "flex", gap: 6, alignItems: "center" }}><Search size={14} /><input type="search" placeholder="scene number, name…" value={query} onChange={e => { setQuery(e.target.value); setLimit(60); }} /></span></label>
          <label className="field"><span>Show</span><select value={group} onChange={e => { setGroup(e.target.value as typeof group); setLimit(60); }}>{GROUPS.map(g => <option key={g.id} value={g.id}>{g.label}</option>)}</select></label></div>
        {grid(shown.slice(0, limit))}
        {shown.length > limit && <button type="button" className="button" onClick={() => setLimit(limit + 60)}>Show more ({shown.length - limit} left)</button>}
        {!shown.length && <p className="eyebrow reference-label">Nothing matches.</p>}
      </>}
  </div>;
}
