import { Request, Response } from 'express';

class AccountController {
    async getSignInPage(req: Request, res: Response) {
        try {
        res.render('pages/signin');
        } catch (error) {
        console.error('Error fetching signin page:', error);
        res.status(500).render('pages/error', {
            message: 'Error loading signin page',
            error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
        });
        }
    }

    async getSignUpPage(req: Request, res: Response) {
        try {
            res.render('pages/signup');
        } catch (error) {
            console.error('Error fetching signup page:', error);
            res.status(500).render('pages/error', {
                message: 'Error loading signup page',
                error: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : undefined
            });
        }
    }
}

export default new AccountController();