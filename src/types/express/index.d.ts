declare global {
    namespace Express {
      interface Request {
        user?: {
          id: string;
          // Add any additional fields for user if needed
        };
      }
    }
  }
  