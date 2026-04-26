import { useEffect, useState, type ComponentType } from "react";

type LanyardProps = Record<string, never>;

// Inline fallback to avoid importing from lanyard.tsx (which pulls in Three.js)
function LanyardFallback() {
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

export function LanyardClient() {
  const [Comp, setComp] = useState<ComponentType<LanyardProps> | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Detect WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
      if (!gl) {
        setFailed(true);
        return;
      }
    } catch {
      setFailed(true);
      return;
    }
    import("./lanyard")
      .then((m) => {
        if (!cancelled) setComp(() => m.Lanyard3D);
      })
      .catch(() => setFailed(true));
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) return <LanyardFallback />;
  if (!Comp) return <LanyardFallback />;
  return <Comp />;
}
