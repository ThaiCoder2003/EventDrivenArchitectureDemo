var express = require('express');
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 4001;
const connectDB = require('./config/db');
const seed = require('./utils/seed');

// Connect to MongoDB
connectDB().then(() => {
    console.log('Database connected successfully');
    // Seed the database with initial products
    seed();
}).catch(err => {
    console.error('Database connection failed:', err);
});

var userRouter = require('./routes/user');
var transactionRouter = require('./routes/transaction');
var app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use('/user', userRouter);
app.use('/transaction', transactionRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// view engine setup
