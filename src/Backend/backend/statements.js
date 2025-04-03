const db = require('better-sqlite3')('database.db')

const createTable = () => {
    const sql = `
        CREATE TABLE bøker(
            ISBN INTEGER PRIMARY KEY,
            Navn TEXT NOT NULL,
            Alder INEGER   
        )
    `
    db.prepare(sql).run()
}

createTable