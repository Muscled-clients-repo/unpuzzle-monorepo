import { Response } from 'express';

export class CookieManager {
    private static readonly DOMAIN = process.env.DOMAIN?.replace(/['"]/g, '') || '.nazmulcodes.org';
    private static readonly AUTH_COOKIE = '__atrj';
    
    static {
        console.log('CookieManager initialized with DOMAIN:', this.DOMAIN);
        console.log('Raw DOMAIN env var:', process.env.DOMAIN);
    }
    
    static setAuthCookie(res: Response, token: string, options: Partial<{
        maxAge: number;
        httpOnly: boolean;
        secure: boolean;
        sameSite: 'strict' | 'lax' | 'none';
    }> = {}) {
        const isProduction = process.env.NODE_ENV === 'production';
        const isHttps = process.env.CLIENT_URL_ENDPOINT?.startsWith('https') || isProduction;
        
        const defaultOptions = {
            httpOnly: true,
            secure: isHttps, // Use secure if HTTPS
            domain: this.DOMAIN,
            path: '/',
            sameSite: 'none' as const, // Always use 'none' for cross-subdomain
            maxAge: 24 * 60 * 60 * 1000, // 24 hours
            ...options
        };

        console.log('Setting cookie with options:', {
            domain: defaultOptions.domain,
            secure: defaultOptions.secure,
            sameSite: defaultOptions.sameSite,
            path: defaultOptions.path,
            cookieName: this.AUTH_COOKIE,
            isProduction,
            isHttps
        });

        res.cookie(this.AUTH_COOKIE, token, defaultOptions);
    }

    static clearAuthCookie(res: Response) {
        const isHttps = process.env.CLIENT_URL_ENDPOINT?.startsWith('https') || process.env.NODE_ENV === 'production';
        res.clearCookie(this.AUTH_COOKIE, {
            domain: this.DOMAIN,
            path: '/',
            httpOnly: true,
            secure: isHttps,
            sameSite: 'none' as const
        });
    }

    static getAuthCookie(req: any): string | undefined {
        return req.cookies[this.AUTH_COOKIE];
    }

    // Set session cookie for real-time features
    static setSessionCookie(res: Response, sessionId: string) {
        const isHttps = process.env.CLIENT_URL_ENDPOINT?.startsWith('https') || process.env.NODE_ENV === 'production';
        res.cookie('__session', sessionId, {
            httpOnly: true,
            secure: isHttps,
            domain: this.DOMAIN,
            path: '/',
            sameSite: 'none' as const,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
    }

    static clearAllAuthCookies(res: Response) {
        const cookiesToClear = [this.AUTH_COOKIE, '__session', 'socketId'];
        const isHttps = process.env.CLIENT_URL_ENDPOINT?.startsWith('https') || process.env.NODE_ENV === 'production';
        
        cookiesToClear.forEach(cookieName => {
            res.clearCookie(cookieName, {
                domain: this.DOMAIN,
                path: '/',
                httpOnly: true,
                secure: isHttps,
                sameSite: 'none' as const
            });
        });
    }
}