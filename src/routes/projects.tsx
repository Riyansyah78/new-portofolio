import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState, type MouseEvent } from "react";
import { FloatingBlobs } from "@/components/site/blobs";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/projects")({
  head: () => ({
    meta: [
      { title: "Projects — Riyansyah" },
      {
        name: "description",
        content: "Selected work by Riyansyah: web apps, mobile, open source, and experiments.",
      },
      { property: "og:title", content: "Projects — Riyansyah" },
      {
        property: "og:description",
        content: "A curated collection of shipped products and experiments.",
      },
    ],
  }),
  component: ProjectsPage,
});

type Project = {
  title: string;
  category: "Web" | "Mobile" | "Open Source";
  desc: string;
  long: string;
  tech: string[];
  gradient: string;
  emoji: string;
  demo?: string;
  repo?: string;
};

const PROJECTS: Project[] = [
  {
    title: "Film Organizer",
    category: "Web",
    desc: "projects.filmOrganizer.desc",
    long: "projects.filmOrganizer.long",
    tech: ["React", "Vite", "Tailwind CSS"],
    gradient: "bg-gradient-cool",
    emoji: "🎬",
    repo: "https://github.com/Riyansyah78/film-organizer-react",
    demo: "https://film-organizer-nu.vercel.app",
  },
  {
    title: "PustakaConnect",
    category: "Web",
    desc: "projects.pustakaConnect.desc",
    long: "projects.pustakaConnect.long",
    tech: ["React", "Supabase", "Tailwind CSS", "Framer Motion"],
    gradient: "bg-gradient-warm",
    emoji: "📚",
    repo: "https://github.com/Riyansyah78/library-app",
    demo: "https://pustaka-connect.vercel.app/",
  },
  {
    title: "SoundCloud Clone",
    category: "Web",
    desc: "projects.soundcloudClone.desc",
    long: "projects.soundcloudClone.long",
    tech: ["React", "Supabase", "Howler.js", "Zustand"],
    gradient: "bg-gradient-fun",
    emoji: "🎵",
    repo: "https://github.com/Riyansyah78/soundcloud-clone",
    demo: "https://soundcloud-clone-psi.vercel.app/",
  },
];

const FILTERS = ["All", "Web", "Mobile", "Open Source"] as const;

function ProjectsPage() {
  const { t } = useI18n();
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [active, setActive] = useState<Project | null>(null);

  const visible = useMemo(
    () => (filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
    [filter],
  );

  const filterLabels: Record<string, string> = {
    All: t("projects.all"),
    Web: "Web",
    Mobile: "Mobile",
    "Open Source": "Open Source",
  };

  return (
    <main className="relative min-h-screen overflow-hidden pt-28 noise">
      <FloatingBlobs />
      <div className="container relative mx-auto max-w-7xl px-6 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl font-bold md:text-7xl"
        >
          {t("projects.title")} <span className="text-gradient-warm">{t("projects.work")}</span>
        </motion.h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{t("projects.subtitle")}</p>

        {/* Filters */}
        <div className="mt-10 flex flex-wrap gap-3">
          {FILTERS.map((f) => {
            const isActive = filter === f;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="relative rounded-full px-5 py-2 text-sm font-semibold transition-colors"
              >
                {isActive && (
                  <motion.span
                    layoutId="filter-pill"
                    className="absolute inset-0 rounded-full bg-foreground"
                    transition={{ type: "spring", stiffness: 300, damping: 28 }}
                  />
                )}
                <span
                  className={`relative z-10 ${isActive ? "text-background" : "text-foreground/70"}`}
                >
                  {filterLabels[f] || f}
                </span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <motion.div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => (
              <ProjectCard key={p.title} p={p} index={i} onClick={() => setActive(p)} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-foreground/60 p-4 backdrop-blur-sm"
            onClick={() => setActive(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl overflow-hidden rounded-3xl border-2 border-foreground bg-card shadow-card"
            >
              <div className={`flex h-56 items-center justify-center ${active.gradient} text-7xl`}>
                {active.emoji}
              </div>
              <div className="p-8">
                <div className="text-xs font-semibold uppercase tracking-widest text-purple">
                  {active.category}
                </div>
                <h3 className="mt-1 font-display text-3xl font-bold">{active.title}</h3>
                <p className="mt-3 text-muted-foreground">{t(active.long)}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {active.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => setActive(null)}
                    className="rounded-full border-2 border-foreground bg-background px-5 py-2.5 text-sm font-semibold"
                  >
                    {t("projects.close")}
                  </button>
                  {active.demo && (
                    <a
                      href={active.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-gradient-fun px-5 py-2.5 text-sm font-semibold text-white shadow-pop"
                    >
                      {t("projects.liveDemo")}
                    </a>
                  )}
                  {active.repo && (
                    <a
                      href={active.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background"
                    >
                      {t("projects.source")}
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function ProjectCard({ p, index, onClick }: { p: Project; index: number; onClick: () => void }) {
  const { t } = useI18n();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    setTilt({ x: y * -10, y: x * 12 });
  };
  const onLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.button
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, delay: index * 0.05 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease-out",
      }}
      className="group relative overflow-hidden rounded-3xl border-2 border-foreground bg-card text-left shadow-card"
    >
      <div
        className={`flex h-44 items-center justify-center ${p.gradient} text-6xl transition-transform duration-500 group-hover:scale-110`}
      >
        {p.emoji}
      </div>
      <div className="p-5">
        <div className="text-xs font-semibold uppercase tracking-widest text-purple">
          {p.category}
        </div>
        <div className="mt-1 font-display text-xl font-bold">{p.title}</div>
        <div className="mt-1 text-sm text-muted-foreground">{t(p.desc)}</div>
      </div>
    </motion.button>
  );
}
