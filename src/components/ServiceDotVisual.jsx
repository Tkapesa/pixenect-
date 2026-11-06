import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useReducedMotion } from 'framer-motion';
import * as THREE from 'three';
import './ServiceDotVisual.css';

const FORMATION_SIZE = { width: 720, height: 520 };
const MAX_DOTS = 7600;
const WORLD_SCALE = 0.0096;

function drawDesktop(ctx) {
  ctx.beginPath();
  ctx.roundRect(285, 55, 150, 104, 8);
  ctx.moveTo(285, 73);
  ctx.lineTo(435, 73);
  ctx.moveTo(295, 65);
  ctx.lineTo(297, 65);
  ctx.moveTo(304, 65);
  ctx.lineTo(306, 65);
  ctx.moveTo(350, 159);
  ctx.lineTo(350, 184);
  ctx.moveTo(375, 159);
  ctx.lineTo(375, 184);
  ctx.moveTo(330, 184);
  ctx.lineTo(395, 184);
  ctx.stroke();
}

function drawDesign(ctx) {
  ctx.beginPath();
  ctx.roundRect(305, 48, 110, 145, 16);
  ctx.moveTo(338, 64);
  ctx.lineTo(382, 64);
  ctx.moveTo(347, 178);
  ctx.lineTo(373, 178);
  ctx.moveTo(350, 94);
  ctx.lineTo(350, 147);
  ctx.lineTo(365, 134);
  ctx.lineTo(378, 162);
  ctx.lineTo(390, 156);
  ctx.lineTo(377, 129);
  ctx.lineTo(397, 126);
  ctx.closePath();
  ctx.stroke();
}

function drawAutomation(ctx) {
  ctx.beginPath();
  ctx.moveTo(310, 121);
  ctx.lineTo(341, 121);
  ctx.moveTo(379, 121);
  ctx.lineTo(397, 121);
  ctx.lineTo(397, 78);
  ctx.lineTo(410, 78);
  ctx.moveTo(397, 121);
  ctx.lineTo(397, 164);
  ctx.lineTo(410, 164);
  ctx.roundRect(268, 103, 42, 36, 9);
  ctx.arc(360, 121, 19, 0, Math.PI * 2);
  ctx.roundRect(410, 64, 36, 28, 8);
  ctx.roundRect(410, 150, 36, 28, 8);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(342, 114);
  ctx.lineTo(350, 121);
  ctx.lineTo(342, 128);
  ctx.moveTo(383, 114);
  ctx.lineTo(391, 121);
  ctx.lineTo(383, 128);
  ctx.stroke();
}

function drawCommerce(ctx) {
  ctx.beginPath();
  ctx.moveTo(290, 80);
  ctx.lineTo(430, 80);
  ctx.lineTo(414, 135);
  ctx.lineTo(307, 135);
  ctx.closePath();
  ctx.moveTo(300, 80);
  ctx.lineTo(286, 52);
  ctx.lineTo(270, 52);
  ctx.moveTo(307, 135);
  ctx.lineTo(300, 151);
  ctx.lineTo(408, 151);
  ctx.moveTo(322, 170);
  ctx.lineTo(322, 171);
  ctx.moveTo(391, 170);
  ctx.lineTo(391, 171);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(322, 171, 9, 0, Math.PI * 2);
  ctx.arc(391, 171, 9, 0, Math.PI * 2);
  ctx.stroke();
}

function drawGrowth(ctx) {
  ctx.beginPath();
  ctx.moveTo(290, 184);
  ctx.lineTo(290, 65);
  ctx.moveTo(290, 184);
  ctx.lineTo(432, 184);
  ctx.moveTo(309, 158);
  ctx.lineTo(342, 133);
  ctx.lineTo(366, 145);
  ctx.lineTo(407, 88);
  ctx.moveTo(383, 88);
  ctx.lineTo(407, 88);
  ctx.lineTo(407, 112);
  ctx.moveTo(315, 168);
  ctx.lineTo(315, 151);
  ctx.moveTo(339, 168);
  ctx.lineTo(339, 139);
  ctx.moveTo(363, 168);
  ctx.lineTo(363, 151);
  ctx.moveTo(387, 168);
  ctx.lineTo(387, 120);
  ctx.stroke();
}

