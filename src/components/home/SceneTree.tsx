"use client";

import { Suspense, memo, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, useGLTF, useProgress } from "@react-three/drei";
import {
  ACESFilmicToneMapping,
  Box3,
  Group,
  Material,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  SRGBColorSpace,
  Vector3,
} from "three";

const MODEL_PATH = "/models/Meshy_AI_derevo_0113133108_texture.glb";

type SceneTreeProps = {
  className?: string;
  onReady?: () => void;
};

type FadeTarget = { material: Material; baseOpacity: number };

useGLTF.preload(MODEL_PATH);

const prepareFadeTargets = (scene: Group): FadeTarget[] => {
  const cache = (scene.userData as { __fadeTargets?: FadeTarget[] }).__fadeTargets;
  if (cache) {
    return cache;
  }

  const fades: FadeTarget[] = [];
  scene.traverse((child) => {
    const mesh = child as Mesh;
    if (!mesh.isMesh) return;
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const prepared = materials.map((mat) => {
      const material = mat as Material;
      const baseOpacity = typeof material.opacity === "number" ? material.opacity : 1;
      material.transparent = true;
      material.opacity = 0;
      fades.push({ material, baseOpacity });
      return material;
    });
    mesh.material = Array.isArray(mesh.material) ? prepared : prepared[0];
  });

  (scene.userData as { __fadeTargets?: FadeTarget[] }).__fadeTargets = fades;
  return fades;
};

const resetFadeTargets = (targets: FadeTarget[]) => {
  targets.forEach(({ material }) => {
    material.transparent = true;
    material.opacity = 0;
    (material as Material).needsUpdate = true;
  });
};

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

const TreeModel = ({ onReady }: { onReady?: () => void }) => {
  const groupRef = useRef<Group>(null);
  const orbitRef = useRef<Mesh>(null);
  const orbitRingRef = useRef<Mesh>(null);
  const orbitMaterialRef = useRef<MeshStandardMaterial>(null);
  const { camera } = useThree();
  const { scene } = useGLTF(MODEL_PATH);
  const fadeTargets = useMemo(() => prepareFadeTargets(scene), [scene]);
  const fadeTargetsRef = useRef<FadeTarget[]>([]);
  const introStartedRef = useRef(false);
  const introStartRef = useRef<number | null>(null);
  const introDoneRef = useRef(false);
  const pointerTargetRef = useRef({ x: 0, y: 0 });
  const pointerCurrentRef = useRef({ x: 0, y: 0 });
  const finalScaleRef = useRef(1);
  const baseGroupPos = useRef({ x: 0.18, y: -0.58, z: 0 });
  const cameraTargetRef = useRef({ distance: 0, y: 0.18 });
  const cameraStartRef = useRef({ distance: 0, y: 0.12 });
  const cameraLerpRef = useRef(0);
  const readyAnnouncedRef = useRef(false);

  const bounds = useMemo(() => {
    const box = new Box3().setFromObject(scene);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    return { box, size, center, maxDim };
  }, [scene]);

  const fitted = useMemo(() => {
    const padding = 2.15;
    const height = bounds.size.y || 1;
    const targetSize = 3.5;
    const normalizedScale = bounds.maxDim ? targetSize / bounds.maxDim : 1;
    const scale = normalizedScale * 1.6;
    const radius = (bounds.maxDim || 1) * scale * 0.55;
    const fov = (30 * Math.PI) / 180;
    const distanceFromHeight = ((height * scale) / 2) / Math.tan(fov / 2) * padding;
    const distance = Math.max(distanceFromHeight, radius * 3.2) * 1.18;
    return { scale, radius, distance };
  }, [bounds.maxDim, bounds.size.y]);

  const orbitSettings = useMemo(() => {
    const base = bounds.maxDim || 1;
    return {
      radius: base * 0.6,
      height: base * 0.18,
      tube: Math.max(base * 0.007, 0.003),
    };
  }, [bounds.maxDim]);

  useLayoutEffect(() => {
    const sceneData = scene.userData as { __centered?: boolean };
    if (!sceneData.__centered) {
      scene.position.sub(bounds.center);
      sceneData.__centered = true;
    }
    if (groupRef.current) {
      finalScaleRef.current = fitted.scale;
      groupRef.current.scale.setScalar(finalScaleRef.current * 0.96);
      groupRef.current.position.set(baseGroupPos.current.x, baseGroupPos.current.y, baseGroupPos.current.z);
    }

    const distance = fitted.distance;
    camera.near = Math.max(0.01, distance / 50);
    camera.far = distance * 50;
    camera.position.set(0, cameraStartRef.current.y, distance * 1.08);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    cameraTargetRef.current = { distance, y: 0.18 };
    cameraStartRef.current = { distance: distance * 1.08, y: 0.12 };
    cameraLerpRef.current = 0;
  }, [camera, bounds.center, bounds.size, fitted.distance, fitted.scale, scene]);

  useEffect(() => {
    fadeTargetsRef.current = fadeTargets;
    resetFadeTargets(fadeTargets);
    introStartedRef.current = true;
    introStartRef.current = performance.now();
    introDoneRef.current = false;
    readyAnnouncedRef.current = false;
  }, [fadeTargets]);

  useEffect(() => {
    const handleMove = (event: MouseEvent) => {
      const width = window.innerWidth || 1;
      const height = window.innerHeight || 1;
      const x = (event.clientX / width) * 2 - 1;
      const y = (event.clientY / height) * 2 - 1;
      pointerTargetRef.current = { x, y };
    };
    const handleLeave = () => {
      pointerTargetRef.current = { x: 0, y: 0 };
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseleave", handleLeave);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;
    const pointerTarget = pointerTargetRef.current;
    const pointerCurrent = pointerCurrentRef.current;
    const smooth = 1 - Math.pow(0.08, delta * 60);
    pointerCurrent.x += (pointerTarget.x - pointerCurrent.x) * smooth;
    pointerCurrent.y += (pointerTarget.y - pointerCurrent.y) * smooth;

    let lift = 0;
    const orbit = orbitRef.current;
    const orbitRing = orbitRingRef.current;
    if (orbit || orbitRing) {
      const t = state.clock.getElapsedTime() * 0.6;
      const orbitRadius = orbitSettings.radius;
      const orbitHeight = orbitSettings.height;
      const bob = Math.sin(t * 1.6) * orbitSettings.height * 0.35;
      if (orbit) {
        orbit.position.set(Math.cos(t) * orbitRadius, orbitHeight + bob, Math.sin(t) * orbitRadius);
        const pulse = 0.92 + Math.sin(t * 2.6) * 0.08;
        orbit.scale.setScalar(pulse);
        if (orbitMaterialRef.current) {
          orbitMaterialRef.current.emissiveIntensity = 0.55 + Math.sin(t * 2.6) * 0.25;
        }
      }
      if (orbitRing) {
        orbitRing.position.set(0, orbitHeight, 0);
      }
    }
    if (introStartedRef.current && !introDoneRef.current && introStartRef.current) {
      const elapsed = Math.max(0, performance.now() - introStartRef.current);
      const duration = 1250;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const easedQuint = 1 - Math.pow(1 - t, 5);

      fadeTargetsRef.current.forEach(({ material, baseOpacity }) => {
        material.opacity = baseOpacity * eased;
      });

      const scale = finalScaleRef.current * (0.96 + 0.04 * easedQuint);
      lift = 0.048 * (1 - easedQuint);
      group.scale.setScalar(scale);

      if (!readyAnnouncedRef.current && eased > 0.12) {
        readyAnnouncedRef.current = true;
        onReady?.();
      }

      if (t >= 1) {
        introDoneRef.current = true;
      }
    }

    const rotX = pointerCurrent.y * 0.06;
    const rotY = pointerCurrent.x * 0.08;
    const offsetX = pointerCurrent.x * 0.06;
    const offsetY = pointerCurrent.y * 0.04;
    group.rotation.x = rotX;
    group.rotation.y = rotY;
    group.position.set(
      baseGroupPos.current.x + offsetX,
      baseGroupPos.current.y + lift + offsetY,
      baseGroupPos.current.z,
    );

    if (cameraLerpRef.current < 1) {
      cameraLerpRef.current = Math.min(1, cameraLerpRef.current + delta / 0.45);
      const easedCam = 1 - Math.pow(1 - cameraLerpRef.current, 3);
      const z = MathUtils.lerp(cameraStartRef.current.distance, cameraTargetRef.current.distance, easedCam);
      const y = MathUtils.lerp(cameraStartRef.current.y, cameraTargetRef.current.y, easedCam);
      camera.position.set(0, y, z);
      camera.lookAt(0, 0, 0);
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.08, 0]}>
      <mesh ref={orbitRingRef} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[orbitSettings.radius, orbitSettings.tube, 18, 180]} />
        <meshStandardMaterial
          color="#9fdcff"
          emissive="#63c6ff"
          emissiveIntensity={0.65}
          transparent
          opacity={0.6}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>
      <mesh ref={orbitRef}>
        <sphereGeometry args={[0.04, 18, 18]} />
        <meshStandardMaterial ref={orbitMaterialRef} color="#d9f7ff" emissive="#4cc1ff" emissiveIntensity={0.7} />
      </mesh>
      <primitive object={scene} />
    </group>
  );
};

