const { v4: uuidv4 } = require('uuid');
const InMemoryDB = require('../InMemoryDB');
const Restaurant = require('../models/Restaurant');

class RestaurantService {
    // Returns all restaurants
    static getAll() {
        return InMemoryDB.restaurants;
    }

    // Returns a restaurant or null
    static getById(id) {
        return InMemoryDB.restaurants.find(r => r.id === id) || null;
    }

    // Generates an ID, creates a Restaurant, pushes to InMemoryDB.restaurants, returns it
    static create(data) {
        const id = uuidv4();
        const newRestaurant = new Restaurant(id, data.name, data.description, data.products || []);
        InMemoryDB.restaurants.push(newRestaurant);
        return newRestaurant;
    }

    // Updates name/description. Returns updated object or null
    static update(id, data) {
        const restaurant = this.getById(id);
        if (!restaurant) return null;

        if (data.name !== undefined) {
            restaurant.name = data.name;
        }
        if (data.description !== undefined) {
            restaurant.description = data.description;
        }
        return restaurant;
    }

    // Removes the restaurant using splice(). Returns boolean
    static delete(id) {
        const index = InMemoryDB.restaurants.findIndex(r => r.id === id);
        if (index === -1) return false;

        InMemoryDB.restaurants.splice(index, 1);
        return true;
    }

    // Returns an array of restaurants where the name or description includes the query string (case-insensitive)
    static search(query) {
        if (!query) return [];
        const lowerQuery = String(query).toLowerCase();
        return InMemoryDB.restaurants.filter(r => {
            const nameMatch = r.name && String(r.name).toLowerCase().includes(lowerQuery);
            const descMatch = r.description && String(r.description).toLowerCase().includes(lowerQuery);
            return nameMatch || descMatch;
        });
    }
}

module.exports = RestaurantService;
