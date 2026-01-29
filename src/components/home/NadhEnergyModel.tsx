"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Center, useGLTF } from "@react-three/drei";
import { ACESFilmicToneMapping, Box3, Group, MathUtils, SRGBColorSpace, Vector3 } from "three";
import { useReducedMotion } from "framer-motion";

const MODEL_PATH = "/models/Meshy_AI_Hydrogen_Energy_Fusio_0129220137_texture.glb";
const CAMERA_DISTANCE = 3.4;
const CAMERA_FOV = 35;
const FILL_RATIO = 0.72;

useGLTF.preload(MODEL_PATH);

type InteractionState = {
  dragging: boolean;
  lastX: number;
  lastY: number;
  dragTarget: { x: number; y: number };
  dragCurrent: { x: number; y: number };
  hoverTarget: { x: number; y: number };
  hoverCurrent: { x: number; y: number };
};

const createInteractionState = (): InteractionState => ({
  dragging: false,
  lastX: 0,
  lastY: 0,
  dragTarget: { x: 0, y: 0 },
  dragCurrent: { x: 0, y: 0 },
  hoverTarget: { x: 0, y: 0 },
  hoverCurrent: { x: 0, y: 0 },
});

const EnergyModel = ({ interactions, reduceMotion }: { interactions: InteractionState; reduceMotion: boolean }) => {
  const groupRef = useRef<Group>(null);
  const { scene } = useGLTF(MODEL_PATH);
  const baseRotation = useMemo(() => ({ x: -0.12, y: Math.PI * 0.15 }), []);

  const bounds = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    return { center, maxDim };
  }, [scene]);

  const scale = useMemo(() => {
    const fov = (CAMERA_FOV * Math.PI) / 180;
    const viewHeight = 2 * CAMERA_DISTANCE * Math.tan(fov / 2);
    return (viewHeight * FILL_RATIO) / bounds.maxDim;
  }, [bounds.maxDim]);

  useLayoutEffect(() => {
    const sceneData = scene.userData as { __centered?: boolean };
    if (!sceneData.__centered) {
      scene.position.sub(bounds.center);
      sceneData.__centered = true;
    }
  }, [bounds.center, scene]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const dragSmooth = reduceMotion ? 1 : 1 - Math.pow(0.12, delta * 60);
    const hoverSmooth = reduceMotion ? 1 : 1 - Math.pow(0.1, delta * 60);

    interactions.dragCurrent.x = MathUtils.lerp(interactions.dragCurrent.x, interactions.dragTarget.x, dragSmooth);
    interactions.dragCurrent.y = MathUtils.lerp(interactions.dragCurrent.y, interactions.dragTarget.y, dragSmooth);
    interactions.hoverCurrent.x = MathUtils.lerp(interactions.hoverCurrent.x, interactions.hoverTarget.x, hoverSmooth);
    interactions.hoverCurrent.y = MathUtils.lerp(interactions.hoverCurrent.y, interactions.hoverTarget.y, hoverSmooth);

    const hoverStrength = reduceMotion ? 0 : 0.16;
    const wobble = reduceMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.6) * 0.03;

    group.rotation.x = baseRotation.x + interactions.dragCurrent.x + interactions.hoverCurrent.y * hoverStrength + wobble;
    group.rotation.y = baseRotation.y + interactions.dragCurrent.y + interactions.hoverCurrent.x * hoverStrength;
    group.rotation.z = interactions.hoverCurrent.x * 0.04;
    group.position.y = wobble * 0.4 + interactions.hoverCurrent.y * 0.06;
  });

  return (
    <group ref={groupRef} scale={scale}>
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
};

type NadhEnergyModelProps = {
  className?: string;
};

export const NadhEnergyModel = ({ className }: NadhEnergyModelProps) => {
  const reduceMotion = useReducedMotion();
  const interactions = useRef(createInteractionState()).current;
  const [dpr, setDpr] = useState<[number, number]>([1, 1.5]);

  useEffect(() => {
    const updateDpr = () => {
      const isMobile = window.innerWidth < 768;
      setDpr(isMobile ? [1, 1.25] : [1, 1.6]);
    };
    updateDpr();
    window.addEventListener("resize", updateDpr);
    return () => window.removeEventListener("resize", updateDpr);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const handleMove = (event: PointerEvent) => {
      if (interactions.dragging) return;
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      interactions.hoverTarget = {
        x: (event.clientX / width) * 2 - 1,
        y: (event.clientY / height) * 2 - 1,
      };
    };
    const handleLeave = () => {
      interactions.hoverTarget = { x: 0, y: 0 };
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerleave", handleLeave);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
    };
  }, [interactions, reduceMotion]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    event.preventDefault();
    interactions.dragging = true;
    interactions.lastX = event.clientX;
    interactions.lastY = event.clientY;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactions.dragging) return;
    const dx = event.clientX - interactions.lastX;
    const dy = event.clientY - interactions.lastY;
    interactions.lastX = event.clientX;
    interactions.lastY = event.clientY;
    interactions.dragTarget.y += dx * 0.005;
    interactions.dragTarget.x += dy * 0.005;
    interactions.dragTarget.x = MathUtils.clamp(interactions.dragTarget.x, -1.1, 1.1);
  };

  const stopDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!interactions.dragging) return;
    interactions.dragging = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div
      className={className ?? "relative h-[320px] w-[320px] sm:h-[380px] sm:w-[380px] md:h-[440px] md:w-[440px]"}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      onPointerLeave={stopDrag}
      onContextMenu={(event) => event.preventDefault()}
    >
      <Canvas
        className="h-full w-full"
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={dpr}
        camera={{ position: [0, 0.1, CAMERA_DISTANCE], fov: CAMERA_FOV, near: 0.1, far: 60 }}
        onCreated={({ gl: renderer }) => {
          renderer.setClearColor(0x000000, 0);
          renderer.outputColorSpace = SRGBColorSpace;
          renderer.toneMapping = ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1.08;
        }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[3.2, 4.1, 2.4]} intensity={1.1} color="#c6f0ff" />
        <directionalLight position={[-2.8, 1.8, -2.2]} intensity={0.55} color="#8fd9ff" />
        <pointLight position={[0, 2.2, 2.4]} intensity={0.6} color="#5fb8ff" />
        <Suspense fallback={null}>
          <EnergyModel interactions={interactions} reduceMotion={reduceMotion} />
        </Suspense>
      </Canvas>
    </div>
  );
};
