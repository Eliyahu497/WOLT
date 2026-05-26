const InMemoryDB = require('../InMemoryDB');
const Order = require('../models/Order');
const crypto = require('crypto'); // Built-in Node.js module to generate unique UUIDs

class OrderService {
    
    // Create a new order in memory
    create(userId, restaurantId, items) {
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

        // 6. Generate a secure unique ID for the order
        const orderId = crypto.randomUUID();

        // 7. Instantiate the Order and save it to the global In-Memory DB
        const newOrder = new Order(orderId, userId, restaurantId, orderItems, 'pending', totalPrice);
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

    // Update order details (e.g., changing status from 'pending' to 'completed')
    update(id, data) {
        const order = this.getById(id);
        if (!order) return null;

        if (data.status) order.status = data.status;
        return order;
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