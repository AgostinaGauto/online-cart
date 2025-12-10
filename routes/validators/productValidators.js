const {body} = require('express-validator');
const product = require('../../models/product');

// reglas de validacion para el campo name

const name_validations = [
    body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio')
    .isString()
    .withMessage('El nombre debe ser una cadena de caracteres')
    .isLength({min: 3})
    .withMessage('El nombre debe tener al menos 3 caracteres')
    .isLength({max: 100})
    .withMessage('Solo se permite un maximo de 100 caracteres para el nombre')
];

// reglas para el campo price

const price_validations = [
    body('price')
    .trim()
    .notEmpty()
    .withMessage('El campo precio es obligatorio')
    .isInt({min: 1})
    .withMessage('El campo precio debe ser un numero entero positivo mayor a 0')
];

// reglas para el campo minimum_stock

const minimum_stock_validations = [
    body('minimum_stock')
    .trim()
    .notEmpty()
    .withMessage('El campo stock minimo es obligatorio')
    .isInt({min: 1})
    .withMessage('El campo stock minimo debe ser un número entero positivo mayor a 0')
    .custom((value, {req}) =>{
        if(value > parseInt(req.body.stock, 10)){
            throw new Error('El campo stock minimo no puede ser mayor al campo stock')
        }
        return true;

    }) 
];

// reglas para el campo stock

const stock_validations = [
    body('stock')
    .trim()
    .notEmpty()
    .withMessage('El campo stock es obligatorio')
    .isInt({min: 1})
    .withMessage('El campo stock debe ser un número entero positivo mayor a cero')

];

const product_validations = [
    ...name_validations,
    ...price_validations,
    ...minimum_stock_validations,
    ...stock_validations
];

module.exports = {
    product_validations
}