
// esta es una funcion que sirve para proteger paginas
// solo los usuarios logueados podran acceder a ciertas rutas
// esta funcion se utilizara en las rutas de cada modelo segun sea necesario

module.exports.ensure_authenticated = (req, res, next) =>{
    if(req.isAuthenticated()){ // devuelve true o false. Evalua si el usuario esta autenticado

        return next(); // si esta autenticado, puede entrar a la pagina protegida y detiene la ejecucion
    }

// si no esta logueado, se muestra un mensaje y se redirige a la pagina del login
    req.flash('error_msg', 'Inicia sesión para acceder a esta página.'); 
    res.redirect('/user/login');
};

