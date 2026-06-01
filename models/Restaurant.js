// models/Restaurant.js
class Restaurant {
    constructor(id, name, description, owner, products = []) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.owner = owner;
        this.products = products;
    }
}

module.exports = Restaurant;
