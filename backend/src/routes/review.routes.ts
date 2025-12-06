import { Router } from 'express';
import { body } from 'express-validator';
import { reviewController } from '../controllers';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';

const router = Router();

router.get('/', reviewController.getReviews);

router.get('/:id', reviewController.getReviewById);

router.post(
  '/',
  requireAuth,
  validate([
    body('game').notEmpty().withMessage('Game ID is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('rating').isInt({ min: 1, max: 10 }).withMessage('Rating must be between 1 and 10'),
    body('images').optional().isArray().withMessage('Images must be an array'),
  ]),
  reviewController.createReview
);

router.put(
  '/:id',
  requireAuth,
  validate([
    body('content').optional().notEmpty().withMessage('Content cannot be empty'),
    body('rating').optional().isInt({ min: 1, max: 10 }).withMessage('Rating must be between 1 and 10'),
    body('images').optional().isArray().withMessage('Images must be an array'),
  ]),
  reviewController.updateReview
);

router.delete('/:id', requireAuth, reviewController.deleteReview);

export default router;


