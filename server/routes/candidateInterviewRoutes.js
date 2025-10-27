import express from 'express';
import { submitInterview, getCandidateInterviews, getInterview } from '../controllers/candidateInterview.js';
const router = express.Router();

router.post('/submit', submitInterview);
router.get('/user', getCandidateInterviews);
router.get('/interview',getInterview);
export default router;
