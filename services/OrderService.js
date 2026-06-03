const InMemoryDB = require('../InMemoryDB');
const Order = require('../models/Order');
const crypto = require('crypto'); // Built-in Node.js module to generate unique UUIDs

class OrderService {

    // Create a new order in memory (supports custom ID for updates)
    create(userId, restaurantId, items, orderId = null) {
        // 1. Validate that the user exists in the system
        const userExists = InMemoryDB.users.find(u => u.id === userId);
        if (!userExists) {
            throw new Error("User not found");
        }

        // 2. Validate that restaurantId is provided and correct
        if (!restaurantId || typeof restaurantId !== 'string' || !restaurantId.trim()) {
            throw new Error("Restaurant ID is required");
        }

        // 3. Verify that the restaurant exists in the database
        const restaurant = InMemoryDB.restaurants.find(r => r.id === restaurantId);
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
            // Verify that the product ID is provided
            if (!item || !item.productId || typeof item.productId !== 'string' || !item.productId.trim()) {
                throw new Error("Product ID is required for all items");
            }

            // Verify that the product exists in the restaurant's menu
            const product = restaurant.products ? restaurant.products.find(p => p.id === item.productId) : null;
            if (!product) {
                throw new Error(`Product ${item.productId} not found in restaurant`);
            }

            // Verify that the quantity is a positive integer greater than zero
            const qty = Number(item.quantity);
            if (!item.quantity || isNaN(qty) || !Number.isInteger(qty) || qty <= 0) {
                throw new Error(`Quantity for product ${item.productId} must be a positive integer`);
            }

            totalPrice += product.price * qty;

            return {
                productId: item.productId,
                quantity: qty
            };
        });

        // 6. Generate a secure unique ID for the order if not provided
        const finalId = orderId || crypto.randomUUID();

        // 7. Instantiate the Order and save it to the global In-Memory DB
        const newOrder = new Order(finalId, userId, restaurantId, orderItems, totalPrice);
        InMemoryDB.orders.push(newOrder);

        return newOrder;
    }

    // Retrieve all orders belonging to a specific user
    getByUserId(userId) {
        return InMemoryDB.orders.filter(order => order.userId === userId);
    }

    // Retrieve a single order by its unique ID
    getById(id) {
        return InMemoryDB.orders.find(order => order.id === id);
    }

    // Update order details by deleting the old order and creating a new updated Order instance using create()
    update(id, data) {
        const oldOrder = this.getById(id);
        if (!oldOrder) return null;

        // Extract values, defaulting to old values if not provided in update request
        const userId = oldOrder.userId;
        const restaurantId = oldOrder.restaurantId;
        const items = data.items || oldOrder.items;

        // Delete the old order first
        this.delete(id);

        try {
            // Re-create the order with the updated details, reusing the same ID
            return this.create(userId, restaurantId, items, id);
        } catch (error) {
            // If validation in create fails, restore the original order in DB and rethrow error
            InMemoryDB.orders.push(oldOrder);
            throw error;
        }
    }

    // Delete/Cancel an order from the memory array
    delete(id) {
        const index = InMemoryDB.orders.findIndex(order => order.id === id);
        if (index === -1) return false;

        InMemoryDB.orders.splice(index, 1);
        return true;
    }
}

// Export an instance of the service (Singleton pattern)
module.exports = new OrderService();