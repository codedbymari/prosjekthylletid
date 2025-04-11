require("dotenv").config();
const express = require("express");
const sqlite3 = require("better-sqlite3");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors()); //gjør det mulig å ta imot førespørsler fra frontend
app.use(express.json());

//åpner tilkoblingen SQLite-databasen
const db = new sqlite3("database.db");
//feilhåndtering
if(err){
    console.error("Kunne ikke koble til database", err.message);
    process.exit(1);
} else{
    console.log("Du er tilkoblen til Databasen"); 
}
});

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


