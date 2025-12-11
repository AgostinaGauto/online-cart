const Product = require('../models/product');
const Category = require('../models/category');

module.exports.renderCatalog = async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                { model: Category, as: 'category_relation', attributes: ['name'] }
            ]
        });

        const plainProducts = products.map(prod => prod.get({ plain: true }));

        res.render('catalog/catalog', {
            titulo: "Catálogo de Productos",
            products: plainProducts
        });
    } catch (error) {
        console.log(error);
        req.flash("error", "Error al cargar el catálogo");
        res.redirect('/');
    }
};