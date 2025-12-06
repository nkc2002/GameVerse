import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import gameRoutes from './game.routes';
import postRoutes from './post.routes';
import reviewRoutes from './review.routes';
import commentRoutes from './comment.routes';
import uploadRoutes from './upload.routes';
import statsRoutes from './stats.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/games', gameRoutes);
router.use('/posts', postRoutes);
router.use('/reviews', reviewRoutes);
router.use('/comments', commentRoutes);
router.use('/uploads', uploadRoutes);
router.use('/stats', statsRoutes);

export default router;


