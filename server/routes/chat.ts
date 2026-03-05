import { Router, Response } from 'express';
import { protect, premiumOnly } from '../middleware/auth';
import Chat from '../models/Chat';
import Questionnaire from '../models/Questionnaire';
import Recommendation from '../models/Recommendation';
import { generateChatResponse } from '../services/gemini';

const router = Router();

// @route   GET /api/chat/history
// @desc    Get chat history
router.get('/history', protect, premiumOnly, async (req: any, res: Response) => {
    try {
        let chat = await Chat.findOne({ userId: req.user._id });
        if (!chat) {
            chat = await Chat.create({ userId: req.user._id, messages: [] });
        }
        res.json(chat.messages);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/chat/message
// @desc    Send message and get AI response
router.post('/message', protect, premiumOnly, async (req: any, res: Response) => {
    try {
        const { content } = req.body;

        // 1. Get or create chat
        let chat = await Chat.findOne({ userId: req.user._id });
        if (!chat) {
            chat = await Chat.create({ userId: req.user._id, messages: [] });
        }

        // 2. Add user message
        chat.messages.push({ role: 'user', content });

        // 3. Get context (Student Profile + Recommendations)
        const studentData = await Questionnaire.findOne({ userId: req.user._id });
        const recommendations = await Recommendation.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

        // 4. Generate AI response
        const aiContent = await generateChatResponse(
            content,
            chat.messages.slice(-5), // Send last 5 messages for context
            studentData,
            recommendations
        );

        // 5. Add AI response to chat
        chat.messages.push({ role: 'assistant', content: aiContent });
        await chat.save();

        res.json(chat.messages);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/chat/clear
// @desc    Start new conversation
router.post('/clear', protect, premiumOnly, async (req: any, res: Response) => {
    try {
        await Chat.findOneAndUpdate(
            { userId: req.user._id },
            { messages: [] }
        );
        res.json({ message: 'Chat cleared' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
