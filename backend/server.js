import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import connectDB from './config/db.js';

// IMPORT ROUTES
import authRoutes from './routes/authRoutes.js';
import linkRoutes from './routes/linkRoutes.js';
import redirectRoutes from './routes/redirectRoutes.js';

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// API ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);

// Redirect Routes
app.use('/', redirectRoutes);

// Test Route
app.get('/', (req, res) => {
  res.send('🚀 URL Shortener API is officially running smoothly!');
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`📡 Backend server actively listening on port ${PORT}`);
});