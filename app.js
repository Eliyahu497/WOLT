const express = require('express');
const app = express();
const PORT = 3000;

// Basic middleware to parse and understand JSON payloads arriving in the request body
app.use(express.json());

// Basic test route to verify that the server is live and working on the network
app.get('/', (req, res) => {
    res.status(200).json({ message: "Wolt Web Server Backend is running perfectly!" });
});

// Later on (Step 5), Developer 3 will connect everyone's unified routers here!
const restaurantRouter = require('./routes/restaurantRouter');
app.use('/restaurants', restaurantRouter);

// Start the server listening on the defined port
app.listen(PORT, () => {
    console.log(`Server is running live on http://localhost:${PORT}`);
});