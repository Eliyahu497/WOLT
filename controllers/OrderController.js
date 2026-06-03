const orderService = require('../services/OrderService');
const tcpClient = require('../services/TCPClient');

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

            // Report the purchase of items to the C++ recommendation engine.
            // Under exercise 2 rules, we attempt a PATCH operation to append the purchased products to the user's existing history.
            // If the user does not exist in the recommender system database, PATCH returns 404, in which case we fall back to a POST operation.
            const productIds = items.map(item => item.productId);
            tcpClient.reportInteraction(userId, productIds).catch(err => {
                console.error(`[TCP Client Error] Failed to report purchase to C++ server: ${err.message}`);
            });

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

    // PATCH /api/orders/:id - Update order items
    updateOrder(req, res) {
        const { id } = req.params;

        // Retrieve the old order before updating to compare items
        const oldOrder = orderService.getById(id);
        if (!oldOrder) {
            return res.status(404).json({ error: "Order not found to update" });
        }
        const oldProductIds = oldOrder.items.map(item => item.productId);

        const updatedOrder = orderService.update(id, req.body);
        if (!updatedOrder) {
            return res.status(404).json({ error: "Order not found to update" });
        }

        // If the items list is modified, update the user's history in the C++ RecommenderServer
        if (req.body.items) {
            const newProductIds = updatedOrder.items.map(item => item.productId);
            // Identify products that were removed from this specific order
            const removedProductIds = oldProductIds.filter(pid => !newProductIds.includes(pid));

            // Exclude the current updated order from the other orders check
            const allOtherOrders = orderService.getByUserId(updatedOrder.userId)
                .filter(order => order.id !== id);

            // Only delete if the product is not in any of the user's other orders
            const productsToDelete = removedProductIds.filter(pid => {
                const isInOtherOrder = allOtherOrders.some(order =>
                    order.items.some(item => item.productId === pid)
                );
                return !isInOtherOrder;
            });

            if (productsToDelete.length > 0) {
                tcpClient.removePurchase(updatedOrder.userId, productsToDelete)
                    .then(() => {
                        return tcpClient.reportInteraction(updatedOrder.userId, newProductIds);
                    })
                    .catch(err => {
                        console.error(`[TCP Client Error] Failed to update purchase on C++ server: ${err.message}`);
                    });
            } else {
                // If no products need to be deleted, just report/append the new ones
                tcpClient.reportInteraction(updatedOrder.userId, newProductIds).catch(err => {
                    console.error(`[TCP Client Error] Failed to report purchase to C++ server: ${err.message}`);
                });
            }
        }

        // 204 No Content specifies a successful mutation with an empty response body
        return res.status(204).json(updatedOrder);
    }

    // DELETE /api/orders/:id - Cancel/Remove an order
    deleteOrder(req, res) {
        const { id } = req.params;

        // 1. Retrieve the order from database first
        const order = orderService.getById(id);
        if (!order) {
            return res.status(404).json({ error: "Order not found to delete" });
        }

        // 2. Extract the details we need for the TCP command while the order still exists
        const userId = order.userId;
        const productIds = order.items.map(item => item.productId);

        // 3. Delete the order from the local database
        const isDeleted = orderService.delete(id);
        if (!isDeleted) {
            return res.status(404).json({ error: "Order not found to delete" });
        }

        // 4. Send the DELETE command asynchronously to the C++ RecommenderServer
        // Only delete the products that are NOT present in any other active orders of this user
        const allOtherOrders = orderService.getByUserId(userId);
        const productsToDelete = productIds.filter(pid => {
            const isInOtherOrder = allOtherOrders.some(o =>
                o.items.some(item => item.productId === pid)
            );
            return !isInOtherOrder;
        });

        if (productsToDelete.length > 0) {
            tcpClient.removePurchase(userId, productsToDelete).catch(err => {
                console.error(`[TCP Client Error] Failed to remove purchase from C++ server: ${err.message}`);
            });
        }

        return res.status(204).send();
    }
}

module.exports = new OrderController();