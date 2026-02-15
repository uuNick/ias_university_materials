import express from 'express';
import AuthorRouter from './authorRouter.js';
import UserRouter from './userRouter.js';
const router = express.Router();

router.use("/authors", AuthorRouter);
router.use('/users', UserRouter);

export default router;