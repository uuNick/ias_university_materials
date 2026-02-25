import express from 'express';
import { 
    getFaculty,
    getAllFaculties,
    createFaculty,
    updateFaculty,
    deleteFaculty,
    getReportMaterialsOnYear,
} from '../controllers/facultyController.js';

const router = express.Router();

router.get('/', getAllFaculties);
router.get('/:id', getFaculty);
router.get('/report/materials_by_year', getReportMaterialsOnYear);
router.post('/', createFaculty);
router.put('/:id', updateFaculty);
router.delete('/:id', deleteFaculty);
export default router;