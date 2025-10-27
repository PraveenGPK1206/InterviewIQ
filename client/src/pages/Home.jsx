import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Card from "../components/Card";
import Resume from "../components/Resume";
import CreateInterview from "../components/CreateInterview";
import axios from "axios";

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
  const [upload, setUpload] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [selfBlock, setSelfBlock] = useState(false);
  const [create, setCreate] = useState(false);
  const [interviews, setInterviews] = useState([]);
  const [completedInterviews, setCompletedInterviews] = useState([]);
  const [clickedIdx, setClickedIdx] = useState(null);

  // Fetch all interviews
  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/interviews`);
        setInterviews(res.data);
      } catch (err) {
        console.error("Failed to fetch interviews:", err);
      }
    };
    fetchInterviews();
  }, [currentUser]);

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
            Your Created Interviews &nbsp;&nbsp;
            <Add onClick={() => setCreate(true)}>Create</Add>
          </Box>
        )}
      </Container1>

      <Container2>
        {(selfBlock && currentUser?.userType !== "interviewer"
          ? completedInterviews
          : interviews
        )
          .filter(
            (interview) =>
              !(currentUser?.userType === "interviewer" && interview.interviewerId !== currentUser._id)
          )
          .map((interview, index) => (
            <Card
              key={interview._id || index}
              selfBlock={selfBlock}
              setUpload={setUpload}
              interviewer={currentUser?.userType === "interviewer"}
              index={index}
              setClickedIdx={setClickedIdx}
              data={interview}
            />
          ))}

        {upload && clickedIdx !== null && interviews[clickedIdx] && (
          <Upload>
            <Resume
              setUpload={setUpload}
              interview_id={interviews[clickedIdx]._id}
            />
          </Upload>
        )}

        {create && (
          <Create>
            <CreateInterview
              setCreate={setCreate}
              candidateId={currentUser._id}
              setInterviews={setInterviews}
            />
          </Create>
        )}
      </Container2>
    </Wrapper>
  );
};

export default Home;
