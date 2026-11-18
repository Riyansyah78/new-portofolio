import { useEffect, useState, type ComponentType } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

type LanyardProps = {
  interactive?: boolean;
  mobile?: boolean;
  onContextLost?: () => void;
};

export function LanyardClient({ mobileView = false }: { mobileView?: boolean }) {
  const isMobile = useIsMobile();
  const isActive = isMobile === mobileView;
  const [Comp, setComp] = useState<ComponentType<LanyardProps> | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!isActive) return;
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
  }, [isActive, isMobile]);

  if (!isActive || failed || !Comp) return null;

  return <Comp interactive={!isMobile} mobile={isMobile} onContextLost={() => setFailed(true)} />;
}
