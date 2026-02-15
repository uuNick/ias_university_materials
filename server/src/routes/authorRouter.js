import express from 'express';
import { 
  getAuthorById, 
  getAllAuthors, 
  createAuthor,
  updateAuthor, 
  deleteAuthor 
} from '../controllers/authorController.js';

const router = express.Router();

router.get('/', getAllAuthors);
router.get('/:id', getAuthorById);
router.post('/', createAuthor);
router.put('/:id', updateAuthor);
router.delete('/:id', deleteAuthor);
export default router;