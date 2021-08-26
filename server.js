const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');
const colors = require('colors');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

app.use(cors());

// Body Parser
app.use(express.json({ extended: true}));
app.use(express.urlencoded({ extended: true}));

app.use(express.static('public'));  
app.use('/images', express.static('images')); 
// load environment variables using dotenv
dotenv.config({ path: './config/config.env'});

// Connect to Database
connectDB();

// Load Route files
const authRoutes = require('./route/userRoutes');
const productRoutes = require('./route/productRoutes');
const merchantRoutes = require('./route/merchantRoutes');


// images from server

// Middleware logging during development
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount Route files
app.use('/api/v1/giro-app/auth', authRoutes);
app.use('/api/v1/giro-app/', productRoutes);
app.use('/api/v1/giro-app/merchants', merchantRoutes);

// Use error handler
app.use(errorHandler);


const PORT = 3000 || process.env.PORT;

const server = app.listen(PORT, () => {
    console.log(`Server Listening in PORT ${PORT} on ${process.env.NODE_ENV}`.grey.italic)
});

//this is used to handle unhandled rejections like database connection processes
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error - ${err.message}`.red.bold);
    // Close the server and exit process
    server.close(() => process.exit(1));
})