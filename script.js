const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./database.db");

// Skapa tabell
db.run(`
CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    amount REAL,
    category TEXT,
    date TEXT
)
`);

// Hämta alla transaktioner
app.get("/transactions", (req, res) => {
    db.all("SELECT * FROM transactions", [], (err, rows) => {
        res.json(rows);
    });
});

// Lägg till transaktion
app.post("/transactions", (req, res) => {
    const { type, amount, category } = req.body;

    db.run(
        "INSERT INTO transactions (type, amount, category, date) VALUES (?, ?, ?, datetime('now'))",
        [type, amount, category],
        function (err) {
            res.json({ id: this.lastID });
        }
    );
});

app.listen(3000, () => console.log("Server running on port 3000"));