import express from 'express';
import {
  createTrip,
  getMyTrips,
  getPublicTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  cloneTrip,
  toggleLike,
  reorderPlaces,
} from '../controllers/tripController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/public', getPublicTrips);
router.get('/me', protect, getMyTrips);
router.get('/:id', getTripById);
router.post('/', protect, createTrip);
router.put('/:id', protect, updateTrip);
router.delete('/:id', protect, deleteTrip);
router.post('/:id/clone', protect, cloneTrip);
router.patch('/:id/like', protect, toggleLike);
router.patch('/:id/reorder', protect, reorderPlaces);

export default router;