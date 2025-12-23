
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 1%;
  width: 98%;
  height: 98%;
  display: flex;
  flex-direction: column;
`;

const Icon = styled.div`
  flex: 1;
  color: #b3d2eaff;
  padding-left: 96%;
  font-size: 1.4rem;
  font-weight: 600;
  &:hover {
    cursor: pointer;
  }
`;

const Container = styled.div`
  flex: 8;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Input = styled.input`
  width: 50%;
  margin-bottom: 0.8rem;
  padding: 0.6rem;
  font-size: 1rem;
  border: 0.1rem solid #ddd;
  border-radius: 0.2rem;
  outline: none;
`;

const Desc = styled.textarea.attrs({
  autoCorrect: "off",
  autoCapitalize: "none",
  spellCheck: "false",
  autoComplete: "off",
})`
  width: 50%;
  margin-bottom: 0.8rem;
  padding: 0.6rem;
  height: 20%;
  font-size: 1rem;
  font-family: inherit;
  border: 0.1rem solid #ddd;
  border-radius: 0.2rem;
  outline: none;
`;

const Div = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Button = styled.button`
  width: 20%;
  padding: 0.6rem;
  font-size: 1rem;
  color: #1f3850ff;
  background-color: #b3d2ea;
  border: none;
  border-radius: 0.2rem;
  cursor: pointer;
  margin-top: 0.6rem;
  transition: transform 0.1s ease-in-out;
  font-weight:500;
  &:hover {
    background-color: #98caf0;
    transform: scale(1.05);
  }
`;

const CreateInterview = ({ setCreate, candidateId, setInterviews }) => {
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const navigate = useNavigate();

  const getCreatedInterviews = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/interviews/user?interviewerId=${candidateId}`
      );
      setInterviews(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching interviews. Please try again.");
    }
  };

  const handleSubmit = async () => {
    if (!company.trim() || !role.trim() || !description.trim()) {
      alert("Please fill in all fields before submitting.");
      return;
    }

    try {
      await axios.post("http://localhost:8800/api/interviews/", {
        interviewerId: candidateId,
        company,
        role,
        description,
      });
      await getCreatedInterviews(); // ensure latest data before navigating
      setCreate(false);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Error creating interview. Please try again.");
    }
  };

  return (
    <Wrapper>
      <Icon onClick={() => setCreate(false)}>X</Icon>
      <Container>
        <Input
          type="text"
          placeholder="Company Name"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <Desc
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Div>
          <Button onClick={handleSubmit}>Create</Button>
        </Div>
      </Container>
    </Wrapper>
  );
};

export default CreateInterview;
