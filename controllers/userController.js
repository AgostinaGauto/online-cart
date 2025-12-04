const { response } = require('express');
const user = require('../models/user');
const { validationResult } = require('express-validator');
const passport = require('passport');
// Recordar importar las asociaciones

//------------------ Controlador de renderizado ---------------------

module.exports.renderUserRegisterForm = async (request, response) =>{
    response.render('user/register');

};


//----------------- Controlador de registro ---------------------

module.exports.userRegister = async (request, response) =>{
    
    // Recolectamos todos los errores que generaron los middlewares de validacion
    // que se ejecutaron antes de este controlador.
    // Y devuelve un objeto (array) con metodos como isEmpty() y array()
    const errors = validationResult(request); 

    if(!errors.isEmpty()) { // Si hay errores se vuelve a renderizar la vista con los errores y los datos que fueron ingresados por el usuario
        return response.render('user/register', { // Utilizamos return porque detiene la ejecucion del controlador
            errors: errors.array(), // Mostramos los errores en la vista
            user: { // Mostramos los valores ingresados para que el usuario no tenga que reescribirlos
                name: request.body.name,
                email: request.body.email
            }

        });
    }

    try {

        const {name, email, password} = request.body; // Si no hay errores traemos del cuerpo de la solicitud los datos ingresados

        const user_exists = await user.findOne({where: {email}}); // Buscamos si existe un usuario con el mismo email registrado

        if(user_exists){ // Si existe un usuario con ese email 
                        // Se notifica que ya esta en uso y se redirecciona al formulario de registro
            request.flash('error_msg', 'El email ingresado ya está registrado');
            return response.redirect('/user/register');

        }

        await user.create({name, email, password}); // Sino registra el usuario, muestra un mensaje de exito
                                                    // Y redirecciona al login para iniciar sesion
        request.flash('success_msg', 'Registro exitoso');
        response.redirect('/user/login');
        
    } catch (error) { // Si en el medio surgen errores, los capturamos y se muestra un mensaje de error y el detalle
        console.log('Error al crear el usuario: ', error.message);

        if(error.parent){
            console.log('Detalle SQL:', error.parent.sqlMessage);
        }

        request.flash('error_msg', 'Ha ocurrido un error al crear el usuario');
        response.redirect('/user/register');
        
    }
};

// ------------------- Controlador de renderizado del login -----------------------

module.exports.renderUserLoginForm = async (request, response) =>{
    response.render('user/login');

};

// ------------------- Controlador del login ---------------------

// Este controlador procesa el login cuando el usuario envia el formulario de inicio de sesion
// Le dice a passport: 'Autentica este usuario utilizando la estrategia local(email + contraseña)'
// Y segun el resultado redirecciona a distintos lugares.
// Este controlador no evalua nada por si solo. Le deja todo el trabajo a passport.

module.exports.loginUser = (request, response, next) =>{

    passport.authenticate('local', {
        successRedirect: '/home', // Donde redirecciona si el registro es exitoso
        failureRedirect: '/user/login', // Donde redirecciona si el registro falla
        failureFlash: true // Mensaje de error en caso de que no se pueda autenticar

    })(request, response, next);
};

// ------------------- Controlador de cierre de sesion -----------------
// request: datos de la peticion. response: para enviar respuestas o redireccionar. next: envia errores a express
// 

module.exports.logoutUser = (request, response, next) =>{

    request.logout(error =>{ // request.logout() es una funcion propia de passport. Elimina la sesion del usuario.
        if(error) return next(error); // Si hay errores los pasa al middleware de errores y detiene el proceso
        request.flash('success_msg', 'Sesion cerrada correctamente'); // Si todo salio bien muestra un mensaje flash
        response.redirect('/user/logout'); // Una vez cerrada la sesion, redirecciona al formulario de inicio de sesion nuevamente

    });

};










