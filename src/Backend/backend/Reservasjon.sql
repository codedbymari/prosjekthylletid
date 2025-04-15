CREATE TABLE IF NOT EXISTS reservasjoner (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tittel TEXT NOT NULL,
    forfatter TEXT NOT NULL,
    lånernummer TEXT NOT NULL,
    reservert_dato TEXT NOT NULL,
    klar_dato TEXT NOT NULL,
    hentet_dato TEXT,
    status VARCHAR(20),
    FOREIGN KEY (lånernummer) REFERENCES låner(lånernummer)
);



INSERT INTO reservasjoner (tittel, forfatter, lånernummer, reservert_dato, klar_dato, hentet_dato, status)
VALUES
    ('Sjøfareren', 'Erika Fatland', 'N00123456', '14.03.2025', '15.03.2025', '16.03.2025', 'Hentet'),
    ('Lur familiemat', 'Ida Gran-Jansen', 'N00234567', '13.03.2025', '14.03.2025', '17.03.2025', 'Hentet'),
    ('Råsterk på et år', 'Jørgine Massa Vasstrand', 'N00345678', '15.03.2025', '16.03.2025', NULL, 'Venter'),
    ('Tørt land', 'Jørn Lier Horst', 'N00456789', '14.03.2025', '15.03.2025', '16.03.2025', 'Hentet'),
    ('Kongen av Os', 'Jo Nesbø', 'N00567890', '15.03.2025', '16.03.2025', NULL, 'Venter'),
    ('23 meter offside (Pondus)', 'Frode Øverli', 'N00678901', '12.03.2025', '13.03.2025', '14.03.2025', 'Hentet'),
    ('Felix har følelser', 'Charlotte Mjelde', 'N00789012', '15.03.2025', '16.03.2025', NULL, 'Venter'),
    ('Skriket', 'Jørn Lier Horst og Jan-Erik Fjell', 'N00890123', '13.03.2025', '14.03.2025', '15.03.2025', 'Hentet'),
    ('Juleroser', 'Herborg Kråkevik', 'N00901234', '14.03.2025', '15.03.2025', NULL, 'Utløpt'),
    ('Søvngjengeren', 'Lars Kepler', 'N00012345', '10.03.2025', '12.03.2025', NULL, 'Venter'),
    ('En uvanlig venn', 'Hilde Hagerup', 'N00111223', '01.04.2025', '03.04.2025', NULL, 'Venter'),
    ('Når katten er borte', 'Maja Lunde', 'N00222334', '02.04.2025', '04.04.2025', '06.04.2025', 'Hentet'),
    ('På vei til en ny verden', 'Kari S. Krøyer', 'N00333445', '03.04.2025', '05.04.2025', NULL, 'Venter'),
    ('Sol over Bergen', 'Jan Mehlum', 'N00444556', '04.04.2025', '06.04.2025', '07.04.2025', 'Hentet'),
    ('Skattejakten', 'Bjørn L. Fredriksen', 'N00555667', '05.04.2025', '07.04.2025', NULL, 'Venter'),
    ('Livet på skjerm', 'Ingrid B. Wahl', 'N00666778', '06.04.2025', '08.04.2025', NULL, 'Venter'),
    ('Det forbudte rommet', 'Siv L. Guldal', 'N00777889', '07.04.2025', '09.04.2025', '10.04.2025', 'Hentet'),
    ('I skyggen av elgen', 'Ellen R. Fredriksen', 'N00888990', '08.04.2025', '10.04.2025', NULL, 'Venter'),
    ('Under stjernene', 'Nils A. Lofthus', 'N00999001', '09.04.2025', '11.04.2025', NULL, 'Venter');
    



