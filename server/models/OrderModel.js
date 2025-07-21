const mongoose = require('mongoose');
const OrderModel = new mongoose.Schema({
    user: { type: String, required: true },
    products: [{
        product: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, default: 1 }
    }],
    totalPrice: { type: Number, required: true, default: 0 },
    boughtDate: { type: Date, default: Date.now },
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', OrderModel);