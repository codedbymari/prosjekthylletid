CREATE TABLE IF NOT EXISTS lånere (
<<<<<<< HEAD
    låner_id INTEGER PRIMARY KEY AUTOINCREMENT,
    fornavn TEXT NOT NULL,
    etternavn TEXT NOT NULL,
    lånernummer TEXT NOT NULL UNIQUE,
=======
    lånernummer INTEGER PRIMARY KEY AUTOINCREMENT,
    fornavn TEXT NOT NULL,
    etternavn TEXT NOT NULL,
>>>>>>> bf0852aa5b98c85e3e243f903c86700551d1ae0a
    epost TEXT NOT NULL,
    telefonnummer TEXT,
    adresse TEXT,
    medlemskap_dato TEXT NOT NULL,
    status TEXT NOT NULL
);

-- Eksempler på innsetting av data i lånere-tabellen (dummy data)
INSERT INTO lånere (fornavn, etternavn, lånernummer, epost, telefonnummer, adresse, medlemskap_dato, status)
VALUES
    ("Maria", "Hansen", "N00123456", "maria.hansen@email.com", "12345678", "Storgata 15, 0123 Oslo", "01.01.2023", "Aktiv"),
    ("Per", "Johansen", "N00234567", "per.johansen@email.com", "23456789", "Kirkegata 22, 0456 Oslo", "15.03.2024", "Aktiv"),
    ("Lise", "Berg", "N00345678", "lise.berg@email.com", "34567890", "Torggata 5, 0567 Oslo", "10.12.2023", "Suspender"),
    ("Ole", "Larsen", "N00456789", "ole.larsen@email.com", "45678901", "Parkveien 10, 0789 Oslo", "12.02.2022", "Inaktiv"),
    ("Anna", "Nilsen", "N00567890", "anna.nilsen@email.com", "56789012", "Frognerveien 8, 0789 Oslo", "25.11.2023", "Aktiv"),
    ("Jonas", "Pettersen", "N00678901", "jonas.pettersen@email.com", "67890123", "Vestre Strøm 3, 0987 Oslo", "05.06.2022", "Aktiv"),
    ("Eva", "Olsen", "N00789012", "eva.olsen@email.com", "78901234", "Bakkegata 7, 0678 Oslo", "21.04.2023", "Inaktiv"),
    ("Thomas", "Kjeldsen", "N00890123", "thomas.kjeldsen@email.com", "89012345", "Jernbanegata 10, 0432 Oslo", "30.09.2021", "Aktiv"),
    ("Isabelle", "Lind", "N00901234", "isabelle.lind@email.com", "90123456", "Solheimgata 2, 0213 Oslo", "13.08.2023", "Suspender"),
    ("David", "Sund", "N01012345", "david.sund@email.com", "01234567", "Ekebergveien 20, 0923 Oslo", "17.07.2022", "Aktiv");
