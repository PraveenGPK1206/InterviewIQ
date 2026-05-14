import express from 'express';
import { cache } from "../middleware/cache.js";
import { submitInterview, getCandidateInterviews, getInterview, getInterviews } from '../controllers/candidateInterview.js';
const router = express.Router();

router.post('/submit', submitInterview);
router.get('/user', cache(
    (req) => `candidateInterviews_${req.query.candidateId}`,
    300
  ), getCandidateInterviews);
router.get('/interview', 
  cache(
    (req) =>
      `candidateInterview_${req.query.candidateInterviewId}`,
    300
  ), getInterview);
router.get('/interviews',cache(
    (req) => `ranking_${req.query.interviewId}`,
    300
  ),getInterviews);
export default router;
