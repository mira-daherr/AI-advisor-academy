import { Router } from 'express';
const router = Router();

router.post('/evaluate', (req, res) => {
    res.json({ message: 'Evaluate questionnaire placeholder' });
});

router.post('/chat', (req, res) => {
    res.json({ message: 'AI Chat placeholder' });
});

export default router;
