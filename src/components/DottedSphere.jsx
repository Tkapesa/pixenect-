import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import { BlurIn, SplitEyebrow, SplitHeading } from './RevealText';

const PARTICLE_COUNT = 5000;
const RADIUS = 5;
const SPIN_PER_SECOND = 0.12;

function createSpherePositions(count, radius) {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i += 1) {
    const y = 1 - (i / (count - 1)) * 2;
    const ring = Math.sqrt(1 - y * y);
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * ring * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * ring * radius;
  }
  return positions;
}

function createDotTexture() {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d');
  context.beginPath();
  context.arc(size / 2, size / 2, size / 2 - 1, 0, Math.PI * 2);
  context.fillStyle = '#ffffff';
  context.fill();
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function SphereParticles({ pointerRef, reduceMotion }) {
  const parallaxRef = useRef(null);
  const pointsRef = useRef(null);
  const positions = useMemo(() => createSpherePositions(PARTICLE_COUNT, RADIUS), []);
  const dotTexture = useMemo(() => createDotTexture(), []);

  useEffect(() => () => dotTexture.dispose(), [dotTexture]);

  useFrame((state, delta) => {
    if (reduceMotion) return;
    const parallax = parallaxRef.current;
    const points = pointsRef.current;
    if (!parallax || !points) return;

    points.rotation.y += delta * SPIN_PER_SECOND;
    parallax.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.18;

    const ease = 1 - Math.exp(-delta * 3);
    parallax.rotation.x += (pointerRef.current.y * 0.25 - parallax.rotation.x) * ease;
    parallax.rotation.y += (pointerRef.current.x * 0.35 - parallax.rotation.y) * ease;
  });

  return (
    <group ref={parallaxRef}>
      <points ref={pointsRef} rotation={[0.35, 0, 0.12]}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          sizeAttenuation
          color="#ffffff"
          map={dotTexture}
          alphaTest={0.01}
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function DottedSphere({ tags }) {
  const sectionRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [inView, setInView] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: '200px 0px' });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handlePointerMove = (event) => {
    const bounds = sectionRef.current?.getBoundingClientRect();
    if (!bounds) return;
    pointerRef.current.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointerRef.current.y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
  };

  const handlePointerLeave = () => {
    pointerRef.current.x = 0;
    pointerRef.current.y = 0;
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Disciplines"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative overflow-hidden border-t-[0.5px] border-hairline-soft bg-black font-mono text-fg"
    >
      <div className="relative mx-auto flex min-h-[640px] max-w-[1400px] items-center justify-center px-6 py-16 sm:min-h-[760px]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 [mask-image:radial-gradient(circle,black_40%,transparent_80%)]"
        >
          <Canvas
            frameloop={inView ? 'always' : 'never'}
            dpr={[1, 1.75]}
            camera={{ position: [0, 0, 14], fov: 45, near: 0.1, far: 50 }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <SphereParticles pointerRef={pointerRef} reduceMotion={reduceMotion} />
          </Canvas>
        </div>

        <div className="relative z-10 flex max-w-[760px] flex-col items-center gap-6 text-center">
          <SplitEyebrow text="[ Disciplines ]" />
          <SplitHeading
            text={`${tags.length} disciplines. One connected team.`}
            delay={0.4}
            className="m-0 font-mono text-[clamp(2rem,5vw,3rem)] font-extrabold leading-[1.1] tracking-[-0.04em] text-fg"
          />
          <BlurIn as="p" delay={0.9} className="m-0 max-w-[480px] text-[15px] leading-relaxed text-[rgba(240,240,248,0.8)]">
            Everything your business needs to launch, grow, and run smarter, planned and delivered by the same people.
          </BlurIn>
          <ul className="m-0 mt-2 flex list-none flex-wrap justify-center gap-2.5 p-0">
            {tags.map((tag, index) => (
              <BlurIn
                as="li"
                key={tag}
                delay={1 + index * 0.04}
                className="rounded-full border-[0.5px] border-[rgba(240,240,248,0.14)] bg-white/[0.03] px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-fg-secondary shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md transition-colors duration-300 hover:border-[rgba(16,185,129,0.6)] hover:text-fg"
              >
                {tag}
              </BlurIn>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default DottedSphere;
