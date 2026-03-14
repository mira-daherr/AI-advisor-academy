import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import { sendWelcomeEmail, sendVerificationEmail } from '../services/emailService';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

// Helper to generate token
const generateToken = (id: string) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const user = await User.create({
            name,
            email,
            password,
            isVerified: false,
            verificationToken,
        });

        // Send verification email
        sendVerificationEmail(user.email, user.name, verificationToken).catch(err =>
            console.error('Failed to send verification email:', err)
        );

        res.status(201).json({
            message: 'Registration successful. Please check your email to verify your account.',
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user: any = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            if (!user.isVerified) {
                return res.status(403).json({ message: 'الرجاء التحقق من بريدك الإلكتروني أولاً' });
            }

            const token = generateToken(user._id.toString());

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                plan: user.plan,
                profileCompleted: user.profileCompleted,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/auth/verify-email
// @desc    Verify user email
router.get('/verify-email', async (req: Request, res: Response) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ message: 'مطلوب رمز التحقق' });
        }

        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({ message: 'رمز التحقق غير صالح' });
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();

        // Send welcome email after verification (non-blocking)
        sendWelcomeEmail(user.email, user.name).catch(err =>
            console.error('Failed to send welcome email:', err)
        );

        // Redirect to login page
        const frontendUrl = process.env.NODE_ENV === 'production'
            ? (process.env.FRONTEND_URL || 'https://astonishing-macaron-822c6b.netlify.app')
            : (process.env.CLIENT_URL || 'http://localhost:5173');

        res.redirect(`${frontendUrl}/signin?verified=true`);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout user & clear cookie
router.post('/logout', (req: Request, res: Response) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

// @route   GET /api/auth/me
// @desc    Get current user
router.get('/me', async (req: any, res: Response) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(401).json({ message: 'Not authorized, token failed' });
    }
});

export default router;
