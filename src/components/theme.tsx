"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Check, CloudSun, Moon, Sun } from "lucide-react";
import { IconButton } from "./ui";

export const THEME_KEY = "frame-theme";

export const THEMES = [
  { id: "daylight", label: "Daylight", icon: Sun },
  { id: "midnight", label: "Midnight", icon: Moon },
  { id: "slate", label: "Slate", icon: CloudSun },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
};

const storedTheme = (): ThemeId => {
  try {
    const t = localStorage.getItem(THEME_KEY);
    return THEMES.some(x => x.id === t) ? (t as ThemeId) : "daylight";
  } catch {
    return "daylight";
  }
};

/** Server render has no localStorage, so it always starts on Daylight. */
const serverTheme = (): ThemeId => "daylight";

/** Apply a theme by setting `data-theme` on <html> (Daylight clears it so `:root` applies). */
export function applyTheme(id: ThemeId) {
  try {
    if (id === "daylight") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", id);
    localStorage.setItem(THEME_KEY, id);
  } catch {
    /* ignore */
  }
  listeners.forEach(l => l());
}

/** Mounted once in the root layout so the saved theme is applied on every page after hydration. */
export function ThemeApplier() {
  useEffect(() => {
    applyTheme(storedTheme());
  }, []);
  return null;
}

/** Top-bar control: a small picker for the three themes; the choice is remembered. */
export function ThemeControl() {
  const theme = useSyncExternalStore(subscribe, storedTheme, serverTheme);
  const [open, setOpen] = useState(false);

  const active = THEMES.find(t => t.id === theme) || THEMES[0];
  const ActiveIcon = active.icon;

  function choose(id: ThemeId) {
    applyTheme(id);
    setOpen(false);
  }

  return (
    <div className="theme-control">
      <IconButton label={`Theme: ${active.label}`} onClick={() => setOpen(o => !o)}><ActiveIcon size={18} /></IconButton>
      {open && <>
        <button className="popover-dismiss" aria-label="Close theme menu" onClick={() => setOpen(false)} />
        <div className="theme-menu" role="menu" aria-label="Choose a theme">
          <span className="eyebrow">Theme</span>
          {THEMES.map(t => (
            <button key={t.id} type="button" role="menuitem" className={t.id === theme ? "active" : ""} onClick={() => choose(t.id)}>
              <t.icon size={15} />
              {t.label}
              {t.id === theme && <Check size={14} />}
            </button>
          ))}
        </div>
      </>}
    </div>
  );
}
