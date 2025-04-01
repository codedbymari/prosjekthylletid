CREATE TABLE bøker(
    ISBN INTEGER PRIMARY KEY,
    Navn TEXT NOT NULL,
    Alder INEGER   
)

INSERT INTO bøker (ISBN, Navn, Alder)
VALUES
    (3245, "David", 34),
    (54365, "Lars", 35)