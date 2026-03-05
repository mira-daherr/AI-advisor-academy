import { Router, Response } from 'express';
import { protect } from '../middleware/auth';
import Questionnaire from '../models/Questionnaire';
import User from '../models/User';

const router = Router();

// @route   POST /api/questionnaire/submit
// @desc    Submit questionnaire responses
router.post('/submit', protect, async (req: any, res: any) => {
    try {
        const responses = req.body;

        // Create or Update questionnaire for this user
        const questionnaire = await Questionnaire.findOneAndUpdate(
            { userId: req.user._id },
            { ...responses, userId: req.user._id },
            { upsert: true, new: true }
        );

        // Mark user profile as completed
        await User.findByIdAndUpdate(req.user._id, { profileCompleted: true });

        res.status(200).json({
            message: 'Questionnaire submitted successfully',
            questionnaire
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/questionnaire/my
// @desc    Get current user's questionnaire
router.get('/my', protect, async (req: any, res: any) => {
    try {
        const questionnaire = await Questionnaire.findOne({ userId: req.user._id });
        if (!questionnaire) {
            if (process.env.ANTHROPIC_API_KEY === 'mock') {
                return res.json({
                    userId: req.user._id,
                    name: req.user.name,
                    hobbies: ['Technology', 'Science'],
                    futureVision: 'Building technology',
                    motivation: 70,
                    independence: 'I\'m very self-driven and independent',
                    grades: {
                        math: 'A',
                        science: 'A',
                        language: 'B',
                        socialStudies: 'A',
                        gpa: '3.9'
                    },
                    regions: ['Europe', 'North America'],
                    budget: 'Can self-fund (limited budget)'
                });
            }
            return res.status(404).json({ message: 'No questionnaire found' });
        }
        res.json(questionnaire);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
