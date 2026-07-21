import styled, { keyframes } from "styled-components";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const Spinner = styled.div`
  width: ${({ $size }) => $size || "32px"};
  height: ${({ $size }) => $size || "32px"};
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing(6)} 0;
`;

const Loading = ({ size }) => (
  <Wrapper>
    <Spinner $size={size} />
  </Wrapper>
);

export default Loading;
