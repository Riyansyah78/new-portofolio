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

function FloatingCard() {
  const group = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = clock.elapsedTime;
    group.current.position.y = Math.sin(t * 1.1) * 0.1;
    group.current.rotation.x = Math.sin(t * 0.55) * 0.035;
    group.current.rotation.y = Math.sin(t * 0.4) * 0.06;
  });

  return (
    <group ref={group} position={[0, -0.25, 2.2]}>
      <group scale={0.45} position={[0, -0.6, -0.05]}>
        <CardMesh />
      </group>
    </group>
  );
}

function Band({
  interactive = true,
  mobile = false,
  maxSpeed = 50,
  minSpeed = 10,
}: {
  interactive?: boolean;
  mobile?: boolean;
  maxSpeed?: number;
  minSpeed?: number;
}) {
  if (mobile) return <FloatingCard />;
  return (
    <Physics interpolate gravity={[0, -40, 0]} timeStep={1 / 60}>
      <PhysicsBand interactive={interactive} maxSpeed={maxSpeed} minSpeed={minSpeed} />
    </Physics>
  );
}

function PhysicsBand({
  interactive = true,
  maxSpeed = 50,
  minSpeed = 10,
}: {
  interactive?: boolean;
  maxSpeed?: number;
  minSpeed?: number;
}) {
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
  const linkLength = 1;
  const linkStep = linkLength / 2;

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
  useRopeJoint(fixed as any, j1 as any, [[0, 0, 0], [0, 0, 0], linkStep]);
  useRopeJoint(j1 as any, j2 as any, [[0, 0, 0], [0, 0, 0], linkStep]);
  useRopeJoint(j2 as any, j3 as any, [[0, 0, 0], [0, 0, 0], linkStep]);
  useSphericalJoint(j3 as any, card as any, [
    [0, 0, 0],
    [0, 0.66, -0.05],
  ]);

  useEffect(() => {
    if (!interactive || !hovered) return;
    document.body.style.cursor = dragged ? "grabbing" : "grab";
    return () => {
      document.body.style.cursor = "auto";
    };
  }, [hovered, dragged, interactive]);

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
      clipL.set(-0.03, 0.63, -0.05).applyQuaternion(quat);
      clipR.set(0.03, 0.63, -0.05).applyQuaternion(quat);

      curveL.points[3].set(fixedPos.x - 0.55, fixedPos.y, fixedPos.z);
      curveL.points[2].set(j1Pos.x - 0.35, j1Pos.y, j1Pos.z);
      curveL.points[1].set(j2Pos.x - 0.15, j2Pos.y, j2Pos.z);
      curveR.points[3].set(fixedPos.x + 0.55, fixedPos.y, fixedPos.z);
      curveR.points[2].set(j1Pos.x + 0.35, j1Pos.y, j1Pos.z);
      curveR.points[1].set(j2Pos.x + 0.15, j2Pos.y, j2Pos.z);
      curveL.points[0].set(cardPos.x + clipL.x, cardPos.y + clipL.y, cardPos.z + clipL.z);
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
      <group position={[2, 2.1, 0]}>
        <RigidBody position={[0, 0, 0]} ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0, -linkStep, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -linkLength, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[0, -linkLength * 1.5, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>

        <RigidBody
          position={[0, -2.25, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.92, 1.29, 0.01]} position={[0, -0.6, -0.03]} />
          <group
            scale={1.05}
            position={[0, -0.6, -0.05]}
            onPointerOver={interactive ? () => hover(true) : undefined}
            onPointerOut={interactive ? () => hover(false) : undefined}
            onPointerUp={
              interactive
                ? (e: any) => {
                    (e.target as Element).releasePointerCapture?.(e.pointerId);
                    drag(false);
                  }
                : undefined
            }
            onPointerCancel={
              interactive
                ? (e: any) => {
                    (e.target as Element).releasePointerCapture?.(e.pointerId);
                    drag(false);
                  }
                : undefined
            }
            onPointerDown={
              interactive
                ? (e: any) => {
                    (e.target as Element).setPointerCapture?.(e.pointerId);
                    if (!card.current) return;
                    const t = card.current.translation();
                    drag(new THREE.Vector3().copy(e.point).sub(new THREE.Vector3().copy(t as any)));
                  }
                : undefined
            }
          >
            <CardMesh />
          </group>
        </RigidBody>
      </group>
      <mesh ref={bandL}>
        <meshStandardMaterial
          color="#596574"
          roughness={0.85}
          metalness={0}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={bandR}>
        <meshStandardMaterial
          color="#596574"
          roughness={0.85}
          metalness={0}
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
        <meshStandardMaterial color="#435570" metalness={0.15} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.05, 0]}>
        <torusGeometry args={[0.08, 0.02, 16, 32]} />
        <meshStandardMaterial color="#b9b397" metalness={0.3} roughness={0.55} />
      </mesh>
      {/* front */}
      <mesh>
        <boxGeometry args={[1.6, 2.25, 0.02]} />
        <meshPhysicalMaterial
          map={frontTex}
          clearcoat={0.15}
          clearcoatRoughness={0.7}
          roughness={0.75}
          metalness={0}
        />
      </mesh>
      {/* back */}
      <mesh position={[0, 0, -0.011]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[1.6, 2.25]} />
        <meshPhysicalMaterial
          map={backTex}
          clearcoat={0.15}
          clearcoatRoughness={0.7}
          roughness={0.75}
          metalness={0}
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

