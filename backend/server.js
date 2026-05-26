import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js'; // Note: You MUST add the '.js' extension here!

// Pulls in your secret .env configuration parameters
dotenv.config();

// Initialize the Express app framework
const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Basic test route
app.get('/', (req, res) => {
  res.send('🚀 URL Shortener API is officially running smoothly!');
});

// Start listening for incoming traffic
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`📡 Backend server actively listening on port ${PORT}`);
});