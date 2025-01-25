import { Router } from 'express';
import { csrfProtection } from '../middleware/csrf';
import type { Request, Response } from 'express';

const router = Router();

router.get('/', csrfProtection, (req: Request, res: Response) => {
  // The CSRF token is already set in the response headers by the middleware
  res.json({ success: true });
});

export default router;