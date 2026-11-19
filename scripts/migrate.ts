// Ensures the SQLite schema exists. Idempotent — safe to run any time.
import { getDb } from "../lib/db"

const db = getDb()
console.log("Database at:", (db as any).open?.databaseFilename ?? process.env.DATABASE_FILE ?? "data/site.db")
console.log("Schema OK")
