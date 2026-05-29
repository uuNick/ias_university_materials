import express from 'express';
import { getUserById, getAllUsers, createUser, updateUser, deleteUser, getUsersWithPagAndSearch } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { restrictTo } from '../middleware/roleMiddleware.js';
import { ROLES } from '../config/roles.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/search', getUsersWithPagAndSearch);
router.get('/:id', getUserById);
router.post('/', protect, restrictTo(ROLES.ADMIN), createUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;