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

const Cantidad = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 400;
`;

const RatingStars = ({ promedio = 0, cantidad }) => (
  <Wrapper>
    <FiStar fill="currentColor" />
    {promedio.toFixed(1)}
    {cantidad !== undefined && (
      <Cantidad>({cantidad})</Cantidad>
    )}
  </Wrapper>
);

export default RatingStars;
