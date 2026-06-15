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

        const userExists = InMemoryDB.users.find(u => u.id === data.owner);
        if (!userExists) {
            throw new Error("User not found");
        }

        const newRestaurant = new Restaurant(id, data.name, data.description, data.location, data.owner, data.products || [], data.image);
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
        return InMemoryDB.restaurants.filter(r => {
            const nameMatch = r.name && String(r.name).toLowerCase().includes(lowerQuery);
            const descMatch = r.description && String(r.description).toLowerCase().includes(lowerQuery);
            return nameMatch || descMatch;
        });
    }
}

module.exports = RestaurantService;
