const express = require('express');
const app = express();
const PORT = 1234; // הפורט המנצח שלנו

// 1. מייבאים את הראוטר האמיתי שכתבתם!
const restaurantRouter = require('./routes/restaurantRouter');

app.use(express.json());

// 2. מחברים את הראוטר לשרת
app.use('/api/restaurants', restaurantRouter);

app.listen(PORT, () => {
    console.log(`REAL EXPRESS SERVER IS ALIVE ON PORT ${PORT}`);
});