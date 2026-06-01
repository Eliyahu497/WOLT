const orderService = require('../services/OrderService');

class OrderController {

    // POST /api/orders - Create a new order
    createOrder(req, res) {
        try {
            // Extract the authenticated user ID from the custom HTTP header
            const userId = req.headers['x-user-id'];
            const { restaurantId, items } = req.body;

            if (!restaurantId || !items || items.length === 0) {
                return res.status(400).json({ error: "Missing required fields (restaurantId or items)" });
            }

            // Basic protection fallback if Header is entirely missing
            if (!userId) {
                return res.status(400).json({ error: "Missing required X-User-ID header" });
            }

            const newOrder = orderService.create(userId, restaurantId, items);

            // 210 Created status on successful resource initialization
            return res.status(201).json(newOrder);
        } catch (error) {
            // Task 63: Capture failures gracefully (e.g., User not found in DB)
            return res.status(400).json({ error: error.message });
        }
    }

    // GET /api/orders - Retrieve all orders for the current user
    getUserOrders(req, res) {
        const userId = req.headers['x-user-id'];
        if (!userId) {
            return res.status(400).json({ error: "Missing required X-User-ID header" });
        }

        const orders = orderService.getByUserId(userId);
        return res.status(200).json(orders);
    }

    // GET /api/orders/:id - Retrieve specific order details
    getOrderById(req, res) {
        const { id } = req.params;
        const order = orderService.getById(id);

        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }

        return res.status(200).json(order);
    }

    // PATCH /api/orders/:id - Update order status
    updateOrder(req, res) {
        const { id } = req.params;
        const updatedOrder = orderService.update(id, req.body);

        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found to update" });
        }

        // 204 No Content specifies a successful mutation with an empty response body
        return res.status(204).json(updatedOrder);
    }

    // DELETE /api/orders/:id - Cancel/Remove an order
    deleteOrder(req, res) {
        const { id } = req.params;
        const isDeleted = orderService.delete(id);

        if (!isDeleted) {
            return res.status(404).json({ error: "Order not found to delete" });
        }

        return res.status(204).send();
    }
}

module.exports = new OrderController();