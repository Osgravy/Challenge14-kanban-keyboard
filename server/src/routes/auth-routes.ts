import { Router, Request, Response } from 'express';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  // Validate input
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    // Find user in database
    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare provided password with hashed password in database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create JWT payload (don't include sensitive info)
    const payload = { 
      userId: user.id,
      username: user.username
    };
    
    // Generate token with expiration
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'defaultSecret',
      { expiresIn: process.env.JWT_EXPIRES_IN ? parseInt(process.env.JWT_EXPIRES_IN, 10) || '1h' : '1h' }
    );

    // Return the token and basic user info (without password)
    return res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        // Add other non-sensitive user fields as needed
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

const router = Router();

// POST /login - Login a user
router.post('/login', login);

export default router;