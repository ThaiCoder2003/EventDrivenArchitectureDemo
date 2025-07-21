const express = require('express');
const User = require('../models/UserModel');
const { loginUser, logoutUser, registerUser } = require('../events/producers/userEventHandlers');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
require('../events/consumers/userEvents'); // Import consumers to listen for events
require('dotenv').config(); // Load environment variables
// GET home page

router.post('/register', async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || !confirmPassword) return res.status(400).json({ error: 'You must enter all the information' });

    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });
        const hashedPassword = await bcrypt.hash(password, 10);
        await registerUser({ email, password: hashedPassword, name: email }); // Emit user registration event
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'You must enter all the information' });

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'Invalid email or password' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || 'your_jwt_secret', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'development', sameSite: 'lax', maxAge: 60 * 60 * 1000 }); // Set cookie with token
        await loginUser({ email }); // Emit user login event
        res.status(200).json({ message: 'User logged in successfully' });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get('/check', auth, (req, res) => {
    res.status(200).json({ isAuthenticated: true, user: { id: req.user.id, email: req.user.email } });
});

router.post('/logout', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const email = req.user.email;
        res.clearCookie('token'); // Clear the cookie
        await logoutUser({ email, userId }); // Emit user logout event
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;