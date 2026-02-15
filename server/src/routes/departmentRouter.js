import express from 'express';
import { 
    getDepartment,
    getAllDepartments,
    getDepartmentsByFacultyId,
    createDepartment,
    updateDepartment,
    deleteDepartment
} from '../controllers/departmentController.js';

const router = express.Router();

router.get('/', getAllDepartments);
router.get('/byFacultyId/:id', getDepartmentsByFacultyId)
router.get('/:id', getDepartment);
router.post('/', createDepartment);
router.put('/:id', updateDepartment);
router.delete('/:id', deleteDepartment);
export default router;