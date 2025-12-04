
const mysql= require('mysql2/promise') // Importa mysql para ejecutar consultas SQL
const { Sequelize } = require('sequelize'); // Importamos sequelize necesario para realizar la conexion a la bd


// Definicion y configuracion de la BD

const sequelize_connection = new Sequelize( 'onlineCart_db', 'root', '',
    {
        host: process.env.DB_HOST,
        dialect: 'mysql',
        port: process.env.DB_PORT || 3306,
        loggins: false,
        define: {timestamps : false},
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

// Funcion que se va a asegurar que la BD existe antes de comenzar a usar el ORM (Si no existe, la crea. Ahi es cuando utiliza el ORM)

async function ensure_database(params) {
    const connection = await mysql.createConnection({host: 'localhost', user: 'root', password: ''}); // Se conecta a mysql. no a una BD
    await connection.query( // Verificamos que si no existe tal base de datos, la cree automaticamente
        'CREATE DATABASE IF NOT EXISTS onlineCart_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;' 
        
    );
    await connection.end(); // Cerramos la conexion con mysql para no dejar conexiones abiertas 
}

// exportamos la conexion al ORM y la funcion para asegurar la existencia de la BD
module.exports = {sequelize_connection, ensure_database};

