import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';  // Import the CORS package
dotenv.config();
import userRoutes from './routes/userRoutes';
import bypassRoutes from "./routes/bypassRoutes";
import clientRoutes from "./routes/clientRoutes";
import adminRoutes from "./routes/adminRoutes";
import authRoutes from "./routes/authRoutes";
import { authMiddleware } from './middleware/auth';

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:3000', 'https://yourproductiondomain.com'], // Add allowed origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // Allow cookies and other credentials in requests
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
};

// Enable CORS with the defined options
app.use(cors(corsOptions));

// Middleware to parse JSON requests
app.use(express.json());

// Serve images statically from the 'uploads' directory
app.use('/uploads', express.static('uploads'));

// API Routes
app.use('/api', bypassRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/admin', authMiddleware(['admin']), adminRoutes);
app.use('/api/user', authMiddleware(['user']), userRoutes);
app.use('/api/client', authMiddleware(['client']), clientRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    // Start the server once connected to the database
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log('Error connecting to MongoDB:', err.message));
