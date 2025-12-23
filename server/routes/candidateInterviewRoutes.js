import express from 'express';
import { submitInterview, getCandidateInterviews, getInterview, getInterviews } from '../controllers/candidateInterview.js';
const router = express.Router();

router.post('/submit', submitInterview);
router.get('/user', getCandidateInterviews);
router.get('/interview',getInterview);
router.get('/interviews',getInterviews);
export default router;
