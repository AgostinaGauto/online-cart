const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const {create_category_validations, update_category_validations} = require('../routes/validators/categoryValidators');

// --------------------- Ruta de redireccionamiento ----------------------
router.get('/', (req, res) =>{
    res.redirect('/category/create');

});


// --------------------- Ruta de renderizado -----------------------
router.get('/create', categoryController.renderCategoryForm);


// -------------------- Ruta de registro ------------------------
router.post('/create', create_category_validations, categoryController.createCategory);


// -------------------- Ruta de listado -----------------------
router.get('/list', categoryController.listCategories);


// -------------------- Ruta para mostrar formulario de edicion --------------------
router.get('/edit/:category_id', categoryController.renderEditForm);


// -------------------- Ruta para procesar la edicion ---------------------
router.post('/edit/:category_id', update_category_validations, categoryController.updateCategory);


// -------------------- Ruta para eliminar categoria ---------------------
router.post('/delete/:category_id', categoryController.deteleCategory);

module.exports = router;


