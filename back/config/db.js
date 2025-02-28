const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('todo_db', 'root', '', {
  host: '127.0.0.1',
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log("Connexion réussie à la base de données"))
  .catch(err => console.error("Erreur de connexion :", err));

module.exports = sequelize;
