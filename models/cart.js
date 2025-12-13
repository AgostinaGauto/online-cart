const sequelize = require('sequelize');
const db = require('../database/mysql-connection');
const User = require('../models/user');

const cart = db.sequelize_connection.define('cart', {
    cart_id: {
        type: sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true

    },

    date: {
        type: sequelize.DATEONLY,
        allowNull: false
    },

    state: {
        type: sequelize.STRING(100),
        allowNull: false
    },

    user_id: {
        type: sequelize.INTEGER,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    }

});

cart.belongsTo(User, {
    foreignKey: 'user_id',
    as: 'user_relation'

});

module.exports = cart;