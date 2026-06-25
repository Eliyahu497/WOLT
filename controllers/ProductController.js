const ProductService = require('../services/ProductService');
const tcpClient = require('../services/TCPClient');

class ProductController {
    // Get all products of a specific restaurant
    static async getProducts(req, res) {
        try {
            const { restaurantId } = req.params;
            if (!restaurantId) {
                return res.status(400).json({ error: 'Restaurant ID is required' });
            }

            const products = await ProductService.getProducts(restaurantId);
            if (!products) {
                return res.status(404).json({ error: 'Restaurant not found' });
            }

            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Get a specific product of a specific restaurant by its ID
    static async getProductById(req, res) {
        try {
            const { restaurantId, productId } = req.params;
            if (!restaurantId || !productId) {
                return res.status(400).json({ error: 'Restaurant ID and Product ID are required' });
            }

            const product = await ProductService.getProductById(restaurantId, productId);
            if (!product) {
                return res.status(404).json({ error: 'Product or Restaurant not found' });
            }

            const userId = req.headers['x-user-id'];
            if (userId) {
                tcpClient.reportInteraction(userId, productId).catch(err => {
                    console.error(`[TCP Client Error] Failed to report view to C++ server: ${err.message}`);
                });
            }

            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Add a new product to a specific restaurant
    static async addProduct(req, res) {
        try {
            const { restaurantId } = req.params;
            const { name, description, price, image } = req.body;
            const owner = req.headers['x-user-id'];
            if (!owner) {
                return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
            }
            if (!restaurantId) {
                return res.status(400).json({ error: 'Restaurant ID is required' });
            }
            if (!name || price === undefined || !image) {
                return res.status(400).json({ error: 'Name, price and image are required' });
            }
            if (isNaN(Number(price)) || Number(price) <= 0) {
                return res.status(400).json({ error: 'Price must be a positive number' });
            }

            const newProduct = await ProductService.addProduct(restaurantId, {
                name,
                description,
                price: Number(price),
                image
            }, owner);

            if (!newProduct) {
                return res.status(404).json({ error: 'Restaurant not found' });
            }

            res.setHeader('Location', `/api/restaurants/${restaurantId}/products/${newProduct.id}`);
            return res.status(201).send();
        } catch (error) {
            if (error.message.includes("owner")) {
                return res.status(403).json({ error: error.message });
            }
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    // Update a product's details
    static async updateProduct(req, res) {
        try {
            const { restaurantId, productId } = req.params;
            const { name, description, price, image } = req.body;
            const owner = req.headers['x-user-id'];
            if (!owner) {
                return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
            }
            if (!restaurantId || !productId) {
                return res.status(400).json({ error: 'Restaurant ID and Product ID are required' });
            }
            if (price !== undefined && (isNaN(Number(price)) || Number(price) <= 0)) {
                return res.status(400).json({ error: 'Price must be a positive number' });
            }

            const updatedProduct = await ProductService.updateProduct(restaurantId, productId, {
                name,
                description,
                price: price !== undefined ? Number(price) : undefined,
                image
            }, owner);

            if (!updatedProduct) {
                return res.status(404).json({ error: 'Product or Restaurant not found' });
            }

            return res.status(204).send();
        } catch (error) {
            if (error.message.includes("owner")) {
                return res.status(403).json({ error: error.message });
            }
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    // Delete a product from a restaurant
    static async deleteProduct(req, res) {
        try {
            const { restaurantId, productId } = req.params;
            const owner = req.headers['x-user-id'];
            if (!owner) {
                return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
            }
            if (!restaurantId || !productId) {
                return res.status(400).json({ error: 'Restaurant ID and Product ID are required' });
            }

            const success = await ProductService.deleteProduct(restaurantId, productId, owner);
            if (!success) {
                return res.status(404).json({ error: 'Product or Restaurant not found' });
            }

            return res.status(204).send(); // 204 No Content for successful deletion
        } catch (error) {
            if (error.message.includes("owner")) {
                return res.status(403).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ProductController;
