import express from 'express';
import { downloadBackup, runParser, handleParserWebhookLog } from '../controllers/adminController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { ROLES } from '../config/roles.js';

const router = express.Router();

router.post('/backup', protect, restrictTo(ROLES.ADMIN), downloadBackup);
router.post('/run_parser', protect, restrictTo(ROLES.ADMIN), runParser);
router.post('/parser/logs', handleParserWebhookLog);

export default router;