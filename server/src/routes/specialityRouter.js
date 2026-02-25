import express from 'express';
import { 
  getAllSpecialities, 
  getSpecialityByCode, 
  createSpeciality, 
  updateSpeciality, 
  deleteSpeciality,
  getSpecialityReportByYear,
} from '../controllers/specialityController.js';

const router = express.Router();

router.get('/', getAllSpecialities);
router.get('/:code', getSpecialityByCode);
router.get('/report/specialities_by_year', getSpecialityReportByYear);
router.post('/', createSpeciality);
router.put('/:code', updateSpeciality);
router.delete('/:code', deleteSpeciality);

export default router;