import { drizzle } from "drizzle-orm/node-postgres";
import { Pool, type PoolClient } from "pg";
import fs from "node:fs";

const databaseUrl = process.env.DATABASE_URL;

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

const DB_FILE = "/tmp/arena_projects.json";

function loadProjects(): Record<string, unknown>[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    }
  } catch {}
  return [];
}

function saveProjects(projects: Record<string, unknown>[]) {
  fs.writeFileSync(DB_FILE, JSON.stringify(projects, null, 2), "utf8");
}

const COLS = [
  "id", "title", "description", "genre", "format", "status", "cover_image",
  "acts", "scenes", "frames", "script", "notes", "moodboards", "characters",
  "brainstorm", "share_id", "created_at", "updated_at",
];

const JSON_COLS = new Set(["acts", "scenes", "frames", "notes", "moodboards", "characters", "brainstorm"]);
const DATE_COLS = new Set(["created_at", "updated_at"]);

const DEFAULTS: Record<string, () => unknown> = {
  id: () => crypto.randomUUID(),
  title: () => "",
  description: () => "",
  genre: () => "Drama",
  format: () => "Short film",
  status: () => "In development",
  cover_image: () => "/images/coastal-road.jpg",
  acts: () => [],
  scenes: () => [],
  frames: () => [],
  script: () => "",
  notes: () => [],
  moodboards: () => [],
  characters: () => [],
  brainstorm: () => [],
  share_id: () => null,
  created_at: () => new Date().toISOString(),
  updated_at: () => new Date().toISOString(),
};

function parseJsonOrSelf(val: unknown, fallback: unknown) {
  if (val === null || val === undefined) return fallback;
  if (Array.isArray(val) || typeof val === "object") return val;
  if (typeof val !== "string") return val;
  try { return JSON.parse(val); } catch { return fallback; }
}

function rowToObject(row: Record<string, unknown>) {
  const obj: Record<string, unknown> = {};
  for (const col of COLS) {
    const val = row[col];
    if (JSON_COLS.has(col)) {
      obj[col] = parseJsonOrSelf(val, []);
    } else if (DATE_COLS.has(col)) {
      obj[col] = val ? new Date(val as string) : new Date();
    } else {
      obj[col] = val ?? null;
    }
  }
  return obj;
}

function rowToArray(row: Record<string, unknown>, fields: { name: string }[]) {
  return fields.map(f => {
    const name = f.name;
    const val = row[name];
    if (JSON_COLS.has(name)) {
      return parseJsonOrSelf(val, []);
    }
    if (DATE_COLS.has(name)) {
      return val ? new Date(val as string) : new Date();
    }
    return val ?? null;
  });
}

