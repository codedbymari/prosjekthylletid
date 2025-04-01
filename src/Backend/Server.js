const express = require("express");
const sqlite3 = require("better-sqlite3");
const cors = require("cors");

const app = express();
const port = 3000;

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
});
