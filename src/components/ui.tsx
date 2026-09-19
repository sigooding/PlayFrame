"use client";

import { cloneElement, isValidElement, useEffect, useRef, type ReactNode, type ButtonHTMLAttributes } from "react";
import { createPortal } from "react-dom";
import { X, Film, ArrowUpRight } from "lucide-react";

export function FrameLogo({ small = false }: { small?: boolean }) {
  return <span className={`brand ${small ? "brand-small" : ""}`}><span className="brand-mark" aria-hidden="true"><span /><span /><span /><span /><i /></span><span>frame<span className="brand-period">.</span></span></span>;
}

export function IconButton({ children, label, className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode; label: string }) {
  return <button type="button" className={`icon-button ${className}`} aria-label={label} title={label} {...props}>{children}</button>;
}

export function Avatar({ name = "Jamie Parker", small = false }: { name?: string; small?: boolean }) {
  return <span className={`avatar ${small ? "avatar-small" : ""}`} aria-label={name}>{name.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase()}</span>;
}

export function Modal({ children, title, subtitle, onClose, wide = false, className = "" }: { children: ReactNode; title: string; subtitle?: string; onClose: () => void; wide?: boolean; className?: string }) {
  const panel = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  }, [onClose]);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timeout = setTimeout(() => panel.current?.querySelector<HTMLElement>("input, textarea, select, button")?.focus(), 50);
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key === "Tab") {
        const focusable = panel.current?.querySelectorAll<HTMLElement>('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex="0"]');
        if (!focusable?.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => { clearTimeout(timeout); document.removeEventListener("keydown", handleKey); document.body.style.overflow = previousOverflow; previous?.focus(); };
  }, []);
  return createPortal(<div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}><div ref={panel} className={`modal ${wide ? "modal-wide" : ""} ${className}`} role="dialog" aria-modal="true" aria-label={title}><div className="modal-heading"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div><IconButton label="Close dialog" onClick={onClose}><X size={19} /></IconButton></div>{children}</div></div>, document.body);
}

export function EmptyState({ title, description, action, actionLabel }: { title: string; description: string; action?: () => void; actionLabel?: string }) {
  return <div className="empty-state"><span className="empty-icon"><Film size={29} strokeWidth={1.3} /></span><h3>{title}</h3><p>{description}</p>{action && <button className="button button-primary" onClick={action}>{actionLabel}<ArrowUpRight size={15} /></button>}</div>;
}

export function Field({ label, children, hint, className = "" }: { label: string; children: ReactNode; hint?: string; className?: string }) {
  const control = isValidElement<{ "aria-label"?: string }>(children)
    ? cloneElement(children, { "aria-label": children.props["aria-label"] || label })
    : children;
  return <label className={`field ${className}`}><span>{label}</span>{control}{hint && <small>{hint}</small>}</label>;
}
