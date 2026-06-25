const RestaurantService = require('../services/RestaurantService');
const userService = require('../services/UserService');
const { calculateDistance } = require('../utils/location');

class RestaurantController {
    // Retrieve all restaurants
    static async getAllRestaurants(req, res) {
        try {
            let restaurants = await RestaurantService.getAll();
            
            if (req.user) {
                const user = await userService.getUserById(req.user.id);
                if (user && user.location) {
                    restaurants = restaurants.map(rest => {
                        if (rest.location) {
                            const distance = calculateDistance(user.location, rest.location);
                            if (distance !== null) {
                                return { ...rest, distanceKm: distance };
                            }
                        }
                        return rest;
                    });
                }
            }
            
            return res.status(200).json(restaurants);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Retrieve a single restaurant by ID
    static async getRestaurantById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'Restaurant ID is required' });
            }

            const restaurant = await RestaurantService.getById(id);
            if (!restaurant) {
                return res.status(404).json({ error: 'Restaurant not found' });
            }

            return res.status(200).json(restaurant);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Create a new restaurant
    static async createRestaurant(req, res) {
        try {
            const { name, description, location, image, category } = req.body;
            const owner = req.headers['x-user-id'];
            if (!owner) {
                return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
            }

            const user = await userService.getUserById(owner);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (!name || !image || !category) {
                return res.status(400).json({ error: 'Name, image, and category are required' });
            }

            if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
                return res.status(400).json({ error: 'invalid location: lat and lng must be numbers' });
            }

            const restaurant = await RestaurantService.create({ name, description, location, owner, image, category });
            res.setHeader('Location', `/api/restaurants/${restaurant.id}`);
            return res.status(201).send();
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    // Update an existing restaurant's details
    static async updateRestaurant(req, res) {
        try {
            const { id } = req.params;
            const { name, description, location, image, category } = req.body;
            const owner = req.headers['x-user-id'];

            if (!owner) {
                return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
            }

            if (!id) {
                return res.status(400).json({ error: 'Restaurant ID is required' });
            }
            if (location && (typeof location.lat !== 'number' || typeof location.lng !== 'number')) {
                return res.status(400).json({ error: 'invalid location: lat and lng must be numbers' });
            }

            const updatedRestaurant = await RestaurantService.update(id, { name, description, location, image, category }, owner);
            if (!updatedRestaurant) {
                return res.status(404).json({ error: 'Restaurant not found' });
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

    // Delete a restaurant
    static async deleteRestaurant(req, res) {
        try {
            const { id } = req.params;
            const owner = req.headers['x-user-id'];

            if (!owner) {
                return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
            }

            if (!id) {
                return res.status(400).json({ error: 'Restaurant ID is required' });
            }

            const success = await RestaurantService.delete(id, owner);
            if (!success) {
                return res.status(404).json({ error: 'Restaurant not found' });
            }
            return res.status(204).send(); // 204 No Content for successful deletion
        } catch (error) {
            if (error.message.includes("owner")) {
                return res.status(403).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    // Rate a specific restaurant
    static async rateRestaurant(req, res) {
        try {
            const { id } = req.params;
            const { rating } = req.body;
            const userId = req.user.id;

            if (!id) {
                return res.status(400).json({ error: 'Restaurant ID is required' });
            }

            if (rating === undefined || typeof rating !== 'number' || rating < 1 || rating > 5) {
                return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
            }

            const updatedRestaurant = await RestaurantService.rate(id, rating, userId);
            if (!updatedRestaurant) {
                return res.status(404).json({ error: 'Restaurant not found' });
            }

            return res.status(200).json(updatedRestaurant);
        } catch (error) {
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = RestaurantController;
