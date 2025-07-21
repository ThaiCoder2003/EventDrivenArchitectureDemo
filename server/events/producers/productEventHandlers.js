const eventBus = require('../eventBus');

async function addToCart(product) {
    // Emit an event when a product is added to the cart
    try {
        console.log('Emitting cart:', product);
        await eventBus.emitAsync('product_added_to_cart', {
            productId: product.id,
            quantity: product.quantity || 1,
            userId: product.userId,
            price: product.price,
            name: product.name
        });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        throw new Error('Failed to add product to cart');
    }
}

async function removeFromCart(product) {
    // Emit an event when a product is removed from the cart
    try {
        await eventBus.emitAsync('product_removed_from_cart', {
            name: product.name,
            productId: product.id,
            userId: product.userId,
            price: product.price
        });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        throw new Error('Failed to remove product from cart');
    }
}

async function purchaseProduct(transaction) {
    // Emit an event when a product is purchased
    try {
        await eventBus.emitAsync('product_purchased', transaction);
    } catch (error) {
        console.error('Error purchasing product:', error);
        throw new Error('Failed to purchase product');
    }
}

module.exports = {
    addToCart,
    removeFromCart,
    purchaseProduct
};

