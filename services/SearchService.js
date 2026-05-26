// Import the database containing the restaurants and products
const InMemoryDB = require('../InMemoryDB');

class SearchService {
    /**
     * Search for restaurants and products matching a query string.
     * @param {string} query - The text to search for (e.g., "pizza" or "pasta")
     * @returns {Object} An object with two lists: matching restaurants and matching products
     */
    static search(query) {
        // If the search query is empty or undefined, return empty lists immediately
        if (!query) {
            return { restaurants: [], products: [] };
        }

        // Convert the search text to lowercase so the search is not case-sensitive
        const lowerQuery = String(query).toLowerCase();


        //  STEP 1: Search in Restaurants
        // Filter the list of all restaurants in the database
        const matchedRestaurants = InMemoryDB.restaurants.filter(r => {
            // Check if the restaurant name exists and contains our search text
            const nameMatch = r.name && String(r.name).toLowerCase().includes(lowerQuery);

            // Check if the restaurant description exists and contains our search text
            const descMatch = r.description && String(r.description).toLowerCase().includes(lowerQuery);

            // Return true if either the name OR the description contains the search text
            return nameMatch || descMatch;
        });

        //  STEP 2: Search in Products (Menu Items)
        const matchedProducts = [];

        // Go through each restaurant one by one
        InMemoryDB.restaurants.forEach(restaurant => {
            // Check if this restaurant has products, and make sure products is an array
            if (restaurant.products && Array.isArray(restaurant.products)) {
                // Go through each product in this restaurant's menu
                restaurant.products.forEach(product => {
                    // Check if the product name contains our search text
                    const nameMatch = product.name && String(product.name).toLowerCase().includes(lowerQuery);

                    // Check if the product description contains our search text
                    const descMatch = product.description && String(product.description).toLowerCase().includes(lowerQuery);

                    // If either the product name OR its description matches:
                    if (nameMatch || descMatch) {
                        // Add the matching product to our results array
                        matchedProducts.push({
                            id: product.id,
                            name: product.name,
                            description: product.description,
                            price: product.price,
                            // Save the ID of the restaurant that sells this product
                            // (So the client/frontend knows where this product belongs)
                            restaurantId: restaurant.id
                        });
                    }
                });
            }
        });

        // Return the grouped search results
        return {
            restaurants: matchedRestaurants,
            products: matchedProducts
        };
    }
}

// Export the search service class so the controller can use it
module.exports = SearchService;
