const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const ProductSchema = require('./Product');

const RestaurantSchema = new mongoose.Schema({
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    description: { type: String },
    location: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
    },
    owner: { type: String, ref: 'User', required: true },
    category: { type: String, ref: 'Category', required: true },
    image: { type: String, required: true },
    rating: { type: Number, default: null },
    ratings: { type: Map, of: Number, default: {} },
    deliveryTime: { type: String },
    deliveryPrice: { type: Number },
    products: [ProductSchema]
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

module.exports = mongoose.model('Restaurant', RestaurantSchema);
