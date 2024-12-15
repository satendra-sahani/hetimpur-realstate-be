import { Request, Response, NextFunction, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

// Register function
export const register: RequestHandler = async (req, res, next) => {
  try {
    const { name, email, password, contact, approved } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return; // Ensure the function exits after sending a response
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      contact,
      approved,
    });

    // Respond with success message
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    next(error); // Forward error to Express error handler
  }
};

// Login function
export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'User is not registered' });
      return;
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role, name: user.name }, process.env.JWT_SECRET!);

    // Respond with token and success message
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};
