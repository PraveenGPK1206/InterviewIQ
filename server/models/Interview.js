import mongoose from "mongoose";

const InterviewSchema = new mongoose.Schema({
    company:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    description:{ 
        type: String 
    },
    interviewerId:{
        type:String,
        required: true,
    }
 },
 {timestamps : true}
);

export default mongoose.model("Interview", InterviewSchema);