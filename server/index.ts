import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import passport from './services/passportConfig';
import authRoutes from './routes/auth';
import googleAuthRoutes from './routes/googleAuth';
import advisorRoutes from './routes/advisor';
import paymentRoutes from './routes/payment';
import questionnaireRoutes from './routes/questionnaire';
import recommendationRoutes from './routes/recommendations';
import chatRoutes from './routes/chat';
import reportRoutes from './routes/reports';
import bookmarkRoutes from './routes/bookmarks';
import healthRoutes from './routes/health';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
    'https://astonishing-macaron-822c6b.netlify.app',
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://localhost:5173',
    'http://localhost:3000',
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    },
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Initialize Passport (no session — we use JWT cookies)
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/auth', googleAuthRoutes);        // GET /auth/google, GET /auth/google/callback
app.use('/api/advisor', advisorRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/questionnaire', questionnaireRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/health', healthRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/academic-advisor')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
