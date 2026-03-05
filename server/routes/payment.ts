import { Router } from 'express';
const router = Router();

router.post('/create-checkout-session', (req, res) => {
    res.json({ message: 'Stripe session placeholder' });
});

router.post('/webhook', (req, res) => {
    res.json({ received: true });
});

export default router;
