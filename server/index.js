import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import postRoutes from './routes/postRoutes.js';

dotenv.config();

const app = express();

connectDB();

app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.CLIENT_URL,
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' })); // 10mb for base64 images

app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/posts', postRoutes);

app.get('/', (req, res) => {
  res.send('TripSync API is running 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));