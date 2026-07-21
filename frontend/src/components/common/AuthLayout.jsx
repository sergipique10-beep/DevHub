import styled from "styled-components";
import { FiCode } from "react-icons/fi";
import { Card, GradientText } from "../../styles/ui";

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
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.font.heading};
  font-weight: 700;
  font-size: 1.6rem;
  margin-bottom: ${({ theme }) => theme.spacing(3)};

  svg {
    color: ${({ theme }) => theme.colors.accentCyan};
    filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.6));
  }
`;

const AuthLayout = ({ children }) => (
  <Wrapper>
    <Glow />
    <Content>
      <Brand>
        <FiCode size={28} /> <GradientText>DevHub</GradientText>
      </Brand>
      <Card>{children}</Card>
    </Content>
  </Wrapper>
);

export default AuthLayout;
