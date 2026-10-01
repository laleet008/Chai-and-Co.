'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, ContactShadows, OrbitControls, Decal, Html } from '@react-three/drei';
import * as THREE from 'three';
import { useReducedMotion } from '@/lib/useReducedMotion';

function makeRoughnessTexture() {
  if (typeof document === 'undefined') return null;
  const size = 512;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(size, size);
  for (let i = 0; i < img.data.length; i += 4) {
    const base = 120;
    const noise = (Math.random() - 0.5) * 80;
    const x = (i / 4) % size;
    const y = Math.floor(i / 4 / size);
    const wave = Math.sin((y / size) * Math.PI * 40 + x * 0.01) * 15;
    const v = Math.max(0, Math.min(255, base + noise + wave));
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(2, 3);
  t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
}

type LabelTex = { tex: THREE.CanvasTexture; key: string };

function makeLabelTexture(name: string, accent: string, sub = 'ILAM · NEPAL · 1,900 m'): LabelTex {
  const key = `${name}__${accent}`;
  if (typeof document === 'undefined') return { tex: null as any, key };
  const size = 1024;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = '#F4F0E8';
  roundRect(ctx, 60, 160, size - 120, size - 320, 16);
  ctx.fill();
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1A1714';
  ctx.font = "500 64px 'Fraunces', 'Playfair Display', Georgia, serif";
  ctx.fillText('Chai & Co.', size / 2, 300);
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(size / 2 - 160, 340);
  ctx.lineTo(size / 2 + 160, 340);
  ctx.stroke();
  ctx.fillStyle = '#1A1714';
  ctx.font = "600 92px 'Fraunces', 'Playfair Display', Georgia, serif";
  wrapText(ctx, name.toUpperCase(), size / 2, 470, 760, 94, 'center');
  ctx.fillStyle = accent;
  ctx.font = "500 34px 'Fraunces', Georgia, serif";
  const leafY = 680;
  drawLeafGlyph(ctx, size / 2, leafY, 44, accent);
  ctx.fillStyle = '#1A1714';
  ctx.font = "600 28px 'Inter', system-ui, sans-serif";
  ctx.letterSpacing ? (ctx as any).letterSpacing = '0.24em' : null;
  ctx.fillText(sub, size / 2, leafY + 90);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return { tex: t, key };
}

function makeLidBumpTexture(accent: string) {
  if (typeof document === 'undefined') return null;
  const size = 512;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#C8C8C8';
  ctx.textAlign = 'center';
  ctx.font = "700 78px 'Fraunces', Georgia, serif";
  ctx.fillText('C & Co.', size / 2, size / 2 - 10);
  drawLeafGlyph(ctx, size / 2, size / 2 + 90, 60, '#B0B0B0');
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
  t.anisotropy = 4;
  t.needsUpdate = true;
  return t;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  align: CanvasTextAlign = 'left',
) {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  ctx.textAlign = align;
  lines.forEach((l, i) => {
    ctx.fillText(l, x, startY + i * lineHeight);
  });
}

function drawLeafGlyph(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  color: string,
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = Math.max(1, size * 0.06);
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, -size);
  ctx.bezierCurveTo(size * 0.7, -size * 0.5, size, size * 0.3, size * 0.4, size * 0.9);
  ctx.bezierCurveTo(0, size * 0.6, -size * 0.4, size * 0.9, -size * 0.4, size * 0.4);
  ctx.bezierCurveTo(-size * 0.4, size * 0.1, -size * 0.6, -size * 0.4, 0, -size);
  ctx.closePath();
  ctx.globalAlpha = 0.9;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, -size * 0.85);
  ctx.quadraticCurveTo(size * 0.1, 0, size * 0.35, size * 0.7);
  ctx.stroke();
  ctx.restore();
}

