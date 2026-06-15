const InMemoryDB = require('../InMemoryDB');
const orderService = require('../services/OrderService');

console.log("--- STARTING ORDER SERVICE LOCAL TEST ---");

// 1. Seed simulated data into the memory arrays (Mocking Developer 1 & 2)
InMemoryDB.users.push({ id: "user_shira", name: "Shira" });
InMemoryDB.restaurants.push({
    id: "rest_giraffe",
    name: "Giraffe",
    description: "Asian Noodle Bar",
    location: { lat: 32.0, lng: 34.0 },
    products: [{ id: "prod_sushi", name: "Sushi", price: 65 }]
});

console.log("Current Users in DB:", InMemoryDB.users);

// 2. Test Order Creation
try {
    const itemPayload = [{ productId: "prod_sushi", quantity: 2 }];
    const myOrder = orderService.create("user_shira", "rest_giraffe", itemPayload);
    
    console.log("\n✅ Success! Order Created:");
    console.log(myOrder);
    console.log(`Calculated Price (65 * 2): ${myOrder.total} NIS`);
    
    // 3. Test Retrieving Orders
    const userOrders = orderService.getByUserId("user_shira");
    console.log(`\n🔍 Found ${userOrders.length} orders for user_shira.`);
    
    // 4. Test Updating Order Items (e.g., changing quantity of sushi from 2 to 3)
    orderService.update(myOrder.id, { items: [{ productId: "prod_sushi", quantity: 3 }] });
    console.log("\n🔄 Items Updated, New Total (65 * 3):", orderService.getById(myOrder.id).total, "NIS");
    
} catch (error) {
    console.error("❌ Test Failed with error:", error.message);
}