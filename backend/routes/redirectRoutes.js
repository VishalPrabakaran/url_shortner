import express from 'express';
import { handleRedirect } from '../controllers/redirectController.js';

const router = express.Router();

// Matches root endpoints directly (e.g. localhost:5000/aB3dE)
router.get('/:code', handleRedirect);

export default router;