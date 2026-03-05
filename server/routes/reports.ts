import { Router, Response } from 'express';
import { protect, premiumOnly } from '../middleware/auth';
import Questionnaire from '../models/Questionnaire';
import Recommendation from '../models/Recommendation';
import { generateAdvisorPDF } from '../services/pdfGenerator';

const router = Router();

// @route   GET /api/reports/download
// @desc    Download the academic advisor report as PDF
router.get('/download', protect, premiumOnly, async (req: any, res: Response) => {
    try {
        const studentData = await Questionnaire.findOne({ userId: req.user._id });
        const recommendations = await Recommendation.findOne({ userId: req.user._id }).sort({ createdAt: -1 });

        if (!studentData || !recommendations) {
            return res.status(404).json({ message: 'No data found to generate report. Complete the questionnaire first.' });
        }

        const pdfBuffer = await generateAdvisorPDF({
            user: req.user,
            studentData,
            recommendations
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=AcademicAdvisor_Report_${req.user.name.replace(/\s+/g, '_')}.pdf`);
        res.send(pdfBuffer);
    } catch (error: any) {
        console.error('PDF Generation Error:', error);
        res.status(500).json({ message: 'Failed to generate PDF' });
    }
});

export default router;
