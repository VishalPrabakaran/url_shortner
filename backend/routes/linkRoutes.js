import express from 'express';
import { createLink, getUserLinks, deleteLink } from '../controllers/linkController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Notice we wrap every pathway with the 'protect' shield middleware!
router.post('/', protect, createLink);
router.get('/', protect, getUserLinks);
router.delete('/:id', protect, deleteLink);

export default router;