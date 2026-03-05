import { Router, Response } from 'express';
import { protect } from '../middleware/auth';
import Questionnaire from '../models/Questionnaire';
import Recommendation from '../models/Recommendation';
import { generateAcademicRecommendations } from '../services/gemini';

const router = Router();

// @route   POST /api/recommendations/generate
// @desc    Generate or retrieve cached academic recommendations
router.post('/generate', protect, async (req: any, res: any) => {
    try {
        // 1. Check if we already have a recent recommendation for this user
        const existingRec = await Recommendation.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

        // If it exists and is less than 24 hours old, return it (simple caching)
        if (existingRec) {
            const diff = Date.now() - new Date(existingRec.generatedAt).getTime();
            const oneDay = 24 * 60 * 60 * 1000;
            if (diff < oneDay) {
                return res.json(existingRec);
            }
        }

        // 2. Fetch the student's latest questionnaire
        const studentData = await Questionnaire.findOne({ userId: req.user._id });
        if (!studentData) {
            return res.status(404).json({ message: 'No questionnaire found. Please complete the intake flow first.' });
        }

        // 3. Call Gemini AI
        const aiResponse = await generateAcademicRecommendations(studentData, req.user.plan);

        // 4. Save to MongoDB (Cache)
        const recommendation = await Recommendation.create({
            userId: req.user._id,
            ...aiResponse,
            generatedAt: new Date()
        });

        res.status(201).json(recommendation);
    } catch (error: any) {
        console.error('Recommendation Generation Error:', error);
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
});

// @route   GET /api/recommendations/latest
// @desc    Get current user's latest recommendation
router.get('/latest', protect, async (req: any, res: any) => {
    try {
        const recommendation = await Recommendation.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
        if (!recommendation) {
            return res.status(404).json({ message: 'No recommendations found' });
        }
        res.json(recommendation);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/recommendations/my
// @desc    Get current user's latest recommendation (alias)
router.get('/my', protect, async (req: any, res: any) => {
    try {
        const recommendation = await Recommendation.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
        if (!recommendation) {
            return res.status(404).json({ message: 'No recommendations found' });
        }
        res.json(recommendation);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
