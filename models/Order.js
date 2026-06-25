const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const OrderItemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    quantity: { type: Number, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    userId: { type: String, ref: 'User', required: true },
    restaurantId: { type: String, ref: 'Restaurant', required: true },
    items: [OrderItemSchema],
    total: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
}, {
    toJSON: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    toObject: {
        virtuals: true,
        transform: (doc, ret) => {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

module.exports = mongoose.model('Order', OrderSchema);