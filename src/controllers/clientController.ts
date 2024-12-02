import { RequestHandler } from 'express';
import Land from '../models/Land'; // Adjust the import path based on your folder structure

// Create a new land posting
export const createLand: RequestHandler = async (req, res, next) => {
  try {
    const { client, image, address, status } = req.body;
    const newLand = new Land({ client, image, address, status });
    const savedLand = await newLand.save();
    res.status(201).json(savedLand); // Send the response and do not return anything
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};

// Read all land postings
export const getLands: RequestHandler = async (req, res, next) => {
  try {
    const lands = await Land.find().populate('client', 'name email'); // Populate client details if needed
    res.status(200).json(lands); // Send the response and do not return anything
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};

// Read a single land posting by ID
export const getLandById: RequestHandler = async (req, res, next) => {
  try {
    const land = await Land.findById(req.params.id).populate('client', 'name email');
    if (!land) {
      res.status(404).json({ message: 'Land not found' });
      return; // Return here to avoid further execution
    }
    res.status(200).json(land); // Send the response and do not return anything
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};

// Update a land posting by ID
export const updateLand: RequestHandler = async (req, res, next) => {
  try {
    const updatedLand = await Land.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedLand) {
      res.status(404).json({ message: 'Land not found' });
      return; // Return here to avoid further execution
    }
    res.status(200).json(updatedLand); // Send the response and do not return anything
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};

// Delete a land posting by ID
export const deleteLand: RequestHandler = async (req, res, next) => {
  try {
    const deletedLand = await Land.findByIdAndDelete(req.params.id);
    if (!deletedLand) {
      res.status(404).json({ message: 'Land not found' });
      return; // Return here to avoid further execution
    }
    res.status(200).json({ message: 'Land deleted successfully' }); // Send the response and do not return anything
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};
