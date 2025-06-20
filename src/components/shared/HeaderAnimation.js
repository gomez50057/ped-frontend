"use client";

import { useEffect, useRef } from "react";
import lottie from "lottie-web";

export default function HeaderAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: false,   // No repetimos la animación al inicio
      autoplay: false,
      path: "/animations/data.json",
    });

    // Definimos el frame de inicio para la segunda reproducción.
    let startLoopFrame = 0;

    // Se ejecuta cuando el DOM de la animación está completamente cargado.
    const handleDomLoaded = () => {
      const totalSeconds = animation.getDuration(true);

      // Calculamos FPS en base al total de frames y duración
      const fps = animation.totalFrames / totalSeconds;
      startLoopFrame = Math.round(73 * fps);
      // Reproducimos la animación por primera vez (sin loop).
      animation.play();
    };

    // Se ejecuta cuando la primera reproducción termina.
    const handleComplete = () => {
      // Removemos el listener para evitar llamadas dobles.
      animation.removeEventListener("complete", handleComplete);

      // Ahora sí activamos loop y reproducimos desde el frame indicado hasta el final.
      animation.loop = true;
      animation.playSegments([startLoopFrame, animation.totalFrames], true);
    };

    // Registramos los eventos.
    animation.addEventListener("DOMLoaded", handleDomLoaded);
    animation.addEventListener("complete", handleComplete);

    // Limpiamos los listeners y destruimos la animación al desmontar el componente.
    return () => {
      animation.removeEventListener("DOMLoaded", handleDomLoaded);
      animation.removeEventListener("complete", handleComplete);
      animation.destroy();
    };
  }, []);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
