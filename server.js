const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;
const DB_FILE = "./links.json";

app.use(express.json());
app.use(express.static(__dirname));

function loadDB() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}
function saveDB(db) {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

app.post("/add-category", (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "name required" });
  const db = loadDB();
  if (db.categories.find(c => c.name === name))
    return res.status(400).json({ error: "exists" });
  db.categories.push({ name, links: [] });
  saveDB(db);
  res.json({ ok: true });
});

app.post("/add-link", (req, res) => {
  const { category, title, url } = req.body;
  if (!category || !url) return res.status(400).json({ error: "missing" });
  const db = loadDB();
  const cat = db.categories.find(c => c.name === category);
  if (!cat) return res.status(404).json({ error: "no category" });
  cat.links.push({ title, url });
  saveDB(db);
  res.json({ ok: true });
});

app.listen(PORT, () => console.log("Admin server on http://localhost:" + PORT));
