import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/', (req: Request, res: Response) => {
    const dbStatus = mongoose.connection.readyState === 1;

    res.status(dbStatus ? 200 : 503).json({
        status: dbStatus ? 'ok' : 'error',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        dbConnected: dbStatus
    });
});

export default router;
