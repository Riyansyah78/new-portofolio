import { useEffect, useState, type ComponentType } from "react";
import { LanyardFallback } from "./lanyard";

type LanyardProps = Record<string, never>;

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
