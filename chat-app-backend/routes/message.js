// This handles the SQLite operations for messages
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const router = express.Router();

// Connect to SQLite database
const db = new sqlite3.Database("./db/chat.db", (err) => {
  if (err) {
    console.error("Error connecting to SQLite:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create table if it doesn't exist
db.run(
  `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        content TEXT NOT NULL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
);

// Fetch all messages
router.get("/", (req, res) => {
  db.all("SELECT * FROM messages ORDER BY timestamp ASC", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Add a new message
router.post("/", (req, res) => {
  const { username, content } = req.body;
  if (!username || !content) {
    return res
      .status(400)
      .json({ error: "Username and content are required." });
  }
  const sql = "INSERT INTO messages (username, content) VALUES (?, ?)";
  db.run(sql, [username, content], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({
        id: this.lastID,
        username,
        content,
        timestamp: new Date().toISOString(),
      });
    }
  });
});

// Delete all messages (optional for clearing history)
router.delete("/", (req, res) => {
  db.run("DELETE FROM messages", (err) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json({ message: "All messages deleted." });
    }
  });
});

module.exports = router;
