// InMemoryDB.js - Temporary application database stored in server memory
const InMemoryDB = {
    categories: [
        { id: "sushi", name: "Sushi", icon: "🍣" },
        { id: "burgers", name: "Burgers", icon: "🍔" },
        { id: "pizza", name: "Pizza", icon: "🍕" },
        { id: "asian", name: "Asian", icon: "🥢" },
        { id: "desserts", name: "Desserts", icon: "🍰" },
        { id: "indian", name: "Indian", icon: "🍛" },
        { id: "mexican", name: "Mexican", icon: "🌮" },
        { id: "italian", name: "Italian", icon: "🍝" },
        { id: "other", name: "Other", icon: "🍽️" }
    ],
    users: [
        {
            id: "owner-giraffe-123",
            name: "Giraffe Owner",
            email: "giraffe@owner.com",
            phone: "0541234567",
            location: { lat: 32.0853, lng: 34.7818 },
            userName: "giraffe_owner",
            password: "Password123",
            role: "manager",
            avatar: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=150"
        },
        {
            id: "owner-burger-456",
            name: "Burger Owner",
            email: "burger@owner.com",
            phone: "0541234567",
            location: { lat: 32.0853, lng: 34.7818 },
            userName: "burger_owner",
            password: "Password123",
            role: "manager",
            avatar: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=150"
        },
        {
            id: "owner-pizza-789",
            name: "Pizza Owner",
            email: "pizza@owner.com",
            phone: "0541234567",
            location: { lat: 32.0853, lng: 34.7818 },
            userName: "pizza_owner",
            password: "Password123",
            role: "manager",
            avatar: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150"
        },
        {
            id: "owner-sushi-999",
            name: "Sushi Owner",
            email: "sushi@owner.com",
            phone: "0541234567",
            location: { lat: 32.0853, lng: 34.7818 },
            userName: "sushi_owner",
            password: "Password123",
            role: "manager",
            avatar: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=150"
        },
        {
            id: "owner-desserts-888",
            name: "Desserts Owner",
            email: "desserts@owner.com",
            phone: "0541234567",
            location: { lat: 32.0853, lng: 34.7818 },
            userName: "desserts_owner",
            password: "Password123",
            role: "manager",
            avatar: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150"
        },
        {
            id: "owner-indian-111",
            name: "Indian Palace Owner",
            email: "indian@owner.com",
            phone: "0541234567",
            location: { lat: 32.0853, lng: 34.7818 },
            userName: "indian_owner",
            password: "Password123",
            role: "manager",
            avatar: "https://images.unsplash.com/photo-1585938338392-50a59970d2ee?w=150"
        },
        {
            id: "owner-mexican-222",
            name: "Mexican Street Owner",
            email: "mexican@owner.com",
            phone: "0541234567",
            location: { lat: 32.0853, lng: 34.7818 },
            userName: "mexican_owner",
            password: "Password123",
            role: "manager",
            avatar: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=150"
        },
        {
            id: "owner-italian-333",
            name: "Trattoria Bella Owner",
            email: "italian@owner.com",
            phone: "0541234567",
            location: { lat: 32.0853, lng: 34.7818 },
            userName: "italian_owner",
            password: "Password123",
            role: "manager",
            avatar: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=150"
        }
    ],
    restaurants: [
        {
            id: "rest-giraffe",
            name: " Eran & Shira's Restaurant of LOVE ",
            description: "Asian noodle bar, fresh sushi, and selected dishes from the Far East.",
            location: { lat: 32.0853, lng: 34.7818 },
            owner: "owner-giraffe-123",
            category: "asian",
            image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=crop&q=60",
            rating: 4.6,
            deliveryTime: "25-35 min",
            deliveryPrice: 15,
            products: [
                {
                    id: "prod-wedding",
                    restaurantId: "rest-giraffe",
                    name: "MAZAL TOV ERAN & SHIRA!",
                    description: "A special dish dedicated to Eran and Shira for their wedding!",
                    price: 1000000000000,
                    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&auto=format&fit=crop&q=60"
                },
                {
                    id: "prod-pad-thai",
                    restaurantId: "rest-giraffe",
                    name: "Chicken Pad Thai",
                    description: "Rice noodles, egg, chicken, bean sprouts, cilantro, peanuts, and lime in traditional tamarind sauce.",
                    price: 64,
                    image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?w=500&auto=format&fit=crop&q=60"
                },
                {
                    id: "prod-curry-chicken",
                    restaurantId: "rest-giraffe",
                    name: "Green Curry Chicken",
                    description: "Chicken pieces in green curry, coconut milk, eggplants, zucchini, and fresh basil. Served with jasmine rice.",
                    price: 68,
                    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500&auto=format&fit=crop&q=60"
                },
                {
                    id: "prod-gyoza",
                    restaurantId: "rest-giraffe",
                    name: "Chicken Gyoza",
                    description: "5 pieces of steamed and pan-seared dumplings filled with chicken and vegetables, served with soy-ginger dip.",
                    price: 36,
                    image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=500&auto=format&fit=crop&q=60"
                }
            ]
        },
        {
            id: "rest-burger-room",
            name: "Burger Room",
            description: "Indulgent beef burgers made from premium cuts with crispy golden fries.",
            location: { lat: 32.0853, lng: 34.7818 },
            owner: "owner-burger-456",
            category: "burgers",
            image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60",
            rating: 4.8,
            deliveryTime: "20-30 min",
            deliveryPrice: 12,
            products: [
                {
                    id: "prod-classic-burger",
                    restaurantId: "rest-burger-room",
                    name: "Classic 200g Burger",
                    description: "Premium beef patty in a soft bun with lettuce, tomatoes, red onions, and pickles.",
                    price: 58,
                    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60"
                },
                {
                    id: "prod-cheese-burger",
                    restaurantId: "rest-burger-room",
                    name: "Deluxe Cheeseburger",
                    description: "200g beef patty with melted cheddar cheese, caramelized onions, and garlic aioli.",
                    price: 66,
                    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=60"
                },
                {
                    id: "prod-french-fries",
                    restaurantId: "rest-burger-room",
                    name: "Crispy French Fries",
                    description: "Crispy cut potatoes seasoned with salt and sweet smoked paprika.",
                    price: 18,
                    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=60"
                }
            ]
        },
        {
            id: "rest-tony-vespa",
            name: "Tony Vespa",
            description: "Roman square pizza by weight with an assortment of gourmet toppings.",
            location: { lat: 32.0853, lng: 34.7818 },
            owner: "owner-pizza-789",
            category: "pizza",
            image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=60",
            rating: 4.5,
            deliveryTime: "15-25 min",
            deliveryPrice: 10,
            products: [
                {
                    id: "prod-pizza-margherita",
                    restaurantId: "rest-tony-vespa",
                    name: "Classic Margherita Pizza",
                    description: "Rich tomato sauce, fresh mozzarella cheese, basil leaves, and extra virgin olive oil.",
                    price: 45,
                    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=60"
                },
                {
                    id: "prod-pizza-pepperoni",
                    restaurantId: "rest-tony-vespa",
                    name: "Spicy Pepperoni Pizza",
                    description: "Tomato sauce, mozzarella cheese, and crispy slices of beef pepperoni drizzled with chili oil.",
                    price: 54,
                    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=60"
                }
            ]
        },
        {
            id: "rest-sushi-bar",
            name: "Sushi Bar",
            description: "Specialty rolls, fresh sashimi, and custom platters crafted daily.",
            location: { lat: 32.0853, lng: 34.7818 },
            owner: "owner-sushi-999",
            category: "sushi",
            image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=60",
            rating: 4.7,
            deliveryTime: "30-40 min",
            deliveryPrice: 18,
            products: [
                {
                    id: "prod-salmon-sushi",
                    restaurantId: "rest-sushi-bar",
                    name: "Salmon Special Roll",
                    description: "Salmon and avocado inside, wrapped with seared salmon, yuzu aioli, and sweet potato crisps.",
                    price: 62,
                    image: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&auto=format&fit=crop&q=60"
                },
                {
                    id: "prod-veggie-roll",
                    restaurantId: "rest-sushi-bar",
                    name: "Veggie Roll",
                    description: "Cucumber, carrot, avocado, and kanpyo rolled in toasted black and white sesame seeds.",
                    price: 44,
                    image: "https://images.unsplash.com/photo-1583623025817-d180a2221d0a?w=500&auto=format&fit=crop&q=60"
                }
            ]
        },
        {
            id: "rest-sweet-creations",
            name: "Sweet Creations",
            description: "Artisanal cakes, cupcakes, and assorted sweet desserts.",
            location: { lat: 32.0853, lng: 34.7818 },
            owner: "owner-desserts-888",
            category: "desserts",
            image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=60",
            rating: 4.9,
            deliveryTime: "15-30 min",
            deliveryPrice: 14,
            products: [
                {
                    id: "prod-chocolate-cake",
                    restaurantId: "rest-sweet-creations",
                    name: "Warm Chocolate Fudge Cake",
                    description: "Rich chocolate cake with a molten liquid center, served warm with vanilla ice cream.",
                    price: 38,
                    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60"
                }
            ]
        },
        {
            id: "rest-taj-mahal",
            name: "Taj Mahal",
            description: "Authentic Indian cuisine, rich curries, tandoori specialties, and freshly baked naan.",
            location: { lat: 32.0853, lng: 34.7818 },
            owner: "owner-indian-111",
            category: "indian",
            image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80",
            rating: 4.7,
            deliveryTime: "30-45 min",
            deliveryPrice: 15,
            products: [
                {
                    id: "prod-butter-chicken",
                    restaurantId: "rest-taj-mahal",
                    name: "Butter Chicken",
                    description: "Tender chicken cooked in a rich, creamy, spiced tomato sauce.",
                    price: 62,
                    image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80"
                },
                {
                    id: "prod-garlic-naan",
                    restaurantId: "rest-taj-mahal",
                    name: "Garlic Naan",
                    description: "Freshly baked tandoori flatbread with minced garlic and butter.",
                    price: 14,
                    image: "https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500&auto=format&fit=crop&q=80"
                }
            ]
        },
        {
            id: "rest-la-taqueria",
            name: "La Taqueria",
            description: "Traditional Mexican street food: fresh tacos, burritos, quesadillas, and homemade guacamole.",
            location: { lat: 32.0853, lng: 34.7818 },
            owner: "owner-mexican-222",
            category: "mexican",
            image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
            rating: 4.6,
            deliveryTime: "20-35 min",
            deliveryPrice: 10,
            products: [
                {
                    id: "prod-barbacoa-burrito",
                    restaurantId: "rest-la-taqueria",
                    name: "Beef Barbacoa Burrito",
                    description: "Slow-cooked beef wrapped with rice, black beans, salsa, and cheese.",
                    price: 48,
                    image: "https://images.unsplash.com/photo-1626700051175-6518c4793f4f?w=500&auto=format&fit=crop&q=80"
                },
                {
                    id: "prod-chips-guac",
                    restaurantId: "rest-la-taqueria",
                    name: "Chips & Guacamole",
                    description: "Crispy corn tortilla chips with freshly made avocado guacamole.",
                    price: 22,
                    image: "https://images.unsplash.com/photo-1579631542720-3a87824ffd8e?w=500&auto=format&fit=crop&q=80"
                }
            ]
        },
        {
            id: "rest-trattoria-bella",
            name: "Trattoria Bella",
            description: "Classic Italian home cooking, handmade pasta, rich sauces, and fresh herbs.",
            location: { lat: 32.0853, lng: 34.7818 },
            owner: "owner-italian-333",
            category: "italian",
            image: "https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=800&auto=format&fit=crop&q=80",
            rating: 4.8,
            deliveryTime: "25-35 min",
            deliveryPrice: 12,
            products: [
                {
                    id: "prod-fettuccine-alfredo",
                    restaurantId: "rest-trattoria-bella",
                    name: "Fettuccine Alfredo",
                    description: "Ribbon pasta tossed in creamy parmesan butter sauce with chicken.",
                    price: 58,
                    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&auto=format&fit=crop&q=80"
                },
                {
                    id: "prod-lasagna-classica",
                    restaurantId: "rest-trattoria-bella",
                    name: "Lasagna Classica",
                    description: "Layers of pasta, seasoned meat ragu, bechamel sauce, and mozzarella.",
                    price: 64,
                    image: "https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&auto=format&fit=crop&q=80"
                }
            ]
        }
    ],
    orders: []
};

module.exports = InMemoryDB;