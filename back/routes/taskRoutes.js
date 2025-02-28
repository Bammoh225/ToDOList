const express = require('express');
const router = express.Router();
const Task = require('../models/tasks');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new task
router.post('/', async (req, res) => {
  try {
    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a task
router.put('/:id', async (req, res) => {
  try {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) {
      return res.status(400).json({ error: 'ID invalide' });
    }

    // Mise à jour de la tâche avec Sequelize
    const [updatedRows] = await Task.update(
      { 
        title: req.body.title, 
        completed: req.body.completed,
        updatedAt: new Date() // ✅ Met à jour la date
      }, 
      { where: { id: taskId } }
    );

    if (updatedRows === 0) {
      return res.status(404).json({ error: 'Tâche non trouvée' });
    }

    // Récupérer la tâche mise à jour
    const updatedTask = await Task.findByPk(taskId);
    res.json(updatedTask); // ✅ Retourne bien la tâche modifiée
  } catch (err) {
    console.error("Erreur mise à jour :", err);
    res.status(500).json({ error: err.message });
  }
});




// Delete a task
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task) {
      await task.destroy();
      res.json({ message: 'Task deleted' });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
