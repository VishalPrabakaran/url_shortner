import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoutes from './routes/authRoutes.js';
import linkRoutes from './routes/linkRoutes.js';
import redirectRoutes from './routes/redirectRoutes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health-check route
app.get('/', (req, res) => {
  res.send('SHORTX Backend API is running...');
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/links', linkRoutes);
app.use('/', redirectRoutes);

// Fallback route for any unknown API path
app.use((req, res) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Database Connection & Server Start
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/shortx';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully!');
    app.listen(PORT, () => {
      console.log(`Server is running smoothly on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err);
  });