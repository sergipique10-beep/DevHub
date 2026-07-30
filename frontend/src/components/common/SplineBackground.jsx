import { Suspense, lazy, useState } from "react";
import styled from "styled-components";

const Spline = lazy(() => import("@splinetool/react-spline"));

const Layer = styled.div`
  position: absolute;
  inset: -25%;
  z-index: 0;
  opacity: ${({ $ready }) => ($ready ? 1 : 0)};
  transition: opacity 600ms ease;

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const SplineBackground = () => {
  const [ready, setReady] = useState(false);

  return (
    <Layer $ready={ready} aria-hidden="true">
      <Suspense fallback={null}>
        <Spline scene="/particles.splinecode" onLoad={() => setReady(true)} />
      </Suspense>
    </Layer>
  );
};

export default SplineBackground;
