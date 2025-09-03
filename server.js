const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();

const db = new sqlite3.Database('guestbook.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS entries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        message TEXT NOT NULL,
        date DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});

app.use(express.static('.'));
app.use(express.json());

// API to get entries
app.get('/api/entries', (req, res) => {
    db.all('SELECT * FROM entries ORDER BY date DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API to add entry
app.post('/api/entries', (req, res) => {
    const { name, message } = req.body;
    if (!name || !message) return res.status(400).json({ error: 'Missing fields' });
    db.run(
        'INSERT INTO entries (name, message) VALUES (?, ?)',
        [name, message],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ id: this.lastID, name, message, date: new Date().toISOString() });
        }
    );
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
