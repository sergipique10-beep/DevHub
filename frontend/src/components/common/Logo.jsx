import { useId } from "react";
import styled from "styled-components";
import { alpha, media, PARADAS_GRADIENTE } from "../../styles/theme";
import { GradientText } from "../../styles/ui";

const Wrap = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing(1)};
  font-family: ${({ theme }) => theme.font.heading};
  font-weight: 700;
  font-size: ${({ $size }) => `${$size * 0.043}rem`};
  letter-spacing: -0.01em;
`;

const Mark = styled.svg`
  flex-shrink: 0;
  filter: drop-shadow(0 0 6px ${alpha("primary", 0.35)});
  transition: filter 0.2s ease, transform 0.2s ease;

  ${media.reducedMotion} {
    transition: none;
  }
`;

const Logo = ({ size = 30, showWordmark = true }) => {
  // Cada instancia necesita su propio id: dos logos en la misma pagina
  // compartirian el gradiente y el segundo se quedaria sin relleno.
  const gradId = `logo-grad-${useId()}`;

  return (
    <Wrap $size={size}>
      <Mark
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        role="img"
        aria-label="DevHub"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            {PARADAS_GRADIENTE.map(({ offset, color }) => (
              <stop key={offset} offset={offset} stopColor={color} />
            ))}
          </linearGradient>
        </defs>

        {/* Hexagono: el "hub", el nodo de la red */}
        <path
          d="M16 2.5 4.4 9.25v13.5L16 29.5l11.6-6.75V9.25z"
          stroke={`url(#${gradId})`}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* "D" abierta: dos trazos angulares que evocan un chevron */}
        <path
          d="M11 9.5v13"
          stroke={`url(#${gradId})`}
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <path
          d="M11 9.5 18.5 12.5 21.5 16 18.5 19.5 11 22.5"
          stroke={`url(#${gradId})`}
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle cx="15.4" cy="16" r="1.5" fill={`url(#${gradId})`} />
      </Mark>

      {showWordmark && <GradientText>DevHub</GradientText>}
    </Wrap>
  );
};

export default Logo;
