import express from 'express';
import { searchPlaces } from '../controllers/placeController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search', protect, searchPlaces);

export default router;