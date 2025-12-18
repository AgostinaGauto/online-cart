const Cart = require('../models/cart');
const CartItem = require('../models/cart_items');
const Product = require('../models/product');

// ------------------ Crear u obtener carrito activo ------------------

module.exports.getOrCreateActiveCart = async (userId) => {
    try {
        let cart = await Cart.findOne({
            where: {
                user_id: userId,
                state: 'Activo'
            }
        });

        if (!cart) {
            cart = await Cart.create({
                date: new Date(),
                state: 'Activo',
                user_id: userId
            });
        }

        return cart;

    } catch (error) {
        console.error('Error al crear u obtener el carrito:', error);
        throw error;
    }
};

// ------------------- Mostrar carrito activo -------------------

module.exports.viewActiveCart = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const cartData = await Cart.findOne({
            where: {
                user_id: userId,
                state: 'Activo'
            }
        });

        if (!cartData) {
            return res.render('cart/cart', { cart: null });
        }

        // 🔹 Convertimos a objeto plano
        const cart = cartData.get({ plain: true });

        const cartItemsData = await CartItem.findAll({
            where: { cart_id: cart.cart_id },
            include: [
                {
                    model: Product,
                    as: 'product_relation'
                }
            ]
        });

        const cartItems = cartItemsData.map(item => {
            const plainItem = item.get({ plain: true });
            plainItem.subtotal = plainItem.amount * plainItem.price;
            return plainItem;
        });

        const total = cartItems.reduce((acc, item) => acc + item.subtotal, 0);

        res.render('cart/cart', {
            cart,
            cartItems,
            total
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al mostrar el carrito');
    }
};

// ------------------- Confirmar carrito -------------------

module.exports.confirmCart = async (req, res) => {
    try {
        const userId = req.user.user_id;
        const cartId = req.params.id; // ✅ corregido

        await Cart.update(
            { state: 'Confirmado' },
            {
                where: {
                    cart_id: cartId,
                    user_id: userId
                }
            }
        );

        res.redirect('/cart/history');

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al confirmar el carrito');
    }
};

// ------------------- Historial de carritos confirmados -------------------

module.exports.cartHistory = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const cartsData = await Cart.findAll({
            where: {
                user_id: userId,
                state: 'Confirmado'
            },
            order: [['date', 'DESC']]
        });

        // 🔹 Convertimos a objetos planos
        const carts = cartsData.map(cart => cart.get({ plain: true }));

        res.render('cart/history', { carts });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar historial');
    }
};

