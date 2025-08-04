import { Router, Request, Response } from 'express';

const router = Router();

// Get A New Api Health report
router.get('/', (req: Request, res: Response)=>{
    res.status(200).json({
        message: 'Api is healthy',
        timestamp: new Date().toISOString(),
        success: true,
    });
});

// Create A New Api Health report
router.post('/', (req: Request, res: Response)=>{
    res.status(200).json({
        message: 'Api is healthy',
        timestamp: new Date().toISOString(),
        success: true,
    });
});


export default router; 