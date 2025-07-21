const eventBus = require('../eventBus');
const User = require('../../models/UserModel');

eventBus.on('user_registered', async (user, { resolve, reject }) => {
    try {
        console.log(`User registered: ${user.email}`);
        const newUser = await User.create(user);
        resolve(newUser); // Let the route know we succeeded
    } catch (err) {
        console.error('Error in event handler:', err);
        reject(err); // Let the route catch and return failure
    }
});

eventBus.on('user_logged_in', async (user, { resolve, reject }) => {
    try {
        console.log(`User logged in: ${user.email}`);
        // Here you can add logic to handle user login, like updating last login time
        await User.findOneAndUpdate(
            { email: user.email },
            { lastLogin: Date.now() },
            { new: true }
        );
        resolve(user); // Let the route know we succeeded
    } catch (error) {
        console.error('Error handling user_logged_in event:', error);
        reject(error); // Let the route catch and return failure
    }
});

eventBus.on('user_logged_out', async (user, { resolve, reject }) => {
    try {
        console.log(`User logged out: ${user.email}`);
        resolve(user); // Let the route know we succeeded
    } catch (error) {
        console.error('Error handling user_logged_out event:', error);
        reject(error); // Let the route catch and return failure   
    }
    // Here you can add logic to handle user logout, if needed
});


