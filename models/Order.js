// models/Order.js
class Order {
    constructor(id, userId, restaurantId, items = [], status = 'pending', total = 0) {
        this.id = id;                 // Unique UUID for the order
        this.userId = userId;         // The ID of the user placing the order (from X-User-ID)
        this.restaurantId = restaurantId; // The ID of the restaurant
        this.items = items;           // Array of OrderItem instances
        this.status = status;         // Order status (e.g., 'pending', 'completed')
        this.total = total;           // Total calculated price of the order
    }
}

module.exports = Order;