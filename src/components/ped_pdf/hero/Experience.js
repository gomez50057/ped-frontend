"use client";

import { Environment, Float, OrbitControls } from "@react-three/drei";
import { Book } from "./Book";

export const Experience = ({
  onBookClick,
  onBookHoverChange,
  onBookPointerMove,

  sceneScale = 1.85,
  scenePosition = [0, -0.15, 0],
}) => {
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
      </Float>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={true}
        enableDamping={true}
        dampingFactor={0.08}
        autoRotate={true}
        autoRotateSpeed={0.28}
        rotateSpeed={0.7}
        minPolarAngle={Math.PI / 2.35}
        maxPolarAngle={Math.PI / 1.75}
      />

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
        position={[0, -0.45, -0.1]}
        rotation-x={-Math.PI / 2}
        receiveShadow
      >
        <planeGeometry args={[2.6, 1.95]} />
        <shadowMaterial transparent opacity={0.34} />
      </mesh>
    </>
  );
};
