"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Plus, Trash2, Sparkles, GripVertical, ZoomIn, ZoomOut, Move3d, RotateCcw, Link2, X, Unlink } from "lucide-react";
import type { BrainstormNode } from "@/lib/types";

const NODE_WIDTH = 210;
const CANVAS_W = 1800, CANVAS_H = 1100;
const colorConfig: Record<string, { bg: string; border: string; text: string; line: string }> = {
  sage: { bg: "#edf3e5", border: "#cfd8c0", text: "#4f6d45", line: "#8fae7c" },
  sand: { bg: "#f5efe3", border: "#e5d8bc", text: "#8a6f48", line: "#c6ac7a" },
  rose: { bg: "#f7ebe8", border: "#e2cdc8", text: "#9a6f60", line: "#d0a396" },
  clay: { bg: "#ebe5da", border: "#d9ccc0", text: "#74604a", line: "#b39c82" },
  ink: { bg: "#ececed", border: "#c5c7cf", text: "#3f434c", line: "#8e93a0" },
};

type Point = { x: number; y: number };
type Props = {
  nodes: BrainstormNode[];
  onEdit: (node: BrainstormNode) => void;
  onAdd: (x?: number, y?: number) => void;
  onChange: (nodes: BrainstormNode[], message?: string) => Promise<boolean>;
  onDelete: (node: BrainstormNode) => void;
};

