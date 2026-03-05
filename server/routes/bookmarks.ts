import { Router, Response } from 'express';
import { protect } from '../middleware/auth';
import Bookmark from '../models/Bookmark';

const router = Router();

// @route   GET /api/bookmarks
// @desc    Get all bookmarks for current user
router.get('/', protect, async (req: any, res: Response) => {
    try {
        const bookmarks = await Bookmark.find({ userId: req.user._id });
        res.json(bookmarks);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/bookmarks
// @desc    Add a university to bookmarks
router.post('/', protect, async (req: any, res: Response) => {
    try {
        const { universityName, country, tuition } = req.body;

        // Check if already bookmarked
        const existing = await Bookmark.findOne({ userId: req.user._id, universityName });
        if (existing) {
            return res.status(400).json({ message: 'University already bookmarked' });
        }

        const bookmark = await Bookmark.create({
            userId: req.user._id,
            universityName,
            country,
            tuition
        });
        res.status(201).json(bookmark);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PATCH /api/bookmarks/:id
// @desc    Update notes for a bookmark
router.patch('/:id', protect, async (req: any, res: Response) => {
    try {
        const bookmark = await Bookmark.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            { notes: req.body.notes },
            { new: true }
        );
        res.json(bookmark);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/bookmarks/:id
// @desc    Remove a bookmark
router.delete('/:id', protect, async (req: any, res: Response) => {
    try {
        await Bookmark.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        res.json({ message: 'Bookmark removed' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
