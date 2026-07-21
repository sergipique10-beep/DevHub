import styled from "styled-components";

const Circle = styled.div`
  width: ${({ $size }) => $size || "44px"};
  height: ${({ $size }) => $size || "44px"};
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Avatar = ({ nombre = "", fotoPerfil, size }) => (
  <Circle $size={size}>
    {fotoPerfil ? <img src={fotoPerfil} alt={nombre} /> : nombre.charAt(0).toUpperCase()}
  </Circle>
);

export default Avatar;
