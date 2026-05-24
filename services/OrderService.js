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

        // 2. Find the restaurant to look up product prices
        const restaurant = InMemoryDB.restaurants.find(r => r.id === restaurantId);
        let totalPrice = 0;

        // Map incoming items and calculate the total price dynamically
        const orderItems = items.map(item => {
            let productPrice = 50; // Mock fallback price if Developer 2's catalog isn't ready yet
            
            if (restaurant && restaurant.products) {
                const product = restaurant.products.find(p => p.id === item.productId);
                if (product) {
                    productPrice = product.price;
                }
            }
            
            totalPrice += productPrice * item.quantity;
            
            return {
                productId: item.productId,
                quantity: item.quantity
            };
        });

        // 3. Generate a secure unique ID for the order
        const orderId = crypto.randomUUID();

        // 4. Instantiate the Order and save it to the global In-Memory DB
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