const RestaurantService = require('../services/RestaurantService');
const userService = require('../services/UserService');

class RestaurantController {
    // Retrieve all restaurants
    static getAllRestaurants(req, res) {
        try {
            const restaurants = RestaurantService.getAll();
            return res.status(200).json(restaurants);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Retrieve a single restaurant by ID
    static getRestaurantById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'Restaurant ID is required' });
            }

            const restaurant = RestaurantService.getById(id);
            if (!restaurant) {
                return res.status(404).json({ error: 'Restaurant not found' });
            }

            return res.status(200).json(restaurant);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Create a new restaurant
    static createRestaurant(req, res) {
        try {
            const { name, description, image } = req.body;
            const owner = req.headers['x-user-id'];
            if (!owner) {
                return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
            }

            const user = userService.getUserById(owner);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            if (!name || !image) {
                return res.status(400).json({ error: 'Name and image are required' });
            }

            const restaurant = RestaurantService.create({ name, description, owner, image });
            res.setHeader('Location', `/api/restaurants/${restaurant.id}`);
            return res.status(201).send();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Update an existing restaurant's details
    static updateRestaurant(req, res) {
        try {
            const { id } = req.params;
            const { name, description, image } = req.body;
            const owner = req.headers['x-user-id'];

            if (!owner) {
                return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
            }

            if (!id) {
                return res.status(400).json({ error: 'Restaurant ID is required' });
            }
            const updatedRestaurant = RestaurantService.update(id, { name, description, image }, owner);
            if (!updatedRestaurant) {
                return res.status(404).json({ error: 'Restaurant not found' });
            }
            return res.status(204).send();
        } catch (error) {
            if (error.message.includes("owner")) {
                return res.status(403).json({ error: error.message });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    // Delete a restaurant
    static deleteRestaurant(req, res) {
        try {
            const { id } = req.params;
            const owner = req.headers['x-user-id'];

            if (!owner) {
                return res.status(401).json({ error: 'Unauthorized: Missing user ID' });
            }

            if (!id) {
                return res.status(400).json({ error: 'Restaurant ID is required' });
            }

            const success = RestaurantService.delete(id, owner);
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
}

module.exports = RestaurantController;
