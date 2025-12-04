const sequelize = require('sequelize'); // ORM que contiene tipos de datos, funciones, operadores (permite trabajar con SQL)
const db = require('../database/mysql-connection'); // Importamos la conexion a la BD
const bcrypt = require('bcryptjs'); // bcrypt sirve para encriptar contraseñas antes de guardarlas en la BD
const passport = require('passport');


// Definicion del modelo usuario (Representa una tabla dentro de nuestra base de datos)
const user = db.sequelize_connection.define('users', 

    // Definicion de la estructura de la tabla

    {
        user_id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false

        },

        name: {
            type: sequelize.STRING(100),
            allowNull: false
        },

        email: {
            type: sequelize.STRING(100),
            allowNull: false
        },

        password: {
            type: sequelize.STRING(100),
            allowNull: false
        },  
    },

    // Los hooks son funciones que se ejecutan antes de insertar un nuevo usuario en la BD

    {
        hooks: {
            async beforeCreate(user)
            {

                const salt = await bcrypt.genSalt(10); // Creamos un salt criptografico llamando a bcrypt.genSalt. El 10 es el numero de rondas
                const hash = await bcrypt.hash(user.password, salt); // Tomamos la contraseña ingresada y la combinamos con el salt para generar un hash seguro
                user.password = hash; // Reemplazamos la contraseña original del usuario por el hash creado anteriormente

            }

        }
    }

);


// Importamos el modelo para que los controladores puedan utilizarlo
module.exports = user;

