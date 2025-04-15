
const express = require("express");
const sqlite3 = require("better-sqlite3");
const cors = require("cors");

const app = express();
const port = 5000;

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
        }
        res.json(rows);
    });
});

// API-endepunkt for å hente lånere
app.get("/låner", (req, res) => {
    hentLånere((err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});


// Start serveren
app.listen(port, () => {
    console.log(`Server kjører på http://localhost:${port}`);
});




