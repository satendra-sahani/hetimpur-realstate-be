import { RequestHandler } from 'express';
import Land from '../models/Land'; // Adjust the import path based on your folder structure

// Create a new land posting
export const createLand: RequestHandler = async (req, res, next) => {
  try {
    const { client, image, address, number, price, state, city } = req.body;
    const newLand = new Land({ client, image, number, price, address, state, city });
    const savedLand = await newLand.save();
    res.status(201).json(savedLand); // Send the response and do not return anything
  } catch (error) {
    next(error); // Pass the error to the next middleware
  }
};

// Read all land postings
export const getLands: RequestHandler = async (req, res, next) => {
  try {
    // Pagination parameters
    const page = parseInt(req.query.page as string, 10) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string, 10) || 10; // Default to 10 items per page

    // Search parameter
    const search = req.query.search as string;

    // Construct the filter object
    const filter: any = { client: req.user?.id }; // Ensure lands are specific to the logged-in user
    if (search) {
      // Modify this based on the searchable fields in your Land model
      filter.$or = [
        { name: { $regex: search, $options: 'i' } }, // Case-insensitive search
        { description: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ];
    }
    if (req.user?.role == "client") {
      filter.client = req.user.id;
    } else if (req.user?.role == "user") {
      delete filter.client;
      filter.paymentStatus = true
    }

    // Calculate pagination parameters
    const skip = (page - 1) * limit;

    // Fetch lands with pagination and populate client details
    const lands = await Land.find(filter)
      .populate('client', 'name') // Populate client details
      .skip(skip)
      .limit(limit);

    // Total count of lands for the given filter
    const totalLands = await Land.countDocuments(filter);

    // Send the paginated response
    res.status(200).json({
      total: totalLands,
      page,
      limit,
      totalPages: Math.ceil(totalLands / limit),
      data: lands,
    });
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
