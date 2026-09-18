
// ==========================================================
// BAYONE SOLUTIONS
// SQLITE DATABASE
// ==========================================================

const Database = require("better-sqlite3");
const path = require("path");


// ==========================================================
// DATABASE PATH
// ==========================================================

const databasePath =
    path.join(
        __dirname,
        "bayone.db"
    );


// ==========================================================
// DATABASE CONNECTION
// ==========================================================

const db =
    new Database(databasePath);


// ==========================================================
// DATABASE SETTINGS
// ==========================================================

db.pragma("journal_mode = WAL");


// ==========================================================
// CREATE VISITORS TABLE
// ==========================================================

db.exec(`

    CREATE TABLE IF NOT EXISTS visitors (

        id INTEGER PRIMARY KEY AUTOINCREMENT,

        first_name TEXT NOT NULL,

        last_name TEXT NOT NULL,

        email TEXT NOT NULL,

        phone TEXT NOT NULL,

        country_code TEXT,

        phone_full TEXT,

        company_name TEXT NOT NULL,

        designation TEXT,

        consent INTEGER NOT NULL DEFAULT 1,

        created_at DATETIME DEFAULT CURRENT_TIMESTAMP

    )

`);


// ==========================================================
// DATABASE READY
// ==========================================================

console.log(
    "SQLite database connected successfully."
);

console.log(
    `Database: ${databasePath}`
);


// ==========================================================
// EXPORT
// ==========================================================

module.exports = db;