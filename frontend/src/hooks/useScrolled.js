import { useEffect, useState } from "react";

/**
 * True cuando la página está desplazada más de `umbral` píxeles.
 *
 * El listener es pasivo porque solo lee `scrollY`: así el navegador no tiene
 * que esperar a saber si vamos a llamar a preventDefault antes de repintar.
 */
export const useScrolled = (umbral = 8) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const alHacerScroll = () => setScrolled(window.scrollY > umbral);
    alHacerScroll();
    window.addEventListener("scroll", alHacerScroll, { passive: true });
    return () => window.removeEventListener("scroll", alHacerScroll);
  }, [umbral]);

  return scrolled;
};

export default useScrolled;
