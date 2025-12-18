const sequelize = require('sequelize');
const db = require('../database/mysql-connection');
const cart = require('./cart');
const product = require('./product');


const cart_items = db.sequelize_connection.define('cart_items', {

    cart_item_id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
        
    },

    amount: {
        type: sequelize.INTEGER,
        allowNull: false
        
    },

    price: {
        type: sequelize.INTEGER,
        allowNull: false
        
    },

    cart_id: {
        type: sequelize.INTEGER,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    },

    product_id: {
        type: sequelize.INTEGER,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    }
});


cart_items.belongsTo(cart, {
    foreignKey: 'cart_id',
    as: 'cart_relation'

});

cart_items.belongsTo(product, {
    foreignKey: 'product_id',
    as: 'product_relation'

});

module.exports = cart_items;

