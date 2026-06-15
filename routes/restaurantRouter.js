const express = require('express');
const router = express.Router();
const RestaurantController = require('../controllers/RestaurantController');
const ProductController = require('../controllers/ProductController');
const { authenticateToken, optionalAuthenticateToken, isManager } = require('../middlewares/auth');

// --- Restaurant Routes ---
// GET / - Retrieve all restaurants
router.get('/', optionalAuthenticateToken, RestaurantController.getAllRestaurants);

// POST / - Create a new restaurant
router.post('/', RestaurantController.createRestaurant);

// GET /:id - Retrieve a specific restaurant by ID
router.get('/:id', RestaurantController.getRestaurantById);

// PATCH /:id - Update details of a specific restaurant
router.patch('/:id', RestaurantController.updateRestaurant);

// DELETE /:id - Delete a specific restaurant
router.delete('/:id', authenticateToken, isManager, RestaurantController.deleteRestaurant);


// --- Nested Product Routes ---
// GET /:restaurantId/products - Retrieve all products of a specific restaurant
router.get('/:restaurantId/products', ProductController.getProducts);

// POST /:restaurantId/products - Add a new product to a specific restaurant
router.post('/:restaurantId/products', ProductController.addProduct);

// GET /:restaurantId/products/:productId - Retrieve a specific product by its ID
router.get('/:restaurantId/products/:productId', ProductController.getProductById);

// PATCH /:restaurantId/products/:productId - Update details of a specific product
router.patch('/:restaurantId/products/:productId', ProductController.updateProduct);

// DELETE /:restaurantId/products/:productId - Delete a specific product
router.delete('/:restaurantId/products/:productId', authenticateToken, isManager, ProductController.deleteProduct);

module.exports = router;
