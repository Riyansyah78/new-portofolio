import { useEffect, useRef } from "react";

export function FluidBackground() {
  const mouseRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let rafId: number;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handlePointerMove = (e: PointerEvent) => {
      targetX = (e.clientX - window.innerWidth / 2) * 0.12;
      targetY = (e.clientY - window.innerHeight / 2) * 0.12;
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.04;
      currentY += (targetY - currentY) * 0.04;
      if (mouseRef.current) {
        mouseRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Noise grain overlay */}
      <div className="noise absolute inset-0 opacity-40 dark:opacity-20" />

      {/* Fluid Orb 1: Electric Indigo & Violet (top-left) */}
      <div
        className="absolute -top-[15%] -left-[10%] h-[65vw] w-[65vw] max-h-[750px] max-w-[750px] animate-fluid-1 rounded-full opacity-25 blur-[90px] md:blur-[140px] dark:opacity-20"
        style={{
          background: "radial-gradient(circle at 30% 30%, var(--purple), var(--blue))",
        }}
      />

      {/* Fluid Orb 2: Electric Cyan & Slate Blue (top-right) */}
      <div
        className="absolute top-[10%] -right-[15%] h-[60vw] w-[60vw] max-h-[700px] max-w-[700px] animate-fluid-2 rounded-full opacity-20 blur-[90px] md:blur-[140px] dark:opacity-20"
        style={{
          background: "radial-gradient(circle at 70% 30%, var(--cyan), var(--blue))",
        }}
      />

      {/* Fluid Orb 3: Deep Slate & Violet (bottom-left) */}
      <div
        className="absolute -bottom-[20%] -left-[10%] h-[60vw] w-[60vw] max-h-[700px] max-w-[700px] animate-fluid-3 rounded-full opacity-20 blur-[90px] md:blur-[140px] dark:opacity-20"
        style={{
          background: "radial-gradient(circle at 40% 60%, var(--blue), var(--purple))",
        }}
      />

      {/* Fluid Orb 4: Cool Mint & Mist Cyan (bottom-right) */}
      <div
        className="absolute -bottom-[15%] right-[10%] h-[55vw] w-[55vw] max-h-[650px] max-w-[650px] animate-fluid-4 rounded-full opacity-15 blur-[90px] md:blur-[140px] dark:opacity-15"
        style={{
          background: "radial-gradient(circle at 60% 40%, var(--cyan), var(--mint))",
        }}
      />

      {/* Interactive mouse-reactive fluid center orb */}
      <div
        ref={mouseRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 will-change-transform"
      >
        <div
          className="h-[45vw] w-[45vw] max-h-[550px] max-w-[550px] animate-blob rounded-full opacity-20 blur-[90px] md:blur-[130px] dark:opacity-15"
          style={{
            background: "radial-gradient(circle at 50% 50%, var(--purple), var(--cyan))",
          }}
        />
      </div>
    </div>
  );
}

export const FloatingBlobs = FluidBackground;
