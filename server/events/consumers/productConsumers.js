const eventBus = require('../eventBus');
const Product = require('../../models/ProductModel');
const Order = require('../../models/OrderModel');
const Cart = require('../../models/CartModel');
const User = require('../../models/UserModel');

eventBus.on('product_added_to_cart', async (cartData) => {
    try {
        console.log(`Product added to cart: ${cartData.name}`);
        // Here you can add logic to handle adding a product to the cart
        const cart = await Cart.findOne({ userId: cartData.userId });
        if (cart) {
            const existingProduct = cart.products.find(p => p.productId.toString() === cartData._id.toString());
            // If product already exists in the cart, update quantity
            // Otherwise, add new product to the cart
            if (existingProduct) {
                existingProduct.quantity += cartData.quantity;
            } else {
                cart.products.push({ productId: cartData._id, quantity: cartData.quantity });
            }
            // Update total price
            cart.totalPrice += cartData.price * cartData.quantity;
            await cart.save();
        } else {
            // Create a new cart if it doesn't exist
            await Cart.create({
                userId: cartData.userId,
                products: [{ productId: cartData._id, quantity: cartData.quantity }],
                totalPrice: cartData.price * cartData.quantity
            });
        }

    } catch (error) {
        console.error('Error handling product_added_to_cart event:', error);
    }
});

eventBus.on('product_removed_from_cart', async (product) => {
    console.log(`Product removed from cart: ${product.name}`);
    // Here you can add logic to handle removing a product from the cart
    const cart = await Cart.findOne({ userId: product.userId });

    if (cart) {
        const existingProduct = cart.products.find(p => p.productId.toString() === product._id.toString());

        if (existingProduct) {
            cart.totalPrice -= existingProduct.quantity * product.price;
            cart.products = cart.products.filter(p => p.productId.toString() !== product._id.toString());
            await cart.save();
        }
    }
}
);

eventBus.on('product_purchased', async (transaction) => {
    try {
        const cart = await Cart.findOne({ userId: transaction.userId });
        const user = await User.findById(transaction.userId);
        const email = user?.email || 'unknown user';

        if (!cart || cart.products.length === 0) {
            console.warn(`No cart found or empty cart for user ${email}`);
            return;
        }

        // Build order details
        const products = await Promise.all(cart.products.map(async (p) => {
            const productDoc = await Product.findById(p.productId);
            return {
                product: productDoc?.name || 'Unknown',
                price: productDoc?.price || 0,
                quantity: p.quantity,
            };
        }));

        // Save order
        const order = new Order({
            user: email,
            products,
            totalPrice: cart.totalPrice,
        });

        await order.save();

        // Clear cart after successful purchase
        cart.products = [];
        cart.totalPrice = 0;
        await cart.save();
        console.log(`Order created for ${email}. Cart cleared.`);
    } catch (err) {
        console.error('Error handling product_purchased event:', err);
    }
});