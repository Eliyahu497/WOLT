const express = require('express');
const app = express();
const PORT = 1234; 

const restaurantRouter = require('./routes/restaurantRouter');

app.use(express.json());

app.use('/api/restaurants', restaurantRouter);

app.listen(PORT, () => {
    console.log(`REAL EXPRESS SERVER IS ALIVE ON PORT ${PORT}`);
});