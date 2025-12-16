const Cart = require('../models/cart');
const CartItem = require('../models/cart_items');

// ------------------ Control de creacion o verificacion de carrito activo ------------------

// busca un carrito activo del usuario
// si no existe lo crea automaticamente
// el catalogo va a utilizar esta funcion

module.exports.gerOrCreateActiveCart = async (userId) => { // este controlador se usa cuando el usuario añade un producto al carrito
    try {
        // buscamos un carrito activo del usuario
        let cart = await Cart.findOne({
            where: {
                user_id: userId,
                state: 'Activo'
            }
        });

        // si no existe, lo creamos
        if (!cart) {
            cart = await Cart.create({
                date: new Date(), // fecha actual
                state: 'Activo', // estado del carrito nuevo
                user_id: userId // id del usuario que obtuvimos por parametro

            });
        }
        
        // devolvemos el carrito creado
        return cart

    } catch (error) {
        console.error('Error al crear u obtener el carrito:', error);
        throw error;

    }
};


// ------------------- Formulario que muestra el carrito activo del usuario -------------------

// muestra el carrito actual del usuario

exports.viewActiveCart = async (req, res) => {
    try {
        const userId = req.user.user_id;

        const cart = await Cart.findOne({
            where: {
                user_id: userId,
                state: 'Activo'
            }
        });

        if (!cart) {
            return res.render('cart/cart', { cart: null });
        }

        const cartItems = await CartItem.findAll({
            where: { cart_id: cart.cart_id },
            include: [
                {
                    model: Product,
                    as: 'product_relation'
                }
            ]
        });

        let total = 0;

        cartItems.forEach(item => {
            item.subtotal = item.amount * item.price;
            total += item.subtotal;
        });

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

// ------------------- Controlador que confirma el carrito (finaliza compra) ------------------

// cambia el estado del carrito a 'confirmado'

module.exports.confirmCart = async (req, res) => {
    try {

        const userId = req.user.user_id; // obtenemos el id del usuario de la sesion del usuario logueado
        const cartId = req.params.cart_id; // obtenemos el id del carrito de la URL

        await Cart.update( // actualizamos el carrito 
            { state: 'Confirmado' }, // su estado pasa a confirmado

            {
                where: { // y especificamos que registro en la tabla de carritos sera actualizado
                    cart_id: cartId, // segun id del carrito
                    user_id: userId // y el id del usuario dueño de ese carrito
                }
            }
        );

        res.redirect('/cart/history'); // redirigimos al historial de carritos

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al confirmar el carrito');

    }
};


// -------------- Controlador de historial de carrito confirmados por el usuario ---------------

// Lista los carritos confirmados
// que seria el historial de compras

module.exports.cartHistory = async (req, res) => {
    try {
        const userId = req.user.user_id; // obtenemos el id del usuario logueado

        const carts = await Cart.findAll({ // buscamos un registro de carrito que coincida con el id del usuario obtenido
            where: {
                user_id: userId,
                state: 'Confirmado' // y que el estado sea confirmado
            },

            order: [['date', 'DESC']] // ordenamos los registros por fecha

        });

        res.render('cart/history', { // renderizamos la vista del historial y le pasamos los registros de carritos
            carts

        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Error al cargar historial');

    }
};


