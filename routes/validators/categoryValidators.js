const { body } = require('express-validator');
const Category = require('../../models/category');

// ---------------- Validación del campo name ----------------

const name_validations = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('El nombre es obligatorio')
        .isLength({ min: 3 })
        .withMessage('El nombre debe tener al menos 3 caracteres')
];

// ---------------- Validación al crear categoría ----------------
// Verifica unicidad correcta (si existe → error)

const create_category_validations = [
    ...name_validations,
    body('name').custom(async (value) => {
        const exists = await Category.findOne({ where: { name: value }, raw: true });

        if (exists) {
            throw new Error('Ya existe una categoría con ese nombre');
        }

        return true;
    })
];

// ---------------- Validación al actualizar categoría ----------------
// Permite mantener el mismo nombre de la categoría que se está editando

const update_category_validations = [
    ...name_validations,
    body('name').custom(async (value, { req }) => {
        const category_id = req.params.category_id;

        const exists = await Category.findOne({ where: { name: value }, raw: true });

        // Si existe otra categoría con el mismo nombre → error
        if (exists && String(exists.category_id) !== String(category_id)) {
            throw new Error('Ya existe una categoría con ese nombre');
        }

        return true;
    })
];

module.exports = {
    create_category_validations,
    update_category_validations
};