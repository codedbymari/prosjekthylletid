const express = require('express');
const cors = require('cors');
const app = express(); 
const sqlite3 = require('sqlite3').verbose();
const path = require('path');



app.use(cors()); 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

//åpner tilkoblingen SQLite-databasen
let db;
try {
    //åpner en tilkobling
    db = new sqlite3.Database("database.db");
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


// API-endepunkt for å hente reservasjoner
app.get('/reservasjoner', (req, res) => {
    const query = 'SELECT * FROM reservasjoner';  // Henter alle reserveringer

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).send('En feil oppstod ved henting av data.');
        }
        res.json(rows); // Sender hele resultatet som JSON
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

const port= 5000;
// Start serveren
app.listen(port, () => {
    console.log(`Server kjører på http://localhost:${port}`);
});




