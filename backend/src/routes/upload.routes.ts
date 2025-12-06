import { Router } from 'express';
import { uploadController } from '../controllers';
import { requireAuth } from '../middlewares/auth';
import { upload } from '../middlewares/upload';

const router = Router();

router.post('/', requireAuth, upload.single('file'), uploadController.uploadFile);

router.post('/multiple', requireAuth, upload.array('files', 10), uploadController.uploadMultiple);

export default router;