export function BrainstormBoard({ nodes, onEdit, onAdd, onChange, onDelete }: Props) {
  const [scale, setScale] = useState(1);
  const [positions, setPositions] = useState<Record<string, Point>>({});
  const [sizes, setSizes] = useState<Record<string, number>>({});
  const [drag, setDrag] = useState<{ id: string; offset: Point } | null>(null);
  const [linking, setLinking] = useState<{ from: string; cursor: Point } | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [linkMode, setLinkMode] = useState(false);
  const [linkSource, setLinkSource] = useState<string | null>(null);
  const moved = useRef(false);
  const boardRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const pos = (n: BrainstormNode): Point => positions[n.id] || { x: n.x, y: n.y };
  const height = (id: string) => sizes[id] || 120;
  const center = (n: BrainstormNode): Point => ({ x: pos(n).x + NODE_WIDTH / 2, y: pos(n).y + height(n.id) / 2 });

  useLayoutEffect(() => {
    const next: Record<string, number> = {};
    let changed = false;
    for (const n of nodes) { const h = nodeRefs.current[n.id]?.offsetHeight; if (h) { next[n.id] = h; if (sizes[n.id] !== h) changed = true; } }
    if (changed) setSizes(s => ({ ...s, ...next }));
  });
  useEffect(() => { setPositions({}); }, [nodes]);

  function canvasPoint(e: React.MouseEvent): Point {
    const rect = boardRef.current!.getBoundingClientRect();
    return { x: (e.clientX - rect.left + boardRef.current!.scrollLeft) / scale, y: (e.clientY - rect.top + boardRef.current!.scrollTop) / scale };
  }

  // ---- connections ----
  const pairs: [BrainstormNode, BrainstormNode][] = [];
  const seen = new Set<string>();
  for (const a of nodes) for (const id of a.connections) { const b = nodes.find(n => n.id === id); if (!b) continue; const key = [a.id, b.id].sort().join("|"); if (seen.has(key)) continue; seen.add(key); pairs.push([a, b]); }
  const connected = (a: string, b: string) => nodes.some(n => (n.id === a && n.connections.includes(b)) || (n.id === b && n.connections.includes(a)));

  async function connect(a: string, b: string) {
    if (a === b || connected(a, b)) return;
    await onChange(nodes.map(n => n.id === a ? { ...n, connections: [...n.connections, b] } : n), "Ideas connected.");
  }
  async function disconnect(a: string, b: string) {
    await onChange(nodes.map(n => (n.id === a || n.id === b) ? { ...n, connections: n.connections.filter(id => id !== a && id !== b) } : n), "Connection removed.");
  }

  // ---- node drag ----
  function startDrag(e: React.MouseEvent, node: BrainstormNode) {
    if (e.button !== 0) return;
    e.stopPropagation();
    if (linkMode) return;
    const p = canvasPoint(e);
    setDrag({ id: node.id, offset: { x: p.x - pos(node).x, y: p.y - pos(node).y } });
    moved.current = false;
  }
  function onMove(e: React.MouseEvent) {
    if (linking) { setLinking({ ...linking, cursor: canvasPoint(e) }); return; }
    if (!drag) return;
    const p = canvasPoint(e);
    const next = { x: Math.max(0, Math.round(p.x - drag.offset.x)), y: Math.max(0, Math.round(p.y - drag.offset.y)) };
    const node = nodes.find(n => n.id === drag.id)!;
    if (Math.abs(next.x - node.x) > 2 || Math.abs(next.y - node.y) > 2) moved.current = true;
    setPositions(prev => ({ ...prev, [drag.id]: next }));
  }
  async function endDrag() {
    if (linking) { setLinking(null); return; }
    if (!drag) return;
    const p = positions[drag.id];
    const node = nodes.find(n => n.id === drag.id);
    setDrag(null);
    if (p && node && (p.x !== node.x || p.y !== node.y)) await onChange(nodes.map(n => n.id === node.id ? { ...n, x: p.x, y: p.y } : n));
  }

  // ---- linking via port drag or link mode ----
  function startLink(e: React.MouseEvent, node: BrainstormNode) {
    e.stopPropagation(); e.preventDefault();
    setLinking({ from: node.id, cursor: center(node) });
  }
  function nodeMouseUp(e: React.MouseEvent, node: BrainstormNode) {
    if (linking) { e.stopPropagation(); const from = linking.from; setLinking(null); void connect(from, node.id); }
  }
  function nodeClick(node: BrainstormNode) {
    if (moved.current) { moved.current = false; return; }
    if (linkMode) {
      if (!linkSource) { setLinkSource(node.id); return; }
      if (linkSource !== node.id) void connect(linkSource, node.id);
      setLinkSource(null);
      return;
    }
    onEdit(node);
  }

  function anchor(a: BrainstormNode, b: BrainstormNode): [Point, Point] {
    const ca = center(a), cb = center(b);
    const dx = cb.x - ca.x, dy = cb.y - ca.y;
    if (Math.abs(dx) >= Math.abs(dy)) {
      return dx >= 0 ? [{ x: pos(a).x + NODE_WIDTH, y: ca.y }, { x: pos(b).x, y: cb.y }] : [{ x: pos(a).x, y: ca.y }, { x: pos(b).x + NODE_WIDTH, y: cb.y }];
    }
    return dy >= 0 ? [{ x: ca.x, y: pos(a).y + height(a.id) }, { x: cb.x, y: pos(b).y }] : [{ x: ca.x, y: pos(a).y }, { x: cb.x, y: pos(b).y + height(b.id) }];
  }
  function path(p1: Point, p2: Point) {
    const horizontal = Math.abs(p2.x - p1.x) >= Math.abs(p2.y - p1.y);
    const bend = Math.max(40, Math.min(160, (horizontal ? Math.abs(p2.x - p1.x) : Math.abs(p2.y - p1.y)) / 2));
    return horizontal ? `M${p1.x},${p1.y} C${p1.x + Math.sign(p2.x - p1.x) * bend},${p1.y} ${p2.x - Math.sign(p2.x - p1.x) * bend},${p2.y} ${p2.x},${p2.y}` : `M${p1.x},${p1.y} C${p1.x},${p1.y + Math.sign(p2.y - p1.y) * bend} ${p2.x},${p2.y - Math.sign(p2.y - p1.y) * bend} ${p2.x},${p2.y}`;
  }

  function freeSpot(): Point {
    const w = NODE_WIDTH + 40, hGap = 40;
    const boxes = nodes.map(n => ({ x: pos(n).x, y: pos(n).y, w: NODE_WIDTH, h: height(n.id) }));
    const scrollX = (boardRef.current?.scrollLeft || 0) / scale, scrollY = (boardRef.current?.scrollTop || 0) / scale;
    for (let row = 0; row < 12; row++) for (let col = 0; col < 7; col++) {
      const x = scrollX + 40 + col * w, y = scrollY + 40 + row * (150 + hGap);
      if (x + NODE_WIDTH > CANVAS_W || y + 150 > CANVAS_H) continue;
      const clash = boxes.some(bx => x < bx.x + bx.w + 24 && x + NODE_WIDTH + 24 > bx.x && y < bx.y + bx.h + 24 && y + 150 + 24 > bx.y);
      if (!clash) return { x, y };
    }
    return { x: 40 + Math.random() * 400, y: 40 + Math.random() * 300 };
  }
  const links = pairs.length;
  return <section className="view-enter"><div className="section-heading"><div><div className="section-title-row"><h2>Brainstorm map</h2><span className="count-badge">{nodes.length}</span></div><p>A visual web of ideas — connect characters, scenes, and themes.</p></div><div className="section-actions"><button type="button" className={`button ${linkMode ? "button-primary" : ""}`} onClick={() => { setLinkMode(!linkMode); setLinkSource(null); }} aria-pressed={linkMode}><Link2 size={14} />{linkMode ? (linkSource ? "Now pick the second idea" : "Pick the first idea") : "Connect ideas"}</button><button type="button" className="button button-primary" onClick={() => { const p = freeSpot(); onAdd(Math.round(p.x), Math.round(p.y)); }}><Plus size={14} />Add idea</button></div></div>

    <div className="brain-canvas-wrap"><div className="brain-toolbar"><button type="button" className="text-button" onClick={() => setScale(s => Math.min(s + 0.15, 2))}><ZoomIn size={14} />Zoom in</button><button type="button" className="text-button" onClick={() => setScale(s => Math.max(s - 0.15, 0.4))}><ZoomOut size={14} />Zoom out</button><button type="button" className="text-button" onClick={() => setScale(1)}><RotateCcw size={14} />Reset</button><span className="brain-stats">{links} connection{links === 1 ? "" : "s"}</span><span className="brain-hint"><Move3d size={13} />Double-click empty space to add an idea · drag a node to move it · drag the <i /> port onto another idea to connect them</span></div>

      <div ref={boardRef} className={`node-canvas ${linkMode ? "link-mode" : ""} ${drag ? "dragging" : ""}`} onDoubleClick={e => { if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("brain-stage")) { const p = canvasPoint(e); onAdd(Math.round(p.x - NODE_WIDTH / 2), Math.round(p.y - 40)); } }} onMouseMove={onMove} onMouseUp={endDrag} onMouseLeave={() => { setDrag(null); setLinking(null); }}>
        <div className="brain-stage" style={{ width: CANVAS_W, height: CANVAS_H, transform: `scale(${scale})`, transformOrigin: "top left" }}>
          <svg className="brain-links" width={CANVAS_W} height={CANVAS_H} aria-hidden="true">
            {pairs.map(([a, b]) => { const [p1, p2] = anchor(a, b); const stroke = (colorConfig[a.color] || colorConfig.sage).line; return <path key={`${a.id}-${b.id}`} d={path(p1, p2)} stroke={stroke} strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.85} />; })}
            {linking && (() => { const from = nodes.find(n => n.id === linking.from); if (!from) return null; const c = center(from); return <path d={path(c, linking.cursor)} stroke="#6f8f5c" strokeWidth={2} strokeDasharray="6 5" fill="none" />; })()}
          </svg>
          {pairs.map(([a, b]) => { const [p1, p2] = anchor(a, b); const mx = (p1.x + p2.x) / 2, my = (p1.y + p2.y) / 2; return <button type="button" key={`x-${a.id}-${b.id}`} className="link-remove" style={{ left: mx, top: my }} aria-label={`Remove connection between ${a.title} and ${b.title}`} title="Remove connection" onClick={e => { e.stopPropagation(); void disconnect(a.id, b.id); }}><Unlink size={11} /></button>; })}

          {nodes.map(node => {
            const colors = colorConfig[node.color] || colorConfig.sage;
            const p = pos(node);
            const isSource = linkSource === node.id || linking?.from === node.id;
            return <div key={node.id} ref={el => { nodeRefs.current[node.id] = el; }} role="button" tabIndex={0} aria-label={`Edit idea: ${node.title}`} className={`brain-node ${drag?.id === node.id ? "is-dragging" : ""} ${isSource ? "is-source" : ""} ${(linking || linkMode) && !isSource ? "is-target" : ""}`} style={{ left: p.x, top: p.y, width: NODE_WIDTH, borderColor: colors.border, background: colors.bg, color: colors.text }} onMouseDown={e => startDrag(e, node)} onMouseUp={e => nodeMouseUp(e, node)} onClick={() => nodeClick(node)} onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); nodeClick(node); } }} onMouseEnter={() => setHovered(node.id)} onMouseLeave={() => setHovered(null)}>
              <div className="brain-node-top"><span>{node.tags.slice(0, 2).join(" · ") || "IDEA"}</span><GripVertical size={12} /></div>
              <h3>{node.title}</h3>
              {node.content && <p>{node.content}</p>}
              {node.tags.length > 0 && <div className="brain-node-tags">{node.tags.map(tag => <span key={tag} style={{ borderColor: colors.border }}>{tag}</span>)}</div>}
              <div className="brain-node-foot"><span>{node.connections.length + nodes.filter(n => n.id !== node.id && n.connections.includes(node.id) && !node.connections.includes(n.id)).length} link{(node.connections.length + nodes.filter(n => n.id !== node.id && n.connections.includes(node.id) && !node.connections.includes(n.id)).length) === 1 ? "" : "s"}</span></div>
              <button type="button" className="brain-port" aria-label={`Drag to connect ${node.title} with another idea`} title="Drag to connect" onMouseDown={e => startLink(e, node)} onClick={e => e.stopPropagation()}><Link2 size={11} /></button>
              {hovered === node.id && !drag && <button type="button" className="brain-delete" aria-label={`Delete idea ${node.title}`} onMouseDown={e => e.stopPropagation()} onClick={e => { e.stopPropagation(); onDelete(node); }}><Trash2 size={12} /></button>}
            </div>;
          })}
        </div>
        {linkMode && <div className="link-banner"><Link2 size={14} />{linkSource ? `Connecting “${nodes.find(n => n.id === linkSource)?.title}” — click the second idea.` : "Click two ideas to connect them."}<button type="button" onClick={() => { setLinkMode(false); setLinkSource(null); }} aria-label="Exit connect mode"><X size={13} /></button></div>}
      </div>

      {nodes.length === 0 && <div className="empty-state brain-empty"><span className="empty-icon"><Sparkles size={28} strokeWidth={1.3} /></span><h3>A map of possibilities.</h3><p>Double-click anywhere on the canvas above, or press <strong>Add idea</strong>. Then drag the link port from one idea onto another to connect them.</p></div>}
    </div>
  </section>;
}
