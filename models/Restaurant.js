// models/Restaurant.js
class Restaurant {
    constructor(id, name, description, location, owner, products = [], image, category, rating = null) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.location = location;
        this.owner = owner;
        this.products = products;
        this.image = image;
        this.category = category;
        this.rating = rating;
        this.ratings = {};
        this.orderCount = 0;
    }
}

module.exports = Restaurant;
