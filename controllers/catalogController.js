const Product = require('../models/product');
const Category = require('../models/category');
const Cart = require('../models/cart');
const CartItem = require('../models/cartItem');

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

/*
module.exports.addToCart = async (req, res) => {
    try {

        const userId = req.session.user_id; // obtenemos el id del parametro de la sesion
        const productId = req.params.product_id; // obtenemos el id del producto del cuerpo de la solicitud
        const { quantity } = req.body; // obtenemos del cuerpo de la solicitud la cantidad de productos solicitados por el usuario

        const quantityNum = parseInt(quantity); // pasamos a entero la cantidad dado que los formularios HTML devuelven todo en formato string
        if (!quantityNum || quantityNum < 1) { // verificamos que quantityNum este vacio o que sea menor que 1
            req.flash('error_msg', 'La cantidad debe ser al menos 1');
            return res.redirect('/catalog');

        }


        // obtenemos el producto segun id especificado para proceder a validar stock y obtener precio
        const product = await Product.findByPk(productId);

        if (!product) { // verificamos la existencia de ese producto
            req.flash('error_msg', 'Producto no encontrado');
            return res.render('/catalog');
        }

        // validamos stock disponible del producto
        if (product.stock < quantityNum) {
            req.flash('error_msg', `Stock insuficiente. Solo hay ${product.stock} unidades disponibles`);
            return res.redirect('/catalog');

        }

        // buscar carrito activo del usuario
        let activeCart = await Cart.findOne({
            where: {
                user_id: userId,
                state: 'Activo'
            }
        });

        // si no existe un carrito activo, creamos uno
        if (!activeCart) { // verificamos si existe un carrito 
            activeCart = await Cart.create({ // creamos uno llamando a la instancia Cart con el metodo create()
                user_id: userId, // pasamos id del usuario dueño de ese carrito
                date: new Date(), // fecha actual 
                state: 'Activo' // y estado del carrito
            });
        }

        // ahora verificamos si el producto ya existe en el carrito
        const existingItem = await CartItem.findOne({
            where: {
                cart_id: activeCart.cart_id,
                product_id: productId
            }
        });


        if (existingItem) {

            const newQuantity = existingItem.quantity + quantityNum;

            // validar que la nueva cantidad no exceda el stock

            if (newQuantity > product.stock) {
                req.flash('error_msg', `No se puede agregar mas unidades. Stock disponible: ${product.stock}`);
                return res.redirect('/catalog');

            }

            existingItem.quantity = newQuantity;
            await existingItem.save();

            req.flash('success', `Cantidad actualizada: ${product.name} x${newQuantity}`);

        } else {
            // si no existe crear un nuevo item en el carrito
            await CartItem.create({
                cart_id: activeCart.cart_id,
                product_id: productId,
                quantity: quantityNum,
                price: product.price

            });

            req.flash('success', `${product.name} agregado al carrito`);
        }

        // actualizar el stock del producto
        product.stock -= quantityNum;
        await product.save();

        // Redirigir al carrito activo
        res.redirect(`/cart/${activeCart.cart_id}`);

    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        req.flash('error', 'Error al agregar el producto al carrito');
        res.redirect('/catalog');

    }

}; */