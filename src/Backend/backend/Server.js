/*const express = require("express");
const sqlite3 = require("better-sqlite3");
const cors = require("cors");

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const db = new sqlite3("database.db");

// Route for å hente reservasjoner
app.get("/reservasjoner", (req, res) => {
    const stmt = db.prepare("SELECT * FROM reservasjoner");
    const reservasjoner = stmt.all();
    res.json(reservasjoner);
});

app.listen(port, () => {
    console.log(`Serveren kjører på http://localhost:${port}`);
});*/

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors()); // Tillater forespørsler fra frontend
app.use(express.json());

const db = new sqlite3.Database("./reservasjon.db", sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    console.log("✅ Tilkoblet SQLite-database.");
});

// API-endepunkt for å hente reservasjoner
app.get("/reservasjoner", (req, res) => {
    db.all("SELECT * FROM reservasjoner", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.listen(PORT, () => console.log(`🚀 Server kjører på http://localhost:${PORT}`));
