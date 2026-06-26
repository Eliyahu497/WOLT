const Order = require('../models/Order');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const crypto = require('crypto');

class OrderService {

    // Create a new order
    async create(userId, restaurantId, items, orderId = null) {
        // 1. Validate that the user exists in the system
        const userExists = await User.findById(userId);
        if (!userExists) {
            throw new Error("User not found");
        }

        // 2. Validate that restaurantId is provided and correct
        if (!restaurantId || typeof restaurantId !== 'string' || !restaurantId.trim()) {
            throw new Error("Restaurant ID is required");
        }

        // 3. Verify that the restaurant exists in the database
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            throw new Error("Restaurant not found");
        }

        // 4. Verify that items is a valid non-empty array
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw new Error("Order must contain at least one item");
        }

        let totalPrice = 0;

        // 5. Map incoming items, validate them, and calculate the total price
        const orderItems = items.map(item => {
            if (!item || !item.productId || typeof item.productId !== 'string' || !item.productId.trim()) {
                throw new Error("Product ID is required for all items");
            }

            const product = restaurant.products ? restaurant.products.id(item.productId) : null;
            if (!product) {
                throw new Error(`Product ${item.productId} not found in restaurant`);
            }

            const qty = Number(item.quantity);
            if (!item.quantity || isNaN(qty) || !Number.isInteger(qty) || qty <= 0) {
                throw new Error(`Quantity for product ${item.productId} must be a positive integer`);
            }

            totalPrice += product.price * qty;

            return {
                productId: item.productId,
                quantity: qty,
                name: product.name,
                price: product.price
            };
        });

        const finalId = orderId || crypto.randomUUID();

        // 6. Add delivery fee to total price
        totalPrice += (restaurant.deliveryPrice || 0);

        // 7. Instantiate the Order and save it to MongoDB
        const newOrder = new Order({
            _id: finalId,
            userId,
            restaurantId,
            items: orderItems,
            total: totalPrice
        });
        
        await newOrder.save();

        return newOrder;
    }

    // Retrieve all orders belonging to a specific user
    async getByUserId(userId) {
        return await Order.find({ userId });
    }

    // Retrieve a single order by its unique ID
    async getById(id) {
        return await Order.findById(id);
    }

    // Update order details by deleting the old order and creating a new updated Order instance
    async update(id, data) {
        const oldOrder = await this.getById(id);
        if (!oldOrder) return null;

        const userId = oldOrder.userId;
        const restaurantId = oldOrder.restaurantId;
        const items = data.items || oldOrder.items;

        await this.delete(id);

        try {
            return await this.create(userId, restaurantId, items, id);
        } catch (error) {
            // Restore original order
            const restoredOrder = new Order({
                _id: oldOrder._id,
                userId: oldOrder.userId,
                restaurantId: oldOrder.restaurantId,
                items: oldOrder.items,
                total: oldOrder.total,
                createdAt: oldOrder.createdAt
            });
            await restoredOrder.save();
            throw error;
        }
    }

    // Delete/Cancel an order
    async delete(id) {
        const result = await Order.findByIdAndDelete(id);
        return result !== null;
    }
}

module.exports = new OrderService();