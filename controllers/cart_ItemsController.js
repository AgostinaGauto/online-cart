const CartItem = require('../models/cart_items');
const Product = require('../models/product');
const CartController = require('./cartController');

// ---------------- Controlador para agregar producto al carrito -------------------
// este controlador se usa desde el catalogo

module.exports.addItemToCart = async (req, res) =>{
    try {
        const userId = req.user.user_id;
        const { product_id, amount } = req.body;

        // obtenemos o creamos carrito activo 
        const cart = await CartController.gerOrCreateActiveCart(userId);

        // buscar producto
        const product = await Product.findByPk(product_id);

        if(!product){
            return res.status(404).send('Producto no encontrado');

        }

        // validar stock
        if(amount > product.stock){
            return res.status(400).send('Stock insuficiente');
        }

        // verificamos si el producto ya esta en el carrito
        let cartItem = await CartItem.findOne({
            where: {
                cart_id: cart.cart_id,
                product_id: product_id
            }
        });

        if(cartItem){

            // si ya existe, sumamos cantidad
            cartItem.amount += parseInt(amount);
            await cartItem.save();

        }else{
            // si no existe, lo creamos
            cartItem = await CartItem.create({
                cart_id: cart.cart_id,
                product_id: product_id,
                amount: amount,
                price: product.price

            });
        }

        // actualizar stock del producto
        product.stock -= amount;
        await product.save();
        res.redirect('/cart');

    } catch (error) {
        console.error('Error al agregar item: ', error);
        res.status(500).send('Error al agregar producto al carrito');
        
    }
};


// ------------------ Controlador para eliminar item del carrito ------------------

module.exports.removeItemFromCart = async (req, res) =>{
    try {
        const cartItemId = req.params.id;

        const cartItem = await CartItem.findByPk(cartItemId);

        if(!cartItem){
            return res.status(400).send('Item no encontrado');
            
        }

        // devolver stock al producto
        const product = await Product.findByPk(cartItem.product_id);

        if(product){
            product.stock += cartItem.amount;
            await product.save();
        }

        await cartItem.destroy();
        res.redirect('/cart');
        
    } catch (error) {
        console.error('Error el eliminar item:', error);
        res.status(500).send('Error al eliminar item del carrito');
        
    }
};