function drawFront(ctx: CanvasRenderingContext2D, w: number, h: number, _tex: THREE.CanvasTexture) {
  const navy = "#435570";
  const yellow = "#c5c19e";
  const coral = "#bf806d";
  const ink = "#283d68";

  ctx.fillStyle = navy;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = yellow;
  ctx.fillRect(16, 16, w - 32, h - 32);
  ctx.fillStyle = "#d5d0b5";
  ctx.fillRect(25, 25, w - 50, h - 50);
  ctx.fillStyle = yellow;
  ctx.fillRect(32, 32, w - 64, h - 64);

  // Pixel-style portfolio header
  ctx.fillStyle = navy;
  ctx.fillRect(40, 42, w - 80, 62);
  ctx.fillStyle = coral;
  ctx.fillRect(53, 57, 12, 12);
  ctx.fillRect(69, 73, 8, 8);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 27px ui-monospace, monospace";
  ctx.fillText("PLAYER 01", w / 2, 73);

  // Pixel portrait on a stepped arcade tile
  ctx.fillStyle = navy;
  ctx.fillRect(142, 135, 228, 222);
  ctx.fillStyle = "#c7bea0";
  ctx.fillRect(154, 147, 204, 198);
  ctx.fillStyle = "#435570";
  ctx.fillRect(166, 159, 12, 12);
  ctx.fillRect(334, 159, 12, 12);
  ctx.fillRect(166, 321, 12, 12);
  ctx.fillRect(334, 321, 12, 12);

  const sprite = [
    "....CCCC....",
    "..CCCCCCCC..",
    ".CCCPPPPPPCC.",
    "CCCPPPPPPPPCC",
    "CCPOOOOOOOOPCC",
    "CCPOBOOBOOPCC",
    "CCPOOOOOOOOPCC",
    ".CCPOOMMOPCC.",
    "..CCPPPPPPCC..",
    "...CCCCCC....",
  ];
  const pixel = 15;
  const spriteTop = 178;
  const pixelColors: Record<string, string> = {
    C: coral,
    P: "#b87565",
    O: "#e2cdb5",
    B: navy,
    M: "#c47c78",
  };
  sprite.forEach((row, rowIndex) => {
    const startX = (w - row.length * pixel) / 2;
    [...row].forEach((cell, columnIndex) => {
      if (cell === ".") return;
      ctx.fillStyle = pixelColors[cell];
      ctx.fillRect(startX + columnIndex * pixel, spriteTop + rowIndex * pixel, pixel, pixel);
    });
  });

  // Pixel sparkle accents
  ctx.fillStyle = coral;
  ctx.fillRect(111, 197, 8, 24);
  ctx.fillRect(103, 205, 24, 8);
  ctx.fillStyle = navy;
  ctx.fillRect(388, 274, 8, 24);
  ctx.fillRect(380, 282, 24, 8);

  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 43px ui-monospace, monospace";
  ctx.fillText("Riyansyah", w / 2, 400);
  ctx.font = "bold 19px ui-monospace, monospace";
  ctx.fillText("FULL-STACK DEVELOPER", w / 2, 438);

  // Chunky pixel divider
  ctx.fillStyle = navy;
  ctx.fillRect(148, 465, 216, 6);
  ctx.fillStyle = coral;
  ctx.fillRect(148, 465, 28, 6);
  ctx.fillRect(336, 465, 28, 6);

  // Contact details retained from original badge
  ctx.fillStyle = navy;
  ctx.fillRect(66, 498, 24, 24);
  ctx.fillStyle = yellow;
  ctx.font = "bold 13px ui-monospace, monospace";
  ctx.textAlign = "center";
  ctx.fillText("@", 78, 510);
  ctx.fillStyle = ink;
  ctx.textAlign = "left";
  ctx.font = "16px ui-monospace, monospace";
  ctx.fillText("riyansyahanugrahprtm@gmail.com", 101, 511);

  ctx.fillStyle = navy;
  ctx.fillRect(66, 538, 24, 24);
  ctx.fillStyle = yellow;
  ctx.textAlign = "center";
  ctx.font = "bold 13px ui-monospace, monospace";
  ctx.fillText("+", 78, 550);
  ctx.fillStyle = ink;
  ctx.textAlign = "left";
  ctx.font = "bold 16px ui-monospace, monospace";
  ctx.fillText("Majalengka, ID", 101, 551);

  const socials = ["GH", "DC", "X"];
  socials.forEach((social, index) => {
    const x = 147 + index * 78;
    ctx.fillStyle = navy;
    ctx.fillRect(x, 584, 54, 38);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "bold 16px ui-monospace, monospace";
    ctx.fillText(social, x + 27, 603);
  });

  ctx.fillStyle = navy;
  ctx.fillRect(40, h - 66, w - 80, 34);
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "bold 16px ui-monospace, monospace";
  ctx.fillText("CODE  ·  CREATE  ·  REPEAT", w / 2, h - 49);
}

