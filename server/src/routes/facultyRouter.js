import express from 'express';
import { 
    getFaculty,
    getAllFaculties,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    getReportMaterialsOnYear,
    getReportMaterialsOnYearWithDepartments,
    exportFacultyReportExcel,
    exportFacultyDepReportExcel,
} from '../controllers/facultyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllFaculties);
router.get('/:id', getFaculty);
router.get('/report/materials_by_year', getReportMaterialsOnYear);
router.get('/export_excel/materials_by_year', protect, exportFacultyReportExcel);
router.get('/report/materials_by_year_with_departments', getReportMaterialsOnYearWithDepartments);
router.get('/export_excel/materials_by_year_with_departmnets', protect, exportFacultyDepReportExcel);
router.post('/', createFaculty);
router.patch('/:id', updateFaculty);
router.delete('/:id', deleteFaculty);
export default router;