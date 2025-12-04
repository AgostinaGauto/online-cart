const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { ensure_authenticated } = require('../middlewares/authentication');


// ------------------- Rutas de registro ---------------------
router.get('/register', userController.renderUserRegisterForm);
router.post('/register', userController.userRegister);

// ------------------- Rutas de login ------------------------
router.get('/login', userController.renderUserLoginForm);
router.post('/login', userController.loginUser);

// ------------------ Rutas de logout ------------------------
router.get('/logout', ensure_authenticated, userController.logoutUser);


module.exports = router;