const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');

class RestaurantService {
    // Returns all restaurants
    static async getAll() {
        const restaurants = await Restaurant.find();
        const orders = await Order.find();
        
        return restaurants.map(rest => {
            const restObj = rest.toObject();
            restObj.orderCount = orders.filter(o => o.restaurantId === rest.id).length;
            return restObj;
        });
    }

    // Returns a restaurant or null
    static async getById(id) {
        const rest = await Restaurant.findById(id);
        if (!rest) return null;
        
        const orderCount = await Order.countDocuments({ restaurantId: id });
        const restObj = rest.toObject();
        restObj.orderCount = orderCount;
        return restObj;
    }

    // Generates an ID, creates a Restaurant, pushes to DB, returns it
    static async create(data) {
        const userExists = await User.findById(data.owner);
        if (!userExists) {
            throw new Error("User not found");
        }

        const newRestaurant = new Restaurant(data);
        await newRestaurant.save();
        return newRestaurant;
    }

    // Updates name/description/image. Returns updated object or null
    static async update(id, data, ownerId) {
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) return null;

        if (restaurant.owner !== ownerId) {
            throw new Error("You are not the owner of this restaurant");
        }

        if (data.name !== undefined) restaurant.name = data.name;
        if (data.description !== undefined) restaurant.description = data.description;
        if (data.image !== undefined) restaurant.image = data.image;
        if (data.location !== undefined) restaurant.location = data.location;
        if (data.category !== undefined) restaurant.category = data.category;

        await restaurant.save();
        return restaurant;
    }

    // Removes the restaurant using findOneAndDelete(). Returns boolean
    static async delete(id, ownerId) {
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) return false;

        if (restaurant.owner !== ownerId) {
            throw new Error("You are not the owner of this restaurant");
        }

        await Restaurant.findByIdAndDelete(id);
        return true;
    }

    // Returns an array of restaurants where the name or description includes the query string (case-insensitive)
    static async search(query) {
        if (!query) return [];
        const regex = new RegExp(query, 'i');
        const restaurants = await Restaurant.find({
            $or: [
                { name: regex },
                { description: regex }
            ]
        });
        
        const orders = await Order.find();
        return restaurants.map(rest => {
            const restObj = rest.toObject();
            restObj.orderCount = orders.filter(o => o.restaurantId === rest.id).length;
            return restObj;
        });
    }

    // Rates a restaurant and updates its average rating
    static async rate(id, ratingValue, userId) {
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) return null;

        if (!restaurant.ratings) {
            restaurant.ratings = new Map();
        }

        restaurant.ratings.set(userId, ratingValue);

        let sum = 0;
        let count = 0;
        restaurant.ratings.forEach((val) => {
            sum += val;
            count++;
        });
        
        restaurant.rating = parseFloat((sum / count).toFixed(1));

        await restaurant.save();
        return restaurant;
    }
}

module.exports = RestaurantService;
