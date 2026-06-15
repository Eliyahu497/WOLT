// models/Restaurant.js
class Restaurant {
    constructor(id, name, description, location, owner, products = []) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.location = location;
        this.owner = owner;
        this.products = products;
    }
}

module.exports = Restaurant;