function createJsonPool(): Pool {
  function queryHandler(config: unknown, maybeValues?: unknown): Promise<unknown> {
    let text = typeof config === "string" ? config : (config as { text: string }).text;
    const values = Array.isArray(maybeValues)
      ? maybeValues
      : (typeof config === "object" && config && Array.isArray((config as { values?: unknown[] }).values) ? (config as { values: unknown[] }).values : []);
    const isArrayMode = typeof config === "object" && config && (config as { rowMode?: string }).rowMode === "array";
    text = text.trim();

    if (/^select\s+1$/i.test(text)) {
      return Promise.resolve({ rows: isArrayMode ? [[1]] : [{ "?column?": 1 }], fields: [{ name: "?column?" }] });
    }
    if (/select\s+count\(\*\)::int\s+as\s+count\s+from\s+film_projects/i.test(text)) {
      const projects = loadProjects();
      return Promise.resolve({ rows: isArrayMode ? [[projects.length]] : [{ count: projects.length }], fields: [{ name: "count" }] });
    }
    if (/^create\s+table/i.test(text) || /^alter\s+table/i.test(text) || /^begin/i.test(text) || /^commit/i.test(text) || /^rollback/i.test(text)) {
      return Promise.resolve({ rows: [], fields: [] });
    }
    if (/^select\s+/i.test(text)) {
      let projects = loadProjects();
      const selectMatch = text.match(/^select\s+(.*?)\s+from/i);
      let colNames = COLS;
      if (selectMatch) {
        colNames = selectMatch[1].split(",").map(s => s.trim().replace(/^"|"$/g, ""));
      }
      const fields = colNames.map(name => ({ name }));

      const idMatch = text.match(/"film_projects"\."id"\s*=\s*\$(\d+)/i);
      const shareMatch = text.match(/"film_projects"\."share_id"\s*=\s*\$(\d+)/i);

      if (idMatch) {
        const idVal = values[parseInt(idMatch[1], 10) - 1];
        projects = projects.filter(p => p.id === idVal);
      } else if (shareMatch) {
        const shareVal = values[parseInt(shareMatch[1], 10) - 1];
        projects = projects.filter(p => p.share_id === shareVal);
      } else {
        projects.sort((a, b) => ((a.created_at as string) || "").localeCompare((b.created_at as string) || "") || ((a.id as string) || "").localeCompare((b.id as string) || ""));
      }

      const limitMatch = text.match(/limit\s+(\$\d+|\d+)/i);
      if (limitMatch) {
        const limitVal = limitMatch[1].startsWith("$")
          ? (values[parseInt(limitMatch[1].slice(1), 10) - 1] as number)
          : parseInt(limitMatch[1], 10);
        projects = projects.slice(0, limitVal);
      }
      const resultRows = isArrayMode ? projects.map(r => rowToArray(r, fields)) : projects.map(rowToObject);
      return Promise.resolve({ rows: resultRows, fields });
    }
    if (/^insert\s+into\s+"film_projects"/i.test(text)) {
      const colsMatch = text.match(/\((.*?)\)\s+values/i);
      if (!colsMatch) return Promise.resolve({ rows: [], fields: [] });
      const cols = colsMatch[1].split(",").map(c => c.trim().replace(/^"|"$/g, ""));
      const valsMatch = text.match(/values\s*\((.*?)\)/i);
      const valPlaceholders = valsMatch ? valsMatch[1].split(",").map(v => v.trim()) : [];

      let valIdx = 0;
      const item: Record<string, unknown> = {};
      for (let i = 0; i < cols.length; i++) {
        const col = cols[i];
        const ph = valPlaceholders[i];
        if (ph === "default") {
          const defaultFn = DEFAULTS[col];
          item[col] = defaultFn ? defaultFn() : null;
        } else {
          const v = values[valIdx++];
          if (JSON_COLS.has(col)) {
            item[col] = typeof v === "string" ? parseJsonOrSelf(v, []) : (v ?? []);
          } else if (DATE_COLS.has(col)) {
            item[col] = v instanceof Date ? v.toISOString() : (v || new Date().toISOString());
          } else {
            item[col] = v ?? null;
          }
        }
      }
      if (!item.id) item.id = crypto.randomUUID();
      if (!item.created_at) item.created_at = new Date().toISOString();
      if (!item.updated_at) item.updated_at = new Date().toISOString();

      const projects = loadProjects();
      const existingIdx = projects.findIndex(p => p.id === item.id);
      let savedItem = item;
      if (existingIdx === -1) {
        projects.push(item);
        saveProjects(projects);
      } else {
        savedItem = projects[existingIdx];
      }
      const fields = COLS.map(name => ({ name }));
      return Promise.resolve({ rows: isArrayMode ? [rowToArray(savedItem, fields)] : [rowToObject(savedItem)], fields });
    }
    if (/^update\s+"film_projects"/i.test(text)) {
      const setMatch = text.match(/set\s+(.*?)\s+where/i);
      const whereMatch = text.match(/where\s+(.*?)(?:\s+returning|$)/i);
      if (!setMatch || !whereMatch) return Promise.resolve({ rows: [], fields: [] });
      const setPart = setMatch[1];
      const wherePart = whereMatch[1];
      const setCols = setPart.split(",").map(s => s.trim().split("=")[0].trim().replace(/^"|"$/g, ""));

      const idMatch = wherePart.match(/"film_projects"\."id"\s*=\s*\$(\d+)/i);
      const idVal = idMatch ? values[parseInt(idMatch[1], 10) - 1] : values[values.length - 1];

      const projects = loadProjects();
      const idx = projects.findIndex(p => p.id === idVal);
      let updatedItem: Record<string, unknown> | null = null;
      if (idx !== -1) {
        let valIdx = 0;
        for (const col of setCols) {
          const v = values[valIdx++];
          if (JSON_COLS.has(col)) {
            projects[idx][col] = typeof v === "string" ? parseJsonOrSelf(v, []) : (v ?? []);
          } else if (DATE_COLS.has(col)) {
            projects[idx][col] = v instanceof Date ? v.toISOString() : (v || new Date().toISOString());
          } else {
            projects[idx][col] = v ?? null;
          }
        }
        projects[idx].updated_at = new Date().toISOString();
        saveProjects(projects);
        updatedItem = projects[idx];
      }
      const fields = COLS.map(name => ({ name }));
      return Promise.resolve({ rows: updatedItem ? (isArrayMode ? [rowToArray(updatedItem, fields)] : [rowToObject(updatedItem)]) : [], fields });
    }
    if (/^delete\s+from\s+"film_projects"/i.test(text)) {
      const idMatch = text.match(/"film_projects"\."id"\s*=\s*\$(\d+)/i);
      if (idMatch) {
        const idVal = values[parseInt(idMatch[1], 10) - 1];
        const projects = loadProjects().filter(p => p.id !== idVal);
        saveProjects(projects);
      }
      return Promise.resolve({ rows: [], fields: [] });
    }
    return Promise.resolve({ rows: [], fields: [] });
  }

  const fakePool = {
    connect: async () => ({ query: queryHandler as unknown, release: () => {} } as unknown as PoolClient),
    release: () => {},
    query: queryHandler as unknown,
    on: () => fakePool,
    end: async () => {},
  } as unknown as Pool;

  return fakePool;
}

export const pool: Pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  (databaseUrl && !databaseUrl.includes("127.0.0.1:5432") && !databaseUrl.includes("localhost:5432")
    ? new Pool({ connectionString: databaseUrl })
    : createJsonPool());

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