function drawBrand(ctx) {
  ctx.beginPath();
  ctx.moveTo(324, 184);
  ctx.lineTo(324, 57);
  ctx.lineTo(372, 57);
  ctx.bezierCurveTo(408, 57, 426, 75, 426, 103);
  ctx.bezierCurveTo(426, 131, 408, 149, 372, 149);
  ctx.lineTo(349, 149);
  ctx.lineTo(349, 184);
  ctx.moveTo(349, 84);
  ctx.lineTo(371, 84);
  ctx.bezierCurveTo(385, 84, 393, 91, 393, 103);
  ctx.bezierCurveTo(393, 115, 385, 122, 371, 122);
  ctx.lineTo(349, 122);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(423, 58, 8, 0, Math.PI * 2);
  ctx.arc(432, 150, 6, 0, Math.PI * 2);
  ctx.moveTo(424, 66);
  ctx.lineTo(409, 78);
  ctx.moveTo(426, 145);
  ctx.lineTo(405, 132);
  ctx.stroke();
}

function drawContent(ctx) {
  ctx.beginPath();
  ctx.moveTo(304, 53);
  ctx.lineTo(386, 53);
  ctx.lineTo(416, 83);
  ctx.lineTo(416, 184);
  ctx.lineTo(304, 184);
  ctx.closePath();
  ctx.moveTo(386, 53);
  ctx.lineTo(386, 83);
  ctx.lineTo(416, 83);
  ctx.moveTo(328, 105);
  ctx.lineTo(392, 105);
  ctx.moveTo(328, 125);
  ctx.lineTo(392, 125);
  ctx.moveTo(328, 145);
  ctx.lineTo(377, 145);
  ctx.stroke();
}

function drawProcess(ctx) {
  const nodes = [[286, 121], [344, 121], [402, 121], [460, 121]];
  ctx.beginPath();
  ctx.moveTo(301, 121);
  ctx.lineTo(329, 121);
  ctx.moveTo(359, 121);
  ctx.lineTo(387, 121);
  ctx.moveTo(417, 121);
  ctx.lineTo(445, 121);
  nodes.forEach(([x, y], index) => {
    ctx.roundRect(x - 15, y - 16, 30, 32, 8);
    if (index < nodes.length - 1) {
      const arrowX = x + 28;
      ctx.moveTo(arrowX - 4, y - 5);
      ctx.lineTo(arrowX + 2, y);
      ctx.lineTo(arrowX - 4, y + 5);
    }
  });
  ctx.stroke();
}

// Shared with the ambient page canvas; keeping this generator beside the matching artwork avoids diverging masks.
// eslint-disable-next-line react-refresh/only-export-components
export function createFormation(variant) {
  const canvas = document.createElement('canvas');
  canvas.width = FORMATION_SIZE.width;
  canvas.height = FORMATION_SIZE.height;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.strokeStyle = '#fff';
  context.fillStyle = '#fff';
  context.lineWidth = 9;
  context.lineCap = 'round';
  context.lineJoin = 'round';

  const shape = {
    'web-development': drawDesktop,
    'ui-ux-design': drawDesign,
    'content-strategy': drawAutomation,
    'growth-seo': drawGrowth,
    'brand-identity': drawBrand,
    'ecommerce-solutions': drawCommerce,
    'content-library': drawContent,
    process: drawProcess,
  }[variant] ?? drawBrand;
  context.save();
  context.translate(FORMATION_SIZE.width / 2, 120);
  context.scale(1.3, 1.3);
  context.translate(-FORMATION_SIZE.width / 2, -120);
  shape(context);
  context.restore();
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.font = '700 92px Arial, sans-serif';
  context.fillText('PIXENECT', FORMATION_SIZE.width / 2, 320);
  context.font = '500 17px Arial, sans-serif';
  context.fillText('SOLUTIONS', FORMATION_SIZE.width / 2, 388);

  const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
  const candidates = [];
  for (let y = 0; y < canvas.height; y += 2) {
    for (let x = 0; x < canvas.width; x += 2) {
      if (pixels[(y * canvas.width + x) * 4 + 3] > 100) candidates.push([x, y]);
    }
  }

  const step = Math.max(1, Math.ceil(candidates.length / MAX_DOTS));
  const targets = [];
  for (let index = 0; index < candidates.length && targets.length < MAX_DOTS; index += step) {
    const [x, y] = candidates[index];
    targets.push([
      (x - canvas.width / 2) * WORLD_SCALE,
      (canvas.height / 2 - y) * WORLD_SCALE,
      Math.sin(index * 2.31) * 0.16,
    ]);
  }

  return targets;
}

