# Online Cart
OnlineCart es una aplicación web desarrollada con **NodeJs, Express y Mysql**.
El sistema permite gestionar un carrito de compras en línea, con control de acceso de usuarios y operaciones CRUD sobre categorías, productos, carritos e ítems.

# Tecnologías Utilizadas
- ** Node.js** – Entorno de ejecución
- ** Express.js** – Framework web
- ** Sequelize** – ORM
- ** MySQL / mysql2** – Base de datos relacional
- ** Passport.js** – Autenticación
- ** Bcrypt** – Encriptación de contraseñas
- ** Express-session** – Manejo de sesiones
- ** Handlebars (HBS)** – Motor de plantillas
- ** Bootstrap** – Diseño responsive
- ** Dotenv** – Variables de entorno
- ** Nodemon** – Reinicio automático del servidor durante desarrollo.

## Objetivo del Proyecto
Desarrollar una aplicación web que permita:

- Autenticación de usuarios registrados
- Gestión completa de productos y categorías
- Interacción con un catálogo online
- Manejo de carritos de compra con historial
- Control de stock y validaciones de negocio

## Entidades Clave
**User**: Registro y autenticación de clientes.
**Category**: Agrupación de productos.
**Product**: Ítems con nombre, precio, stock, stock mínimo e imagen.
**Cart**: Representa la compra (activa o confirmada).
**Cart_items**: Detalle de productos dentro de un carrito (cantidad y precio de compra).

## Funcionalidades Principales
- **Registro y Autenticación**: Inicio de sesión seguro con Passport y Bcrypt.
- **ABMC (CRUD) Completo**: Altas, bajas, modificaciones y consultas sobre Usuarios, Categorías, Productos, Carritos e Ítems del Carrito.
- **Gestión de Catálogo**: Visualización de productos disponibles con imagen, stock y precio.
- **Control de Stock en Tiempo Real**: Evita agregar al carrito cantidades mayores al stock disponible.
- **Actualización Automática de Stock**: Al agregar/eliminar ítems o confirmar la compra.
- **Validación de Datos**: Uso de express-validator para asegurar la calidad de los datos (precio > 0, stock no negativo).
- **Histórico de Compras**: Consulta de carritos confirmados por el usuario.
- **Gestión de Archivos**: Subida de imágenes de productos gestionada con Multer.
- **Seguridad**: Encriptación de contraseñas con bcrypt.
- **Autenticación y Sesiones**: Passport junto con express-session para el manejo de sesiones. La configuración actual utiliza memoria local, con posibilidad de integración futura con Redis para escalabilidad y alta disponibilidad.


