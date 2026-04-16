"use client";

import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Experience } from "@/components/ped_pdf/hero/Experience";
import styles from "./UI.module.css";

export default function Hero({ onBookClick }) {
  const containerRef = useRef(null);
  const [cameraConfig, setCameraConfig] = useState({
    x: -0.2,
    y: 1,
    z: 4,
    fov: 45,
  });
  const [isBookHovered, setIsBookHovered] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const update = () => {
      if (typeof window === "undefined") return;

      if (window.innerWidth > 800) {
        setCameraConfig({
          x: -0.2,
          y: 1,
          z: 4,
          fov: 45,
        });
      } else {
        setCameraConfig({
          x: -0.1,
          y: 0.95,
          z: 6.8,
          fov: 42,
        });
      }
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const syncCursorPosition = useCallback((point) => {
    if (!containerRef.current || !point) return;

    const rect = containerRef.current.getBoundingClientRect();
    setCursorPosition({
      x: point.clientX - rect.left,
      y: point.clientY - rect.top,
    });
  }, []);

  const handleBookHoverChange = useCallback(
    (hovered, point) => {
      setIsBookHovered(hovered);

      if (hovered && point) {
        syncCursorPosition(point);
      }
    },
    [syncCursorPosition]
  );

  const handleBookPointerMove = useCallback(
    (point) => {
      syncCursorPosition(point);
    },
    [syncCursorPosition]
  );

  return (
    <div
      ref={containerRef}
      className={`${styles.containerBase} ${
        isBookHovered ? styles.pointerCursor : ""
      }`}
    >
      <Loader />
      <Canvas
        shadows
        camera={{
          position: [
            cameraConfig.x,
            cameraConfig.y,
            cameraConfig.z,
          ],
          fov: cameraConfig.fov,
        }}
        >
          <group position-y={0}>
            <Suspense fallback={null}>
              <Experience
                onBookClick={onBookClick}
                onBookHoverChange={handleBookHoverChange}
                onBookPointerMove={handleBookPointerMove}
              />
            </Suspense>
          </group>
        </Canvas>

      {isBookHovered && (
        <div
          className={styles.cursorHint}
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
          }}
          aria-hidden="true"
        >
          <span className={styles.cursorRing}></span>
          <span className={styles.cursorLabel}>Da clic para leer el PED</span>
        </div>
      )}
    </div>
  );
}
