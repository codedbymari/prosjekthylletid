<<<<<<< HEAD
/*const express = require("express");
=======
require("dotenv").config();
const express = require("express");
>>>>>>> bf0852aa5b98c85e3e243f903c86700551d1ae0a
const sqlite3 = require("better-sqlite3");
const cors = require("cors");

const app = express();
<<<<<<< HEAD
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
=======
const port = process.env.PORT || 5000;

app.use(cors()); //gjør det mulig å ta imot førespørsler fra frontend
app.use(express.json());

//åpner tilkoblingen SQLite-databasen
let db;
try {
    //åpner en tilkobling
    db = new sqlite3("database.db");
    //hvis vellykket:
    console.log("Du er tilkoblet databasen");
} catch (err) {
    //hvis ikke:
    console.error("Kunne ikke koble til database:", err.message);
    process.exit(1);
}

//funksjon for å hente reserveringer
function hentReservasjoner(callback){
    const sql= "SELECT * FROM reservasjoner";
    db.all(sql, [], callback);
}

//funksjon for å hente lånere
function hentLånere(callback){
    const sql= "SELECT * FROM lånere";
    db.all(sql, [], callback);
}


// Route for å hente reservasjoner
app.get("/reservasjoner", (req, res) => {
    hentReservasjoner((err, rows) => {
    if (err) {
            return res.status(500).json({ error: err.message });
>>>>>>> bf0852aa5b98c85e3e243f903c86700551d1ae0a
        }
        res.json(rows);
    });
});

<<<<<<< HEAD
app.listen(PORT, () => console.log(`🚀 Server kjører på http://localhost:${PORT}`));
=======
// API-endepunkt for å hente lånere
app.get("/lånere", (req, res) => {
    hentLånere((err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});


// Start serveren
app.listen(PORT, () => {
    console.log(`Server kjører på http://localhost:${PORT}`);
});


>>>>>>> bf0852aa5b98c85e3e243f903c86700551d1ae0a
