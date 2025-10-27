import CandidateInterview from "../models/CandidateInterview.js";
export const submitInterview = async (req, res) => {
  try {
    const { interviewId, candidateId} = req.body;
    const existing = await CandidateInterview.findOne({ interviewId, candidateId });
      
    if (existing) {
      return res.status(400).json({ message: 'Candidate already joined this interview' });
    }
    const newCandidateInterview =  new CandidateInterview(req.body);
    const completedInterview = await newCandidateInterview.save();
    res.status(200).json(completedInterview);
  } catch (err) {
    console.error(err);
  }
};

export const getCandidateInterviews = async(req,res)=>{
   try{
    const { candidateId } = req.query;
    const candidateInterviews = await CandidateInterview.find({candidateId:candidateId});
    if(!candidateInterviews){
      return res.status(404).json({ message: 'No interviews found' });
    }
    res.status(200).json(candidateInterviews);
   } catch(err){
    console.error(err);
    res.status(500).json({ message: 'Failed to get interviews', error: err.message });
   }
};

export const getInterview = async (req, res) => {
  const { interviewId } = req.query;
  try {
    // Fetch all interviews and populate interviewer details
    const candidateInterview = await CandidateInterview.findById(interviewId);
    res.status(200).json(candidateInterview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch data', error: err.message });
  }
};
