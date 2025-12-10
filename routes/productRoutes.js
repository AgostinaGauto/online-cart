const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { upload } = require('../config/multer');
const { product_validations } = require('../routes/validators/productValidators');

//----------------- Ruta de redireccionamiento --------------------

router.get('/', (req, res) =>{
    res.redirect('/product/create');

});

// ---------------- Ruta de renderizado del formulario -----------------

router.get('/create', productController.renderProductForm);

// ---------------- Ruta de registro (crear producto) ------------------

router.post('/create', upload.single('image'), product_validations, productController.createProduct);

// ---------------- Ruta de listado -----------------

router.get('/list', productController.listProducts);

// ---------------- Ruta para eliminar producto -------------------

router.post('/delete/:product_id', productController.deleteProduct);

// ---------------- Ruta para mostrar formulario de edicion -----------------

router.get('/edit/:product_id', productController.renderEditForm);

// --------------- Ruta para procesar la edicion (cuando enviamos en formulario de edicion) ---------------------

router.post('/edit/:product_id', upload.single('image'), product_validations, productController.updateProduct);


module.exports = router;
