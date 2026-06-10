import express from 'express';
import { 
    getDepartment,
    getAllDepartments,
    getDepartmentsByFacultyId,
    createDepartment,
    updateDepartment,
    deleteDepartment,
    getDepartmentsMaterialsCount,
    getDepartmentDisciplinesReport,
    getDepartmentAuthorsActivity,
    exportDepartmentDisciplinesToExcel,
    exportDepartmentDisciplinesToWord
} from '../controllers/departmentController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { ROLES } from '../config/roles.js';

const router = express.Router();

router.get('/', getAllDepartments);
router.get('/byFacultyId/:id', getDepartmentsByFacultyId);
router.get('/report/disciplines', protect, restrictTo(...Object.values(ROLES)), getDepartmentDisciplinesReport);
router.get('/report/department_activity', protect, restrictTo(...Object.values(ROLES)), getDepartmentsMaterialsCount);
router.get('/report/department_authors_activity', protect, restrictTo(...Object.values(ROLES)), getDepartmentAuthorsActivity);
router.get('/export_excel/disciplines', protect, restrictTo(...Object.values(ROLES)), exportDepartmentDisciplinesToExcel);
router.get('/export_word/disciplines', protect, restrictTo(...Object.values(ROLES)), exportDepartmentDisciplinesToWord);
router.get('/:id', getDepartment);
router.post('/', createDepartment);
router.patch('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);
export default router;
