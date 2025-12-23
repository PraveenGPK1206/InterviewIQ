import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { loginFailure, login, loginSuccess } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #b3d2ea;
  height: 70%;
  width: 30%;
  box-shadow: 0 -0.1rem 0.5rem rgba(169, 195, 219, 0.65);
`;

const Container1 = styled.div`
  width: 100%;
  flex: 1;
  display: flex;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
`;

const Tab = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  height: 100%;
  background-color: ${(props) => (props.active ? "#1f3850" : "#cdd9e5")};
  color: ${(props) => (props.active ? "#cdd9e5" : "#1f3850")};
  transition: all 0.3s ease;
`;

const Container2 = styled.div`
  width: 100%;
  background-color: #4b6d87;
  flex: 5;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 30px;
  width: 300px;
`;

const Input = styled.input`
  margin-bottom: 15px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 5px;
  outline: none;
`;

const CheckBox = styled.label`
  display: flex;
  align-items: center;
  font-size: 16px;
  color: #fff;
  gap: 8px;
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
  }
`;

const Button = styled.button`
  padding: 10px;
  font-size: 16px;
  color: #fff;
  background-color: #1f3850;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  &:active {
    transform: scale(0.98);
    background-color: #163047;
  }
`;

const SignIn = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false);
  const [signUp, setSignUp] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (signUp) {
      // Sign Up mode
      const userType = isChecked ? "interviewer" : "candidate";
      try {
        await axios.post("http://localhost:8800/api/users/signup", {
          name,
          email,
          userType,
          password,
        });
        alert("Signup successful! Please sign in.");
        setSignUp(false);
        setName("");
        setEmail("");
        setPassword("");
        setIsChecked(false);
      } catch (err) {
        console.error("Signup failed:", err);
        alert("Signup failed. Try again.");
      }
    } else {
      // Sign In mode
      dispatch(login());
      try {
        const res = await axios.post(
          "http://localhost:8800/api/users/signin",
          { email, password }
        );
        dispatch(loginSuccess(res.data));
        navigate("/");
      } catch (err) {
        dispatch(loginFailure());
        alert("Invalid credentials!");
      }
    }
  };

  return (
    <Wrapper>
      <Container1>
        <Tab active={!signUp} onClick={() => setSignUp(false)}>
          <span>Sign In</span>
        </Tab>
        <Tab active={signUp} onClick={() => setSignUp(true)}>
          <span>Sign Up</span>
        </Tab>
      </Container1>

      <Container2>
        <Form onSubmit={handleSubmit}>
          {signUp && (
            <Input
            type="text"
            placeholder="Username"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          ) }

          <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {signUp && (
            <CheckBox>
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
              />
              Interviewer
            </CheckBox>
          )}

          <Button type="submit">{signUp ? "Register" : "Login"}</Button>
        </Form>
      </Container2>
    </Wrapper>
  );
};

export default SignIn;
