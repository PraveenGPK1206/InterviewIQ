import express from 'express';
import { cache } from "../middleware/cache.js";
import { addInterview, getAllInterviews, getCreatedInterviews, getInterview } from '../controllers/interview.js';
const router = express.Router();

router.post('/' ,addInterview);
router.get('/', cache("all_interviews", 300),getAllInterviews);
router.get('/user', cache((req) => `created_interviews_${req.query.interviewerId}`, 300),getCreatedInterviews);
router.get('/interview',cache(
    (req) => `interview_${req.query.interviewId}`,
    300
  ), getInterview);
export default router;
