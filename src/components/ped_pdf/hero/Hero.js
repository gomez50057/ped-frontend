"use client";

import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Experience } from "@/components/ped_pdf/hero/Experience";
import styles from "./UI.module.css";

const DEFAULT_SCENE_CONFIG = {
  cameraPosition: [0.02, 0.55, 1.85],
  fov: 34,
  sceneScale: 0.5,
  scenePosition: [0, -0.05, 0],
  shadowY: -0.72,
};

const SCENE_BREAKPOINTS = [
  {
    minWidth: 1600,
    config: {
      cameraPosition: [0.02, 0.5, 1.65],
      fov: 32,
      sceneScale: 0.45,
      scenePosition: [0, -0.05, 0],
      shadowY: -0.72,
    },
  },
  {
    minWidth: 1280,
    config: {
      cameraPosition: [0.02, 0.55, 1.8],
      fov: 33,
      sceneScale: 0.45,
      scenePosition: [0, -0.05, 0],
      shadowY: -0.72,
    },
  },
  {
    minWidth: 1024,
    config: {
      cameraPosition: [0.02, 0.6, 2],
      fov: 35,
      sceneScale: 0.37,
      scenePosition: [0, -0.04, 0],
      shadowY: -0.72,
    },
  },
  {
    minWidth: 768,
    config: {
      cameraPosition: [0.01, 0.65, 2.25],
      fov: 38,
      sceneScale: 1.5,
      scenePosition: [0, -0.02, 0],
      shadowY: -0.7,
    },
  },
];

function resolveSceneConfig(width) {
  if (!width) return DEFAULT_SCENE_CONFIG;

  const match = SCENE_BREAKPOINTS.find(
    ({ minWidth }) => width >= minWidth
  );

  return match?.config ?? {
    cameraPosition: [0, 0.7, 2.75],
    fov: 42,
    sceneScale: 0.3,
    scenePosition: [0, 0, 0],
    shadowY: -0.68,
  };
}

export default function Hero({ onBookClick }) {
  const containerRef = useRef(null);
  const [sceneConfig, setSceneConfig] = useState(() =>
    typeof window === "undefined"
      ? DEFAULT_SCENE_CONFIG
      : resolveSceneConfig(window.innerWidth)
  );

  const [isBookHovered, setIsBookHovered] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const update = () => {
      setSceneConfig(resolveSceneConfig(window.innerWidth));
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
        className={styles.heroCanvas}
        shadows
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true }}
        camera={{
          position: sceneConfig.cameraPosition,
          fov: sceneConfig.fov,
        }}
      >
        <Suspense fallback={null}>
          <Experience
            onBookClick={onBookClick}
            onBookHoverChange={handleBookHoverChange}
            onBookPointerMove={handleBookPointerMove}
            sceneScale={sceneConfig.sceneScale}
            scenePosition={sceneConfig.scenePosition}
            shadowY={sceneConfig.shadowY}
          />
        </Suspense>
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
