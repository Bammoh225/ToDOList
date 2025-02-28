const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

const sequelize = require("./config/db");

sequelize.sync()
  .then(() => console.log("Base de données synchronisée"))
  .catch(err => console.error("Erreur lors de la synchronisation :", err));

const taskRoutes = require("./routes/taskRoutes");
app.use(express.json());
app.use("/api/tasks", taskRoutes);

// Serve frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Route pour servir "index.html" pour toutes les requêtes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});
app.put('/api/tasks/:id', async (req, res) => {
  try {
      const { title, completed } = req.body;
      const result = await db.run("UPDATE tasks SET title = ?, completed = ? WHERE id = ?", 
          [title, completed ? 1 : 0, req.params.id]);
      res.json({ updated: result.changes });
  } catch (err) { 
      res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`le serveur est démarré sur le localhost:${port}`);
});
