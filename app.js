const express = require('express');
const app = express();
const PORT = 1234; // Using the port from main (1234)

// 1. Import the routers 
const restaurantRouter = require('./routes/restaurantRouter');
const orderRouter = require('./routes/orderRouter');
const searchRouter = require('./routes/searchRouter');
const userRouter = require('./routes/userRouter');
const existUserRouter = require('./routes/existUserRouter');

// Middleware to parse JSON bodies in incoming requests (for POST/PATCH endpoints)
app.use(express.json());

// 2. Mount each router onto its strict, required HTTP URL prefix path
app.use('/api/restaurants', restaurantRouter);
app.use('/api/orders', orderRouter);
app.use('/api/search', searchRouter);
app.use('/api/users', userRouter);
app.use('/api/tokens', existUserRouter);

// Basic test route to verify that the server is live and working on the network
app.get('/', (req, res) => {
    res.status(200).json({ message: "Wolt Web Server Backend is running perfectly!" });
});

// Start the server listening on the defined port
app.listen(PORT, () => {
    console.log(`Server is running live on http://localhost:${PORT}`);
});