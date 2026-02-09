import express from 'express';
import AuthorRouter from './authorRouter.js';
const router = express.Router();

router.use("/authors", AuthorRouter);

export default router;