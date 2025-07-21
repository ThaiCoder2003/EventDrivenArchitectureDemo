var express = require('express');
const cors = require('cors');
require('dotenv').config();
const PORT = process.env.PORT || 4001;
const connectDB = require('./config/db');
const seed = require('./utils/seed');
const cookieParser = require('cookie-parser');

// Connect to MongoDB
connectDB().then(() => {
    console.log('Database connected successfully');
    // Seed the database with initial products
    seed();
}).catch(err => {
    console.error('Database connection failed:', err);
});

var userRouter = require('./routes/user');
var productRouter = require('./routes/product');
var transactionRouter = require('./routes/transaction');
var app = express();

app.use(cors({
    origin: 'http://localhost:4000',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/user', userRouter);   
app.use('/product', productRouter);
app.use('/transaction', transactionRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// view engine setup
