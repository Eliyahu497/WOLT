const express = require('express');
const app = express();
const PORT = 3000;

// 1. Import the routers 
const orderRouter = require('./routes/orderRouter');

// Middleware to parse JSON bodies in incoming requests (for POST/PATCH endpoints)
app.use(express.json());

// 2. Mount each router onto its strict, required HTTP URL prefix path
app.use('/api/orders', orderRouter);

// Basic test route to verify that the server is live and working on the network
app.get('/', (req, res) => {
    res.status(200).json({ message: "Wolt Web Server Backend is running perfectly!" });
});

// =========================================================================
//  TEMPORARY MOCK DATA FOR DEVELOPER 3 TESTING (Delete before final merge)
// =========================================================================
const InMemoryDB = require('./InMemoryDB');

// Seed a dummy user and a dummy restaurant with products directly into memory
InMemoryDB.users.push({ id: "user_shira", name: "Shira" });
InMemoryDB.restaurants.push({
    id: "rest_giraffe",
    name: "Giraffe",
    products: [{ id: "prod_sushi", name: "Sushi", price: 65 }]
});
// 

// Start the server listening on the defined port
app.listen(PORT, () => {
    console.log(`Server is running live on http://localhost:${PORT}`);
});