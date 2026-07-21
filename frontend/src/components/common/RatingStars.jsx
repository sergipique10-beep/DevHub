import styled from "styled-components";
import { FiStar } from "react-icons/fi";

const Wrapper = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: ${({ theme }) => theme.colors.warning};
  font-weight: 600;
  font-size: 0.9rem;
`;

const RatingStars = ({ promedio = 0, cantidad }) => (
  <Wrapper>
    <FiStar fill="currentColor" />
    {promedio.toFixed(1)}
    {cantidad !== undefined && (
      <span style={{ color: "#94a3b8", fontWeight: 400 }}>({cantidad})</span>
    )}
  </Wrapper>
);

export default RatingStars;
