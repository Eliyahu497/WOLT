const { v4: uuidv4 } = require('uuid');
const InMemoryDB = require('../InMemoryDB');
const Restaurant = require('../models/Restaurant');

class RestaurantService {
    // Returns all restaurants
    static getAll() {
        return InMemoryDB.restaurants.map(rest => {
            rest.orderCount = InMemoryDB.orders ? InMemoryDB.orders.filter(o => o.restaurantId === rest.id).length : 0;
            return rest;
        });
    }

    // Returns a restaurant or null
    static getById(id) {
        const rest = InMemoryDB.restaurants.find(r => r.id === id);
        if (!rest) return null;
        rest.orderCount = InMemoryDB.orders ? InMemoryDB.orders.filter(o => o.restaurantId === rest.id).length : 0;
        return rest;
    }

    // Generates an ID, creates a Restaurant, pushes to InMemoryDB.restaurants, returns it
    static create(data) {
        const id = uuidv4();

        const userExists = InMemoryDB.users.find(u => u.id === data.owner);
        if (!userExists) {
            throw new Error("User not found");
        }

        const newRestaurant = new Restaurant(id, data.name, data.description, data.location, data.owner, data.products || [], data.image, data.category);
        InMemoryDB.restaurants.push(newRestaurant);
        return newRestaurant;
    }

    // Updates name/description/image. Returns updated object or null
    static update(id, data, ownerId) {
        const restaurant = this.getById(id);
        if (!restaurant) return null;

        if (restaurant.owner !== ownerId) {
            throw new Error("You are not the owner of this restaurant");
        }

        if (data.name !== undefined) {
            restaurant.name = data.name;
        }
        if (data.description !== undefined) {
            restaurant.description = data.description;
        }
        if (data.image !== undefined) {
            restaurant.image = data.image;
        }
        if (data.location !== undefined) {
            restaurant.location = data.location;
        }
        if (data.category !== undefined) {
            restaurant.category = data.category;
        }
        return restaurant;
    }

    // Removes the restaurant using splice(). Returns boolean
    static delete(id, ownerId) {
        const restaurant = this.getById(id);
        if (!restaurant) return null;

        if (restaurant.owner !== ownerId) {
            throw new Error("You are not the owner of this restaurant");
        }

        InMemoryDB.restaurants = InMemoryDB.restaurants.filter(r => r.id !== id);
        return true;
    }

    // Returns an array of restaurants where the name or description includes the query string (case-insensitive)
    static search(query) {
        if (!query) return [];
        const lowerQuery = String(query).toLowerCase();
        return InMemoryDB.restaurants
            .filter(r => {
                const nameMatch = r.name && String(r.name).toLowerCase().includes(lowerQuery);
                const descMatch = r.description && String(r.description).toLowerCase().includes(lowerQuery);
                return nameMatch || descMatch;
            })
            .map(rest => {
                rest.orderCount = InMemoryDB.orders ? InMemoryDB.orders.filter(o => o.restaurantId === rest.id).length : 0;
                return rest;
            });
    }

    // Rates a restaurant and updates its average rating
    static rate(id, ratingValue, userId) {
        const restaurant = this.getById(id);
        if (!restaurant) return null;

        if (!restaurant.ratings) {
            restaurant.ratings = {};
            if (restaurant.rating !== undefined && restaurant.rating !== null) {
                restaurant.ratings['seed'] = restaurant.rating;
            }
        }

        restaurant.ratings[userId] = ratingValue;

        const values = Object.values(restaurant.ratings);
        const sum = values.reduce((a, b) => a + b, 0);
        restaurant.rating = parseFloat((sum / values.length).toFixed(1));

        return restaurant;
    }
}

module.exports = RestaurantService;
