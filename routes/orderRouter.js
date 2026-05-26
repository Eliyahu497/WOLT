const express = require('express');
const router = express.Router();
const orderController = require('../controllers/OrderController');

// Define endpoint maps pointing directly to controller handlers
router.post('/', orderController.createOrder);        // Maps to POST /api/orders
router.get('/', orderController.getUserOrders);       // Maps to GET /api/orders
router.get('/:id', orderController.getOrderById);     // Maps to GET /api/orders/:id
router.patch('/:id', orderController.updateOrder);   // Maps to PATCH /api/orders/:id
router.delete('/:id', orderController.deleteOrder);  // Maps to DELETE /api/orders/:id

module.exports = router;