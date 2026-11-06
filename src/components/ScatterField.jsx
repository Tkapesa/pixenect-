import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 8000;
const CLUSTER_RADIUS = 2;
const BOUNDS = { x: 10, y: 5, z: 5 };
const DARK_DOT = new THREE.Color('#171717');
const LIGHT_DOT = new THREE.Color('#F0F0F8');

const vertexShader = /* glsl */ `
  attribute vec3 aTarget;
  attribute float aSeed;

  uniform float uProgress;
  uniform float uTime;
  uniform float uSize;
  uniform float uViewportHeight;
  uniform float uMaxSize;

  varying float vDepthFade;

  void main() {
    float stagger = clamp(uProgress * 1.25 - aSeed * 0.25, 0.0, 1.0);
    vec3 position3 = mix(position, aTarget, stagger);

    float phase = aSeed * 6.2831;
    float drift = 0.035 + 0.09 * uProgress;
    position3 += vec3(
      sin(uTime * 0.35 + phase),
      cos(uTime * 0.28 + phase * 1.7),
      sin(uTime * 0.22 + phase * 2.3)
    ) * drift;

    vec4 mvPosition = modelViewMatrix * vec4(position3, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float depth = -mvPosition.z;
    gl_PointSize = clamp(uSize * projectionMatrix[1][1] * uViewportHeight * 0.5 / depth, 1.0, uMaxSize);
    vDepthFade = smoothstep(24.0, 8.0, depth);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;

  varying float vDepthFade;

  void main() {
    float distanceToCenter = length(gl_PointCoord - 0.5);
    float alpha = 1.0 - smoothstep(0.32, 0.5, distanceToCenter);
    if (alpha <= 0.0) discard;
    gl_FragColor = vec4(uColor, alpha * uOpacity * (0.35 + 0.65 * vDepthFade));
  }
`;

function randomInSphere(radius) {
  const u = Math.random();
  const v = Math.random();
  const theta = u * Math.PI * 2;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * radius;
  return [r * Math.sin(phi) * Math.cos(theta), r * Math.sin(phi) * Math.sin(theta), r * Math.cos(phi)];
}

function createAttributes() {
  const start = new Float32Array(PARTICLE_COUNT * 3);
  const target = new Float32Array(PARTICLE_COUNT * 3);
  const seeds = new Float32Array(PARTICLE_COUNT);
  for (let i = 0; i < PARTICLE_COUNT; i += 1) {
    const [x, y, z] = randomInSphere(CLUSTER_RADIUS);
    start.set([x, y, z], i * 3);
    target.set([
      (Math.random() * 2 - 1) * BOUNDS.x,
      (Math.random() * 2 - 1) * BOUNDS.y,
      (Math.random() * 2 - 1) * BOUNDS.z,
    ], i * 3);
    seeds[i] = Math.random();
  }
  return { start, target, seeds };
}

function Particles({ stateRef }) {
  const materialRef = useRef(null);
  const pointsRef = useRef(null);
  const { start, target, seeds } = useMemo(() => createAttributes(), []);
  const uniforms = useMemo(() => ({
    uProgress: { value: 0 },
    uTime: { value: 0 },
    uSize: { value: 0.02 },
    uViewportHeight: { value: 1 },
    uMaxSize: { value: 3 },
    uColor: { value: DARK_DOT.clone() },
    uOpacity: { value: 0.55 },
  }), []);

  useFrame((state) => {
    const material = materialRef.current;
    const points = pointsRef.current;
    if (!material || !points) return;
    const { progress, theme } = stateRef.current;

    material.uniforms.uProgress.value = progress;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uViewportHeight.value = state.size.height * state.viewport.dpr;
    material.uniforms.uMaxSize.value = 3 * state.viewport.dpr;
    material.uniforms.uColor.value.copy(DARK_DOT).lerp(LIGHT_DOT, theme);
    material.uniforms.uOpacity.value = THREE.MathUtils.lerp(0.4, 0.6, theme);

    points.rotation.y = progress * 0.7 + state.clock.elapsedTime * 0.02;
    points.rotation.x = progress * 0.15;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[start, 3]} />
        <bufferAttribute attach="attributes-aTarget" args={[target, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

function ScatterField({ stateRef, active }) {
  return (
    <Canvas
      frameloop={active ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 12], fov: 50, near: 0.1, far: 40 }}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
    >
      <Particles stateRef={stateRef} />
    </Canvas>
  );
}

export default ScatterField;
