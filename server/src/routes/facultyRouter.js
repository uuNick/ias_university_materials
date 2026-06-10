import express from 'express';
import { 
    getFaculty,
    getAllFaculties,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    getReportMaterialsOnYear,
    getReportMaterialsOnYearWithDepartments,
    getDepartmentMaterialsReport,
    exportFacultyReportToExcel,
    exportFacultyDepReportToExcel,
    exportFacultyReportToWord,
    exportFacultyDepReportToWord
} from '../controllers/facultyController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllFaculties);
router.get('/:id', getFaculty);
router.get('/report/materials_by_year', getReportMaterialsOnYear);
router.get('/report/faculty_departments', getDepartmentMaterialsReport);
router.get('/export_excel/materials_by_year', protect, exportFacultyReportToExcel);
router.get('/export_word/materials_by_year', protect, exportFacultyReportToWord);
router.get('/report/materials_by_year_with_departments', getReportMaterialsOnYearWithDepartments);
router.get('/export_excel/materials_by_year_with_departmnets', protect, exportFacultyDepReportToExcel);
router.get('/export_word/materials_by_year_with_departmnets', protect, exportFacultyDepReportToWord);
router.post('/', createFaculty);
router.patch('/:id', updateFaculty);
router.delete('/:id', deleteFaculty);
export default router;