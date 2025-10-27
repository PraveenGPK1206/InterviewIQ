import Interview from "../models/Interview.js";

export const addInterview = async (req, res, next) => {
  const { candidateId } = req.body;
  const newInterview =  new Interview({ interviewerId: candidateId, ...req.body });
  try {
    const savedVideo = await newInterview.save();
    console.log("added Interview");
    res.status(200).json(savedVideo);     
  } catch (err) {
    next(err);
  }
};

// for candidate 
export const getAllInterviews = async (req, res) => {
  try {
    // Fetch all interviews and populate interviewer details
    const interviews = await Interview.find();
    if(!interviews){
      return res.status(404).json({ message: 'No interviews found' });
    }
    res.status(200).json(interviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch interviews', error: err.message });
  }
};

// for admin 
export const getCreatedInterviews = async (req, res) => {
  const { candidateId } = req.query;
  try {
    // Fetch all interviews and populate interviewer details
    const interviews = await Interview.find({ interviewerId: candidateId});
    if(!interviews || interviews.length === 0){
      return res.status(404).json({ message: 'No interviews found' });
    }
    res.status(200).json(interviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch interviews', error: err.message });
  }
};


export const getInterview = async (req, res) => {
  const { interviewId } = req.query;
  try {
    // Fetch all interviews and populate interviewer details
    const interview = await Interview.findById(interviewId);
    res.status(200).json(interview);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch data', error: err.message });
  }
};