export function LeafInstances({ count = 64, visible = true }: { count?: number; visible?: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seed = useMemo(() => {
    const arr: {
      x: number; y: number; z: number; rx: number; ry: number; rz: number; s: number; phase: number;
    }[] = [];
    for (let i = 0; i < count; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 0.75,
        y: -0.65 + Math.random() * 0.6,
        z: (Math.random() - 0.5) * 0.75,
        rx: Math.random() * Math.PI * 2,
        ry: Math.random() * Math.PI * 2,
        rz: Math.random() * Math.PI * 2,
        s: 0.6 + Math.random() * 0.8,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current || !visible) return;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const s = seed[i];
      const bob = Math.sin(t * 1.2 + s.phase) * 0.01;
      dummy.position.set(s.x, s.y + bob, s.z);
      dummy.rotation.set(s.rx + Math.sin(t + s.phase) * 0.15, s.ry + t * 0.1, s.rz);
      dummy.scale.setScalar(s.s);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  const geom = useMemo(() => {
    const g = new THREE.ConeGeometry(0.04, 0.14, 5);
    g.rotateX(Math.PI * 0.25);
    return g;
  }, []);

  return (
    <instancedMesh
      ref={meshRef}
      args={[geom, undefined, count]}
      visible={visible}
      frustumCulled={false}
    >
      <meshStandardMaterial color="#6B8F5E" roughness={0.7} metalness={0.05} side={THREE.DoubleSide} />
    </instancedMesh>
  );
}

export function TeaTinCore({
  accent = '#C9A227',
  name = 'Mist First Flush',
  sub = 'ILAM · NEPAL · 1,900 m',
  scrollProgress = 0,
  lookInside = false,
  enableDrag = false,
  enableCursorParallax = true,
  enableScrollRotate = true,
  onFirstDrag,
}: {
  accent?: string;
  name?: string;
  sub?: string;
  scrollProgress?: number;
  lookInside?: boolean;
  enableDrag?: boolean;
  enableCursorParallax?: boolean;
  enableScrollRotate?: boolean;
  onFirstDrag?: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const lidRef = useRef<THREE.Mesh>(null!);
  const bodyMeshRef = useRef<THREE.Mesh>(null!);
  const bodyMatRef = useRef<THREE.MeshStandardMaterial>(null!);
  const controlsRef = useRef<any>(null);
  const [nextLabel, setNextLabel] = useState<LabelTex | null>(null);
  const [currLabel, setCurrLabel] = useState<LabelTex | null>(null);
  const [fade, setFade] = useState<number>(1);
  const [firstDrag, setFirstDrag] = useState(false);
  const { viewport, size } = useThree();
  const reduced = useReducedMotion();

  const bodyProfile = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    pts.push(new THREE.Vector2(0.0, -0.70));
    pts.push(new THREE.Vector2(0.50, -0.70));
    pts.push(new THREE.Vector2(0.54, -0.67));
    pts.push(new THREE.Vector2(0.55, -0.63));
    pts.push(new THREE.Vector2(0.55, 0.58));
    pts.push(new THREE.Vector2(0.535, 0.615));
    pts.push(new THREE.Vector2(0.50, 0.64));
    pts.push(new THREE.Vector2(0.46, 0.65));
    pts.push(new THREE.Vector2(0.0, 0.65));
    return pts;
  }, []);

  const roughnessTex = useMemo(() => makeRoughnessTexture(), []);
  const lidBumpTex = useMemo(() => makeLidBumpTexture(accent), [accent]);

  useEffect(() => {
    const fresh = makeLabelTexture(name, accent, sub);
    if (!currLabel) {
      setCurrLabel(fresh);
      return;
    }
    if (fresh.key === currLabel.key) return;
    setNextLabel(fresh);
    setFade(1);
    const start = performance.now();
    const dur = 500;
    let raf = 0;
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setFade(1 - eased);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setCurrLabel(fresh);
        setNextLabel(null);
        setFade(1);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [name, accent, sub, currLabel]);

  const targetRotY = useRef(0);
  const targetRotX = useRef(0);
  const cursorY = useRef(0);
  const cursorX = useRef(0);

  useEffect(() => {
    if (!enableCursorParallax || reduced) return;
    const onMove = (e: PointerEvent) => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
      const h = typeof window !== 'undefined' ? window.innerHeight : 768;
      cursorX.current = ((e.clientX / w) - 0.5) * 2;
      cursorY.current = ((e.clientY / h) - 0.5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enableCursorParallax, reduced]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (!enableDrag && groupRef.current) {
      const scrollY = enableScrollRotate && !reduced ? scrollProgress : 0;
      const scrollRot = scrollY * Math.PI * 2.5;
      const scrollTilt = 0.25 - scrollY * 0.35;
      const idleY = reduced ? 0 : Math.sin(t * 0.8) * 0.04;
      const idleX = reduced ? 0 : Math.sin(t * 0.55) * 0.015;
      const parX = enableCursorParallax && !reduced ? cursorX.current * 0.08 : 0;
      const parY = enableCursorParallax && !reduced ? cursorY.current * 0.05 : 0;
      targetRotY.current += (scrollRot + idleY + parX - groupRef.current.rotation.y) * Math.min(1, delta * 4);
      targetRotX.current += (scrollTilt + idleX - parY - groupRef.current.rotation.x) * Math.min(1, delta * 4);
      groupRef.current.rotation.y = targetRotY.current;
      groupRef.current.rotation.x = targetRotX.current;
      const bob = reduced ? 0 : Math.sin(t * 1.1) * 0.015;
      groupRef.current.position.y = bob;
    }
    if (lidRef.current) {
      const open = lookInside ? 1 : 0;
      const target = 0.72 + open * 0.55;
      lidRef.current.position.y += (target - lidRef.current.position.y) * Math.min(1, delta * 3.2);
      lidRef.current.rotation.z += ((open * 0.25) - lidRef.current.rotation.z) * Math.min(1, delta * 3);
      lidRef.current.position.x += ((open * 0.2) - lidRef.current.position.x) * Math.min(1, delta * 3);
    }
    if (bodyMatRef.current) {
      const op = lookInside ? 0.35 : 1;
      bodyMatRef.current.opacity += (op - bodyMatRef.current.opacity) * Math.min(1, delta * 4);
      bodyMatRef.current.transparent = op < 1;
    }
  });

  const bodyColor = useMemo(() => new THREE.Color(accent), [accent]);
  const lidDark = useMemo(() => {
    const c = new THREE.Color(accent);
    c.offsetHSL(0, 0, -0.18);
    return c;
  }, [accent]);
  const rimLightColor = useMemo(() => new THREE.Color(accent), [accent]);

  return (
    <group ref={groupRef}>
      <hemisphereLight args={['#FFFFFF', '#2A231C', 0.4]} />
      <ambientLight intensity={0.25} />
      <directionalLight
        position={[3, 2.4, 2.2]}
        intensity={1.6}
        color="#FFFBF2"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight
        position={[-1.6, 0.8, -1.4]}
        intensity={1.1}
        distance={6}
        color={rimLightColor}
      />
      <spotLight
        position={[0, 3.5, 0]}
        angle={0.55}
        penumbra={0.8}
        intensity={0.9}
        color="#FFF7E6"
      />

      <mesh
        ref={bodyMeshRef}
        castShadow
        receiveShadow
        position={[0, 0, 0]}
      >
        <latheGeometry args={[bodyProfile, 96]} />
        <meshStandardMaterial
          ref={bodyMatRef}
          color={bodyColor}
          metalness={0.75}
          roughness={0.35}
          roughnessMap={roughnessTex ?? undefined}
          envMapIntensity={1.1}
        />
        {currLabel && (
          <Decal
            mesh={bodyMeshRef}
            position={[0, 0.02, 0.552]}
            rotation={[0, 0, 0]}
            scale={[0.92, 1.08, 1]}
          >
            <meshBasicMaterial
              map={currLabel.tex}
              transparent
              opacity={fade}
              depthTest={false}
              polygonOffset
              polygonOffsetFactor={-1}
            />
          </Decal>
        )}
        {nextLabel && (
          <Decal
            mesh={bodyMeshRef}
            position={[0, 0.02, 0.5521]}
            rotation={[0, 0, 0]}
            scale={[0.92, 1.08, 1]}
          >
            <meshBasicMaterial
              map={nextLabel.tex}
              transparent
              opacity={1 - fade}
              depthTest={false}
              polygonOffset
              polygonOffsetFactor={-2}
            />
          </Decal>
        )}
      </mesh>

      <mesh position={[0, 0.55, 0]} castShadow>
        <torusGeometry args={[0.512, 0.013, 20, 128]} />
        <meshStandardMaterial
          color={lidDark}
          metalness={0.92}
          roughness={0.22}
        />
      </mesh>

      <mesh
        ref={lidRef}
        position={[0, 0.72, 0]}
        castShadow
      >
        <cylinderGeometry args={[0.59, 0.59, 0.10, 96, 1, false]} />
        <meshStandardMaterial
          color={lidDark}
          metalness={0.9}
          roughness={0.2}
          bumpMap={lidBumpTex ?? undefined}
          bumpScale={0.025}
        />
      </mesh>

      <LeafInstances visible={lookInside} count={64} />

      <ContactShadows
        position={[0, -0.72, 0]}
        opacity={0.5}
        scale={3}
        blur={2.4}
        far={1.5}
        resolution={1024}
      />

      {enableDrag && !firstDrag && !reduced && (
        <Html
          center
          position={[0, -1.0, 0]}
          style={{ pointerEvents: 'none', width: '220px' }}
        >
          <div
            style={{
              textAlign: 'center',
              fontFamily: "'Inter', system-ui, sans-serif",
              fontSize: 11,
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: '#1A1714',
              opacity: 0.7,
              padding: '8px 10px',
              background: 'rgba(244,240,232,0.85)',
              borderRadius: 999,
              border: '1px solid rgba(26,23,20,0.08)',
              backdropFilter: 'blur(6px)',
            }}
          >
            Drag to rotate
          </div>
        </Html>
      )}

      {enableDrag && (
        <OrbitControls
          ref={(c) => {
            (controlsRef as any).current = c;
            if (c && !firstDrag) {
              c.addEventListener?.('start', () => {
                if (!firstDrag) {
                  setFirstDrag(true);
                  onFirstDrag?.();
                }
              });
            }
          }}
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.07}
          rotateSpeed={0.7}
          minPolarAngle={Math.PI * 0.25}
          maxPolarAngle={Math.PI * 0.78}
        />
      )}

      <Environment preset="studio" />
    </group>
  );
}

export function TeaTinScene(props: React.ComponentProps<typeof TeaTinCore> & {
  className?: string;
  frameloopDemand?: boolean;
  inViewTrigger?: HTMLElement | null;
}) {
  const { className, frameloopDemand = true, inViewTrigger, ...rest } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inView, setInView] = useState(true);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = inViewTrigger ?? canvasRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => setInView(e.isIntersecting));
      },
      { threshold: 0.05 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [inViewTrigger, reduced]);

  return (
    <Canvas
      ref={canvasRef}
      className={className}
      dpr={[1, 2]}
      frameloop={frameloopDemand && !inView ? 'demand' : 'always'}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.05,
        outputColorSpace: THREE.SRGBColorSpace,
        powerPreference: 'high-performance',
      }}
      shadows
      camera={{ position: [0, 0.1, 2.4], fov: 30 }}
      style={{ background: 'transparent' }}
    >
      <SuspenseFallback />
      <TeaTinCore {...rest} />
    </Canvas>
  );
}

function SuspenseFallback() {
  return null;
}
