const ProductService = require('../services/ProductService');

class ProductController {
    // Get all products of a specific restaurant
    static getProducts(req, res) {
        try {
            const { restaurantId } = req.params;
            if (!restaurantId) {
                return res.status(400).json({ error: 'Restaurant ID is required' });
            }

            const products = ProductService.getProducts(restaurantId);
            if (!products) {
                return res.status(404).json({ error: 'Restaurant not found' });
            }

            return res.status(200).json(products);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Get a specific product of a specific restaurant by its ID
    static getProductById(req, res) {
        try {
            const { restaurantId, productId } = req.params;
            if (!restaurantId || !productId) {
                return res.status(400).json({ error: 'Restaurant ID and Product ID are required' });
            }

            const product = ProductService.getProductById(restaurantId, productId);
            if (!product) {
                return res.status(404).json({ error: 'Product or Restaurant not found' });
            }

            const userId = req.headers['x-user-id'];
            // TODO: Call TCPClient.addProductView(userId, productId)

            return res.status(200).json(product);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Add a new product to a specific restaurant
    static addProduct(req, res) {
        try {
            const { restaurantId } = req.params;
            const { name, description, price } = req.body;

            if (!restaurantId) {
                return res.status(400).json({ error: 'Restaurant ID is required' });
            }
            if (!name || price === undefined) {
                return res.status(400).json({ error: 'Name and price are required' });
            }

            const newProduct = ProductService.addProduct(restaurantId, { 
                name, 
                description, 
                price: Number(price) 
            });

            if (!newProduct) {
                return res.status(404).json({ error: 'Restaurant not found' });
            }

            return res.status(201).json(newProduct);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Update a product's details
    static updateProduct(req, res) {
        try {
            const { restaurantId, productId } = req.params;
            const { name, description, price } = req.body;

            if (!restaurantId || !productId) {
                return res.status(400).json({ error: 'Restaurant ID and Product ID are required' });
            }

            const updatedProduct = ProductService.updateProduct(restaurantId, productId, {
                name,
                description,
                price: price !== undefined ? Number(price) : undefined
            });

            if (!updatedProduct) {
                return res.status(404).json({ error: 'Product or Restaurant not found' });
            }

            return res.status(200).json(updatedProduct);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Delete a product from a restaurant
    static deleteProduct(req, res) {
        try {
            const { restaurantId, productId } = req.params;

            if (!restaurantId || !productId) {
                return res.status(400).json({ error: 'Restaurant ID and Product ID are required' });
            }

            const success = ProductService.deleteProduct(restaurantId, productId);
            if (!success) {
                return res.status(404).json({ error: 'Product or Restaurant not found' });
            }

            return res.status(204).send(); // 204 No Content for successful deletion
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = ProductController;
