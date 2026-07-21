import styled from "styled-components";

const Wrapper = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => theme.spacing(3)};
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.85rem;
  margin-top: auto;
`;

const Footer = () => (
  <Wrapper>© {new Date().getFullYear()} DevHub — LinkedIn para programadores</Wrapper>
);

export default Footer;
