import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Home from "./pages/Home";
import Interview from "./pages/Interview";
import SignIn from "./pages/SignIn";
import Result from "./components/Result";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #1f3850ff;
  height: 100vh;
`;

const NavBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0.6rem 2rem;
  background-color: #12283d;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
`;

const Button = styled.button`
  background-color: #b3d2ea;
  color: #1f3850;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 2rem;
  margin-left: 1rem;
  font-weight: 550;
  font-size:1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #98caf0;
    transform: scale(1.05);
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`;

// ✅ Separate component so we can use useNavigate()
const Layout = () => {
  const navigate = useNavigate();

  return (
    <Wrapper>
      <NavBar>
        <Button onClick={() => navigate("/")}>Home</Button>
        <Button onClick={() => navigate("/signin")}>Sign In</Button>
      </NavBar>

      <Content>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </Content>
    </Wrapper>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;
