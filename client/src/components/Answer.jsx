import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 1%;
  width: 98%;
  height: 98%;
  display: flex;
  flex-direction: column;
  background-color: #1f3850ff;
  border-radius: 1rem;
  box-shadow: 0 0 0.6rem rgba(0, 0, 0, 0.4);
`;

const Icon = styled.div`
  flex: 1;
  color: #b3d2eaff;
  padding-top: 1%;
  padding-right: 2%;
  font-size: 1.4rem;
  font-weight: 700;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  user-select: none;

  &:hover {
    cursor: pointer;
    color: #ffffff;
    transform: scale(1.02);
    transition: all 0.1s ease-in-out;
  }
`;

const Heading = styled.div`
  flex: 1;
  padding-top: 2%;
  padding-left: 3%;
  font-size: 1.4rem;
  font-weight: 600;
  color: #98caf0ff;
`;

const Div = styled.div`
  flex: 10;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0 3%;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
`;

const Ans = styled.div`
  width: 100%;
  font-size: 1rem;
  font-style: italic;
  color: #cce4faff;
  line-height: 1.5rem;
  white-space: pre-wrap; /* preserves new lines from backend */
  word-wrap: break-word;
`;

const Answer = ({ setAns, answer }) => {
  return (
    <Wrapper>
      <Icon onClick={() => setAns(false)}>✕</Icon>
      <Heading>Answer:</Heading>
      <Div>
        <Ans>{answer || "No answer available."}</Ans>
      </Div>
    </Wrapper>
  );
};

export default Answer;
