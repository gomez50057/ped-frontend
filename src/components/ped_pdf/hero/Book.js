"use client";

import { useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { easing } from "maath";
import { useMemo, useRef } from "react";
import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  Uint16BufferAttribute,
  Vector3,
} from "three";

const COVER_SIDES = {
  front: "book-cover",
  back: "book-back",
};

const easingFactor = 0.5;
const easingFactorFold = 0.3;
const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2
);

pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

const position = pageGeometry.attributes.position;
const vertex = new Vector3();
const skinIndexes = [];
const skinWeights = [];

for (let i = 0; i < position.count; i++) {
  vertex.fromBufferAttribute(position, i);
  const x = vertex.x;
  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH));
  const skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;

  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0);
}

pageGeometry.setAttribute(
  "skinIndex",
  new Uint16BufferAttribute(skinIndexes, 4)
);
pageGeometry.setAttribute(
  "skinWeight",
  new Float32BufferAttribute(skinWeights, 4)
);

const whiteColor = new Color("white");

const pageMaterials = [
  new MeshStandardMaterial({ color: whiteColor }),
  new MeshStandardMaterial({ color: "#111" }),
  new MeshStandardMaterial({ color: whiteColor }),
  new MeshStandardMaterial({ color: whiteColor }),
];

useTexture.preload(`/img/ped_document/textures/${COVER_SIDES.front}.jpg`);
useTexture.preload(`/img/ped_document/textures/${COVER_SIDES.back}.jpg`);
useTexture.preload(`/img/ped_document/textures/book-cover-roughness.jpg`);

const Cover = ({ onClick, onHoverChange, onPointerMove, ...props }) => {
  const [frontTexture, backTexture, roughnessTexture] = useTexture([
    `/img/ped_document/textures/${COVER_SIDES.front}.jpg`,
    `/img/ped_document/textures/${COVER_SIDES.back}.jpg`,
    `/img/ped_document/textures/book-cover-roughness.jpg`,
  ]);

  frontTexture.colorSpace = SRGBColorSpace;
  backTexture.colorSpace = SRGBColorSpace;

  const group = useRef();
  const skinnedMeshRef = useRef();

  const manualSkinnedMesh = useMemo(() => {
    const bones = [];

    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      const bone = new Bone();
      bones.push(bone);
      bone.position.x = i === 0 ? 0 : SEGMENT_WIDTH;

      if (i > 0) {
        bones[i - 1].add(bone);
      }
    }

    const skeleton = new Skeleton(bones);

    const materials = [
      ...pageMaterials,
      new MeshStandardMaterial({
        color: whiteColor,
        map: frontTexture,
        roughnessMap: roughnessTexture,
      }),
      new MeshStandardMaterial({
        color: whiteColor,
        map: backTexture,
        roughnessMap: roughnessTexture,
      }),
    ];

    const mesh = new SkinnedMesh(pageGeometry, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);
    return mesh;
  }, [frontTexture, backTexture, roughnessTexture]);

  useFrame((_, delta) => {
    if (!skinnedMeshRef.current || !group.current) return;

    const coverRotation = Math.PI / 2;
    const bones = skinnedMeshRef.current.skeleton.bones;

    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? group.current : bones[i];

      easing.dampAngle(
        target.rotation,
        "y",
        i === 0 ? coverRotation : 0,
        easingFactor,
        delta
      );

      easing.dampAngle(target.rotation, "x", 0, easingFactorFold, delta);
    }
  });

  return (
    <group
      {...props}
      ref={group}
      onPointerEnter={(event) => {
        event.stopPropagation();
        onHoverChange?.(true, {
          clientX: event.clientX,
          clientY: event.clientY,
        });
      }}
      onPointerMove={(event) => {
        event.stopPropagation();
        onPointerMove?.({
          clientX: event.clientX,
          clientY: event.clientY,
        });
      }}
      onPointerLeave={(event) => {
        event.stopPropagation();
        onHoverChange?.(false);
      }}
      onClick={(event) => {
        event.stopPropagation();
        onClick?.();
      }}
    >
      <primitive object={manualSkinnedMesh} ref={skinnedMeshRef} />
    </group>
  );
};

export const Book = ({
  onBookClick,
  onBookHoverChange,
  onBookPointerMove,
  ...props
}) => {
  return (
    <group
      {...props}
      rotation={[0.22, -Math.PI / 1.9, -0.05]}
      position={[0.04, 0.08, 0]}
    >
      <Cover
        onClick={onBookClick}
        onHoverChange={onBookHoverChange}
        onPointerMove={onBookPointerMove}
      />
    </group>
  );
};
