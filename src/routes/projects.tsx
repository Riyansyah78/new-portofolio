import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import prints from "@/content/prints.json";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Work — Riyansyah" },
      {
        name: "description",
        content: "Selected work by Riyansyah: web apps, full-stack, audio experiments.",
      },
      { property: "og:title", content: "Work — Riyansyah" },
      {
        property: "og:description",
        content: "A curated collection of shipped products and experiments.",
      },
    ],
  }),
  component: WorkPage,
});

type Print = (typeof prints)[number];

const CATEGORIES = ["All", "Web", "Mobile"];

/* ── reduced-motion ────────────────────────────────────────────────── */
function usePrefersReducedMotion() {
  const [r, set] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    set(mq.matches);
    const h = (e: MediaQueryListEvent) => set(e.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return r;
}

/* ── stagger wrapper ───────────────────────────────────────────────── */
function Rise({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════════════════ */
function WorkPage() {
  const { t, locale } = useI18n();
  const reduced = usePrefersReducedMotion();
  const [filter, setFilter] = useState("All");
  const [selectedPrint, setSelectedPrint] = useState<Print | null>(null);

  /* Lock body scroll and handle Escape key when popup is open */
  useEffect(() => {
    if (!selectedPrint) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPrint(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [selectedPrint]);

  const visible = useMemo(
    () => (filter === "All" ? prints : prints.filter((p) => p.category === filter)),
    [filter],
  );

  return (
    <main className="relative min-h-screen overflow-hidden pt-28 noise">
      <div className="container relative mx-auto max-w-7xl px-6 py-12">
        <Rise>
          <h1 className="font-display text-5xl font-bold md:text-7xl">
            {t("projects.title")} <span className="text-accent">{t("projects.work")}</span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("projects.subtitle")}</p>
        </Rise>

        <Rise delay={0.1}>
          <div className="mt-8 flex flex-wrap gap-2" aria-label="Filter projects">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  filter === c
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/20 bg-background/70 text-foreground/70 hover:border-foreground/50"
                }`}
              >
                {c === "All" ? t("projects.all") : c}
              </button>
            ))}
          </div>
        </Rise>

        <Rise delay={0.15}>
          <HangHero
            prints={visible}
            reduced={reduced}
            selectedSlug={selectedPrint?.slug ?? null}
            onSelect={(p) => setSelectedPrint(p)}
          />
        </Rise>

        {/* Smooth Shared-Element Transition Popup */}
        <AnimatePresence>
          {selectedPrint && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="popup-title"
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.24 }}
                onClick={() => setSelectedPrint(null)}
                className="fixed inset-0 bg-black/60 backdrop-blur-md"
              />

              {/* Shared morphing card */}
              <motion.div
                layoutId={`card-${selectedPrint.slug}`}
                transition={{ type: "spring", stiffness: 320, damping: 30 }}
                className="relative z-10 w-full max-w-2xl overflow-hidden rounded-[2rem] border border-foreground/15 bg-card p-6 text-card-foreground shadow-[0_32px_80px_-20px_rgba(0,0,0,.6)] sm:p-8"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={() => setSelectedPrint(null)}
                  className="absolute right-5 top-5 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-foreground/15 bg-background/80 text-foreground shadow transition hover:bg-foreground hover:text-background"
                  aria-label="Close dialog"
                >
                  ✕
                </button>

                <div className="space-y-5">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-foreground/10 bg-muted">
                    <motion.img
                      layoutId={`img-${selectedPrint.slug}`}
                      src={selectedPrint.image}
                      alt={selectedPrint.title}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
                      {selectedPrint.category}
                    </span>
                    <span className="absolute right-3 top-3 rounded-full bg-background/80 px-2.5 py-1 text-xs font-medium text-foreground backdrop-blur">
                      {selectedPrint.year}
                    </span>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12, duration: 0.2 }}
                    className="text-left space-y-1.5"
                  >
                    <h2 id="popup-title" className="font-display text-2xl font-bold sm:text-3xl">
                      {selectedPrint.title}
                    </h2>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {selectedPrint.description[locale as "en" | "id"] ?? selectedPrint.description.en}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.16, duration: 0.2 }}
                    className="flex flex-wrap gap-2 pt-1"
                  >
                    {selectedPrint.tech.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium text-foreground/80 border border-foreground/10"
                      >
                        {tech}
                      </span>
                    ))}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.2 }}
                    className="flex flex-wrap items-center gap-3 pt-2"
                  >
                    {selectedPrint.demo && (
                      <a
                        href={selectedPrint.demo}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow transition-transform hover:scale-105"
                      >
                        Live Demo 
                      </a>
                    )}
                    {selectedPrint.repo && (
                      <a
                        href={selectedPrint.repo}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-foreground/20 bg-background/70 px-5 py-2.5 text-sm font-semibold text-foreground transition-transform hover:scale-105"
                      >
                        GitHub 
                      </a>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   3D HANG HERO
   wheel / drag / arrow-keys / cursor parallax / idle float / hover lift
   ═══════════════════════════════════════════════════════════════════════ */
function HangHero({
  prints: items,
  reduced,
  selectedSlug,
  onSelect,
}: {
  prints: Print[];
  reduced: boolean;
  selectedSlug: string | null;
  onSelect: (p: Print) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollX = useMotionValue(0);
  const springX = useSpring(scrollX, { stiffness: 120, damping: 26, mass: 0.8 });
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const movedRef = useRef(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  /* idle float */
  const idleOffset = useMotionValue(0);
  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const tick = () => {
      idleOffset.set(Math.sin(Date.now() / 3000) * 6);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced, idleOffset]);

  /* wheel → horizontal scroll */
  const onWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      scrollX.set(scrollX.get() - e.deltaY * 1.5);
    },
    [scrollX],
  );
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  /* arrow keys */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") scrollX.set(scrollX.get() + 320);
      if (e.key === "ArrowRight") scrollX.set(scrollX.get() - 320);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scrollX]);

  /* drag */
  const onPointerDown = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;

    e.currentTarget.setPointerCapture(e.pointerId);
    dragStartX.current = e.clientX;
    dragStartScroll.current = scrollX.get();
    setIsDragging(true);
    movedRef.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        setMousePos({
          x: (e.clientX - rect.left) / rect.width,
          y: (e.clientY - rect.top) / rect.height,
        });
      }
      return;
    }
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 5) movedRef.current = true;
    scrollX.set(dragStartScroll.current + dx);
  };
  const onPointerUp = () => setIsDragging(false);

  return (
    <div
      ref={containerRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={`relative mt-8 overflow-hidden rounded-[2rem] border border-foreground/10 bg-[radial-gradient(circle_at_1px_1px,hsl(var(--foreground)/.08)_1px,transparent_0)] [background-size:24px_24px] ${isDragging ? "cursor-grabbing" : "cursor-grab"} select-none`}
      style={{ minHeight: 380 }}
      aria-label="Draggable project showcase. Drag or use arrow keys to browse."
    >
      <div className="pointer-events-none absolute inset-0 z-10 border-[14px] border-transparent [border-image:linear-gradient(135deg,#c9c6bc,#f8f7f3_18%,#a9a69e_38%,#f7f6f1_58%,#bebbb1_78%,#f3f2ec)_1]" />
      <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-8 w-24 -translate-x-1/2 rounded-b-2xl border-x border-b border-[#a8a59b] bg-gradient-to-b from-[#f9f8f3] to-[#c5c2b8] shadow-md" />

      <motion.div className="flex items-end gap-8 px-10 py-14" style={{ x: springX }}>
        {items.map((p, i) => (
          <HangCard
            key={p.slug}
            print={p}
            index={i}
            mousePos={mousePos}
            reduced={reduced}
            idleY={idleOffset}
            movedRef={movedRef}
            isSelected={selectedSlug === p.slug}
            onSelect={() => onSelect(p)}
          />
        ))}
      </motion.div>

      <div className="pointer-events-none absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-foreground/10 bg-background/85 px-4 py-2 text-xs text-muted-foreground backdrop-blur">
        Drag · Scroll · Arrow keys · Click to open
      </div>
    </div>
  );
}

/* ── Hang card ──────────────────────────────────────────────────────── */
function HangCard({
  print: p,
  index,
  mousePos,
  reduced,
  movedRef,
  isSelected,
  onSelect,
}: {
  print: Print;
  index: number;
  mousePos: { x: number; y: number };
  reduced: boolean;
  idleY: ReturnType<typeof useMotionValue>;
  movedRef: React.MutableRefObject<boolean>;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const px = reduced ? 0 : (mousePos.x - 0.5) * 8;
  const py = reduced ? 0 : (mousePos.y - 0.5) * 5;
  const hoverTilt = index % 2 === 0 ? -4 : 4;

  return (
    <motion.div
      className="group relative w-[min(72vw,300px)] flex-shrink-0 sm:w-[280px]"
      style={{ transformOrigin: "50% -56px" }}
      whileHover={
        isSelected
          ? {}
          : {
              rotate: hoverTilt,
              y: -6,
              transition: { type: "spring", stiffness: 240, damping: 15, mass: 0.7 },
            }
      }
    >
      <div className="absolute -top-14 left-1/2 h-14 w-px -translate-x-1/2 bg-gradient-to-b from-[#c3c0b5] via-[#858279] to-[#c3c0b5]" />
      <div className="absolute -top-1 left-1/2 z-10 h-3 w-7 -translate-x-1/2 rounded-full border border-[#8d8a82] bg-gradient-to-b from-white to-[#aaa79e] shadow-md" />

      <button
        type="button"
        onClick={() => {
          if (!movedRef.current) onSelect();
        }}
        className="block w-full cursor-pointer text-left focus:outline-none"
        aria-label={`Open popup for ${p.title}`}
      >
        <div
          style={{
            transform: reduced ? "none" : `perspective(800px) rotateX(${py}deg) rotateY(${px}deg)`,
            transformOrigin: "top center",
            transition: "transform 0.15s ease-out",
          }}
        >
          <motion.div
            layoutId={`card-${p.slug}`}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            className="overflow-hidden rounded-[1.2rem] border border-foreground/15 bg-[#f2f1ed] p-2.5 pt-5 text-[#20211e] shadow-[0_22px_60px_-24px_rgba(0,0,0,.48)]"
          >
            <div className="relative aspect-[1.6/1] overflow-hidden rounded-[0.9rem] bg-[#d9d8d1]">
              <motion.img
                layoutId={`img-${p.slug}`}
                src={p.image}
                alt={`${p.title} preview`}
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
              />
              <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-black shadow-md transition-all group-hover:scale-105">
                View 
              </span>
            </div>
            <div className="flex items-end justify-between gap-4 px-2 pb-2 pt-3">
              <div>
                <div className="font-display text-lg font-bold tracking-tight">{p.title}</div>
                <div className="mt-1 line-clamp-1 text-xs text-[#696963]">{p.tech.join(" · ")}</div>
              </div>
              <span className="shrink-0 pb-0.5 text-[10px] font-medium uppercase tracking-widest text-[#77766f]">
                0{index + 1}
              </span>
            </div>
          </motion.div>
        </div>
      </button>
    </motion.div>
  );
}
