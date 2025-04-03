CREATE TABLE IF NOT EXISTS reservasjoner (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tittel TEXT NOT NULL,
    forfatter TEXT NOT NULL,
    lånernummer TEXT NOT NULL,
    reservert_dato TEXT NOT NULL,
    klar_dato TEXT NOT NULL,
    hentet_dato TEXT,
    status TEXT NOT NULL
);


INSERT INTO reservasjoner (tittel, forfatter, lånernummer, reservert_dato, klar_dato, hentet_dato, status)
VALUES
    ("Sjøfareren", "Erika Fatland", "N00123456", "14.03.2025", "15.03.2025", "16.03.2025", "Hentet"),
    ("Lur familiemat", "Ida Gran-Jansen", "N00234567", "13.03.2025", "14.03.2025", "17.03.2025", "Hentet"),
    ("Råsterk på et år", "Jørgine Massa Vasstrand", "N00345678", "15.03.2025", "16.03.2025", "-", "Venter"),
    ("Tørt land", "Jørn Lier Horst", "N00456789", "14.03.2025", "15.03.2025", "16.03.2025", "Hentet"),
    ("Kongen av Os", "Jo Nesbø", "N00567890", "15.03.2025", "16.03.2025", "-", "Venter"),
    ("23 meter offside (Pondus)", "Frode Øverli", "N00678901", "12.03.2025", "13.03.2025", "14.03.2025", "Hentet"),
    ("Felix har følelser", "Charlotte Mjelde", "N00789012", "15.03.2025", "16.03.2025", "-", "Venter"),
    ("Skriket", "Jørn Lier Horst og Jan-Erik Fjell", "N00890123", "13.03.2025", "14.03.2025", "15.03.2025", "Hentet"),
    ("Juleroser", "Herborg Kråkevik", "N00901234", "14.03.2025", "15.03.2025", "-", "Utløpt"),
    ("Søvngjengeren", "Lars Kepler", "N00012345", "10.03.2025", "12.03.2025", "-", "Venter");

