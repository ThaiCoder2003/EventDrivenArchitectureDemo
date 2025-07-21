const eventBus = require('../eventBus');
const Order = require('../../models/OrderModel');
const Cart = require('../../models/CartModel');
const User = require('../../models/UserModel');

eventBus.on('product_added_to_cart', async (cartData, { resolve, reject }) => {
    try {
        if (!cartData.userId || !cartData.productId || cartData.quantity <= 0 || cartData.price < 0) {
            throw new Error("Invalid cart data");
        }
        console.log(`Product added to cart: ${cartData.name}`);
        // Here you can add logic to handle adding a product to the cart
        const cart = await Cart.findOne({ userId: cartData.userId });
        if (cart && cart.products.length > 0) {
            const existingProduct = cart.products.find(p => p.product.toString() === cartData.productId.toString());
            // If product already exists in the cart, update quantity
            // Otherwise, add new product to the cart
            if (existingProduct) {
                existingProduct.quantity += cartData.quantity;
            } else {
                cart.products.push({ product: cartData.productId, quantity: cartData.quantity });
            }
            // Update total price
            cart.totalPrice = parseFloat((cart.totalPrice + cartData.price * cartData.quantity).toFixed(2));
            await cart.save();

            resolve(cart); // Let the route know we succeeded
        }
        else if (cart && cart.products.length === 0) {
            // If cart exists but is empty, add the product
            cart.products.push({ product: cartData.productId, quantity: cartData.quantity });
            cart.totalPrice = parseFloat((cart.totalPrice + cartData.price * cartData.quantity).toFixed(2));
            await cart.save();
            resolve(cart); // Let the route know we succeeded
        } 
        else {
            // Create a new cart if it doesn't exist
            const newCart = await Cart.create({
                userId: cartData.userId,
                products: [{ product: cartData.productId, quantity: cartData.quantity }],
                totalPrice: Number(cartData.price) * Number(cartData.quantity)
            });

            return resolve(newCart); // Let the route know we succeeded
        }
        
        resolve(cart); // Let the route know we succeeded
    } catch (error) {
        console.error('Error handling product_added_to_cart event:', error);
        reject(error); // Let the route catch and return failure
    }
});

eventBus.on('product_removed_from_cart', async (product, { resolve, reject }) => {
try {
        console.log(`Product removed from cart: ${product.name}`);
        // Here you can add logic to handle removing a product from the cart
        const cart = await Cart.findOne({ userId: product.userId });
    
        if (cart) {
            const existingProduct = cart.products.find(p => p.product.toString() === product.productId.toString());
    
            if (existingProduct) {
                cart.totalPrice = parseFloat((cart.totalPrice - existingProduct.quantity * product.price).toFixed(2));
                cart.products = cart.products.filter(p => p.product.toString() !== product.productId.toString());
                await cart.save();
            }

            resolve(cart); // Let the route know we succeeded
        }

        else {
            console.warn(`Cart not found for user ${product.userId}`);
            resolve(null); // Let the route know we succeeded but no cart was found
        }
    } catch (error) {
            console.error('Error handling product_removed_from_cart event:', error);
            reject(error); // Let the route catch and return failure
        }
});

eventBus.on('product_purchased', async (transaction, { resolve, reject }) => {
    try {
        const cart = await Cart.findOne({ userId: transaction.userId }).populate('products.product');
        const user = await User.findById(transaction.userId);
        const email = user?.email || 'unknown user';

        if (!cart || cart.products.length === 0) {
            console.warn(`No cart found or empty cart for user ${email}`);
            return;
        }

        // Build order details
        const products = cart.products.map(p => ({
            product: p.product.name,
            quantity: p.quantity,
            price: p.product.price
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

        resolve(order); // Let the route know we succeeded
    } catch (err) {
        console.error('Error handling product_purchased event:', err);
        reject(err); // Let the route catch and return failure
    }
});