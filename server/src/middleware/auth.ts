import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  username: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the Authorization header
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  // If no token is provided, return 401 Unauthorized
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    // Verify the token using the JWT_SECRET from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    
    // Add the user data to the request object
    req.user = { username: decoded.username };
    
    // Proceed to the next middleware/route handler
    next();
    return;
  } catch (error) {
    // Handle different JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ error: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    
    // For any other errors
    return res.status(500).json({ error: 'Failed to authenticate token' });
  }
};