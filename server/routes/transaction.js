const express = require('express');
const Product = require('../models/ProductModel');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../middleware/auth');
const Cart = require('../models/CartModel');
const { addToCart, removeFromCart, purchaseProduct } = require('../events/producers/productProcedures');
require('../events/consumers/productConsumers'); // Import consumers to listen for events

// GET all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ error: 'Product not found' });
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET cart for authenticated user
router.get('/cart', auth, async (req, res) => {
    const userId = req.user.id;
    try {
        const cart = await Cart.findOne({ userId });
        if (!cart) return res.status(404).json({ error: 'Cart not found' });
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
        addToCart({
            name: product.name,
            _id: product._id,
            price: product.price,
            quantity: quantity,
            userId: userId
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
        removeFromCart({
            name: product.name,
            _id: product._id,
            userId: userId
        });

        res.status(200).json({ message: 'Product removed from cart successfully' });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/purchase', auth, async (req, res) => {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.products.length === 0) {
        return res.status(400).json({ error: 'Your cart is empty' });
    }

    try {
        // Emit event to handle product purchase
        purchaseProduct({
            userId: userId
        });
        res.status(200).json({ message: 'Purchase successful' });
    } catch (error) {
        console.error('Error processing purchase:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;    