const express = require("express");
const Task = require("../models/Task");

const router = express.Router();

// ➜ Créer une tâche
router.post("/", async (req, res) => {
    try {
        const task = await Task.create(req.body);
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ➜ Récupérer toutes les tâches
router.get("/", async (req, res) => {
    const tasks = await Task.findAll();
    res.json(tasks);
});

// ➜ Mettre à jour une tâche
router.put("/:id", async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ error: "Tâche non trouvée" });

        await task.update(req.body);
        res.json(task);
    }  
    catch (err) {
        res.status(400).json({ error: err.message }); 
    }
});

// ➜ Supprimer une tâche
router.delete("/:id", async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);
        if (!task) return res.status(404).json({ error: "Tâche non trouvée" });

        await task.destroy();
        res.json({ message: "Tâche supprimée" });
    } catch (err) {
        res.status(400).json({ error: err.message }); // ✅ Gestion des erreurs
    }
});

module.exports = router;
