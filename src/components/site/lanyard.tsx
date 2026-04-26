/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState, Suspense, useMemo } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, useTexture } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";

extend({ MeshLineGeometry, MeshLineMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: any;
    meshLineMaterial: any;
  }
}

function Band({ maxSpeed = 50, minSpeed = 10 }: { maxSpeed?: number; minSpeed?: number }) {
  const bandL = useRef<THREE.Mesh>(null);
  const bandR = useRef<THREE.Mesh>(null);
  const fixedL = useRef<RapierRigidBody>(null);
  const j1L = useRef<RapierRigidBody>(null);
  const j2L = useRef<RapierRigidBody>(null);
  const j3L = useRef<RapierRigidBody>(null);
  const fixedR = useRef<RapierRigidBody>(null);
  const j1R = useRef<RapierRigidBody>(null);
  const j2R = useRef<RapierRigidBody>(null);
  const j3R = useRef<RapierRigidBody>(null);
  const card = useRef<RapierRigidBody>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const rot = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const localAttachL = new THREE.Vector3(-0.06, 1.45, 0);
  const localAttachR = new THREE.Vector3(0.06, 1.45, 0);

  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 2,
    linearDamping: 2,
  };

  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  // Left chain
  useRopeJoint(fixedL as any, j1L as any, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1L as any, j2L as any, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2L as any, j3L as any, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3L as any, card as any, [
    [0, 0, 0],
    [-0.06, 1.45, 0],
  ]);

  // Right chain
  useRopeJoint(fixedR as any, j1R as any, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1R as any, j2R as any, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2R as any, j3R as any, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3R as any, card as any, [
    [0, 0, 0],
    [0.06, 1.45, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  const [curveL] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );
  const [curveR] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );

  const shape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.06, -0.01);
    s.lineTo(0.06, -0.01);
    s.lineTo(0.06, 0.01);
    s.lineTo(-0.06, 0.01);
    s.closePath();
    return s;
  }, []);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1L, j2L, j3L, fixedL, j1R, j2R, j3R, fixedR].forEach((r) => r.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: vec.x - (dragged as THREE.Vector3).x,
        y: vec.y - (dragged as THREE.Vector3).y,
        z: vec.z - (dragged as THREE.Vector3).z,
      });
    }
    if (
      fixedL.current &&
      j1L.current &&
      j2L.current &&
      j3L.current &&
      fixedR.current &&
      j1R.current &&
      j2R.current &&
      j3R.current &&
      card.current &&
      bandL.current &&
      bandR.current
    ) {
      [j1L, j2L, j1R, j2R].forEach((ref) => {
        const r = ref.current!;
        // @ts-ignore lerped is added at runtime
        if (!r.lerped) r.lerped = new THREE.Vector3().copy(r.translation());
        // @ts-ignore
        const clampedDistance = Math.max(0.1, Math.min(1, r.lerped.distanceTo(r.translation())));
        // @ts-ignore
        r.lerped.lerp(
          r.translation(),
          delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)),
        );
      });

      curveL.points[0]
        .copy(localAttachL)
        .applyQuaternion(card.current.rotation() as any)
        .add(card.current.translation() as any);
      // @ts-ignore
      curveL.points[1].copy(j2L.current.lerped);
      // @ts-ignore
      curveL.points[2].copy(j1L.current.lerped);
      curveL.points[3].copy(fixedL.current.translation());

      curveR.points[0]
        .copy(localAttachR)
        .applyQuaternion(card.current.rotation() as any)
        .add(card.current.translation() as any);
      // @ts-ignore
      curveR.points[1].copy(j2R.current.lerped);
      // @ts-ignore
      curveR.points[2].copy(j1R.current.lerped);
      curveR.points[3].copy(fixedR.current.translation());

      const oldGeoL = bandL.current.geometry;
      bandL.current.geometry = new THREE.ExtrudeGeometry(shape, {
        extrudePath: curveL,
        steps: 32,
      });
      oldGeoL?.dispose();

      const oldGeoR = bandR.current.geometry;
      bandR.current.geometry = new THREE.ExtrudeGeometry(shape, {
        extrudePath: curveR,
        steps: 32,
      });
      oldGeoR?.dispose();

      ang.copy(card.current.angvel());
      rot.copy(card.current.rotation() as any);
      let targetAngvelY = ang.y;
      if (dragged) {
        targetAngvelY = ang.y - rot.y * 0.25;
      } else {
        targetAngvelY = ang.y + 0.02;
        card.current.wakeUp();
      }

      card.current.setAngvel({ x: ang.x, y: targetAngvelY, z: ang.z }, true);
    }
  });

  curveL.curveType = "chordal";
  curveR.curveType = "chordal";

  return (
    <>
      <group position={[0, 4, 0]}>
        {/* Left Chain */}
        <RigidBody position={[-0.5, 0, 0]} ref={fixedL} {...segmentProps} type="fixed" />
        <RigidBody position={[-0.5, -0.5, 0]} ref={j1L} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[-0.5, -1, 0]} ref={j2L} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[-0.5, -1.5, 0]} ref={j3L} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        {/* Right Chain */}
        <RigidBody position={[0.5, 0, 0]} ref={fixedR} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, -0.5, 0]} ref={j1R} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.5, -1, 0]} ref={j2R} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0.5, -1.5, 0]} ref={j3R} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          position={[0, -2, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e: any) => {
              (e.target as Element).releasePointerCapture?.(e.pointerId);
              drag(false);
            }}
            onPointerCancel={(e: any) => {
              (e.target as Element).releasePointerCapture?.(e.pointerId);
              drag(false);
            }}
            onPointerDown={(e: any) => {
              (e.target as Element).setPointerCapture?.(e.pointerId);
              if (!card.current) return;
              const t = card.current.translation();
              drag(new THREE.Vector3().copy(e.point).sub(new THREE.Vector3().copy(t as any)));
            }}
          >
            <CardMesh />
          </group>
        </RigidBody>
      </group>
      <mesh ref={bandL}>
        <meshStandardMaterial
          color="#2a2520"
          roughness={0.5}
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={bandR}>
        <meshStandardMaterial
          color="#2a2520"
          roughness={0.5}
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

