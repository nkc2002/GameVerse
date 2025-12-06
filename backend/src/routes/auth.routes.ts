import { Router } from 'express';
import { body } from 'express-validator';
import { authController } from '../controllers';
import { validate } from '../middlewares/validate';
import { authRateLimiter } from '../middlewares/rateLimiter';

const router = Router();

router.post(
  '/register',
  authRateLimiter,
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('username').notEmpty().withMessage('Username is required'),
  ]),
  authController.register
);

router.post(
  '/login',
  authRateLimiter,
  validate([
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ]),
  authController.login
);

router.post('/refresh', authController.refresh);

router.post('/logout', authController.logout);

export default router;


