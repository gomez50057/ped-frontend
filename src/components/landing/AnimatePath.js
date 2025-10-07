"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { MotionPathPlugin } from "gsap/dist/MotionPathPlugin";
import styles from "@/styles/Linesvg.module.css";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function AnimatePath() {
  // Inicializamos con 0 para evitar el acceso a window en el servidor
  const [width, setWidth] = useState(0);

  // Referencias para evitar búsquedas en el DOM
  const containerRef = useRef(null);
  const lineSvgRef = useRef(null);
  const motionPathRef = useRef(null);
  const tractorImgRef = useRef(null);

  // useEffect que se ejecuta solo en el cliente
  useEffect(() => {
    // Verificamos que window esté disponible
    if (typeof window !== "undefined") {
      setWidth(window.innerWidth);
      const handleResize = () => setWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  useEffect(() => {
    // Nos aseguramos que los elementos existen antes de continuar
    if (!containerRef.current || !motionPathRef.current || !tractorImgRef.current) return;

    // Usamos gsap.context para un scope controlado y limpieza automática
    const ctx = gsap.context(() => {
      // Mostramos el SVG
      gsap.set(lineSvgRef.current, { opacity: 1 });

      const yOffset = 0;
      // Configuración inicial de la imagen
      gsap.set(tractorImgRef.current, {
        rotation: 0,
        motionPath: {
          path: motionPathRef.current,
          align: motionPathRef.current,
          alignOrigin: [0, 1],
          autoRotate: false,
          start: 0,
        },
        y: -yOffset,
      });

      // Animación con ScrollTrigger
      gsap.to(tractorImgRef.current, {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: () => "+=" + containerRef.current.offsetHeight,
          scrub: 8,
          markers: false,
          onUpdate: (self) => {
            tractorImgRef.current.src =
              self.direction < 0 ? "/img/trenRetorno.png" : "/img/tren.png";
          },
        },
        ease: "none",
        motionPath: {
          path: motionPathRef.current,
          align: motionPathRef.current,
          alignOrigin: [0, 1],
          autoRotate: false,
          start: 0,
        },
        rotation: 0,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [width]);

  return (
    <div id="aboutTren" ref={containerRef}>
      <svg
        id="linesvg"
        ref={lineSvgRef}
        className={styles.linesvg}
        width="100%"
        height="100%"
        viewBox={`0 0 ${width} 10`}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          id="motionPath"
          ref={motionPathRef}
          className={styles.st0}
          // izquierda a derecha
          // d={`M-${width * 0.1},8 L${width},8`}
          // derecha a izquierda
          d={`M${width},8 L-${width * 0.1},8`} 
        />
      </svg>
      <img
        id="tractorImg"
        ref={tractorImgRef}
        src="/img/tren.png"
        alt="Tren animado"
        style={{
          position: "absolute",
          bottom: 0,
          width: "700px",
          height: "auto",
          zIndex: 10,
        }}
      />
    </div>
  );
}
