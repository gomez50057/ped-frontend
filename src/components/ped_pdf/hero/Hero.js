"use client";

import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Suspense, useEffect, useState } from "react";
import { Experience } from "@/components/ped_pdf/hero/Experience";
import { UI } from "@/components/ped_pdf/hero/UI";
import styles from "./UI.module.css";


export default function Hero() {
  const [cameraZ, setCameraZ] = useState(4);

  useEffect(() => {
    const update = () => {
      if (typeof window === "undefined") return;
      setCameraZ(window.innerWidth > 800 ? 4 : 9);
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
          position: [-0.5, 1, cameraZ],
          fov: 45,
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
