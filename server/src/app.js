const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Vite default port
    credentials: true
}));
app.use(express.json());

// Basic Route for Testing
app.get('/', (req, res) => {
    res.json({ message: "Dayflow API is running 🚀" });
});

// TODO: Import Routes Here
// const authRoutes = require('./routes/auth.routes');
// app.use('/api/auth', authRoutes);

module.exports = app;