// Mock data for the frontend to render screens before the server is fully connected.
// This data mirrors the structures returned by the Express backend API.

export const mockCategories = [
  { id: "sushi", name: "Sushi", icon: "🍣" },
  { id: "burgers", name: "Burgers", icon: "🍔" },
  { id: "pizza", name: "Pizza", icon: "🍕" },
  { id: "asian", name: "Asian", icon: "🥢" },
  { id: "desserts", name: "Desserts", icon: "🍰" }
];

export const mockRestaurants = [
  {
    id: "rest-giraffe",
    name: "Giraffe",
    description: "Asian noodle bar, fresh sushi, and selected dishes from the Far East.",
    location: { lat: 32.0853, lng: 34.7818 },
    ownerId: "owner-giraffe-123",
    category: "asian",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&auto=format&fit=crop&q=60",
    rating: 4.6,
    deliveryTime: "25-35 min",
    deliveryPrice: 15
  },
  {
    id: "rest-burger-room",
    name: "Burger Room",
    description: "Indulgent beef burgers made from premium cuts with crispy golden fries.",
    ownerId: "owner-burger-456",
    category: "burgers",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60",
    rating: 4.8,
    deliveryTime: "20-30 min",
    deliveryPrice: 12
  },
  {
    id: "rest-tony-vespa",
    name: "Tony Vespa",
    description: "Roman square pizza by weight with an assortment of gourmet toppings.",
    ownerId: "owner-pizza-789",
    category: "pizza",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=60",
    rating: 4.5,
    deliveryTime: "15-25 min",
    deliveryPrice: 10
  },
  {
    id: "rest-sushi-bar",
    name: "Sushi Bar",
    description: "Specialty rolls, fresh sashimi, and custom platters crafted daily.",
    ownerId: "owner-sushi-999",
    category: "sushi",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=60",
    rating: 4.7,
    deliveryTime: "30-40 min",
    deliveryPrice: 18
  },
  {
    id: "rest-sweet-creations",
    name: "Sweet Creations",
    description: "Artisanal cakes, cupcakes, and assorted sweet desserts.",
    ownerId: "owner-desserts-888",
    category: "desserts",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=60",
    rating: 4.9,
    deliveryTime: "15-30 min",
    deliveryPrice: 14
  }
];

export const mockProducts = [
  // Giraffe products (Asian)
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
  },

  // Burger Room products (Burgers)
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
  },

  // Tony Vespa products (Pizza)
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
  },

  // Sushi Bar products (Sushi)
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
  },

  // Sweet Creations (Desserts)
  {
    id: "prod-chocolate-cake",
    restaurantId: "rest-sweet-creations",
    name: "Warm Chocolate Fudge Cake",
    description: "Rich chocolate cake with a molten liquid center, served warm with vanilla ice cream.",
    price: 38,
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=60"
  }
];

export const mockUser = {
  id: "user-shira-123",
  name: "Shira Cohen",
  userName: "shira_c",
  email: "shira@example.com",
  phone: "0541234567",
  location: { lat: 32.0853, lng: 34.7818 },
  role: "customer",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=60"
};

export const mockOrders = [
  {
    id: "order-1001",
    userId: "user-shira-123",
    restaurantId: "rest-giraffe",
    restaurantName: "Giraffe",
    items: [
      {
        productId: "prod-pad-thai",
        name: "Chicken Pad Thai",
        price: 64,
        quantity: 2
      },
      {
        productId: "prod-gyoza",
        name: "Chicken Gyoza",
        price: 36,
        quantity: 1
      }
    ],
    total: 164,
    status: "delivered",
    date: "2026-06-09T20:15:00.000Z"
  },
  {
    id: "order-1002",
    userId: "user-shira-123",
    restaurantId: "rest-burger-room",
    restaurantName: "Burger Room",
    items: [
      {
        productId: "prod-cheese-burger",
        name: "Deluxe Cheeseburger",
        price: 66,
        quantity: 1
      },
      {
        productId: "prod-french-fries",
        name: "Crispy French Fries",
        price: 18,
        quantity: 2
      }
    ],
    total: 102,
    status: "in-progress",
    date: "2026-06-10T09:30:00.000Z"
  }
];
