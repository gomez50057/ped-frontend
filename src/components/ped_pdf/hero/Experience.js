"use client";

import { Environment, Float, OrbitControls } from "@react-three/drei";
import { Book } from "./Book";

export const Experience = ({
  onBookClick,
  onBookHoverChange,
  onBookPointerMove,
}) => {
  return (
    <>
      <ambientLight intensity={1.65} />

      <Float
        rotation-x={-Math.PI / 4}
        floatIntensity={1}
        speed={2}
        rotationIntensity={2}
      >
        <group scale={[1.6, 1.6, 1.6]}>
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
      />

      <Environment preset="studio" />

      <directionalLight
        position={[2, 5, 2]}
        intensity={2.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial transparent opacity={0.2} />
      </mesh>
    </>
  );
};
