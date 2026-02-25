import express from 'express';
import { 
  getAuthorById, 
  getAllAuthors, 
  createAuthor,
  updateAuthor, 
  deleteAuthor,
  getTopAuthors,
} from '../controllers/authorController.js';

const router = express.Router();

router.get('/', getAllAuthors);
router.get('/:id', getAuthorById);
router.get('/report/top_authors', getTopAuthors);
router.post('/', createAuthor);
router.put('/:id', updateAuthor);
router.delete('/:id', deleteAuthor);
export default router;