const eventBus = require('../eventBus');

async function registerUser(user) {
  try {
        const { email, password, name } = user;
      // Emit an event when a user is registered
        await eventBus.emitAsync('user_registered', {
            email: email,
            password: password,
            name: name
        });
  } catch (error) {
      console.error('Error registering user:', error);
      throw new Error('User registration failed');
  }
}

async function loginUser(user) {
  // Emit an event when a user logs in
  try {
      await eventBus.emitAsync('user_logged_in', { 
          email: user.email,
      });
  } catch (error) {
      console.error('Error logging in user:', error);
      throw new Error('User login failed');
  }
}

async function logoutUser(user) {
  // Emit an event when a user logs out
  try {
      await eventBus.emitAsync('user_logged_out', {
          email: user.email,
          userId: user.userId
      });
  } catch (error) {
      console.error('Error logging out user:', error);
      throw new Error('User logout failed');
  }
}

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};