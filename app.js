const express = require('express'); // Importamos express, que es el framework para crear el servidor
const session = require('express-session'); // Sirve para manejar sesiones (Guardar datos temporales del usuario)
const flash = require('connect-flash'); // Permite enviar mensajes temporales entre vistas
require('dotenv').config(); // Carga las variables del archivo .env
const {create} = require('express-handlebars'); // Importa la función para crear un motor de plantillas Handlebars
const { extname } = require('path'); // Importa una utilidad para manejar extensiones de archivos

///////////////////// CONFIGURACION HANDDLEBARS ///////////////////////


const hbs = create({ // Definimos la extension de nuestra plantilla
  extname: '.hbs',
  defaultLayout: 'main', // Indicamos cual es el layout principal (Plantilla base de toda la pagina)
  layoutsDir: path.join(__dirname, 'views/layouts'), // Define la carpeta donde están los layouts. 
  partialsDir: path.join(__dirname, 'views/partials'), // Define la carpeta donde están los componentes reutilizables (header, footer, navbar, etc).
  
  // Los helpers son funciones que se pueden usar dentro de las plantillas
  // eq sirve para comparar valores dentro de una vista
  helpers: {eq: function (a, b){
        return a === b}

    }

});


app.engine(".hbs", hbs.engine); // Le decimos a express que use handdlebars para los archivos .hbs
app.set("view engine", ".hbs"); // Definimos que el motor de plantillas sera handdlebars
app.set("views", "/views"); // Indicamos donde estan las vistas


/////////////////// MIDDLEWARES ///////////////////////

// Los middlewares son funciones que procesan la request antes de llegar a las rutas

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'assets')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'secret-key-sgcb',
  resave: false,
  saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg'); // Mensaje de exito
  res.locals.error_msg = req.flash('error_msg'); // Mensaje de error
  res.locals.error = req.flash('error'); // Errores de passport
  res.locals.user = req.user || null; // Datos del usuario autenticado
  next();
});

//////////////////// MENSAJE /////////////////////////

app.listen(process.env.PORT, () => {
    console.log("Servidor corriendo en el puerto: " + process.env.PORT);

});

///////////////////////  HASTA ACA LO MINIMO QUE SE NECESITA PARA TODO PROGRAMA ////////////////////




