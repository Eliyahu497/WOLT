const express = require('express');
const path = require('path');
const app = express();
const PORT = 1234; // Using the port from main (1234)

// 1. Import the routers 
const restaurantRouter = require('./routes/restaurantRouter');
const orderRouter = require('./routes/orderRouter');
const searchRouter = require('./routes/searchRouter');
const userRouter = require('./routes/userRouter');
const existUserRouter = require('./routes/existUserRouter');

// Middleware to parse JSON bodies in incoming requests (for POST/PATCH endpoints)
app.use(express.json({ limit: '10mb' }));

// 2. Mount each router onto its strict, required HTTP URL prefix path
app.use('/api/restaurants', restaurantRouter);
app.use('/api/orders', orderRouter);
app.use('/api/search', searchRouter);
app.use('/api/users', userRouter);
app.use('/api/tokens', existUserRouter);

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'dist')));

// Catch-all route to serve the React index.html for any non-API routes (must be at the end)
app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server listening on the defined port
app.listen(PORT, () => {
    console.log(`Server is running live on http://localhost:${PORT}`);
});