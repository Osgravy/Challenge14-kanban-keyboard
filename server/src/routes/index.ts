import { Router } from 'express';
import authRoutes from './auth-routes.js';
import apiRoutes from './api/index.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public routes - no authentication required
router.use('/auth', authRoutes);

// Protected API routes - require valid JWT token
router.use('/api', authenticateToken, apiRoutes);

export default router;