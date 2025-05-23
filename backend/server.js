const express = require('express');
const cors = require('cors');
const db = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/tasks', (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/tasks', (req, res) => {
  const { content } = req.body;
  db.run("INSERT INTO tasks (content) VALUES (?)", [content], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, content });
  });
});

app.put('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  db.run("UPDATE tasks SET content = ? WHERE id = ?", [content, id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id, content });
  });
});

app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM tasks WHERE id = ?", id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id });
  });
});

app.listen(3000, () => {
  console.log('Backend corriendo en http://localhost:3000');
});
