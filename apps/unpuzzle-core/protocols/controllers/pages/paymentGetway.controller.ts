import { Request, Response } from 'express';

class PaymentController {
  async getPaymentPage(req: any, res: Response) {
    try {
      
      res.render('pages/payment',{user: req.user});
    } catch (error) {
      console.error('Error fetching videos:', error);
      res.status(500).render('pages/error', {
        message: 'Error loading videos',
        error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
      });
    }
  }
}

export default new PaymentController();