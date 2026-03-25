"use client";

import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { Experience } from "@/components/ped_pdf/hero/Experience";
import { UI } from "@/components/ped_pdf/hero/UI";
import styles from "./UI.module.css";

export default function Hero() {
  const [cameraConfig, setCameraConfig] = useState({
    x: -0.2,
    y: 1,
    z: 4,
    fov: 45,
  });

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

  return (
    <div className={styles.containerBase}>
      <UI showOnlyEnds={true} />
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
            <Experience />
          </Suspense>
        </group>
      </Canvas>
    </div>
  );
}