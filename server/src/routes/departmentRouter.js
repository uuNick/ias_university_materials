import express from 'express';
import { 
    getDepartment,
    getAllDepartments,
    getDepartmentsByFacultyId,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentDisciplinesReport,
    exportDepartmentDisciplinesExcel
} from '../controllers/departmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { ROLES } from '../config/roles.js';

const router = express.Router();

router.get('/', getAllDepartments);
router.get('/byFacultyId/:id', getDepartmentsByFacultyId);
router.get('/report/disciplines', protect, restrictTo(...Object.values(ROLES)), getDepartmentDisciplinesReport);
router.get('/export_excel/disciplines', protect, restrictTo(...Object.values(ROLES)), exportDepartmentDisciplinesExcel);
router.get('/:id', getDepartment);
router.post('/', createDepartment);
router.patch('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);
export default router;
