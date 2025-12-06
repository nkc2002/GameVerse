import { Router } from 'express';
import { body } from 'express-validator';
import { commentController } from '../controllers';
import { requireAuth } from '../middlewares/auth';
import { validate } from '../middlewares/validate';

const router = Router();

router.get('/', commentController.getComments);

router.post(
  '/',
  requireAuth,
  validate([
    body('content').notEmpty().withMessage('Content is required'),
    body('post').optional().isMongoId().withMessage('Invalid post ID'),
    body('review').optional().isMongoId().withMessage('Invalid review ID'),
    body('parent').optional().isMongoId().withMessage('Invalid parent comment ID'),
  ]),
  commentController.createComment
);

router.delete('/:id', requireAuth, commentController.deleteComment);

export default router;