const SceneTreeComponent = ({ className, onReady }: SceneTreeProps) => {
  const { progress } = useProgress();
  const [dprRange, setDprRange] = useState<[number, number]>([1, 1.5]);

  useEffect(() => {
    const updateDpr = () => {
      const isMobile = window.innerWidth < 768;
      setDprRange(isMobile ? [1, 1.25] : [1, 1.5]);
    };
    updateDpr();
    window.addEventListener("resize", updateDpr);
    return () => window.removeEventListener("resize", updateDpr);
  }, []);

  return (
    <div className={`relative h-full w-full overflow-visible ${className ?? ""}`}>
      <Canvas
        className="pointer-events-none absolute inset-0 h-full w-full"
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        dpr={dprRange}
        camera={{ fov: 30, near: 0.05, far: 80 }}
        onCreated={({ gl: renderer }) => {
          renderer.setClearColor(0x000000, 0);
          renderer.outputColorSpace = SRGBColorSpace;
          renderer.toneMapping = ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1.08;
        }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[3.4, 4.2, 3]} intensity={1.25} color="#9fd3ff" />
        <directionalLight position={[-2.4, 2.8, 1.2]} intensity={0.75} color="#b0f0e8" />
        <pointLight position={[0, 1.8, 2.6]} intensity={1.2} color="#65b7ff" />
        <Suspense
          fallback={
            <Html center>
              <div className="rounded-full border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/85 px-4 py-2 text-xs font-semibold text-[color:var(--text)] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
                Loading 3D:
              </div>
            </Html>
          }
        >
          <TreeModel onReady={onReady} />
        </Suspense>
      </Canvas>
      {progress < 100 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="rounded-full border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/85 px-4 py-2 text-xs font-semibold text-[color:var(--text)] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
            Loading 3D: {progress.toFixed(0)}%
          </div>
        </div>
      )}
    </div>
  );
};

export const SceneTree = memo(SceneTreeComponent);
SceneTree.displayName = "SceneTree";
