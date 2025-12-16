const express = require('express');
const router = express.Router();
const cart_ItemsController = require('../controllers/cart_ItemsController');
const ensure_authenticated = require('../middlewares/authentication');

// ----------------- Ruta para agregar productos al carrito (desde el catalogo) ---------------
router.post('/add', ensure_authenticated, cart_ItemsController.addItemToCart);

// ---------------- Ruta para eliminar item del carrito -----------------
router.post('/delete/:id', ensure_authenticated, cart_ItemsController.removeItemFromCart);

module.exports = router;