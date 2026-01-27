"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Center, OrbitControls, useGLTF } from "@react-three/drei";

type ProductModelViewerProps = {
  modelUrl: string;
  className?: string;
};

const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
};

export const ProductModelViewer = ({ modelUrl, className }: ProductModelViewerProps) => {
  return (
    <div
      className={
        className ??
        "relative h-[420px] w-full overflow-hidden rounded-3xl border border-[color:var(--glass-stroke)] bg-[color:var(--glass-bg)]/40 shadow-[var(--shadow-1)]"
      }
    >
      <Canvas camera={{ position: [0, 0, 4], fov: 35 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 4, 2]} intensity={1.1} />
        <directionalLight position={[-3, -2, -1]} intensity={0.6} />
        <Suspense fallback={null}>
          <Center>
            <Model url={modelUrl} />
          </Center>
        </Suspense>
        <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.6} />
      </Canvas>
      <div className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-white/70">
        360 VIEW
      </div>
    </div>
  );
};
