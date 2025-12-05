const sequelize = require('sequelize'); // importa el ORM
const db = require('../database/mysql-connection'); // importa la BD

// definicion del modelo
const category = db.sequelize_connection.define('category',
    {
        category_id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: sequelize.STRING(100)
        }
    }
);

module.exports =  category;