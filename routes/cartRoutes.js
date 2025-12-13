const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { ensure_authenticated } = require('../middlewares/authentication');

// ---------------- Ruta para ver carrito activo -----------------

router.get('/', ensure_authenticated, cartController.viewActiveCart);

// ---------------- Ruta para confirmar carrito ------------------

router.post('/confirm/:id', ensure_authenticated, cartController.confirmCart);

// ---------------- Ruta para el historial de carritos confirmados -----------------

router.get('/history', ensure_authenticated, cartController.cartHistory);


module.exports = router;

