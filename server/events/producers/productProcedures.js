const eventBus = require('../eventBus');

function addToCart(product) {
    // Emit an event when a product is added to the cart
    eventBus.emit('product_added_to_cart', product);
}

function removeFromCart(product) {
    // Emit an event when a product is removed from the cart
    eventBus.emit('product_removed_from_cart', product);
}

function purchaseProduct(product) {
    // Emit an event when a product is purchased
    eventBus.emit('product_purchased', product);
}

module.exports = {
    addToCart,
    removeFromCart,
    purchaseProduct
};

