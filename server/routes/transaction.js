const express = require('express');
const Product = require('../models/ProductModel');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/CartModel');
const Order = require('../models/OrderModel');
const { addToCart, removeFromCart, purchaseProduct } = require('../events/producers/productEventHandlers');
require('../events/consumers/productEvents'); // Import consumers to listen for events

// GET cart for authenticated user
router.get('/cart', auth, async (req, res) => {
    const userId = req.user.id;
    try {
        let cart = await Cart.findOne({ userId }).populate('products.product');
        if (!cart) // Create a new cart if it doesn't exist
            cart = await Cart.create({ userId, products: [], totalPrice: 0 });
        // Return the cart with populated product details
        res.status(200).json(cart); 
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// POST add new product to cart
router.post('/add-to-cart', auth, async (req, res) => {   
    const { productId, quantity } = req.body;
    if (!productId  || !quantity) return res.status(400).json({ error: 'You must enter all the information' });

    const userId = req.user.id;

    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        // Emit event to handle adding product to cart
        await addToCart({
            name: product.name,
            id: product._id,
            quantity: quantity,
            userId: userId,
            price: product.price // Assuming price is part of the product object
        });

        res.status(200).json({ message: 'Product added to cart successfully' });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/remove-from-cart', auth, async (req, res) => {
    const { productId } = req.body;
    if (!productId) return res.status(400).json({ error: 'You must enter all the information' });

    const userId = req.user.id;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });

        // Emit event to handle removing product from cart
        await removeFromCart({
            name: product.name,
            id: product._id,
            userId: userId,
            price: product.price // Assuming price is part of the product object
        });

        res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/purchase', auth, async (req, res) => {
    const userId = req.user.id;

    try {
        const cart = await Cart.findOne({ userId });
        if (!cart || cart.products.length === 0) {
            return res.status(400).json({ error: 'Your cart is empty' });
        }

        // Emit event to handle product purchase
        await purchaseProduct({
            userId: userId
        });
        res.status(200).json({ message: 'Purchase successful' });
    } catch (error) {
        console.error('Error processing purchase:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;    