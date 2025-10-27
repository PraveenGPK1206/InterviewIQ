import express from 'express';
import { addInterview, getAllInterviews, getCreatedInterviews, getInterview } from '../controllers/interview.js';
const router = express.Router();

router.post('/' ,addInterview);
router.get('/', getAllInterviews);
router.get('/user',getCreatedInterviews);
router.get('/interview', getInterview);
export default router;
