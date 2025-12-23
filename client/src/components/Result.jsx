import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Answer from "./Answer";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #b3d2eaff;
  height: 80vh;
  width: 70%;
  box-shadow: 0 0 0.6rem rgba(221, 191, 239, 0.88);
  position: relative;
`;

const Container1 = styled.div`
  width: 100%;
  flex: 1;
  background-color: #1f3850ff;
  display: flex;
  font-size: 2rem;
  font-weight: 600;
  color: #b3d2eaff;
  
`;

const Greeting = styled.div`
  flex: 4;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Time = styled.div`
  flex: 1;
  font-style: italic;
  font-family: monaco;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container2 = styled.div`
  flex: 7;
  display: flex;
  flex-direction: column;
   overflow: hidden;  
  min-height: 0; 
  
   &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
`;

const Heading = styled.div`
  width: 100%;
  flex-shrink: 0;
  height: 8%;
  min-height: 0;
  font-size: 1.6rem;
  font-weight: 700;
  font-family: georgia;
  color: rgba(66, 80, 150, 1);
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-right: 1rem;
`;

const Info = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
min-height: 0;  /* Hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  -ms-overflow-style: none;
   
`;

const P = styled.p`
  font-size: 1.3rem;
  color: rgba(51, 74, 111, 1);
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Div1 = styled.div`
  flex: 7;
`;

const Div2 = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const Button = styled.button`
  width: 100%;
  height: 5vh;
  border-radius: 1rem;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  background-color: rgba(51, 74, 111, 1);
  color: #99c1dfff;
  transition: transform 0.1s ease-in-out;

  &:active {
    transform: scale(0.96);
  }
`;

const View = styled.div`
  position: absolute;
  top: 5%;
  left: 10%;
  width: 80%;
  height: 90%;
  background-color: #1f3850ff;
  border-radius: 1rem;
  box-shadow: 0 0 1rem rgba(0, 0, 0, 0.4);
`;

const Result = () => {
  const location = useLocation();
  const { candidateInterviewId } = location.state || {};
  const { currentUser } = useSelector((state) => state.user);
  const [data, setData] = useState(null);
  const [clickedIdx, setClickedIdx] = useState(0);
  const [ans, setAns] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!candidateInterviewId) return; // prevent call if candidateInterviewId is missing
      try {
        const res = await axios.get(
          `http://localhost:8800/api/candidate-interviews/interview?candidateInterviewId=${candidateInterviewId}`
        );
        setData(res.data);
      } catch (err) {
        console.error("Failed to fetch interview data:", err);
      }
    };
    fetchData();
  }, [candidateInterviewId]);

  const handleView = (idx) => {
    setClickedIdx(idx);
    setAns(true);
  };

  if (!data) {
    return (
      <Wrapper>
        <Container1>
          <Greeting>Loading results...</Greeting>
        </Container1>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container1>
        <Greeting>
          Congratulations, {currentUser?.name || "Candidate"}!
        </Greeting>
        <Time>Score: {data.finalScore ?? "N/A"}/10</Time>
      </Container1>

      <Container2>
        <Heading>
          {data.company} &lt;
          <span
            style={{
              color: "#2067a6ff",
              fontWeight: "600",
              fontSize: "1.2rem",
              fontStyle: "italic",
            }}
          >
            {data.role}
          </span>
          &gt;
        </Heading>

        <Info>
          {data.questionAndAnswers?.length > 0 ? (
            data.questionAndAnswers.map((queAndAns, index) => (
              <P key={index}>
                <Div1>
                  {index + 1}. {queAndAns.question}
                </Div1>
                <Div2>
                  <Button onClick={() => handleView(index + 1)}>View</Button>
                </Div2>
              </P>
            ))
          ) : (
            <P>No questions found for this interview.</P>
          )}
        </Info>

        {ans && (
          <View>
            <Answer
              setAns={setAns}
              answer={data.questionAndAnswers?.[clickedIdx - 1]?.answer || ""}
            />
          </View>
        )}
      </Container2>
    </Wrapper>
  );
};

export default Result;
