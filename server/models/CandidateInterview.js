import mongoose from 'mongoose';

const CandidateQASchema = new mongoose.Schema({
  question:    { type: String, required: true },
  difficulty:  { type: String },     // easy / medium / hard
  answer:      { type: String, default: '' },
  aiScore:     { type: Number },
  timeAllowed: { type: Number },
  timeTaken:   { type: Number }
}, { _id: false });


const CandidateInterviewSchema = new mongoose.Schema({
  interviewId: { type: String, required: true },
  candidateId: { type: String, required: true },
  company:{type:String,required:true},
  role:{type:String,required:true},
  description:{type:String,required:true},
  questionAndAnswers:   [CandidateQASchema],                       
  finalScore:  { type: Number },
  aiSummary:   { type: String }
});

export default mongoose.model('CandidateInterview', CandidateInterviewSchema);
