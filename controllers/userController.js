const { response } = require('express');
const user = require('../models/user');
const { validationResult } = require('express-validator');
const passport = require('passport');

// ------------------ Controlador de renderizado del REGISTRO ---------------------

module.exports.renderUserRegisterForm = async (request, response) => {
    response.render('user/register', {
        layout: 'public',       // <-- 🚨 Esto hace que NO aparezca el navbar
        titulo: "Registro"
    });
};

// ----------------- Controlador de registro ---------------------

module.exports.userRegister = async (request, response) => {

    const errors = validationResult(request); 

    if (!errors.isEmpty()) {
        return response.render('user/register', {
            layout: 'public',      // <-- 🚨 IMPORTANTE también aquí
            errors: errors.array(),
            user: {
                name: request.body.name,
                email: request.body.email
            }
        });
    }

    try {

        const { name, email, password } = request.body;

        const user_exists = await user.findOne({ where: { email } });

        if (user_exists) {
            request.flash('error_msg', 'El email ingresado ya está registrado');
            return response.redirect('/user/register');
        }

        await user.create({ name, email, password });

        request.flash('success_msg', 'Registro exitoso');
        response.redirect('/user/login');
        
    } catch (error) {
        console.log('Error al crear el usuario: ', error.message);

        if (error.parent) {
            console.log('Detalle SQL:', error.parent.sqlMessage);
        }

        request.flash('error_msg', 'Ha ocurrido un error al crear el usuario');
        response.redirect('/user/register');
    }
};

// ------------------- Controlador de renderizado del LOGIN -----------------------

module.exports.renderUserLoginForm = async (request, response) => {
    response.render('user/login', {
        layout: 'public',      // <-- 🚨 ESTO ERA LO QUE FALTABA
        titulo: "Iniciar Sesión"
    });
};

// ------------------- Controlador del login ---------------------

module.exports.loginUser = (request, response, next) => {

    passport.authenticate('local', {
        successRedirect: '/home',
        failureRedirect: '/user/login',
        failureFlash: true

    })(request, response, next);
};

// ------------------- Controlador de cierre de sesión -----------------

module.exports.logoutUser = (request, response, next) => {

    request.logout(error => {
        if (error) return next(error);
        request.flash('success_msg', 'Sesión cerrada correctamente');
        response.redirect('/user/login');   // <-- 🚨 Antes apuntaba a /user/logout (incorrecto)
    });

};