function DotFormation({ variant, reduceMotion, pointerRef }) {
  const groupRef = useRef(null);
  const pointsRef = useRef(null);
  const assemblyRef = useRef(0);
  const { targets, start, positions } = useMemo(() => {
    const formation = createFormation(variant);
    const starts = new Float32Array(formation.length * 3);

    formation.forEach((target, index) => {
      const offset = index * 3;
      const random = (seed) => {
        const value = Math.sin((index + 1) * seed) * 43758.5453;
        return value - Math.floor(value);
      };
      starts[offset] = (random(12.9898) - 0.5) * 5.2;
      starts[offset + 1] = (random(78.233) - 0.5) * 4.2;
      starts[offset + 2] = (random(37.719) - 0.5) * 2.8;
    });

    return {
      targets: new Float32Array(formation.flat()),
      start: starts,
      positions: reduceMotion ? new Float32Array(formation.flat()) : new Float32Array(starts),
    };
  }, [reduceMotion, variant]);

  useFrame((state, delta) => {
    const group = groupRef.current;
    const points = pointsRef.current;
    if (!group || !points || reduceMotion) return;

    if (assemblyRef.current < 1) assemblyRef.current = Math.min(1, assemblyRef.current + delta * 0.7);
    const eased = 1 - (1 - assemblyRef.current) ** 3;
    if (assemblyRef.current < 1) {
      const positions = points.geometry.attributes.position.array;
      for (let index = 0; index < targets.length; index += 3) {
        positions[index] = THREE.MathUtils.lerp(start[index], targets[index], eased);
        positions[index + 1] = THREE.MathUtils.lerp(start[index + 1], targets[index + 1], eased);
        positions[index + 2] = THREE.MathUtils.lerp(start[index + 2], targets[index + 2], eased);
      }
      points.geometry.attributes.position.needsUpdate = true;
    }

    const ease = 1 - Math.exp(-delta * 2.2);
    group.rotation.y += delta * 0.045;
    group.rotation.x += (pointerRef.current.y * 0.08 - group.rotation.x) * ease;
    group.rotation.z += (pointerRef.current.x * 0.05 - group.rotation.z) * ease;
    group.position.y = Math.sin(state.clock.elapsedTime * 0.45) * 0.035;
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.031}
          sizeAttenuation
          color="#ffffff"
          transparent
          opacity={0.94}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

function ServiceDotVisual({ service, variant }) {
  const reduceMotion = useReducedMotion();
  const visualRef = useRef(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const visual = visualRef.current;
    if (!visual) return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: '160px 0px',
    });
    observer.observe(visual);
    return () => observer.disconnect();
  }, []);

  const handlePointerMove = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    pointerRef.current.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointerRef.current.y = ((event.clientY - bounds.top) / bounds.height) * 2 - 1;
  };

  const resetPointer = () => {
    pointerRef.current.x = 0;
    pointerRef.current.y = 0;
  };

  return (
    <div
      ref={visualRef}
      className="service-dot-visual"
      role="img"
      aria-label={`White particle illustration of ${service.title} with PIXENECT typography. ${service.tagline}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
    >
      <div className="service-dot-glow" aria-hidden="true" />
      <div className="service-dot-canvas" aria-hidden="true">
        <Canvas
          frameloop={reduceMotion || !inView ? 'never' : 'always'}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 7], fov: 42, near: 0.1, far: 30 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        >
          <DotFormation variant={variant} reduceMotion={reduceMotion} pointerRef={pointerRef} />
        </Canvas>
      </div>
      <span className="service-dot-orbit-label service-dot-orbit-label--top" aria-hidden="true">
        {service.category} / SOLUTIONS
      </span>
      <span className="service-dot-orbit-label service-dot-orbit-label--bottom" aria-hidden="true">
        {service.tagline}
      </span>
    </div>
  );
}

export default ServiceDotVisual;
