import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import { createFormation } from './ServiceDotVisual';
import './DotPageBackdrop.css';

function PageFormation({ variant, reduceMotion }) {
  const groupRef = useRef(null);
  const pointsRef = useRef(null);
  const viewport = useThree((state) => state.viewport);
  const positions = useMemo(() => {
    const formation = createFormation(variant);
    const points = new Float32Array(formation.length * 3);

    formation.forEach((target, index) => {
      const offset = index * 3;
      points[offset] = target[0];
      points[offset + 1] = target[1];
      points[offset + 2] = target[2] * 2 + Math.sin(index * 0.13) * 0.2;
    });

    return points;
  }, [variant]);

  const scale = Math.min((viewport.width * 0.78) / 4.8, (viewport.height * 0.74) / 3.4);
  const offsetX = Math.min(viewport.width * 0.12, 1.05);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group || reduceMotion) return;
    group.rotation.y = Math.sin(state.clock.elapsedTime * 0.13) * 0.06;
    group.rotation.z = Math.sin(state.clock.elapsedTime * 0.1) * 0.025;
    group.position.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.07;
  });

  return (
    <group ref={groupRef} scale={scale} position={[offsetX, 0, 0]}>
      <points ref={pointsRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.024}
          sizeAttenuation
          color="#ffffff"
          transparent
          opacity={0.82}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function DotPageBackdrop({ variant }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="dot-page-backdrop" aria-hidden="true">
      <Canvas
        frameloop={reduceMotion ? 'never' : 'always'}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 12], fov: 50, near: 0.1, far: 40 }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
      >
        <PageFormation variant={variant} reduceMotion={reduceMotion} />
      </Canvas>
    </div>
  );
}

export default DotPageBackdrop;
