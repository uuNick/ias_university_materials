import express from 'express';
import authorController from '../controllers/authorController.js';
const router = express.Router();

router.get("/", authorController.getAuthors);

export default router;