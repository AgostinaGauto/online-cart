const localStrategy = require('passport-local').Strategy // Estrategia local que permite validar usuarios con email y contraseña
const bcrypt = require('bcryptjs'); // Sirve para comparar contraseñas encriptadas
const User = require('../models/user'); // Modelo de la base de datos donde se encuentran los usuarios
const passport = require('passport');


// Estrategia local mediante email y contraseña
module.exports = function(passport) {

    passport.use(
        new localStrategy(
            { usernameField: 'email' },
            async (email, password, done) =>{
                try {

                    const user = await User.findOne({ where: { email } });

                    if(!user){
                        return done(null, false, { message: 'Email no registrado'} );
                    }

                    const validPassword = await bcrypt.compare(password, user.password);

                    if(!validPassword){
                        return done(null, false, {message: 'Contraseña incorrecta'});

                    }

                    return done(null, user);
                    
                } catch (error) {
                    return done(error);
                    
                }
            }
        )
    )
};


// Guardar usuario en sesion

passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

// Recuperar usuario de sesion

passport.deserializeUser(async (user_id, done) =>{
    try {
        const user = await User.findByPk(user_id);
        done(null, user);

    } catch (error) {
        done(error);
        
    }
});