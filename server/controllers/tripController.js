import Trip from '../models/Trip.js';

export const createTrip = async (req, res) => {
  try {
    const { title, destination, startDate, endDate, isPublic, budget, tags } = req.body;

    const trip = await Trip.create({
      author: req.user._id,
      title,
      destination,
      startDate,
      endDate,
      isPublic,
      budget,
      tags,
      days: [],
    });

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ author: req.user._id })
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPublicTrips = async (req, res) => {
  try {
    const { tag, sort } = req.query;

    let query = { isPublic: true };
    if (tag) query.tags = tag;

    let sortOption = { createdAt: -1 };
    if (sort === 'likes') sortOption = { 'likes.length': -1 };

    const trips = await Trip.find(query)
      .populate('author', 'name avatar')
      .sort(sortOption);

    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('author', 'name avatar');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (trip.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updated = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (trip.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await trip.deleteOne();
    res.json({ message: 'Trip deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cloneTrip = async (req, res) => {
  try {
    const original = await Trip.findById(req.params.id);
    if (!original) return res.status(404).json({ message: 'Trip not found' });
    if (!original.isPublic) return res.status(403).json({ message: 'Trip is not public' });

    const cloned = await Trip.create({
      author: req.user._id,
      title: `${original.title} (copy)`,
      destination: original.destination,
      coverImage: original.coverImage,
      startDate: original.startDate,
      endDate: original.endDate,
      isPublic: false,
      clonedFrom: original._id,
      budget: original.budget,
      days: original.days,
      tags: original.tags,
    });

    res.status(201).json(cloned);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const toggleLike = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    const alreadyLiked = trip.likes.includes(req.user._id);

    if (alreadyLiked) {
      trip.likes = trip.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
    } else {
      trip.likes.push(req.user._id);
    }

    await trip.save();
    res.json({ likes: trip.likes.length, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const reorderPlaces = async (req, res) => {
  try {
    const { dayId, places } = req.body;
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (trip.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const day = trip.days.id(dayId);
    if (!day) return res.status(404).json({ message: 'Day not found' });

    day.places = places;
    await trip.save();
    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};