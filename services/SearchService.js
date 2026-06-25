// Import RestaurantService and ProductService to query data
const RestaurantService = require('./RestaurantService');
const ProductService = require('./ProductService');

class SearchService {
    /**
     * Search for restaurants and products matching a query string.
     * @param {string} query - The text to search for (e.g., "pizza" or "pasta")
     * @returns {Object} An object with two lists: matching restaurants and matching products
     */
    static async search(query) {
        // If the search query is empty or undefined, return empty lists immediately
        if (!query) {
            return { restaurants: [], products: [] };
        }

        // 1. Delegate search to RestaurantService
        const matchedRestaurants = await RestaurantService.search(query);

        // 2. Delegate search to ProductService
        const matchedProducts = await ProductService.search(query);

        // Return the grouped search results
        return {
            restaurants: matchedRestaurants,
            products: matchedProducts
        };
    }
}

// Export the search service class so the controller can use it
module.exports = SearchService;
