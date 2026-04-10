import express from 'express';
import Trip from '../models/Trip.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/trips/explore — all public trips
router.get('/explore', async (req, res) => {
  try {
    const trips = await Trip.find({ isPublic: true })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/trips/my — logged in user's trips
router.get('/my', protect, async (req, res) => {
  try {
    const trips = await Trip.find({ author: req.user._id })
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/trips — create trip
router.post('/', protect, async (req, res) => {
  try {
    const { title, destination, budget, date, isPublic } = req.body;
    const trip = await Trip.create({
      title,
      destination,
      budget,
      date,
      isPublic,
      author: req.user._id,
    });
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/trips/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.author.toString() !== req.user._id.toString())
      return res.status(403).json({ message: 'Not authorized' });

    await trip.deleteOne();
    res.json({ message: 'Trip deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/trips/:id/like — toggle like
router.put('/:id/like', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const liked = trip.likes.includes(req.user._id);
    if (liked) {
      trip.likes = trip.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      trip.likes.push(req.user._id);
    }
    await trip.save();
    res.json({ likes: trip.likes.length, liked: !liked });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/trips/:id/clone
router.post('/:id/clone', protect, async (req, res) => {
  try {
    const original = await Trip.findById(req.params.id);
    if (!original) return res.status(404).json({ message: 'Trip not found' });

    const cloned = await Trip.create({
      title: original.title + ' (Clone)',
      destination: original.destination,
      budget: original.budget,
      date: original.date,
      isPublic: false,
      author: req.user._id,
      clonedFrom: original._id,
    });

    original.cloneCount += 1;
    await original.save();

    res.status(201).json(cloned);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/trips/:id/save — toggle save
router.put('/:id/save', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const saved = trip.savedBy.includes(req.user._id);
    if (saved) {
      trip.savedBy = trip.savedBy.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      trip.savedBy.push(req.user._id);
    }
    await trip.save();
    res.json({ saved: !saved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;