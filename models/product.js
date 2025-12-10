const sequelize = require('sequelize');;
const db = require('../database/mysql-connection');
const category = require('../models/category');


const product = db.sequelize_connection.define('product',
    {
        product_id: {
            type: sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: sequelize.STRING(100),
            allowNull: false
        },

        price: {
            type: sequelize.FLOAT,
            allowNull: false
        },

        stock: {
            type: sequelize.INTEGER
        },

        minimum_stock: {
            type: sequelize.INTEGER,
            allowNull: false
        },

        image: {
            type: sequelize.STRING
        },

        category: { // definicion de la relacion foranea con categoria
            type: sequelize.INTEGER,
            allowNull: true,
            references: {
                model: 'categories',   // ⚠ nombre REAL de la tabla en la BD
                key: 'category_id'
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL'
        }
    }
);

// un producto pertenece a una categoria

product.belongsTo(category, {
    foreignKey: 'category',
    as: 'category_relation'

});

module.exports = product;

