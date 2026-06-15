const { v4: uuidv4 } = require('uuid');
const InMemoryDB = require('../InMemoryDB');
const Product = require('../models/Product');

class ProductService {
    // Returns the products array of the specific restaurant, or null
    static getProducts(restaurantId) {
        const restaurant = InMemoryDB.restaurants.find(r => r.id === restaurantId);
        if (!restaurant) return null;
        return restaurant.products;
    }

    // Returns the specific product, or null
    static getProductById(restaurantId, productId) {
        const restaurant = InMemoryDB.restaurants.find(r => r.id === restaurantId);
        if (!restaurant) return null;
        
        const product = restaurant.products.find(p => p.id === productId);
        return product || null;
    }

    // Generates ID, creates Product, pushes to the restaurant's products array, returns it or null if restaurant not found
    static addProduct(restaurantId, data, owner) {
        const restaurant = InMemoryDB.restaurants.find(r => r.id === restaurantId);
        if (!restaurant) return null;
        if (restaurant.owner !== owner) {
            throw new Error("You are not the owner of this restaurant");
        }
        const id = uuidv4();
        const newProduct = new Product(id, data.name, data.description, data.price, data.image);
        restaurant.products.push(newProduct);
        return newProduct;
    }

    // Updates the product. Returns updated product or null if not found
    static updateProduct(restaurantId, productId, data, owner) {
        const restaurant = InMemoryDB.restaurants.find(r => r.id === restaurantId);
        if (!restaurant) return null;
        if (restaurant.owner !== owner) {
            throw new Error("You are not the owner of this restaurant");
        }

        const product = restaurant.products.find(p => p.id === productId);
        if (!product) return null;

        if (data.name !== undefined) product.name = data.name;
        if (data.description !== undefined) product.description = data.description;
        if (data.price !== undefined) product.price = data.price;
        if (data.image !== undefined) product.image = data.image;

        return product;
    }

    // Removes the product from the array. Returns boolean
    static deleteProduct(restaurantId, productId, owner) {
        const restaurant = InMemoryDB.restaurants.find(r => r.id === restaurantId);
        if (!restaurant) return false;
        if (restaurant.owner !== owner) {
            throw new Error("You are not the owner of this restaurant");
        }

        const index = restaurant.products.findIndex(p => p.id === productId);
        if (index === -1) return false;

        restaurant.products.splice(index, 1);
        return true;
    }

    // Search for products across all restaurants whose name or description matches the query
    static search(query) {
        if (!query) return [];
        const lowerQuery = String(query).toLowerCase();
        const results = [];

        InMemoryDB.restaurants.forEach(restaurant => {
            if (restaurant.products && Array.isArray(restaurant.products)) {
                restaurant.products.forEach(product => {
                    const nameMatch = product.name && String(product.name).toLowerCase().includes(lowerQuery);
                    const descMatch = product.description && String(product.description).toLowerCase().includes(lowerQuery);
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
                });
            }
        });

        return results;
    }
}

module.exports = ProductService;
