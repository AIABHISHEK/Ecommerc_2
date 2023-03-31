const mongoose = require('mongoose');


const orderSchema = mongoose.Schema({
    products: [
        {
            product: {
                type: Object,
                required:true
            },
            quantity: {
                type: Number,
                required:true
            }
        }
    ],
    user: {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users',
            required:true
        },
        email: {
            type: String,
            required:true
        }
    }
});

module.exports = mongoose.model('orders', orderSchema);