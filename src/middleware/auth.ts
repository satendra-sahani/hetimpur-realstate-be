import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Define the structure of the token payload
interface JwtPayload {
  id: string;
  role: string;
}

export const authMiddleware = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      res.status(401).json({ message: 'No token, authorization denied' });
      return; // Ensure the function terminates here
    }

    try {
      // Verify the token and cast to JwtPayload interface
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      // Attach user data (id and role) to the request object
      req.user = decoded;

      // Check if the user's role is authorized
      if (!roles.includes(req.user.role)) {
        res.status(403).json({ message: 'Access denied' });
        return; // Ensure the function terminates here
      }

      // Continue to the next middleware/route handler
      next();
    } catch (error) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
};

// Extending the Express Request interface to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
