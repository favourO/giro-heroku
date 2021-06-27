const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

const app = express();

// load environment variables using dotenv
dotenv.config({ path: './config/config.env'});

// Connect to Database
connectDB();

// Load Route files
const authRoutes = require('./route/userRoutes');

// Body Parser
app.use(express.json());

// Mount Route files
app.use('/api/v1/giro-app/auth', authRoutes);

const PORT = 3000 || process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server Listening in PORT ${PORT} on ${process.env.NODE_ENV}`)
});

