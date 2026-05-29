import express from 'express';
import { downloadBackup, runParser } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { ROLES } from '../config/roles.js';

const router = express.Router();

router.get('/backup', protect, restrictTo(ROLES.ADMIN), downloadBackup);
router.post('/run_parser', protect, restrictTo(ROLES.ADMIN), runParser);

export default router;