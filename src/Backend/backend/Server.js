const express = require('express');
const cors = require('cors');
const app = express(); 
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

app.use(cors()); 
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Koble til databasen
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error("Kunne ikke koble til database:", err.message);
    } else {
        console.log("Du er tilkoblet databasen");

        db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
            if (err) {
              console.error("Feil ved henting av tabeller:", err.message);
            } else {
              console.log("Tabeller i databasen:");
              rows.forEach((row) => console.log(row.name));
            }
          });
          

        // Sjekk at tabellen 'reservasjoner' finnes
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='reservasjoner'", (err, row) => {
            if (err) {
                console.error("Feil ved sjekk av tabell 'reservasjoner':", err.message);
            } else if (!row) {
                console.warn("Tabellen 'reservasjoner' finnes ikke!");
            } else {
                console.log("Tabellen 'reservasjoner' finnes");
            }
        });

        // Sjekk at tabellen 'låner' finnes
        db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='låner'", (err, row) => {
            if (err) {
                console.error("Feil ved sjekk av tabell 'låner':", err.message);
            } else if (!row) {
                console.warn("Tabellen 'låner' finnes ikke!");
            } else {
                console.log("Tabellen 'låner' finnes");
            }
        });
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

// API-endepunlt for statistikk over antall reservasjoner per låner
app.get('/statistikk', (req, res) => {
    const query = `
        SELECT låner.lånernummer, låner.fornavn, låner.etternavn, COUNT(*) AS antall_reservasjoner
        FROM reservasjoner
        JOIN låner ON reservasjoner.lånernummer = låner.lånernummer
        GROUP BY låner.lånernummer;
    `;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error("Feil ved henting av statistikk:", err);
            return res.status(500).send('En feil oppstod ved henting av statistikk.');
        }
        res.json(rows);
    });
});


const port= 5000;
// Start serveren
app.listen(port, () => {
    console.log(`Server kjører på http://localhost:${port}`);
});
