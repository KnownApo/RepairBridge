import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";

const dataDir = path.resolve("./data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "repairbridge.db");
const db = new Database(dbPath);

db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS shops (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_user_id TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (owner_user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS vin_lookups (
    id TEXT PRIMARY KEY,
    vin TEXT NOT NULL,
    source TEXT NOT NULL,
    payload_json TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS reports (
    id TEXT PRIMARY KEY,
    vin_lookup_id TEXT,
    summary TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (vin_lookup_id) REFERENCES vin_lookups(id)
  );

  CREATE TABLE IF NOT EXISTS compliance_status (
    id TEXT PRIMARY KEY,
    rate TEXT,
    last_audit TEXT,
    open_findings INTEGER,
    next_review TEXT,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS compliance_reports (
    id TEXT PRIMARY KEY,
    status TEXT,
    summary TEXT,
    payload_json TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS labor_estimates (
    id TEXT PRIMARY KEY,
    cache_key TEXT NOT NULL,
    vin TEXT,
    procedure TEXT,
    region TEXT,
    payload_json TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

export default db;
