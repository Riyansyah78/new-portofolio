import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { LanyardClient } from "@/components/site/lanyard-client";
import { FloatingBlobs } from "@/components/site/blobs";
import { SkillMarquee } from "@/components/site/marquee";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Riyansyah - I build delightful things" },
      {
        name: "description",
        content:
          "Hi, I'm Riyansyah — a developer crafting playful, performant web experiences. Drag the lanyard to say hi.",
      },
      { property: "og:title", content: "Riyansyah — I build delightful things" },
      {
        property: "og:description",
        content: "Playful, interactive developer portfolio with a draggable 3D business card.",
      },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t } = useI18n();

  const words = t("home.words").split(" ");

  return (
    <main className="relative min-h-screen overflow-hidden">
      <section className="relative isolate min-h-screen pt-28 noise">
        <FloatingBlobs />
        <div className="container mx-auto grid max-w-7xl grid-cols-1 items-center gap-8 px-6 py-10 md:grid-cols-2 md:py-16">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/70 px-4 py-1.5 text-xs font-medium backdrop-blur-md"
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-mint" />
              {t("home.badge")}
            </motion.div>

            <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl lg:text-8xl">
              {words.map((w, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 30, rotate: -4 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{
                    delay: 0.2 + i * 0.07,
                    type: "spring",
                    stiffness: 120,
                    damping: 14,
                  }}
                  className={`mr-3 inline-block ${i === words.length - 2 ? "text-gradient-fun" : ""} ${i === words.length - 1 ? "text-gradient-warm" : ""}`}
                >
                  {w}
                </motion.span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl"
            >
              {t("home.desc")}{" "}
              <span className="font-semibold text-foreground">{t("home.alive")}</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/projects"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform hover:scale-105"
              >
                {t("home.seeWork")}
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-full border-2 border-foreground bg-background px-6 py-3 text-sm font-semibold text-foreground transition-transform hover:scale-105"
              >
                {t("home.sayHi")}
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="mt-10 hidden items-center gap-2 text-sm text-muted-foreground md:flex"
            >
              <span className="text-2xl animate-bounce-soft">👉</span>
              {t("home.dragHint")}
            </motion.div>
          </div>

          <div className="relative h-[520px] w-full md:h-[640px]">
            <LanyardClient />
          </div>
        </div>
      </section>

      <SkillMarquee />

      <section className="relative px-6 py-24">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl font-bold md:text-6xl"
          ></motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/about"
              className="rounded-full bg-gradient-fun px-7 py-3 font-semibold text-white shadow-pop hover:scale-105 transition-transform"
            >
              {t("home.aboutMe")}
            </Link>
            <Link
              to="/projects"
              className="rounded-full bg-gradient-cool px-7 py-3 font-semibold text-white shadow-pop hover:scale-105 transition-transform"
            >
              {t("home.projects")}
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
