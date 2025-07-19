const eventBus = require('../eventBus');
const User = require('../../models/UserModel');

eventBus.on('user_registered', async (user) => {
    console.log(`User registered: ${user.email}`);
    // Here you can add logic to handle user registration, like sending a welcome email
    await User.create(user);
});

eventBus.on('user_logged_in', async (user) => {
    console.log(`User logged in: ${user.email}`);
    // Here you can add logic to handle user login, like updating last login time
    await User.findOneAndUpdate(
        { email: user.email },
        { lastLogin: Date.now() },
        { new: true }
    );
});

eventBus.on('user_logged_out', async (user) => {
    console.log(`User logged out: ${user.email}`);
    // Here you can add logic to handle user logout, if needed
});

eventBus.on('user_edited', async (user) => {
    console.log(`User edited: ${user.email}`);
    // Here you can add logic to handle user profile edits, like updating the database
    await User.findOneAndUpdate(
        { email: user.email },
        { name: user.name, updatedAt: Date.now() },
        { new: true }
    );
});