function CardMesh() {
  // Front and back materials drawn via canvas textures
  const frontTex = useCanvasTexture(drawFront);
  const backTex = useCanvasTexture(drawBack);

  return (
    <group>
      {/* clip / lanyard top */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[0.3, 0.1, 0.04]} />
        <meshStandardMaterial color="#2a2520" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <torusGeometry args={[0.08, 0.02, 16, 32]} />
        <meshStandardMaterial color="#9a8d7a" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* front */}
      <mesh>
        <boxGeometry args={[1.6, 2.25, 0.02]} />
        <meshPhysicalMaterial
          map={frontTex}
          clearcoat={1}
          clearcoatRoughness={0.15}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      {/* back */}
      <mesh position={[0, 0, -0.011]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.6, 2.25]} />
        <meshPhysicalMaterial
          map={backTex}
          clearcoat={1}
          clearcoatRoughness={0.15}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

function useCanvasTexture(draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void) {
  const [tex] = useState(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 720;
    const ctx = c.getContext("2d")!;
    draw(ctx, c.width, c.height);
    const t = new THREE.CanvasTexture(c);
    t.anisotropy = 8;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  });
  return tex;
}

function drawFront(ctx: CanvasRenderingContext2D, w: number, h: number) {
  // muted nonchalant gradient bg (bone → warm taupe)
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#e8e1d6");
  g.addColorStop(0.55, "#c9bdaa");
  g.addColorStop(1, "#a89784");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // noise dots
  ctx.globalAlpha = 0.06;
  for (let i = 0; i < 600; i++) {
    ctx.fillStyle = "#3a3530";
    ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
  }
  ctx.globalAlpha = 1;

  // rounded paper panel
  roundRect(ctx, 30, 200, w - 60, h - 240, 32);
  ctx.fillStyle = "rgba(248,244,237,0.96)";
  ctx.fill();

  // avatar circle
  ctx.beginPath();
  ctx.arc(w / 2, 180, 70, 0, Math.PI * 2);
  ctx.fillStyle = "#ede5d6";
  ctx.fill();
  ctx.lineWidth = 6;
  ctx.strokeStyle = "#f8f4ed";
  ctx.stroke();
  ctx.font = "bold 64px system-ui";
  ctx.fillStyle = "#3a3530";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("R", w / 2, 184);

  // Name + role
  ctx.fillStyle = "#2a2520";
  ctx.font = "bold 42px system-ui";
  ctx.fillText("Riyansyah", w / 2, 290);
  ctx.font = "500 24px system-ui";
  ctx.fillStyle = "#9b6a4a";
  ctx.fillText("Full-Stack Developer", w / 2, 326);

  // divider
  ctx.fillStyle = "#9b6a4a";
  ctx.fillRect(w / 2 - 40, 348, 80, 4);

  // Contact lines
  ctx.font = "500 22px system-ui";
  ctx.fillStyle = "#5a544c";
  ctx.textAlign = "left";
  const x = 70;
  ctx.fillText("✉  riyansyahanugrahprtm@gmail.com", x, 410);
  ctx.fillText("📍 Majalengka, ID", x, 490);

  // socials row — muted monochrome
  const socials = ["GH", "DC", "X"];
  const colors = ["#2a2520", "#5865F2", "#2a2520"];
  socials.forEach((s, i) => {
    const cx = 70 + i * 90;
    const cy = 580;
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.fillStyle = "#f8f4ed";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 18px system-ui";
    ctx.fillText(s, cx, cy + 1);
  });

  // chip footer
  ctx.fillStyle = "#2a2520";
  ctx.fillRect(0, h - 60, w, 60);
  ctx.fillStyle = "#d6c9b3";
  ctx.font = "bold 18px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("· developer · builder · whatever ·", w / 2, h - 30);
}

