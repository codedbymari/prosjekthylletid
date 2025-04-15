//Koden importerer SQL-kommandoer fra filer for å opprette tabeller og sette inn data i SQLite-databasen
const fs = require("fs");
const sqlite3 = require("better-sqlite3");

// Åpner databasen
const db = new sqlite3("database.db");

try {
  // Leser inn SQL-filene for lånere og reservasjoner
  const lånerSQL = fs.readFileSync("låner.sql", "utf8");
  const reservasjonSQL = fs.readFileSync("Reservasjon.sql", "utf8");

  // Kjører SQL-kommandoene for å opprette tabellene og sette inn data
  db.exec(lånerSQL);  // Setter inn data for lånere
  db.exec(reservasjonSQL);  // Setter inn data for reservasjoner

  console.log("Data er importert til databasen.");
} catch (err) {
  // Håndterer feil som kan oppstå under importen
  console.error("Noe gikk galt:", err.message);
}
