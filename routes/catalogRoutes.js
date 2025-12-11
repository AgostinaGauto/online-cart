const express = require('express');
const router = express.Router();
const catalogController = require('../controllers/catalogController');

router.get('/', catalogController.renderCatalog);
// router.post('/add-to-cart/:id', catalogController.addToCart);

module.exports = router;