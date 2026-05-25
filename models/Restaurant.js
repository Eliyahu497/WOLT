// models/Restaurant.js
class Restaurant {
    constructor(id, name, description, products = []) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.products = products;
    }
}

module.exports = Restaurant;
