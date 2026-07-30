import styled from "styled-components";
import { Card } from "../../styles/ui";
import Logo from "./Logo";
import SplineBackground from "./SplineBackground";

const Wrapper = styled.div`
  position: relative;
  min-height: calc(100vh - 64px - 68px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(3)};
  overflow: hidden;
`;

const Glow = styled.div`
  position: absolute;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: ${({ theme }) => theme.gradient.glow};
  filter: blur(20px);
  pointer-events: none;
  z-index: 0;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
`;

const Brand = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing(3)};
`;

const AuthLayout = ({ children }) => (
  <Wrapper>
    <SplineBackground />
    <Glow />
    <Content>
      <Brand>
        <Logo size={40} />
      </Brand>
      <Card>{children}</Card>
    </Content>
  </Wrapper>
);

export default AuthLayout;
