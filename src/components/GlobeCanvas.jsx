import { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html, Line, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { feature } from 'topojson-client';
import { geoEquirectangular, geoPath } from 'd3-geo';
import landTopology from 'world-atlas/land-110m.json';
import { HQ, MARKERS, VISITOR_CODE } from '../lib/globeLocations';

const DEG = Math.PI / 180;
const GLOBE_RADIUS = 1;
const SAMPLE_COUNT = 64000;
const MIN_LATITUDE = -60;
const MASK_WIDTH = 1024;
const MASK_HEIGHT = 512;
const ACCENT = '#10B981';
const FOCUS_LONGITUDE = 30;
const ASSEMBLY_SECONDS = 2.8;
// View-space direction, so the lit side stays upper-left while the globe spins or is dragged.
const LIGHT_DIRECTION = new THREE.Vector3(-0.55, 0.7, 0.55).normalize();

const VISITOR_COLOR = '#ffffff';
const ARC_SEGMENTS = 64;
const COMET_TRAIL = [0.009, 0.007, 0.0055, 0.004, 0.003];
const STAR_COUNT = 420;

const ORBITS = [
  { radius: 1.08, rotation: [1.38, 0.22, 0.5], color: '#10B981', opacity: 0.3, satellite: true },
  { radius: 1.14, rotation: [1.52, -0.5, -0.3], color: '#ffffff', opacity: 0.12 },
  { radius: 1.22, rotation: [1.2, 0.85, 0.65], color: '#ffffff', opacity: 0.1 },
];

function latLonToVector3(lat, lon, radius = GLOBE_RADIUS) {
  const phi = (90 - lat) * DEG;
  const theta = (lon + 180) * DEG;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

function formatCoordinate(value, positive, negative) {
  return `${Math.abs(value).toFixed(2)}°${value >= 0 ? positive : negative}`;
}

function buildLandMask() {
  const canvas = document.createElement('canvas');
  canvas.width = MASK_WIDTH;
  canvas.height = MASK_HEIGHT;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  const projection = geoEquirectangular()
    .scale(MASK_WIDTH / (2 * Math.PI))
    .translate([MASK_WIDTH / 2, MASK_HEIGHT / 2]);

  context.fillStyle = '#fff';
  context.beginPath();
  geoPath(projection, context)(feature(landTopology, landTopology.objects.land));
  context.fill();

  return context.getImageData(0, 0, MASK_WIDTH, MASK_HEIGHT).data;
}

// Fibonacci-sphere sampling gives evenly spaced dots; only the ones that land on a continent are kept.
function buildLandPoints() {
  const mask = buildLandMask();
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const positions = [];
  const randoms = [];

  for (let index = 0; index < SAMPLE_COUNT; index += 1) {
    const y = 1 - ((index + 0.5) / SAMPLE_COUNT) * 2;
    const lat = Math.asin(y) / DEG;
    if (lat < MIN_LATITUDE) break;

    const lon = ((goldenAngle * index) % (2 * Math.PI)) / DEG - 180;
    const pixelX = Math.min(MASK_WIDTH - 1, Math.floor(((lon + 180) / 360) * MASK_WIDTH));
    const pixelY = Math.min(MASK_HEIGHT - 1, Math.floor(((90 - lat) / 180) * MASK_HEIGHT));
    if (mask[(pixelY * MASK_WIDTH + pixelX) * 4 + 3] < 128) continue;

    const point = latLonToVector3(lat, lon);
    positions.push(point.x, point.y, point.z);
    const noise = Math.sin(index * 12.9898) * 43758.5453;
    randoms.push(noise - Math.floor(noise));
  }

  return {
    positions: new Float32Array(positions),
    randoms: new Float32Array(randoms),
    count: randoms.length,
  };
}

const dotVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uSize;
  uniform float uPixelRatio;
  uniform float uViewportScale;
  uniform vec3 uLightDirection;
  uniform float uAssembly;
  attribute float aRandom;
  varying float vAlpha;
  varying float vLight;

  vec2 rotate2d(vec2 v, float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return vec2(c * v.x - s * v.y, s * v.x + c * v.y);
  }

  void main() {
    vec4 finalPosition = modelViewMatrix * vec4(position, 1.0);
    vec3 viewNormal = normalize(normalMatrix * position);
    float facing = dot(viewNormal, normalize(-finalPosition.xyz));
    float light = max(dot(viewNormal, uLightDirection), 0.0);
    float rim = pow(1.0 - clamp(facing, 0.0, 1.0), 3.0);
    float twinkle = 0.82 + 0.18 * sin(uTime * 1.3 + aRandom * 6.2831);

    // Each particle starts off-screen along its own screen-space direction and spirals in, staggered by aRandom.
    float progress = clamp((uAssembly - aRandom * 0.35) / 0.65, 0.0, 1.0);
    float eased = 1.0 - pow(1.0 - progress, 3.0);
    float spread = 3.2 + 3.5 * fract(aRandom * 43.17);
    vec2 outward = normalize(finalPosition.xy + vec2(0.0005, 0.0003)) * spread;
    vec2 startXY = rotate2d(outward, 1.4 * (fract(aRandom * 17.31) - 0.5));
    vec2 travelXY = rotate2d(mix(startXY, finalPosition.xy, eased), (1.0 - eased) * 0.9);
    vec4 mvPosition = vec4(travelXY, finalPosition.z, 1.0);

    vLight = min(1.0, (0.9 + 0.25 * light + 0.3 * rim) * (0.5 + 0.5 * twinkle));
    vAlpha = smoothstep(-0.02, 0.18, facing) * smoothstep(0.0, 0.25, progress);
    gl_PointSize = uSize * uPixelRatio * uViewportScale * (0.85 + 0.15 * aRandom) * (0.9 + 0.2 * light) / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const dotFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  varying float vLight;

  void main() {
    float alpha = (1.0 - smoothstep(0.32, 0.5, length(gl_PointCoord - 0.5))) * vAlpha;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(uColor * vLight, alpha);
  }
`;

const bodyVertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vViewDirection;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vViewDirection = normalize(-mvPosition.xyz);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const bodyFragmentShader = /* glsl */ `
  uniform vec3 uLightDirection;
  varying vec3 vNormal;
  varying vec3 vViewDirection;

  void main() {
    float light = max(dot(vNormal, uLightDirection), 0.0);
    float fresnel = 1.0 - max(dot(vNormal, vViewDirection), 0.0);
    vec3 color = mix(vec3(0.08), vec3(0.11), light);
    color += vec3(1.0) * pow(fresnel, 5.0) * (0.45 + 0.7 * max(dot(vNormal, uLightDirection) + 0.4, 0.0));
    gl_FragColor = vec4(color, 1.0);
  }
`;

const haloVertexShader = /* glsl */ `
  varying vec3 vNormal;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const haloFragmentShader = /* glsl */ `
  varying vec3 vNormal;

  void main() {
    float intensity = pow(0.66 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
    gl_FragColor = vec4(vec3(1.0), 1.0) * intensity * 0.5;
  }
`;

const beamVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const beamFragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    float fade = pow(1.0 - vUv.y, 1.6);
    float flicker = 0.75 + 0.25 * sin(uTime * 3.0);
    gl_FragColor = vec4(uColor, fade * 0.75 * flicker);
  }
`;

const starVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uPixelRatio;
  attribute float aRandom;
  varying float vAlpha;
  varying float vAccent;

  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    float twinkle = 0.5 + 0.5 * sin(uTime * (0.6 + aRandom * 1.4) + aRandom * 40.0);
    vAlpha = 0.2 + 0.8 * pow(twinkle, 3.0);
    vAccent = step(0.85, fract(aRandom * 7.0));
    gl_PointSize = (1.2 + aRandom * 2.2) * uPixelRatio * 3.0 / -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const starFragmentShader = /* glsl */ `
  uniform vec3 uAccent;
  varying float vAlpha;
  varying float vAccent;

  void main() {
    float alpha = (1.0 - smoothstep(0.1, 0.5, length(gl_PointCoord - 0.5))) * vAlpha * 0.6;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(mix(vec3(1.0), uAccent, vAccent), alpha);
  }
`;

function buildStars() {
  const positions = new Float32Array(STAR_COUNT * 3);
  const randoms = new Float32Array(STAR_COUNT);
  const hash = (seed) => {
    const value = Math.sin(seed * 12.9898) * 43758.5453;
    return value - Math.floor(value);
  };

  for (let index = 0; index < STAR_COUNT; index += 1) {
    const radius = 1.35 + hash(index + 0.1) * 1.5;
    const z = hash(index + 0.2) * 2 - 1;
    const theta = hash(index + 0.3) * Math.PI * 2;
    const ring = Math.sqrt(1 - z * z);
    positions.set([Math.cos(theta) * ring * radius, Math.sin(theta) * ring * radius, z * radius], index * 3);
    randoms[index] = hash(index + 0.4);
  }

  return { positions, randoms };
}

function shortestLongitudeDelta(from, to) {
  return ((to - from + 540) % 360) - 180;
}

function LandDots({ points, assemblyRef }) {
  const materialRef = useRef(null);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uAssembly: { value: 0 },
    uSize: { value: 5.2 },
    uPixelRatio: { value: 1 },
    uViewportScale: { value: 1 },
    uColor: { value: new THREE.Color('#ffffff') },
    uLightDirection: { value: LIGHT_DIRECTION },
  }), []);

  useFrame(({ gl, size }, delta) => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uTime.value += delta;
    material.uniforms.uAssembly.value = assemblyRef.current;
    material.uniforms.uPixelRatio.value = gl.getPixelRatio();
    material.uniforms.uViewportScale.value = size.height / 600;
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[points.positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[points.randoms, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={dotVertexShader}
        fragmentShader={dotFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

function Beacon({ color, height = 0.2 }) {
  const materialRef = useRef(null);
  const uniforms = useMemo(() => ({
    uColor: { value: new THREE.Color(color) },
    uTime: { value: 0 },
  }), [color]);

  useFrame((_, delta) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value += delta;
  });

  return (
    <mesh position={[0, 0, height / 2]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.005, 0.005, height, 12, 1, true]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={beamVertexShader}
        fragmentShader={beamFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function VisitorTag({ name }) {
  const anchorRef = useRef(null);
  const tagRef = useRef(null);
  const camera = useThree((state) => state.camera);
  const scratch = useMemo(() => ({ world: new THREE.Vector3(), toCamera: new THREE.Vector3() }), []);

  // Html overlays ignore depth, so hide the tag once its pin rotates behind the globe.
  useFrame(() => {
    if (!anchorRef.current || !tagRef.current) return;
    const { world, toCamera } = scratch;
    anchorRef.current.getWorldPosition(world);
    toCamera.copy(camera.position).sub(world).normalize();
    tagRef.current.style.opacity = world.normalize().dot(toCamera) > 0.2 ? '1' : '0';
  });

  return (
    <group ref={anchorRef}>
      <Html position={[0, 0, 0.2]} zIndexRange={[20, 0]} style={{ pointerEvents: 'none' }}>
        <div ref={tagRef} className="flex -translate-x-1/2 -translate-y-full flex-col items-center opacity-0 transition-opacity duration-300">
          <div className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/25 bg-ink/80 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em] text-white backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.9)]" />
            You · {name}
          </div>
          <span className="h-3 w-px bg-linear-to-b from-white/60 to-transparent" />
        </div>
      </Html>
    </group>
  );
}

function ConnectionArc({ from, to, index, color, reduceMotion }) {
  const lineRef = useRef(null);
  const cometRefs = useRef([]);
  const elapsedRef = useRef(0);
  const { curve, points } = useMemo(() => {
    const start = latLonToVector3(from.lat, from.lon, GLOBE_RADIUS * 1.003);
    const end = latLonToVector3(to.lat, to.lon, GLOBE_RADIUS * 1.003);
    const lift = GLOBE_RADIUS * (1.04 + start.distanceTo(end) * 0.22);
    const arc = new THREE.CubicBezierCurve3(
      start,
      start.clone().lerp(end, 0.25).normalize().multiplyScalar(lift),
      start.clone().lerp(end, 0.75).normalize().multiplyScalar(lift),
      end,
    );
    return { curve: arc, points: arc.getPoints(ARC_SEGMENTS) };
  }, [from.lat, from.lon, to.lat, to.lon]);

  useFrame((_, delta) => {
    elapsedRef.current += Math.min(delta, 0.1);
    const elapsed = elapsedRef.current;
    const reveal = reduceMotion ? 1 : THREE.MathUtils.clamp((elapsed - index * 0.15) / 1.1, 0, 1);
    if (lineRef.current) lineRef.current.geometry.instanceCount = Math.round(reveal * ARC_SEGMENTS);

    const head = (elapsed * 0.3 + index * 0.23) % 1.6;
    cometRefs.current.forEach((dot, dotIndex) => {
      if (!dot) return;
      const t = head - dotIndex * 0.022;
      dot.visible = !reduceMotion && reveal === 1 && t >= 0 && t <= 1;
      if (!dot.visible) return;
      curve.getPoint(t, dot.position);
      dot.scale.setScalar(0.35 + 0.65 * Math.sin(Math.PI * t));
    });
  });

  return (
    <group>
      <Line ref={lineRef} points={points} color={color} lineWidth={1} transparent opacity={0.4} depthWrite={false} />
      {COMET_TRAIL.map((radius, dotIndex) => (
        <mesh key={radius} ref={(dot) => { cometRefs.current[dotIndex] = dot; }} visible={false}>
          <sphereGeometry args={[radius, 10, 10]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={1 - dotIndex / COMET_TRAIL.length}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function Stardust() {
  const materialRef = useRef(null);
  const stars = useMemo(() => buildStars(), []);
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uPixelRatio: { value: 1 },
    uAccent: { value: new THREE.Color(ACCENT) },
  }), []);

  useFrame(({ gl }, delta) => {
    const material = materialRef.current;
    if (!material) return;
    material.uniforms.uTime.value += delta;
    material.uniforms.uPixelRatio.value = gl.getPixelRatio();
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[stars.positions, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[stars.randoms, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={starVertexShader}
        fragmentShader={starFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

function Marker({ marker, index, active, highlighted, showTag, onActivate, onDeactivate }) {
  const ringRefs = useRef([]);
  const color = marker.visitor && !marker.hq ? VISITOR_COLOR : ACCENT;
  const { position, quaternion } = useMemo(() => {
    const surfacePoint = latLonToVector3(marker.lat, marker.lon, GLOBE_RADIUS * 1.004);
    return {
      position: surfacePoint,
      quaternion: new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        surfacePoint.clone().normalize(),
      ),
    };
  }, [marker.lat, marker.lon]);

  useFrame(({ clock }) => {
    ringRefs.current.forEach((ring, ringIndex) => {
      if (!ring) return;
      const progress = (clock.elapsedTime * 0.5 + index * 0.37 + ringIndex * 0.5) % 1;
      ring.scale.setScalar(1 + progress * (active || highlighted ? 3.4 : 2.2));
      ring.material.opacity = (1 - progress) * (highlighted ? 1 : 0.9);
    });
  });

  return (
    <group position={position} quaternion={quaternion}>
      <mesh>
        <sphereGeometry args={[marker.hq || marker.visitor ? 0.014 : 0.01, 16, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      {[0, 1].map((ringIndex) => (
        <mesh key={ringIndex} ref={(ring) => { ringRefs.current[ringIndex] = ring; }}>
          <ringGeometry args={[0.013, 0.017, 40]} />
          <meshBasicMaterial color={color} transparent depthWrite={false} side={THREE.DoubleSide} toneMapped={false} />
        </mesh>
      ))}
      {(marker.hq || marker.visitor) && <Beacon color={color} />}
      {marker.visitor && showTag && <VisitorTag name={marker.name} />}
      <mesh
        onPointerOver={(event) => { event.stopPropagation(); onActivate(marker.code); }}
        onPointerOut={() => onDeactivate(marker.code)}
        onClick={(event) => { event.stopPropagation(); onActivate(marker.code); }}
      >
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <Html position={[0, 0, 0.03]} zIndexRange={[30, 0]} style={{ pointerEvents: 'none' }}>
        <div
          aria-hidden={!active}
          className={`transition-opacity duration-200 ${active ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="ml-3 -translate-y-1/2 whitespace-nowrap rounded-md border border-white/10 bg-ink/85 px-3 py-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.2em] text-neutral-300 backdrop-blur-md">
            <div className="flex items-center gap-2 text-white">
              <span className="size-1.5 rounded-full bg-magenta" />
              {marker.name}
              {marker.hq && <span className="text-magenta">· HQ</span>}
              {marker.visitor && <span className="text-magenta">· You</span>}
            </div>
            <div className="text-neutral-500">
              {formatCoordinate(marker.lat, 'N', 'S')} / {formatCoordinate(marker.lon, 'E', 'W')}
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

function Orbit({ radius, rotation, color, opacity, satellite, reduceMotion }) {
  const satelliteRef = useRef(null);
  const points = useMemo(() => Array.from({ length: 181 }, (_, index) => {
    const angle = (index / 180) * Math.PI * 2;
    return [Math.cos(angle) * radius, Math.sin(angle) * radius, 0];
  }), [radius]);

  useFrame(({ clock }) => {
    if (!satelliteRef.current) return;
    const angle = reduceMotion ? 0.8 : clock.elapsedTime * 0.35;
    satelliteRef.current.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
  });

  return (
    <group rotation={rotation}>
      <Line points={points} color={color} lineWidth={1} transparent opacity={opacity} depthWrite={false} />
      {satellite && (
        <mesh ref={satelliteRef}>
          <sphereGeometry args={[0.012, 12, 12]} />
          <meshBasicMaterial color={ACCENT} toneMapped={false} />
        </mesh>
      )}
    </group>
  );
}

function Globe({ onReady, onAssembled, onHoverChange, reduceMotion, started, visitor, highlightCode }) {
  const spinRef = useRef(null);
  const orbitsRef = useRef(null);
  const assemblyRef = useRef(reduceMotion ? 1 : 0);
  const [assembled, setAssembled] = useState(reduceMotion);
  const [activeCode, setActiveCode] = useState(null);
  const points = useMemo(() => buildLandPoints(), []);
  const bodyUniforms = useMemo(() => ({ uLightDirection: { value: LIGHT_DIRECTION } }), []);

  const markers = useMemo(() => {
    const list = MARKERS.map((marker) => ({ ...marker, visitor: marker.code === visitor?.matchCode }));
    if (visitor && !visitor.matchCode) {
      list.push({ code: VISITOR_CODE, name: visitor.name, lat: visitor.lat, lon: visitor.lon, visitor: true });
    }
    return list;
  }, [visitor]);

  // Start turned toward the visitor, leaning toward HQ so the arc between them is on screen.
  const focusLongitude = visitor
    ? visitor.lon + shortestLongitudeDelta(visitor.lon, HQ.lon) * 0.4
    : FOCUS_LONGITUDE;

  useEffect(() => {
    onReady?.(points.count);
  }, [onReady, points.count]);

  useEffect(() => {
    if (assembled) onAssembled?.();
  }, [assembled, onAssembled]);

  useEffect(() => {
    onHoverChange(Boolean(activeCode));
  }, [activeCode, onHoverChange]);

  useFrame((_, delta) => {
    const step = Math.min(delta, 0.1);

    if (started && assemblyRef.current < 1) {
      assemblyRef.current = Math.min(1, assemblyRef.current + step / ASSEMBLY_SECONDS);
      if (assemblyRef.current === 1) setAssembled(true);
    }
    if (orbitsRef.current) {
      const reveal = THREE.MathUtils.smoothstep(assemblyRef.current, 0.55, 1);
      orbitsRef.current.scale.setScalar(Math.max(reveal, 0.0001));
    }

    if (reduceMotion) return;
    if (spinRef.current) spinRef.current.rotation.y += step * 0.06;
    if (orbitsRef.current) orbitsRef.current.rotation.y -= step * 0.02;
  });

  const blockRaysBehindGlobe = (event) => event.stopPropagation();

  return (
    <>
      <group rotation={[0.32, 0, 0]}>
        <group ref={spinRef} rotation={[0, -(focusLongitude + 90) * DEG, 0]}>
          <mesh onPointerOver={blockRaysBehindGlobe} onPointerMove={blockRaysBehindGlobe} onClick={() => setActiveCode(null)}>
            <sphereGeometry args={[GLOBE_RADIUS * 0.992, 96, 96]} />
            <shaderMaterial vertexShader={bodyVertexShader} fragmentShader={bodyFragmentShader} uniforms={bodyUniforms} />
          </mesh>
          <LandDots points={points} assemblyRef={assemblyRef} />
          {assembled && markers.filter((marker) => !marker.hq).map((marker, index) => (
            <ConnectionArc
              key={marker.code}
              from={HQ}
              to={marker}
              index={index}
              color={marker.visitor ? VISITOR_COLOR : ACCENT}
              reduceMotion={reduceMotion}
            />
          ))}
          <group visible={assembled}>
            {markers.map((marker, index) => (
              <Marker
                key={marker.code}
                marker={marker}
                index={index}
                active={activeCode === marker.code}
                highlighted={highlightCode === marker.code}
                showTag={assembled}
                onActivate={setActiveCode}
                onDeactivate={(code) => setActiveCode((current) => (current === code ? null : current))}
              />
            ))}
          </group>
        </group>
        <mesh scale={1.12}>
          <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
          <shaderMaterial
            vertexShader={haloVertexShader}
            fragmentShader={haloFragmentShader}
            side={THREE.BackSide}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
      <group ref={orbitsRef}>
        <Stardust />
        {ORBITS.map((orbit) => <Orbit key={orbit.radius} {...orbit} reduceMotion={reduceMotion} />)}
      </group>
    </>
  );
}

function DragControls({ onDragChange }) {
  return (
    <OrbitControls
      enableZoom={false}
      enablePan={false}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.45}
      minPolarAngle={Math.PI * 0.3}
      maxPolarAngle={Math.PI * 0.7}
      onStart={() => onDragChange(true)}
      onEnd={() => onDragChange(false)}
    />
  );
}

function ResponsiveCamera() {
  const camera = useThree((state) => state.camera);
  const size = useThree((state) => state.size);

  useEffect(() => {
    const aspect = size.width / Math.max(size.height, 1);
    camera.position.setLength(Math.max(2.8, 3.1 / aspect));
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  return null;
}

export default function GlobeCanvas({
  onReady,
  onAssembled,
  interactive,
  running,
  reduceMotion,
  started = true,
  visitor = null,
  highlightCode = null,
}) {
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);
  const cursor = hovering ? 'pointer' : dragging ? 'grabbing' : interactive ? 'grab' : 'auto';

  return (
    <Canvas
      frameloop={running ? 'always' : 'never'}
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 3.05], fov: 45, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ touchAction: interactive ? 'none' : 'pan-y', cursor }}
    >
      <ResponsiveCamera />
      <Globe
        onReady={onReady}
        onAssembled={onAssembled}
        onHoverChange={setHovering}
        reduceMotion={reduceMotion}
        started={started}
        visitor={visitor}
        highlightCode={highlightCode}
      />
      {interactive && <DragControls onDragChange={setDragging} />}
    </Canvas>
  );
}
