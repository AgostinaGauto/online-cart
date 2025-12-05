const category = require('../models/category');
const { validationResult } = require('express-validator');


// ---------------- Controlador de renderizado -----------------

module.exports.renderCategoryForm = (request, response) =>{
    response.render('category/create');

};


// ------------------ Controlador de registro ------------------

module.exports.createCategory = async (request, response) =>{
    const errors = validationResult(request);

    if(!errors.isEmpty()){
        return response.render('category/create',{
            errors: errors.array(),
            category: { name: request.body?.name || '' }
        });

    }

    try {
        const { name } = request.body;
        await category.create({ name });
        request.flash('success_msg', 'Categoria registrada con exito');
        response.redirect("/category/list");

        
    } catch (error) {
        console.error("Error al crear categoria: ", error.message);

        if(error.parent){
            console.error("Detalle SQL: ", error.parent.sqlMessage);
        }

        request.flash("error_msg", "Ocurrio un error al crear la categoria");
        response.redirect("category/create");
    }
};


// ------------------ Controlador de listado -------------------

module.exports.listCategories = async (request, response) =>{

    try {
        const categories = await category.findAll({raw:true}); // consulta sql que busca todas las filas de la tabla categoria 
                                                            // e indica que los devuelva en un objeto plano    
        response.render('category/list', {categories: categories}); // renderizamos la vista con los registros obtenidos
    } catch (error) {
        console.log("Error al obtener las categorias", error.message);
        request.flash("error_msg", "Ocurrio un error al obtener las categorias");
        response.redirect("/home");
        
    }
};

// ----------------- Controlador de modificacion ------------------

module.exports.renderEditForm = async (request, response) =>{

    try {
        const categoryId = request.params.category_id; // Obtenemos el id de la categoria del cuerpo de la solicitud
        const categoryData = await category.findByPk(categoryId, { raw:true }); // Obtenemos el registro de la categoria con el id obtenido

        if(!categoryData){ // si dicha categoria no existe mostramos un mensaje de error y redirigimos al listado
            request.flash("error_msg", "No se ha encontrado el registro");
            return response.redirect('/category/list');
        }

        response.render("category/edit", { category: categoryData }); // Si existe renderizamos la vista y le pasamos el registro en objeto plano
        
    } catch (error) { // si hubo errores en el medio, notificamos y redirigimos al listado nuevamente
        console.log("Error al obtener el registro", error.message);
        request.flash("error_msg", "Ocurrió un error al obtener la categoria");
        return response.redirect("/category/list");
        
    }
};

// ------------------- Controlador para actualizar los datos en la BD -------------------

module.exports.updateCategory = async (request, response) =>{

    const errors = validationResult(request); // recolectamos los errores que se hayan generado
    const categoryId = request.params.category_id; // obtenemos el id de la categoria del cuerpo de la solicitud

    if(!errors){ // si hubo errores renderizamos con los errores y los datos ingresados para que el usuario no tenga que reescribirlos
        return response.render("category/edit", { // usamos un return para que detenga la ejecucion
            errors: errors_array(),
            category: { categoryId, name: request.body.name}
        });
    }

    try {
        const categoryId = request.params.category_id; // obtenemos el id de la categoria del cuerpo de la solicitud
        const {name} = request.body; // obtenemos el nombre del cuerpo de la solicitud
        const category_to_update = await category.findByPk(categoryId); // buscamos la categoria que coincida con el id que obtuvimos

        if(!category_to_update){ // si no existe notificamos su inexistencia y redirigimos al listado nuevamente
            request.flash("success_msg", "Categoria no encontrada");
            return response.redirect("/category/list");

        }

        await category_to_update.update({name}); // si existe la categoria, la actualizamos
        request.flash("success_msg", "Categoria actualizada correctamente"); // mostramos un mensaje de exito
        return response.redirect("/category/list"); // y redirigimos al listado 
        
    } catch (error) { // si hubo errores en el medio, se notifica por consola y por la vista, y redirigimos al listado
        console.log("Error al actualizar la categoria", error.message);
        request.flash("error_msg", "Ocurrió un error al actualizar la categoria");
        return response.redirect("/category/list");
        
    }
};


// -------------------- Controlador de eliminacion --------------------

module.exports.deteleCategory = async (request, response) =>{
    try {
        const {category_id} = request.params;
        await category.destroy({ where: {category_id: category_id}});

        request.flash("success_msg", "Categoria eliminada correctamente");
        response.redirect("/category/list");
    } catch (error) {
        console.log("Error al eliminar la categoria", error.message);
        request.flash("error_msg", "Ocurrió un error al eliminar la categoria");
        return response.redirect("/category/list");
        
    }
};


