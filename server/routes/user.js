const express = require('express');
const User = require('../models/UserModel');
const { loginUser, logoutUser, registerUser, editUser } = require('../events/producers/userProcedures');
const router = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
require('../events/consumers/userConsumers'); // Import consumers to listen for events
// GET home page

router.post('/register', async (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (!email || !password || !confirmPassword) return res.status(400).json({ error: 'You must enter all the information' });

    if (password !== confirmPassword) return res.status(400).json({ error: 'Passwords do not match' });

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ error: 'User already exists' });

        registerUser({ email, password, name: email }); // Emit user registration event
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
        const user = await User.findOne({ email, password });
        if (!user) return res.status(400).json({ error: 'Invalid email or password' });

        const token = jwt.sign({ id: user._id, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });

        loginUser({ email }); // Emit user login event
        res.status(200).json({ message: 'User logged in successfully' });
    } catch (error) {
        console.error('Error logging in user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/', auth, async (req, res) => {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ user });
});

router.post('/logout', auth, (req, res) => {
    const userId = req.user.id;
    const email = req.user.email;
    res.clearCookie('token');
    logoutUser({ email, userId }); // Emit user logout event
    res.status(200).json({ message: 'User logged out successfully' });
});

router.put('/edit', auth, async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'You must enter all the information' });
    try {
        const userId = req.user.id;
        const email = req.user.email;
        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            { name, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedUser) return res.status(404).json({ error: 'User not found' });

        editUser({ email, name }); // Emit user edit event
        res.status(200).json({ message: 'User profile updated successfully', user: updatedUser });
    } catch (error) {
        console.error('Error editing user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;