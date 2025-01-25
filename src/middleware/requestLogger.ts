import type { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

// Extend the Express Request type to include our custom property
interface RequestWithTimer extends Request {
    startTime?: number;
}

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    // Skip logging for favicon requests
    if (req.url === '/favicon.ico') {
        return next();
    }

    const startTime = Date.now();
    const origin = req.headers.origin || 'no-origin';

    res.on('finish', () => {
        const duration = Date.now() - startTime;
        console.log(JSON.stringify({
            timestamp: new Date().toISOString(),
            method: req.method,
            path: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            origin,
            ip: req.ip
        }));
    });

    next();
};