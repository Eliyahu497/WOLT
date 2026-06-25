const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    icon: { type: String, required: true }
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

module.exports = mongoose.model('Category', CategorySchema);
