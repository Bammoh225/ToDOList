const newTaskInput = document.querySelector("#new-tache input");
const tasksDiv = document.querySelector("#tache");
let updateNote = "";


// Fonction générique pour les appels API
const apiRequest = async (url, method = 'GET', body = null) => {
    try {
        const options = { method, headers: { 'Content-Type': 'application/json' } };
        if (body) options.body = JSON.stringify(body);
        const response = await fetch(url, options);
        return response.ok ? await response.json() : Promise.reject(`Erreur ${response.status}`);
    } catch (err) {
        console.error("Erreur API:", err);
        alert("Une erreur est survenue. Veuillez réessayer.");
    }
};

// Charger les tâches au démarrage
window.onload = () => fetchTasks();

const fetchTasks = async () => {
    const tasks = await apiRequest('/api/tasks');
    if (tasks) displayTasks(tasks);
};

const displayTasks = (tasks) => {
    tasksDiv.innerHTML = "";
    tasksDiv.style.display = tasks.length > 0 ? "inline-block" : "none";

    tasks.forEach(task => {
        const taskInnerDiv = document.createElement("div");
        taskInnerDiv.classList.add("tache");
        taskInnerDiv.id = task.id;
        taskInnerDiv.innerHTML = `
            <span id="taskname">${task.title}</span>
            <button class="modif"><i class="fa-solid fa-pen-to-square"></i></button>
            <button class="supp"><i class="fa-solid fa-trash"></i></button>
        `;
        if (task.completed) {
            taskInnerDiv.classList.add("terminé");
            taskInnerDiv.querySelector(".modif").style.visibility = "hidden";
        }

        // Gestion des événements
        taskInnerDiv.onclick = () => toggleTaskCompletion(task.id, task.title, !task.completed);
        taskInnerDiv.querySelector(".modif").onclick = (e) => editTask(e, task.id, task.title);
        taskInnerDiv.querySelector(".supp").onclick = (e) => deleteTask(e, task.id);

        tasksDiv.appendChild(taskInnerDiv);
    });
};

// Ajouter une tâche
document.querySelector("#push").addEventListener("click", async () => {
    if (!newTaskInput.value.trim()) {
        alert("Veuillez entrer une tâche.");
        return;
    }

    const newTask = await apiRequest('/api/tasks', 'POST', { title: newTaskInput.value, completed: false });
    if (newTask) {
        fetchTasks();
        newTaskInput.value = "";
    }
});

// Modifier une tâche
const editTask = async (e, taskId, taskTitle) => {
    e.stopPropagation();

    // Récupérer le nouvel intitulé depuis l'input
    const newTitle = prompt("Modifier la tâche :", taskTitle);
    if (!newTitle || newTitle.trim() === "") return; // Vérifie que le titre n'est pas vide

    try {
        const updatedTask = await apiRequest(`/api/tasks/${taskId}`, 'PUT', { title: newTitle });

        if (updatedTask) {
            document.querySelector(`#${taskId} .task-title`).textContent = updatedTask.title;
            alert("Tâche mise à jour avec succès !");
        }
    } catch (err) {
        console.error("Erreur de mise à jour :", err);
    }
};



// Marquer une tâche comme terminée ou non
const toggleTaskCompletion = async (taskId, taskTitle, completed) => {
    const updatedTask = await apiRequest(`/api/tasks/${taskId}`, 'PUT', { title: taskTitle, completed });
    if (updatedTask) fetchTasks();
};

// Supprimer une tâche avec confirmation
const deleteTask = async (e, taskId) => {
    e.stopPropagation();
    if (confirm("Voulez-vous vraiment supprimer cette tâche ?")) {
        const deleted = await apiRequest(`/api/tasks/${taskId}`, 'DELETE');
        if (deleted) fetchTasks();
    }
};
