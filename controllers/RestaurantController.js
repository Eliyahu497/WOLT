const RestaurantService = require('../services/RestaurantService');

class RestaurantController {
    // Retrieve all restaurants (or filter using query string if provided)
    static getAllRestaurants(req, res) {
        try {
            const { q, search } = req.query;
            const query = q || search;

            if (query) {
                const results = RestaurantService.search(query);
                return res.status(200).json(results);
            }

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
            const { name, description } = req.body;
            if (!name) {
                return res.status(400).json({ error: 'Name is required' });
            }

            const restaurant = RestaurantService.create({ name, description });
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
            const { name, description } = req.body;

            if (!id) {
                return res.status(400).json({ error: 'Restaurant ID is required' });
            }

            const updatedRestaurant = RestaurantService.update(id, { name, description });
            if (!updatedRestaurant) {
                return res.status(404).json({ error: 'Restaurant not found' });
            }

            return res.status(204).send();
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Delete a restaurant
    static deleteRestaurant(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'Restaurant ID is required' });
            }

            const success = RestaurantService.delete(id);
            if (!success) {
                return res.status(404).json({ error: 'Restaurant not found' });
            }

            return res.status(204).send(); // 204 No Content for successful deletion
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = RestaurantController;
