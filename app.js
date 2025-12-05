const express = require('express'); // Importamos express, que es el framework para crear el servidor
const session = require('express-session'); // Sirve para manejar sesiones (Guardar datos temporales del usuario)
const flash = require('connect-flash'); // Permite enviar mensajes temporales entre vistas
require('dotenv').config(); // Carga las variables del archivo .env
const { create } = require('express-handlebars'); // Importa la función para crear un motor de plantillas Handlebars
const { extname } = require('path'); // Importa una utilidad para manejar extensiones de archivos
require('./database/mysql-connection'); // Importamos la conexión a la BD
const path = require('path');
const methodOverride = require('method-override');
const passport = require('passport');
require('./config/passport')(passport);
const { ensure_database, sequelize_connection } = require('./database/mysql-connection');

///////////////////// ROUTERS ////////////////////////////
const homeRoutes = require('./routes/homeRoutes');
const user_router = require('./routes/userRoutes');
const category_router = require('./routes/categoryRoutes');

/////////////////////////////////////////////////////////

const app = express();

///////////////////// CONFIGURACION HANDDLEBARS ///////////////////////

const hbs = create({
  extname: '.hbs',
  defaultLayout: 'main', // Plantilla base
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir: path.join(__dirname, 'views/partials'),

  helpers: {
    eq: function (a, b) {
      return a === b;
    }
  }
});

app.engine(".hbs", hbs.engine); 
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, 'views')); // Ruta de las vistas


/////////////////// MIDDLEWARES ///////////////////////

app.use(express.urlencoded({ extended: true })); // permite que express lea datos enviados desde un formulario html
app.use(express.json()); //permite leer json
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'assets'))); // permite usar archivos estaticos (imagenes, css, pdfs, etc)

///////////////// SESION /////////////////


app.use(session({ // activa el sistema de sesiones en express
  secret: process.env.SESSION_SECRET || 'secret-key-onlineCart', // clave para firmar la cookie
  resave: false, // no guardar si nada cambio
  saveUninitialized: false // no guardar sesiones vacias
}));

app.use(flash());
app.use(passport.initialize()); // inicializa passport en la app
app.use(passport.session()); // permite que passport use las sesiones para recordar que usuario esta logueado


// Este middleware pasa usuario y mensajes a la vista
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg'); 
  res.locals.error_msg = req.flash('error_msg'); 
  res.locals.error = req.flash('error'); 
  res.locals.user = req.user || null; 
  next();
});

//////////////////// RUTAS /////////////////////////
app.use('/', homeRoutes); // ruta de home
app.use('/user', user_router); // /user/register, /user/login, etc.
app.use('/category', category_router); // /category/create, /category/list


app.get('/', (req, res) => {
  res.redirect('/user/login');
});



//////////////////// INICIAR SERVIDOR /////////////////////////

const port = process.env.PORT || 3005;


////////////////// CREACION Y CONEXION A LA BD //////////////////
(async () => {
    try {
        await ensure_database();  
        await sequelize_connection.authenticate();
        console.log("Base creada y conexión establecida");

        await sequelize_connection.sync();  // 👈 CREA LAS TABLAS SI NO EXISTEN
        console.log("Tablas sincronizadas");

        app.listen(port, () => {
            console.log(`Servidor corriendo en el puerto: ${port}`);
        });

    } catch (error) {
        console.error("Error al conectar:", error);
    }
})();
