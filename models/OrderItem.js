// models/OrderItem.js
class OrderItem {
    constructor(productId, quantity) {
        this.productId = productId; // ID of the specific product
        this.quantity = quantity;   // Quantity ordered
    }
}

module.exports = OrderItem;