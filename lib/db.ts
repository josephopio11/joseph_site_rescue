import Database from "better-sqlite3"
import path from "path"
import fs from "fs"

// Resolve the SQLite file. Defaults to <cwd>/data/site.db but can be
// overridden with DATABASE_FILE (absolute path recommended for production).
function resolveDbPath(): string {
  if (process.env.DATABASE_FILE) {
    const dir = path.dirname(process.env.DATABASE_FILE)
    fs.mkdirSync(dir, { recursive: true })
    return process.env.DATABASE_FILE
  }
  const dir = path.join(process.cwd(), "data")
  fs.mkdirSync(dir, { recursive: true })
  return path.join(dir, "site.db")
}

const SCHEMA = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS settings (
  key   TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS admins (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  username      TEXT    NOT NULL UNIQUE,
  password_hash TEXT    NOT NULL,
  created_at    TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
  token     TEXT PRIMARY KEY,
  admin_id  INTEGER NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  expires_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  body       TEXT NOT NULL,
  excerpt    TEXT,
  category   TEXT,
  published  INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS projects (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL,
  slug       TEXT NOT NULL UNIQUE,
  description TEXT,
  body       TEXT,
  url        TEXT,
  repo       TEXT,
  tech       TEXT,
  image      TEXT,
  published  INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published, created_at DESC);
`

let _db: Database.Database | null = null

export function getDb(): Database.Database {
  if (_db) return _db
  const db = new Database(resolveDbPath())
  db.pragma("journal_mode = WAL")
  db.exec(SCHEMA)
  _db = db
  return db
}

/** Run inside a transaction. Rolls back on thrown error. */
export function withTransaction<T>(fn: (db: Database.Database) => T): T {
  const db = getDb()
  const transaction = db.transaction((inner: Database.Database) => fn(inner))
  return transaction(db)
}
