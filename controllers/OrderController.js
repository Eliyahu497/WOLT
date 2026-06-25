const orderService = require('../services/OrderService');
const tcpClient = require('../services/TCPClient');

class OrderController {

    // POST /api/orders - Create a new order
    async createOrder(req, res) {
        try {
            const userId = req.headers['x-user-id'];
            const { restaurantId, items } = req.body;

            if (!restaurantId || !items || items.length === 0) {
                return res.status(400).json({ error: "Missing required fields (restaurantId or items)" });
            }

            if (!userId) {
                return res.status(400).json({ error: "Missing required X-User-ID header" });
            }

            const newOrder = await orderService.create(userId, restaurantId, items);

            const productIds = items.map(item => item.productId);
            tcpClient.reportInteraction(userId, productIds).catch(err => {
                console.error(`[TCP Client Error] Failed to report purchase to C++ server: ${err.message}`);
            });

            return res.status(201).json(newOrder);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: error.message });
            }
            return res.status(400).json({ error: error.message });
        }
    }

    // GET /api/orders - Retrieve all orders for the current user
    async getUserOrders(req, res) {
        try {
            const userId = req.headers['x-user-id'];
            if (!userId) {
                return res.status(400).json({ error: "Missing required X-User-ID header" });
            }

            const orders = await orderService.getByUserId(userId);
            return res.status(200).json(orders);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // GET /api/orders/:id - Retrieve specific order details
    async getOrderById(req, res) {
        try {
            const { id } = req.params;
            const order = await orderService.getById(id);

            if (!order) {
                return res.status(404).json({ error: "Order not found" });
            }

            return res.status(200).json(order);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // PATCH /api/orders/:id - Update order items
    async updateOrder(req, res) {
        try {
            const { id } = req.params;

            const oldOrder = await orderService.getById(id);
            if (!oldOrder) {
                return res.status(404).json({ error: "Order not found to update" });
            }
            const oldProductIds = oldOrder.items.map(item => item.productId);

            const updatedOrder = await orderService.update(id, req.body);
            if (!updatedOrder) {
                return res.status(404).json({ error: "Order not found to update" });
            }

            if (req.body.items) {
                const newProductIds = updatedOrder.items.map(item => item.productId);
                const removedProductIds = oldProductIds.filter(pid => !newProductIds.includes(pid));

                const allOtherOrders = (await orderService.getByUserId(updatedOrder.userId))
                    .filter(order => order.id !== id);

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
                    tcpClient.reportInteraction(updatedOrder.userId, newProductIds).catch(err => {
                        console.error(`[TCP Client Error] Failed to report purchase to C++ server: ${err.message}`);
                    });
                }
            }

            return res.status(204).json(updatedOrder);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    // DELETE /api/orders/:id - Cancel/Remove an order
    async deleteOrder(req, res) {
        try {
            const { id } = req.params;

            const order = await orderService.getById(id);
            if (!order) {
                return res.status(404).json({ error: "Order not found to delete" });
            }

            if (req.user && req.user.role !== 'manager' && order.userId !== req.user.id) {
                return res.status(403).json({ error: "Forbidden: You can only cancel your own orders" });
            }

            const userId = order.userId;
            const productIds = order.items.map(item => item.productId);

            const isDeleted = await orderService.delete(id);
            if (!isDeleted) {
                return res.status(404).json({ error: "Order not found to delete" });
            }

            const allOtherOrders = await orderService.getByUserId(userId);
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
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new OrderController();