function drawBack(ctx: CanvasRenderingContext2D, w: number, h: number, tex: THREE.CanvasTexture) {
  const navy = "#435570";
  const yellow = "#c5c19e";
  ctx.fillStyle = navy;
  ctx.fillRect(0, 0, w, h);

  const qrSize = 280;
  const qx = (w - qrSize) / 2;
  const qy = 140;

  // Pixel-frame around retained CV QR code
  ctx.fillStyle = yellow;
  ctx.fillRect(qx - 24, qy - 24, qrSize + 48, qrSize + 48);
  ctx.fillStyle = "#d5d0b5";
  ctx.fillRect(qx - 14, qy - 14, qrSize + 28, qrSize + 28);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(qx - 8, qy - 8, qrSize + 16, qrSize + 16);

  // Load actual QR code from public folder
  const img = new Image();
  img.src = "/cv-qr.png";
  img.onload = () => {
    ctx.drawImage(img, qx, qy, qrSize, qrSize);
    tex.needsUpdate = true;
  };

  ctx.fillStyle = yellow;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 23px ui-monospace, monospace";
  ctx.fillText("PLAYER 01 · CV ACCESS", w / 2, 76);
  ctx.font = "bold 30px ui-monospace, monospace";
  ctx.fillText("SCAN FOR CV", w / 2, h - 145);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 19px ui-monospace, monospace";
  ctx.fillText("Riyansyah Anugrah Pratama", w / 2, h - 104);
  ctx.font = "16px ui-monospace, monospace";
  ctx.fillText("FULL-STACK DEVELOPER", w / 2, h - 69);
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

export function Lanyard3D({
  interactive = true,
  mobile = false,
  onContextLost,
}: {
  interactive?: boolean;
  mobile?: boolean;
  onContextLost?: () => void;
}) {
  return (
    <Canvas
      style={{
        touchAction: interactive ? "none" : "pan-y",
        width: "100%",
        height: "100%",
      }}
      camera={{ position: [0, 0, mobile ? 8.5 : 9], fov: 25 }}
      gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
      dpr={[1, 1.5]}
      onCreated={({ gl }) => {
        gl.domElement.style.width = "100%";
        gl.domElement.style.height = "100%";
        gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          console.warn("WebGL context lost — switching to fallback");
          onContextLost?.();
        });
      }}
    >
      <ambientLight intensity={1.5} />
      <Suspense fallback={null}>
        <Band interactive={interactive} mobile={mobile} />
        <directionalLight intensity={1.8} position={[0, -1, 5]} />
        <directionalLight intensity={1.2} position={[-1, -1, 1]} />
        <directionalLight intensity={1.2} position={[1, 1, 1]} />
        <directionalLight intensity={1.5} position={[-10, 0, 14]} />
      </Suspense>
    </Canvas>
  );
}
