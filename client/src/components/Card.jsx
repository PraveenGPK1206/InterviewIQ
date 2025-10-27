


import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  width: 100%;
  height: 15%;
  background-color: #b3d2ea;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  border-radius: 0.5rem;
  margin-bottom: 0.4rem;
  box-shadow: 0 0.2rem 0.4rem rgba(51, 74, 111, 0.15);
`;

const Heading = styled.div`
  flex: 2;
  padding-left: 1rem;
  font-size: 1.4rem;
  font-weight: 600;
  font-family:"monaco";
  color: rgba(49, 59, 112, 1);
`;

const Desc = styled.div`
  flex: 1;
  padding-left: 3rem;
  font-size: 1.1rem;
  font-weight: 550;
  font-family: "Courier New", monospace;
  color: rgba(55, 83, 111, 1);
  margin-bottom: 0.4rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Div1 = styled.div`
  flex: 4;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Div2 = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  border-radius: 1rem;
  border: none;
  padding: 10px 20px;
  font-size: 1.1rem;
  cursor: pointer;
  background-color: rgba(51, 74, 111, 1);
  color: #cdd9e5;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #2e4a6f;
    transform: scale(1.03);
  }

  &:active {
    transform: scale(0.98);
  }
`;

const Card = ({ setUpload, interviewer, selfBlock, data, index, setClickedIdx }) => {
  const navigate = useNavigate();

  const handleButton = () => {
    setClickedIdx(index); // ✅ Removed "+1" to avoid off-by-one bug

    if (selfBlock) {
      // Candidate viewing completed interview
      navigate("/result", { state: { interviewId: data._id } });
    } else {
      // Candidate starting interview
      setUpload(true);
    }
  };

  return (
    <Container>
      <Div1>
        <Heading>
          {index + 1}. {data.company}{" "}
          &lt;
          <span
            style={{
              color: "#2067a6",
              fontWeight: 600,
              fontSize: "1.2rem",
              fontStyle: "italic",
            }}
          >
            {data.role}
          </span>
          &gt;
        </Heading>
        <Desc>{data.description}</Desc>
      </Div1>

      {/* Show button only for candidates */}
      {!interviewer && (
        <Div2>
          <Button onClick={handleButton}>
            {selfBlock ? "View" : "Start"}
          </Button>
        </Div2>
      )}
    </Container>
  );
};

export default Card;
