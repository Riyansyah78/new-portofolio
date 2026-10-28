/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef, useState, Suspense, useMemo } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
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
  const fixed = useRef<RapierRigidBody>(null);
  const j1 = useRef<RapierRigidBody>(null);
  const j2 = useRef<RapierRigidBody>(null);
  const j3 = useRef<RapierRigidBody>(null);
  const card = useRef<RapierRigidBody>(null);

  const vec = new THREE.Vector3();
  const ang = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const quat = new THREE.Quaternion();
  const clipL = new THREE.Vector3();
  const clipR = new THREE.Vector3();

  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  };

  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);

  // Single central chain — stable Rapier constraints without joint fighting or twisted slack
  useRopeJoint(fixed as any, j1 as any, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1 as any, j2 as any, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2 as any, j3 as any, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3 as any, card as any, [
    [0, 0, 0],
    [0, 0.78, 0],
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
      [card, j1, j2, j3, fixed].forEach((r) => r.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: vec.x - (dragged as THREE.Vector3).x,
        y: vec.y - (dragged as THREE.Vector3).y,
        z: vec.z - (dragged as THREE.Vector3).z,
      });
    }
    if (
      fixed.current &&
      j1.current &&
      j2.current &&
      j3.current &&
      card.current &&
      bandL.current &&
      bandR.current
    ) {
      [j1, j2].forEach((ref) => {
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

      const fixedPos = fixed.current.translation();
      // @ts-ignore
      const j1Pos = j1.current.lerped ?? j1.current.translation();
      // @ts-ignore
      const j2Pos = j2.current.lerped ?? j2.current.translation();
      const cardPos = card.current.translation();
      const cardRot = card.current.rotation();
      quat.set(cardRot.x, cardRot.y, cardRot.z, cardRot.w);

      // Clip attachment points in card-local space, rotated to world
      clipL.set(-0.03, 0.78, 0).applyQuaternion(quat);
      clipR.set(0.03, 0.78, 0).applyQuaternion(quat);

      // Left strap: hangs from top-left anchor into left side of clip
      curveL.points[3].set(fixedPos.x - 0.55, fixedPos.y, fixedPos.z);
      curveL.points[2].set(j1Pos.x - 0.35, j1Pos.y, j1Pos.z);
      curveL.points[1].set(j2Pos.x - 0.15, j2Pos.y, j2Pos.z);
      curveL.points[0].set(cardPos.x + clipL.x, cardPos.y + clipL.y, cardPos.z + clipL.z);

      // Right strap: hangs from top-right anchor into right side of clip
      curveR.points[3].set(fixedPos.x + 0.55, fixedPos.y, fixedPos.z);
      curveR.points[2].set(j1Pos.x + 0.35, j1Pos.y, j1Pos.z);
      curveR.points[1].set(j2Pos.x + 0.15, j2Pos.y, j2Pos.z);
      curveR.points[0].set(cardPos.x + clipR.x, cardPos.y + clipR.y, cardPos.z + clipR.z);

      const oldGeoL = bandL.current.geometry;
      bandL.current.geometry = new THREE.ExtrudeGeometry(shape, {
        extrudePath: curveL,
        steps: 16,
      });
      oldGeoL?.dispose();

      const oldGeoR = bandR.current.geometry;
      bandR.current.geometry = new THREE.ExtrudeGeometry(shape, {
        extrudePath: curveR,
        steps: 16,
      });
      oldGeoR?.dispose();

      ang.copy(card.current.angvel());
      let targetAngvelY = 0.6;
      if (dragged) {
        targetAngvelY = ang.y;
      } else {
        // Maintain smooth, constant showcase spin speed without unbounded acceleration
        targetAngvelY = THREE.MathUtils.lerp(ang.y, 0.6, Math.min(1, delta * 3));
        card.current.wakeUp();
      }
      const targetAngvelX = THREE.MathUtils.lerp(ang.x, 0, Math.min(1, delta * 4));
      const targetAngvelZ = THREE.MathUtils.lerp(ang.z, 0, Math.min(1, delta * 4));
      card.current.setAngvel({ x: targetAngvelX, y: targetAngvelY, z: targetAngvelZ }, true);
    }
  });

  curveL.curveType = "chordal";
  curveR.curveType = "chordal";

  return (
    <>
      <group position={[2, 4, 0]}>
        <RigidBody position={[0, 0, 0]} ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0, -0.5, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -1, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -1.5, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          position={[0, -2, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.92, 1.29, 0.01]} position={[0, -0.6, -0.03]} />
          <group
            scale={1.15}
            position={[0, -0.6, -0.05]}
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
          color="#111318"
          roughness={0.5}
          metalness={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={bandR}>
        <meshStandardMaterial
          color="#111318"
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
        <meshStandardMaterial color="#181b24" metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <torusGeometry args={[0.08, 0.02, 16, 32]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.95} roughness={0.15} />
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

function useCanvasTexture(
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, tex: THREE.CanvasTexture) => void,
) {
  const [tex] = useState(() => {
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 720;
    const ctx = c.getContext("2d")!;
    const t = new THREE.CanvasTexture(c);
    draw(ctx, c.width, c.height, t);
    t.anisotropy = 8;
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  });
  return tex;
}

function drawFront(ctx: CanvasRenderingContext2D, w: number, h: number, tex: THREE.CanvasTexture) {
  // Sleek tech badge gradient (deep graphite / obsidian with subtle indigo tint)
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#0e1017");
  g.addColorStop(0.6, "#141724");
  g.addColorStop(1, "#1a1d2e");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // Subtle tech grid pattern
  ctx.strokeStyle = "rgba(148, 152, 162, 0.08)";
  ctx.lineWidth = 1;
  const gridSize = 32;
  for (let x = 0; x < w; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  for (let y = 0; y < h; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
    ctx.stroke();
  }

  // Inner card panel
  roundRect(ctx, 30, 200, w - 60, h - 240, 28);
  ctx.fillStyle = "#121520";
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 2;
  ctx.stroke();

  // avatar circle
  ctx.beginPath();
  ctx.arc(w / 2, 180, 70, 0, Math.PI * 2);
  ctx.fillStyle = "#1a1e2d";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#ffffffff";
  ctx.stroke();
  ctx.font = "bold 64px system-ui";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("R", w / 2, 184);

  // Name + role
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 42px system-ui";
  ctx.fillText("Riyansyah", w / 2, 290);
  ctx.font = "600 22px system-ui";
  ctx.fillStyle = "#fdfdfdff";
  ctx.fillText("Full-Stack Developer", w / 2, 326);

  // divider
  ctx.fillStyle = "#a1a1aa";
  ctx.fillRect(w / 2 - 36, 348, 72, 3);

  // Contact lines
  ctx.font = "500 21px system-ui";
  ctx.fillStyle = "#94a3b8";
  ctx.textAlign = "left";
  const x = 70;

  // Mail icon (drawn via canvas path)
  ctx.save();
  ctx.translate(x, 397);
  ctx.strokeStyle = "#a1a1aa";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(0, 0, 18, 14, 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(9, 7);
  ctx.lineTo(18, 0);
  ctx.stroke();
  ctx.restore();
  ctx.fillText("riyansyahanugrahprtm@gmail.com", x + 26, 410);

  // Map pin icon (drawn via canvas path)
  ctx.save();
  ctx.translate(x, 476);
  ctx.fillStyle = "#a1a1aa";
  ctx.beginPath();
  ctx.moveTo(8, 18);
  ctx.bezierCurveTo(8, 18, 0, 10, 0, 6);
  ctx.arc(8, 6, 8, Math.PI, 0, false);
  ctx.bezierCurveTo(16, 10, 8, 18, 8, 18);
  ctx.fill();
  ctx.fillStyle = "#121520";
  ctx.beginPath();
  ctx.arc(8, 6, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("Majalengka, ID", x + 24, 490);

  // socials row
  const socials = ["GH", "DC", "X"];
  const colors = ["#1e2232", "#5865F2", "#1e2232"];
  socials.forEach((s, i) => {
    const cx = 70 + i * 90;
    const cy = 580;
    ctx.beginPath();
    ctx.arc(cx, cy, 32, 0, Math.PI * 2);
    ctx.fillStyle = colors[i];
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 18px system-ui";
    ctx.fillText(s, cx, cy + 1);
  });

  // chip footer
  ctx.fillStyle = "#0a0c12";
  ctx.fillRect(0, h - 60, w, 60);
  ctx.fillStyle = "#ffffffff";
  ctx.font = "bold 17px system-ui";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("· developer · builder · whatever ·", w / 2, h - 30);
}

function drawBack(ctx: CanvasRenderingContext2D, w: number, h: number, tex: THREE.CanvasTexture) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, "#0e1017");
  g.addColorStop(1, "#181b28");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  const qrSize = 280;
  const qx = (w - qrSize) / 2;
  const qy = 140;

  // Background box for QR code
  ctx.fillStyle = "#ffffff";
  roundRect(ctx, qx - 18, qy - 18, qrSize + 36, qrSize + 36, 20);
  ctx.fill();

  // Load actual QR code from public folder
  const img = new Image();
  img.src = "/cv-qr.png";
  img.onload = () => {
    ctx.drawImage(img, qx, qy, qrSize, qrSize);
    tex.needsUpdate = true;
  };

  // tagline
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "bold 34px system-ui";
  ctx.fillText("scan to get my cv", w / 2, h - 140);
  ctx.font = "500 22px system-ui";
  ctx.fillText("Riyansyah Anugrah Pratama", w / 2, h - 100);
  ctx.font = "italic 18px system-ui";
  ctx.fillStyle = "#ffffffff";
  ctx.fillText("full-stack developer", w / 2, h - 70);
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

export function Lanyard3D({ onContextLost }: { onContextLost?: () => void }) {
  return (
    <Canvas
      style={{ touchAction: "none" }}
      camera={{ position: [0, 0, 9], fov: 25 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          console.warn("WebGL context lost — switching to fallback");
          onContextLost?.();
        });
      }}
    >
      <ambientLight intensity={Math.PI} />
      <Suspense fallback={null}>
        <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
          <Band />
        </Physics>
        <directionalLight intensity={4} position={[0, -1, 5]} />
        <directionalLight intensity={5} position={[-1, -1, 1]} />
        <directionalLight intensity={5} position={[1, 1, 1]} />
        <directionalLight intensity={8} position={[-10, 0, 14]} />
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
