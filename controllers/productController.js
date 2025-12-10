const product = require('../models/product');
const { validationResult } = require('express-validator');
const category = require('../models/category');
const { request } = require('express');

// ------------------- Controlador de renderizado --------------------

module.exports.renderProductForm = async (request, response) => {
    try {
        const categories = await category.findAll({ // buscamos todas las categorias en la tabla categori
            order: [['name', 'ASC']], // ordenamos las categorias por nombre y de forma ascendente
            raw: true // indicamos que se devuelvan los datos como objetos plano (JSON)

        });

        response.render('product/create', { categories }); // renderizamos la vista y le pasamos el registro de categorias
    } catch (error) {
        console.error('Error al cargar categorias', error.message);
        request.flash('error_msg', 'No se pudieron cargar las categorias');
        response.redirect('/');

    }
};

// -------------------- Controlador de registro ----------------------

module.exports.createProduct = async (request, response) => {

    const errors = validationResult(request); // obtenemos todo los errores que se hayan generado al ingreasar los datos al formulario

    if (!errors.isEmpty()) { // si hubo errores, los mostramos en la vista. 
        return response.render('product/create', {
            errors: errors.array(), // mostramos los errores
            product: { // y  mostramos los datos ingresados por el usuario para que no tenga que reescribirlos
                name: request.body.name,
                price: request.body.price,
                stock: request.body.stock,
                minimum_stock: request.body.minimum_stock,
                category: request.body.category

            }
        });
    }
    
    // en caso de que no hubo errores se hace lo siguiente:

    const { name, price, stock, minimum_stock, category } = request.body; // obtenemos los datos ingresados desde el cuerpo de la solicitud

    const category_int = request.body.category ? parseInt(request.body.category) : null; // pasamos de string a int la categoria

    const image = request.file ? request.file.filename : null; // procesamos la imagen subida con multer

    await product.create({ name, price, stock, minimum_stock, category: category_int, image }); // creamos un producto en la tabla productos generando una consulta SQL

    request.flash('succes_msg', 'El producto se creo con exito');
    response.redirect('/product/list');
};


// --------------------- Controlador de listado ---------------------

module.exports.listProducts = async(request, response) =>{
    try {
        const products = await product.findAll({raw:true}); // obtenemos todos los registros de productos de nuestra tabla
        response.render('product/list', {products:products}); // renderizamos y se los pasamos a la vista
    } catch (error) {
        console.log('Error al listar los productos', error.message);
        request.flash('error_msg', 'Ocurrio un error al listar los productos');
        response.redirect('/home');
        
    }
};


// -------------------- Controlador de modificacion -------------------

module.exports.renderEditForm = async(request, response) =>{
    try {
        const product_id = request.params.product_id; // obtenemos el id del producto desde los parametro de la solicitud
        const product_data = await product.findByPk(product_id, {raw:true}); // buscamos un producto que coincida con ese id en nuestra tabla de productos

        if(!product_data){ // si no existe un producto con dicho id
            request.flash('error_msg', 'No se ha encontrado el registro'); // se notifica
            return response.redirect('/product/list'); // y se redirige al listado 
        }

        const categories = await category.findAll({ order: [['name', 'ASC']], raw:true}); // en caso de que si exista, entonces procedemos a obtener las categorias

        response.render('product/edit', { // renderizamos la vista y le pasamos los productos y las categorias
            product: product_data,
            categories

        });

    } catch (error) {
        console.log('Error al obtener el registro', error.message);
        request.flash('error_msg', 'Ocurrió un error al obtener un producto');
        return response.redirect('/product/list');
        
    }
};

// --------------------- Controlador para actualizar los datos en la BD -----------------------

module.exports.updateProduct = async (request, response) => {
    const errors = validationResult(request);
    const product_id = request.params.product_id;

    // Si hay errores en las validaciones
    if (!errors.isEmpty()) {
        return response.render('product/edit', {
            errors: errors.array(),
            product: {
                product_id,
                name: request.body.name,
                price: request.body.price,
                stock: request.body.stock,
                minimum_stock: request.body.minimum_stock,
                category: request.body.category,
                image: request.body.image
            }
        });
    }

    try {
        const { name, price, stock, minimum_stock } = request.body;
        const category_int = request.body.category ? parseInt(request.body.category) : null;

        // Si el usuario subió una imagen nueva
        const image = request.file ? request.file.filename : null;

        // Datos a actualizar
        const updateData = {
            name,
            price,
            stock,
            minimum_stock,
            category: category_int
        };

        // Agregar imagen solo si existe
        if (image) {
            updateData.image = image;
        }

        await product.update(updateData, { where: { product_id } });

        request.flash('success_msg', 'El producto se actualizó con éxito');
        return response.redirect('/product/list');

    } catch (error) {
        console.error('Error al actualizar el producto', error.message);

        if (error.parent) {
            console.error('Detalle SQL:', error.parent.sqlMessage);
        }

        request.flash('error_msg', 'Ocurrió un error al actualizar el producto');
        return response.redirect('/product/list');
    }
};

// -------------------- Controlador de eliminacion -----------------------

module.exports.deleteProduct = async(request, response) =>{
    try {
        const {product_id} = request.params; // obtenemos el id del cuerpo de la solicitud
        await product.destroy({where: {product_id: product_id}}); // eliminamos un registro que coincida con dicho id

        request.flash('success_msg', 'Producto eliminado correctamente'); // notificamos exito
        response.redirect('/product/list'); // redireccionamos al listado
    
    } catch (error) {
        console.log('Error al eliminar el producto', error.message);
        request.flash('error_msg', 'Ocurrió un error al eliminar el producto');
        response.redirect('/product/list');
        
    }
};