function drawBack(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#ede5d6");
  g.addColorStop(1, "#b89980");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // QR-like grid
  const qrSize = 280;
  const qx = (w - qrSize) / 2;
  const qy = 140;
  ctx.fillStyle = "#f8f4ed";
  roundRect(ctx, qx - 18, qy - 18, qrSize + 36, qrSize + 36, 24);
  ctx.fill();
  const cell = qrSize / 21;
  ctx.fillStyle = "#2a2520";
  for (let i = 0; i < 21; i++) {
    for (let j = 0; j < 21; j++) {
      if (Math.random() > 0.55) {
        ctx.fillRect(qx + i * cell, qy + j * cell, cell, cell);
      }
    }
  }
  // 3 finder squares
  const finder = (fx: number, fy: number) => {
    ctx.fillStyle = "#f8f4ed";
    ctx.fillRect(fx, fy, cell * 7, cell * 7);
    ctx.fillStyle = "#2a2520";
    ctx.fillRect(fx, fy, cell * 7, cell * 7);
    ctx.fillStyle = "#f8f4ed";
    ctx.fillRect(fx + cell, fy + cell, cell * 5, cell * 5);
    ctx.fillStyle = "#2a2520";
    ctx.fillRect(fx + cell * 2, fy + cell * 2, cell * 3, cell * 3);
  };
  finder(qx, qy);
  finder(qx + cell * 14, qy);
  finder(qx, qy + cell * 14);

  // tagline
  ctx.fillStyle = "#2a2520";
  ctx.textAlign = "center";
  ctx.font = "bold 36px system-ui";
  ctx.fillText("scan, i guess.", w / 2, h - 140);
  ctx.font = "500 22px system-ui";
  ctx.fillText("i make things sometimes", w / 2, h - 100);
  ctx.font = "italic 18px system-ui";
  ctx.fillStyle = "#6b4a35";
  ctx.fillText("— code, coffee, the usual", w / 2, h - 70);
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

export function Lanyard3D() {
  return (
    <Canvas
      camera={{ position: [0, 0, 13], fov: 25 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={Math.PI} />
      <Suspense fallback={null}>
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band />
        </Physics>
        <Environment preset="city">
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Suspense>
    </Canvas>
  );
}

export function LanyardFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative">
        <div className="absolute left-1/2 top-0 h-32 w-1 -translate-x-1/2 bg-gradient-to-b from-pink to-purple" />
        <div
          className="mt-32 h-80 w-56 rotate-2 rounded-3xl bg-gradient-fun p-1 shadow-pop"
          style={{ animation: "wiggle 4s ease-in-out infinite" }}
        >
          <div className="flex h-full w-full flex-col items-center justify-center rounded-3xl bg-card p-4 text-center">
            <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-warm font-display text-3xl font-bold text-white">
              R
            </div>
            <div className="font-display text-xl font-bold">Riyansyah</div>
            <div className="text-sm text-purple">Full-Stack Developer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
