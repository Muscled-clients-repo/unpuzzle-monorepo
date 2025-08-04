import { Router, Request, Response, NextFunction } from 'express';
import { requireAuth } from '@clerk/express'
// Controllers
import homepageController from '../../controllers/pages/homepage.controller';
import accountPagesController from '../../controllers/pages/account.controller';
import videoController from '../../controllers/pages/video.controller';
import paymentController from '../../controllers/pages/paymentGetway.controller';
import ClerkClient from '../../middleware/ClerkClient';


const router = Router();

router.get('/sign-in', accountPagesController.getSignInPage);
router.get('/sign-up', accountPagesController.getSignUpPage);

// protected  routes
router.use(ClerkClient.requireAuthRedirect);

// View routes
router.get('/', homepageController.getHomePage);
router.get('/course-video/:id', videoController.getCourseVideoPage);
router.get('/dev/test-api', (req: Request, res: Response) => {
    res.render('pages/test-api.pug');
});

// payment getway routes
router.get("/purchase/payment", paymentController.getPaymentPage)


router.use((req: Request, res: Response) => {
    res.status(404).render('pages/error', {
        message: 'Page not found',
        error: 'Page not found'
    });
});

export default router; 