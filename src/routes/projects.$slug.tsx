import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import prints from "@/content/prints.json";

export const Route = createFileRoute("/projects/$slug")({
  head: ({ params }) => {
    const p = prints.find((x) => x.slug === params.slug);
    return {
      meta: [
        { title: p ? `${p.title} — Riyansyah` : "Project — Riyansyah" },
        {
          name: "description",
          content: p?.description.en || "Project detail page.",
        },
      ],
    };
  },
  component: PrintPage,
});

function PrintPage() {
  const { slug } = Route.useParams();
  const { locale } = useI18n();
  const navigate = useNavigate();
  const idx = prints.findIndex((p) => p.slug === slug);
  const print = prints[idx];

  if (!print) {
    return (
      <main className="flex min-h-screen items-center justify-center noise">
        <div className="text-center">
          <h1 className="font-display text-4xl font-bold">Not found</h1>
          <Link to="/projects" className="mt-4 inline-block text-accent underline">
            ← Back to work
          </Link>
        </div>
      </main>
    );
  }

  const next = prints[(idx + 1) % prints.length];
  const desc = locale === "id" ? print.long.id : print.long.en;

  return (
    <main className="relative min-h-screen overflow-hidden pt-28 noise">
      <div className="container relative mx-auto max-w-6xl px-6 py-12">
        {/* ── Plate viewer ─────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden rounded-3xl border border-foreground/10 bg-muted"
        >
          {/* extra frames bar */}
          <div className="flex gap-2 border-b border-foreground/10 bg-background/50 p-3">
            <div className="h-12 w-20 overflow-hidden rounded-lg border border-foreground/15 bg-muted">
              <img
                src={print.image}
                alt=""
                className="h-full w-full object-cover opacity-80"
              />
            </div>
          </div>

          {/* main image */}
          <div className="relative aspect-video">
            <img
              src={print.image}
              alt={`${print.title} full preview`}
              className="h-full w-full object-contain p-4"
            />
          </div>

          {/* camera / settings bar */}
          <div className="flex items-center justify-between border-t border-foreground/10 bg-background/50 px-5 py-3 text-xs text-muted-foreground">
            <span>
              🔍 1× · <span className="hidden sm:inline">⚙️ Settings</span>
            </span>
            <span>
              {print.series} · {print.edition}
            </span>
          </div>
        </motion.div>

        {/* ── Details ──────────────────────────────────── */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_auto]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              {print.category}
            </div>
            <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">{print.title}</h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{desc}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {print.tech.map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-4 text-sm text-muted-foreground">
              {print.series} · {print.edition} · {print.year}
            </div>
          </motion.div>

          {/* ── Enquire / Next ─────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex flex-col gap-3"
          >
            {print.demo && (
              <a
                href={print.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background shadow-pop transition-transform hover:scale-105"
              >
                Live Demo
              </a>
            )}
            {print.repo && (
              <a
                href={print.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-foreground/20 px-6 py-3 text-sm font-semibold transition-transform hover:scale-105 hover:bg-muted"
              >
                Source Code
              </a>
            )}
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border border-foreground/20 px-6 py-3 text-sm font-semibold transition-transform hover:scale-105 hover:bg-muted"
            >
              Enquire
            </Link>
            <button
              type="button"
              onClick={() =>
                navigate({ to: "/projects/$slug", params: { slug: next.slug } })
              }
              className="inline-flex items-center justify-center rounded-full border border-foreground/20 px-6 py-3 text-sm font-semibold transition-transform hover:scale-105 hover:bg-muted"
            >
              Next  {next.title}
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="mt-12"
        >
          <Link
            to="/projects"
            className="text-sm text-muted-foreground underline transition-colors hover:text-foreground"
          >
            Back to all work
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
