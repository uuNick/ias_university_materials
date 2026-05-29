import express from 'express';
import AuthRouter from './authRouter.js';
import AuthorRouter from './authorRouter.js';
import UserRouter from './userRouter.js';
import FacultyRouter from './facultyRouter.js';
import DepartmentRouter from './departmentRouter.js';
import TypeRouter from './typeRouter.js';
import Keywords from './keywordRouter.js';
import Specialities from './specialityRouter.js';
import UdcCodes from './udcRouter.js';
import Roles from './roleRouter.js';
import Materials from './materialRouter.js';
import AdminRouter from './adminRouter.js';


const router = express.Router();

router.use("/auth", AuthRouter);
router.use("/authors", AuthorRouter);
router.use('/users', UserRouter);
router.use('/faculties', FacultyRouter);
router.use('/departments', DepartmentRouter);
router.use('/types', TypeRouter);
router.use('/keywords', Keywords);
router.use('/specialties', Specialities);
router.use('/udc_codes', UdcCodes);
router.use('/roles', Roles);
router.use('/materials', Materials);
router.use('/admin', AdminRouter);


export default router;
