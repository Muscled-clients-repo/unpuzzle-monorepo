import userAuthController from "../../controllers/api/userAuth.controller";
import { Router } from "express";
const router = Router();

router.get("/", userAuthController.getUserFromToken);
router.get("/refresh", userAuthController.refreshUser);
router.get('/logout', userAuthController.logout)

// Debug endpoint to check cookies and headers
router.get("/debug-cookies", (req, res) => {
    res.json({
        cookies: req.cookies,
        headers: {
            origin: req.headers.origin,
            host: req.headers.host,
            cookie: req.headers.cookie,
            referer: req.headers.referer
        },
        domain: process.env.DOMAIN,
        nodeEnv: process.env.NODE_ENV,
        clientUrl: process.env.CLIENT_URL_ENDPOINT
    });
});

export default router;