import React, { useRef } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";

GlobalWorkerOptions.workerSrc = pdfjsWorker;

const Wrapper = styled.div`
  padding: 1%;
  width: 98%;
  height: 98%;
  display: flex;
  flex-direction: column;
`;

const Icon = styled.div`
  flex: 1;
  color: #b3d2ea;
  padding-top: 2%;
  padding-left: 90%;
  font-size: 1.4rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    color: #fff;
  }
`;

const Que = styled.div`
  flex: 5;
  padding-top: 5%;
  padding-left: 18%;
  font-size: 1.4rem;
  font-weight: 550;
  color: #9eb9ce;
`;

const Upload = styled.div`
  flex: 10;
  padding-left: 28%;
`;

const Button = styled.button`
  width: 50%;
  height: 32%;
  border-radius: 1rem;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  background-color: rgba(51, 74, 111, 1);
  color: #a0bcd2;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: #2e4a6f;
    transform: scale(1.03);
  }
`;

const Resume = ({ setUpload, interview_id }) => {
  const { currentUser } = useSelector((state) => state.user);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      let text = "";

      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await getDocument({ data: arrayBuffer }).promise;

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item) => item.str).join(" ") + "\n";
        }
      } else if (
        file.type === "text/plain" ||
        file.name.endsWith(".doc") ||
        file.name.endsWith(".docx")
      ) {
        text = await file.text();
      } else {
        alert("Unsupported file type. Please upload a PDF, DOCX, or TXT file.");
        return;
      }

      
      navigate("/interview", {
        state: {
          resumeData: text,
          interview_id,
        },
      });

      
      setUpload(false);
    } catch (error) {
      console.error("Error reading resume:", error);
      alert("Failed to read resume. Please try again.");
    }
  };

  return (
    <Wrapper>
      <Icon onClick={() => setUpload(false)}>✕</Icon>
      <Que>Can you upload your resume?</Que>
      <Upload>
        <Button onClick={handleUpload}>Upload</Button>
        <input
          type="file"
          accept=".txt,.pdf,.doc,.docx"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </Upload>
    </Wrapper>
  );
};

export default Resume;
