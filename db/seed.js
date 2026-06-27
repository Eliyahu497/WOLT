const mongoose = require('mongoose');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const Order = require('../models/Order');
const InMemoryDB = require('../InMemoryDB');

async function seedData() {
    try {
        const categoryCount = await Category.countDocuments();
        const userCount = await User.countDocuments();
        const restaurantCount = await Restaurant.countDocuments();

        if (categoryCount === 0 && userCount === 0 && restaurantCount === 0) {
            console.log('Database is empty. Starting seed...');

            // Seed categories
            await Category.insertMany(InMemoryDB.categories.map(c => ({
                _id: c.id,
                name: c.name,
                icon: c.icon
            })));
            console.log('Categories seeded.');

            // Seed users
            await User.insertMany(InMemoryDB.users.map(u => ({
                _id: u.id,
                name: u.name,
                email: u.email,
                phone: u.phone,
                location: u.location,
                userName: u.userName,
                password: u.password,
                role: u.role,
                avatar: u.avatar
            })));
            console.log('Users seeded.');

            // Seed restaurants
            await Promise.all(InMemoryDB.restaurants.map(r => {
                return Restaurant.create({
                    _id: r.id,
                    name: r.name,
                    description: r.description,
                    location: r.location,
                    owner: r.owner,
                    category: r.category,
                    image: r.image,
                    rating: r.rating,
                    ratings: r.ratings || {},
                    deliveryTime: r.deliveryTime || "25-35 min",
                    deliveryPrice: r.deliveryPrice || 15,
                    products: r.products.map(p => ({
                        _id: p.id,
                        name: p.name,
                        description: p.description,
                        price: p.price,
                        image: p.image
                    }))
                });
            }));
            console.log('Restaurants seeded.');
            
            if (InMemoryDB.orders && InMemoryDB.orders.length > 0) {
                await Order.insertMany(InMemoryDB.orders.map(o => ({
                    _id: o.id,
                    userId: o.userId,
                    restaurantId: o.restaurantId,
                    items: o.items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        name: item.name,
                        price: item.price
                    })),
                    total: o.total
                })));
                console.log('Orders seeded.');
            }
            
            console.log('Seed completed successfully!');
        } else {
            console.log('Database already has data. Skipping seed.');
        }
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

module.exports = seedData;

// If run directly
if (require.main === module) {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/wolt';
    mongoose.connect(MONGODB_URI)
        .then(async () => {
            console.log('Connected to MongoDB for standalone seeding');
            await seedData();
            await mongoose.disconnect();
            console.log('Disconnected from MongoDB');
            process.exit(0);
        })
        .catch(err => {
            console.error('Failed to connect to MongoDB for seeding:', err);
            process.exit(1);
        });
}
