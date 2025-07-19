const eventBus = require('../eventBus');

function registerUser(user) {
  // Emit an event when a user is registered
  eventBus.emit('user_registered', user);
}

function loginUser(user) {
  // Emit an event when a user logs in
  eventBus.emit('user_logged_in', user);
}

function logoutUser(user) {
  // Emit an event when a user logs out
  eventBus.emit('user_logged_out', user);
}

function editUser(user) {
  // Emit an event when a user edits their profile
  eventBus.emit('user_edited', user);
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    editUser
};