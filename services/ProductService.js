const Restaurant = require('../models/Restaurant');
const { v4: uuidv4 } = require('uuid');

class ProductService {
    // Returns the products array of the specific restaurant, or null
    static async getProducts(restaurantId) {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) return null;
        return restaurant.products;
    }

    // Returns the specific product, or null
    static async getProductById(restaurantId, productId) {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) return null;
        
        const product = restaurant.products.id(productId);
        return product || null;
    }

    // Generates ID, creates Product, pushes to the restaurant's products array, returns it or null if restaurant not found
    static async addProduct(restaurantId, data, owner) {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) return null;
        if (restaurant.owner !== owner) {
            throw new Error("You are not the owner of this restaurant");
        }
        
        if (!data._id) data._id = uuidv4();
        
        restaurant.products.push(data);
        await restaurant.save();
        
        return restaurant.products.id(data._id);
    }

    // Updates the product. Returns updated product or null if not found
    static async updateProduct(restaurantId, productId, data, owner) {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) return null;
        if (restaurant.owner !== owner) {
            throw new Error("You are not the owner of this restaurant");
        }

        const product = restaurant.products.id(productId);
        if (!product) return null;

        if (data.name !== undefined) product.name = data.name;
        if (data.description !== undefined) product.description = data.description;
        if (data.price !== undefined) product.price = data.price;
        if (data.image !== undefined) product.image = data.image;

        await restaurant.save();
        return product;
    }

    // Removes the product from the array. Returns boolean
    static async deleteProduct(restaurantId, productId, owner) {
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) return false;
        if (restaurant.owner !== owner) {
            throw new Error("You are not the owner of this restaurant");
        }

        const product = restaurant.products.id(productId);
        if (!product) return false;

        restaurant.products.pull(productId);
        await restaurant.save();
        return true;
    }

    // Search for products across all restaurants whose name or description matches the query
    static async search(query) {
        if (!query) return [];
        const regex = new RegExp(query, 'i');
        
        const restaurants = await Restaurant.find({
            $or: [
                { 'products.name': regex },
                { 'products.description': regex }
            ]
        });
        
        const results = [];
        for (const restaurant of restaurants) {
            if (restaurant.products && Array.isArray(restaurant.products)) {
                for (const product of restaurant.products) {
                    const nameMatch = product.name && regex.test(product.name);
                    const descMatch = product.description && regex.test(product.description);
                    if (nameMatch || descMatch) {
                        results.push({
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            image: product.image,
                            restaurantId: restaurant.id
                        });
                    }
                }
            }
        }

        return results;
    }
}

module.exports = ProductService;
