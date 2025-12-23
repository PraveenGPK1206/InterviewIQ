import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Card from "../components/Card";
import Resume from "../components/Resume";
import CreateInterview from "../components/CreateInterview";
import axios from "axios";
import CandidatesCard from "../components/CandidatesCard";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #b3d2ea;
  height: 85%;
  width: 70%;
  box-shadow: 0 0 0.6rem rgba(221, 191, 239, 0.88);
  position: relative;
`;

const Container1 = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  font-size: 1.5rem;
  font-weight: 600;
`;

const Box = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #1f3850;
  color: #cdd9e5;
`;

const Add = styled.button`
  width: 10%;
  height: 40%;
  border-radius: 1rem;
  border: none;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  color: #1f3850;
  background-color: #b3d2ea;
  &:hover {
    background-color: #98caf0;
    transform: scale(1.05);
  }
`;

const Box1 = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: ${(props) => (props.selfBlock ? "#cdd9e5" : "#1f3850")};
  color: ${(props) => (!props.selfBlock ? "#cdd9e5" : "#1f3850")};
  cursor: pointer;
`;

const Box2 = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: ${(props) => (!props.selfBlock ? "#cdd9e5" : "#1f3850")};
  color: ${(props) => (props.selfBlock ? "#cdd9e5" : "#1f3850")};
  cursor: pointer;
`;

const Container2 = styled.div`
  padding: 1% 0.4%;
  background-color: #668ba7;
  flex: 5;
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const Upload = styled.div`
  position: absolute;
  top: 25%;
  left: 25%;
  width: 50%;
  height: 50%;
  background-color: #1f3850;
  border-radius: 1rem;
`;

const Create = styled.div`
  position: absolute;
  top: 20%;
  left: 15%;
  width: 70%;
  height: 70%;
  background-color: #1f3850;
  border-radius: 1rem;
`;

const Home = () => {
  const [isResumeUploadOpen, setIsResumeUploadOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [selfBlock, setSelfBlock] = useState(false);
  const [create, setCreate] = useState(false);
  const [availableInterviews, setAvailableInterviews] = useState([]);
  const [completedInterviews, setCompletedInterviews] = useState([]);
  const [candidateInterviewAttempts,setCandidateInterviewAttempts]=useState([]);
  const [clickedIdx, setClickedIdx] = useState(null);

  // Fetch all availableInterviews
  useEffect(() => {
    const fetchAvailableInterviews = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/interviews`);
        setAvailableInterviews(res.data);
      } catch (err) {
        console.error("Failed to fetch availableInterviews:", err);
      }
    };
    fetchAvailableInterviews();
  }, [currentUser]);

   // Fetch role based interviews
  useEffect(() => {
    const fetchCandidateInterviewAttempts = async () => {
      if(currentUser.userType!=="interviewer" ||  clickedIdx === null || !availableInterviews[clickedIdx]) return ;
      try {
        const res = await axios.get(`http://localhost:8800/api/candidate-interviews/interviews?interviewId=${availableInterviews[clickedIdx]._id}`);
        setCandidateInterviewAttempts(res.data);
      } catch (err) {
        console.error("Failed to fetch candidateInterviewAttempts:", err);
      }
    };
    fetchCandidateInterviewAttempts();
  }, [currentUser,clickedIdx]);

  // Fetch candidate's completed interviews
  useEffect(() => {
    if (!currentUser?._id) return;
    const fetchCompleted = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/candidate-interviews/user?candidateId=${currentUser._id}`
        );
        setCompletedInterviews(res.data);
      } catch (err) {
        console.error("Failed to fetch completed interviews:", err);
      }
    };
    fetchCompleted();
  }, [currentUser]);

  return (
    <Wrapper>
      <Container1>
        {currentUser?.userType !== "interviewer" ? (
          <>
            <Box1 selfBlock={selfBlock} onClick={() => setSelfBlock(false)}>
              Available Interviews
            </Box1>
            <Box2 selfBlock={selfBlock} onClick={() => setSelfBlock(true)}>
              Completed Interviews
            </Box2>
          </>
        ) : (
          <Box>
            {clickedIdx !== null ? "Candidates Interview for "+availableInterviews[clickedIdx].role:"Your Created Interviews"} &nbsp;&nbsp;
            
            {clickedIdx !== null ? <Add onClick={()=> setClickedIdx(null) }> Back </Add> : <Add onClick={() => setCreate(true)}>Create</Add>  }
          </Box>
        )}
      </Container1>

      <Container2>
       
        { clickedIdx===null 
        ? (selfBlock && currentUser?.userType !== "interviewer"
          ? completedInterviews
          : availableInterviews
        )
          .filter(
            (interview) =>
              !(currentUser?.userType === "interviewer" && interview.interviewerId !== currentUser._id)
          )
          .map((interview, index) => (
            <Card
              key={interview._id || index}
              selfBlock={selfBlock}
              setUpload={setIsResumeUploadOpen}
              interviewer={currentUser?.userType === "interviewer"}
              index={index}
              setClickedIdx={setClickedIdx}
              data={interview}
            />
          ))
          :(
            candidateInterviewAttempts?.map((interview,index)=>(
              <CandidatesCard
                data={interview}
                index={index}
              />
            ))
          )
          }

        {isResumeUploadOpen && clickedIdx !== null && availableInterviews[clickedIdx] && (
          <Upload> 
            <Resume
              setUpload={setIsResumeUploadOpen}
              interview={availableInterviews[clickedIdx]}
            />
          </Upload>
        )}

        {create && (
          <Create>
            <CreateInterview
              setCreate={setCreate}
              candidateId={currentUser._id}
              setInterviews={setAvailableInterviews}
            />
          </Create>
        )}
      </Container2>
    </Wrapper>
  );
};

export default Home;
