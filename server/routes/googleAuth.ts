import { Router, Request, Response } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';
const CLIENT_URL = process.env.NODE_ENV === 'production'
    ? (process.env.FRONTEND_URL || 'https://astonishing-macaron-822c6b.netlify.app')
    : (process.env.CLIENT_URL || 'http://localhost:5173');

// Helper to generate JWT token
const generateToken = (id: string) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
};

// @route   GET /auth/google
// @desc    Redirect user to Google's OAuth login page
router.get(
    '/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

// @route   GET /auth/google/callback
// @desc    Google OAuth callback — issue JWT cookie & redirect to dashboard
router.get(
    '/google/callback',
    passport.authenticate('google', { failureRedirect: `${CLIENT_URL}/signin?error=google_failed`, session: false }),
    (req: Request, res: Response) => {
        const user = req.user as any;

        if (!user) {
            return res.redirect(`${CLIENT_URL}/signin?error=google_failed`);
        }

        const token = generateToken(user._id.toString());

        res.redirect(`${CLIENT_URL}/auth/callback?token=${token}`);
    }
);

export default router;
