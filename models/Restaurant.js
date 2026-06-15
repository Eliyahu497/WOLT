// models/Restaurant.js
class Restaurant {
    constructor(id, name, description, owner, products = [], image) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.owner = owner;
        this.products = products;
        this.image = image;
    }
}

module.exports = Restaurant;
