"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Loader, OrbitControls } from "@react-three/drei";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { Book } from "@/components/ped_pdf/hero/Book";
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
      shadowY: -0.40,
    },
  },
  {
    minWidth: 1280,
    config: {
      cameraPosition: [0.02, 0.55, 1.8],
      fov: 33,
      sceneScale: 0.45,
      scenePosition: [0, -0.05, 0],
      shadowY: -0.38,
    },
  },
  {
    minWidth: 1024,
    config: {
      cameraPosition: [0.02, 0.6, 2],
      fov: 35,
      sceneScale: 0.37,
      scenePosition: [0, -0.04, 0],
      shadowY: -0.37,
    },
  },
  {
    minWidth: 768,
    config: {
      cameraPosition: [0.01, 0.65, 2.25],
      fov: 38,
      sceneScale: 0.35,
      scenePosition: [0, -0.02, 0],
      shadowY: -0.27,
    },
  },
  {
    minWidth: 0,
    config: {
      cameraPosition: [0, 0.7, 2.75],
      fov: 32,
      sceneScale: 0.7,
      scenePosition: [0, 0, 0],
      shadowY: -0.50,
    },
  },
];

function resolveSceneConfig(width) {
  if (!width) return DEFAULT_SCENE_CONFIG;

  const match = SCENE_BREAKPOINTS.find(
    ({ minWidth }) => width >= minWidth
  );

  return match?.config ?? DEFAULT_SCENE_CONFIG;
}

function HeroScene({
  onBookClick,
  onBookHoverChange,
  onBookPointerMove,
  allowManualRotate,
  sceneScale,
  scenePosition,
  shadowY,
}) {
  const mobileAutoRotateRef = useRef(null);

  useFrame((_, delta) => {
    if (allowManualRotate || !mobileAutoRotateRef.current) return;

    mobileAutoRotateRef.current.rotation.y += delta * 0.08;
  });

  return (
    <>
      <ambientLight intensity={1.45} />

      <Float
        rotation-x={-Math.PI / 4.5}
        floatIntensity={0.22}
        speed={1.25}
        rotationIntensity={0.22}
        floatingRange={[-0.025, 0.025]}
      >
        <group ref={mobileAutoRotateRef}>
          <group
            scale={[sceneScale, sceneScale, sceneScale]}
            position={scenePosition}
          >
            <Book
              onBookClick={onBookClick}
              onBookHoverChange={onBookHoverChange}
              onBookPointerMove={onBookPointerMove}
            />
          </group>
        </group>
      </Float>

      {allowManualRotate && (
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableRotate
          enableDamping
          dampingFactor={0.08}
          autoRotate
          autoRotateSpeed={0.28}
          rotateSpeed={0.7}
          minPolarAngle={Math.PI / 2.35}
          maxPolarAngle={Math.PI / 1.75}
        />
      )}

      <Environment preset="studio" />

      <directionalLight
        position={[3.2, 5.2, 2.8]}
        intensity={2.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      <directionalLight position={[-3.5, 2.4, 3.2]} intensity={0.45} />

      <mesh
        position={[0, shadowY, -0.1]}
        rotation-x={-Math.PI / 2}
        receiveShadow
      >
        <planeGeometry args={[2.6, 1.95]} />
        <shadowMaterial transparent opacity={0.34} />
      </mesh>
    </>
  );
}

export default function Hero({ onBookClick }) {
  const containerRef = useRef(null);
  const [sceneConfig, setSceneConfig] = useState(DEFAULT_SCENE_CONFIG);
  const [allowManualRotate, setAllowManualRotate] = useState(true);

  const [isBookHovered, setIsBookHovered] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const update = () => {
      setSceneConfig(resolveSceneConfig(window.innerWidth));
      setAllowManualRotate(
        window.matchMedia("(hover: hover) and (pointer: fine)").matches
      );
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
      } ${allowManualRotate ? "" : styles.touchScrollArea}`}
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
          <HeroScene
            onBookClick={onBookClick}
            onBookHoverChange={handleBookHoverChange}
            onBookPointerMove={handleBookPointerMove}
            allowManualRotate={allowManualRotate}
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
