

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

// ---------------- Styled Components ----------------
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #b3d2ea;
  height: 85%;
  width: 70%;
  box-shadow: 0 0 0.6rem rgba(221, 191, 239, 0.88);
  border-radius: 1rem;
  overflow: hidden;
`;

const Container1 = styled.div`
  flex: 3;
  background-color: #1f3850;
  font-size: 2rem;
  font-weight: 600;
  color: #b3d2ea;
  display: flex;
`;

const Greeting = styled.div`
  flex: 4;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Time = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container2 = styled.div`
  flex: 20;
  display: flex;
  flex-direction: column;
`;

const P = styled.p`
  font-size: 1.4rem;
  color: rgba(51, 74, 111, 1);
  font-weight: 600;
  flex: 0.5;
  padding: 0 10%;
`;

const Div = styled.div`
  flex: 20;
  display: flex;
  flex-direction: column;
  padding: 0 10% 5% 10%;
`;

const Input = styled.textarea.attrs({
  autoCorrect: "off",
  autoCapitalize: "none",
  spellCheck: "false",
  autoComplete: "off",
})`
  flex: 18;
  width: 100%;
  color: #2f5e81;
  padding: 1rem;
  margin-bottom: 2%;
  font-size: 1.2rem;
  font-weight: 600;
  border: 0.1rem solid #ddd;
  border-radius: 0.5rem;
  outline: none;
  resize: vertical;
  box-sizing: border-box;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

const Div1 = styled.div`
  width: 100%;
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

const Button = styled.button`
  border-radius: 1rem;
  border: none;
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
  background-color: rgba(51, 74, 111, 1);
  color: #fff;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #294b76;
    transform: scale(1.05);
  }
`;
const Sub = styled.p`
font-size:5rem`;
// ---------------- Main Component ----------------
const Interview = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { resumeData, interview } = location.state || {};
  const { currentUser } = useSelector((state) => state.user);

  const [resData, setResData] = useState([]);
  const [queAndAns, setQueAndAns] = useState([]);
  const [question, setQuestion] = useState("");
  const [ans, setAns] = useState("");
  const [idx, setIdx] = useState(0);
  const [length, setLength] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4 * 60);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const promptForQue = `
You are a senior technical interviewer.

Resume:
${resumeData}

Candidate is applying for the role of ${interview.role} at ${interview.company}.

Task:
- Analyze the resume.
- Identify key skills and weak areas.
- Ask 6 interview questions starting from easy to hard.
- Questions must be relevant to the resume and role.

Output format (strict):
{
  "questions": ["q1", "q2", "q3", "q4", "q5", "q6"]
}

Rules:
- No explanations.
- No extra text.
- Only valid JSON.
`;


  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && resData.length > 0) {
      handleSubmit();
    }
  }, [timeLeft]);

  useEffect(() => {
    const fetchData = async () => {
      try {

        const res = await axios.post('http://localhost:8800/api/genai', { message: promptForQue });

        const jsonString = res.data.reply.replace(/```json|```/g, "").trim();
        const data = JSON.parse(jsonString);

        if (data.questions && Array.isArray(data.questions)) {
          setResData(data.questions);
          setLength(data.questions.length);
          setQuestion(data.questions[0]);
        } else {
          console.error("Invalid question format from API");
        }
      } catch (err) {
        console.error("Error fetching interview questions:", err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    if (interview && resumeData && currentUser?._id) {
      fetchData();
    }
  }, [interview, resumeData, currentUser, navigate]);

  const getAiScore = async (qaData) => {
  const finalPrompt = `
    You are an expert technical interviewer.

    Resume:
${resumeData}

Role: ${interview.role} at ${interview.company}

Questions:
${JSON.stringify(resData)}

Candidate's answers:
${JSON.stringify(qaData)}

Task:
1. For each question, generate your own ideal answer based on the resume and role.
2. Compare the candidate's answer to your ideal answer.
3. Give 2 points if the candidate's answer fully matches key points, 1 point if partially matches, 0 points if irrelevant, vague, or missing key points.
4. Do not give leniency or extra credit.
5. Sum the points and scale final score out of 10.

Output format (strict JSON):
{
  "finalScore": number,
  "scores": [score1, score2, score3, score4, score5, score6] 
}

Rules:
- Only JSON.
- No extra text or explanation.
`;

    try {
      const res = await axios.post(`http://localhost:8800/api/genai`, {
        message: finalPrompt,
      });
      const jsonString = res.data.reply.replace(/```json|```/g, "").trim();
      const data = JSON.parse(jsonString);
      return data.finalScore || 0;
    } catch (err) {
      console.error("Error getting AI score:", err);
      return 0;
    }
  };

  const handleSubmit = async () => {
    if (!ans.trim()) return alert("Please enter an answer before proceeding!");

    const newQnA = [...queAndAns, { question: resData[idx], answer: ans.trim() }];
    setQueAndAns(newQnA);

    if (idx + 1 === length) {
      setIsSubmitting(true);
      // Last question
      const finalScore = await getAiScore(newQnA);
      try {
        const res = await axios.post(
          "http://localhost:8800/api/candidate-interviews/submit",
          {
            interviewId: interview._id,
            candidateId: currentUser._id,
            company: interview.company,
            role: interview.role,
            description: interview.description,
            questionAndAnswers: newQnA,
            finalScore,
          }
        );
        navigate("/result", { state: { candidateInterviewId: (res.data)._id } });
      } catch (err) {
        console.error("Error submitting results:", err);
        navigate("/");
      }
    } else {
      setIdx((prev) => prev + 1);
      setQuestion(resData[idx + 1]);
      setAns("");
      setTimeLeft(4 * 60);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (loading) {
    return (
      <Wrapper>
        <Container1>
          <Greeting>Loading your interview...</Greeting>
        </Container1>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container1>
        <Greeting>All The Best, {currentUser?.name || "Candidate"} !</Greeting>
        <Time> {minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}</Time>
      </Container1>

      {!isSubmitting ? <Container2>
        {question ? (
          <P>
            {idx + 1}. {question}
          </P>
        ) : (
          <P>Loading question...</P>
        )}
        <Div>
          <Input
            value={ans}
            placeholder="Type your answer here..."
            onChange={(e) => setAns(e.target.value)}
          />
          <Div1>
            <Button onClick={handleSubmit}>
              {idx + 1 === length ? "Submit" : "Next"}
            </Button>
          </Div1>
        </Div>
      </Container2> :
        <Container2>
          <Sub> Submiting...</Sub>
        </Container2>
      }
    </Wrapper>
  );
};

export default Interview;

