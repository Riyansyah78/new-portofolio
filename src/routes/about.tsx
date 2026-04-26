import { createFileRoute } from "@tanstack/react-router";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";
import { FloatingBlobs } from "@/components/site/blobs";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About - Riyansyah, Full-Stack Developer" },
      {
        name: "description",
        content:
          "About Riyansyah: 3+ years building products with Javascript, React, Typescript, Node.js, and a love for playful UX.",
      },
      { property: "og:title", content: "About - Riyansyah" },
      {
        property: "og:description",
        content: "Journey, skills, and stats of a full-stack developer.",
      },
    ],
  }),
  component: AboutPage,
});

const skills = {
  Frontend: [
    { name: "React", color: "bg-cyan" },
    { name: "TypeScript", color: "bg-blue" },
    { name: "Tailwind", color: "bg-mint" },
    { name: "Next.js", color: "bg-foreground text-background" },
  ],
  Backend: [
    { name: "Node.js", color: "bg-mint" },
    { name: "PostgreSQL", color: "bg-blue" },
    { name: "MySQL", color: "bg-blue" },
  ],
  Tools: [
    { name: "Figma", color: "bg-pink" },
    { name: "Vite", color: "bg-yellow" },
    { name: "Git", color: "bg-mint" },
  ],
};

const timeline = [
  {
    year: "2024",
    titleEn: "IT Support",
    titleId: "IT Support",
    descEn: "Helpdesk & Desktop Support",
    descId: "Helpdesk & Desktop Support",
  },
];

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1500, bounce: 0 });
  const display = useTransform(spring, (v) => Math.floor(v).toString());

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, mv, to]);

  return (
    <span ref={ref} className="font-display text-5xl font-bold md:text-7xl">
      <motion.span>{display}</motion.span>
      {suffix}
    </span>
  );
}

function AboutPage() {
  const { t, locale } = useI18n();

  const intro = t("about.intro").split(" ");

  return (
    <main className="relative min-h-screen overflow-hidden pt-28 noise">
      <FloatingBlobs />
      <div className="container relative mx-auto max-w-5xl px-6 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl font-bold md:text-7xl"
        >
          {t("about.title")} <span className="text-gradient-fun">{t("about.me")}</span>
        </motion.h1>

        <p className="mt-10 max-w-3xl text-2xl leading-relaxed md:text-3xl">
          {intro.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="mr-1.5 inline-block"
            >
              {w}
            </motion.span>
          ))}
        </p>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { n: 3, s: "+", l: t("about.yearsBuilding") },
            { n: 1, s: "", l: t("about.projectsShipped") },
            { n: 1, s: "", l: t("about.happyClients") },
            { n: 99, s: "%", l: t("about.caffeinated") },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, type: "spring" }}
              className="rounded-3xl border-2 border-foreground bg-card p-6 text-center shadow-card"
            >
              <Counter to={s.n} suffix={s.s} />
              <div className="mt-2 text-sm text-muted-foreground">{s.l}</div>
            </motion.div>
          ))}
        </div>

        {/* Timeline */}
        <h2 className="mt-24 font-display text-4xl font-bold md:text-5xl">
          {t("about.theJourney")} <span className="text-gradient-warm">{t("about.journey")}</span>
        </h2>
        <div className="relative mt-10 ml-4">
          <motion.div
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            style={{ originY: 0 }}
            className="absolute left-0 top-0 h-full w-1 bg-gradient-fun"
          />
          <div className="space-y-10 pl-10">
            {timeline.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="absolute -left-[2.65rem] top-1.5 h-5 w-5 rounded-full border-4 border-background bg-gradient-fun" />
                <div className="text-sm font-semibold text-purple">{t.year}</div>
                <div className="mt-1 font-display text-2xl font-bold">
                  {locale === "id" ? t.titleId : t.titleEn}
                </div>
                <div className="mt-1 text-muted-foreground">
                  {locale === "id" ? t.descId : t.descEn}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Skills */}
        <h2 className="mt-24 font-display text-4xl font-bold md:text-5xl">
          {t("about.theStack")} <span className="text-gradient-cool">{t("about.stack")}</span>
        </h2>
        <div className="mt-10 space-y-8">
          {Object.entries(skills).map(([group, list]) => (
            <div key={group}>
              <div className="mb-4 text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                {group}
              </div>
              <div className="flex flex-wrap gap-3">
                {list.map((s, i) => (
                  <motion.span
                    key={s.name}
                    initial={{ opacity: 0, scale: 0.7 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, type: "spring", stiffness: 200 }}
                    whileHover={{ scale: 1.15, rotate: [0, -4, 4, 0] }}
                    className={`cursor-default rounded-full ${s.color} px-5 py-2.5 font-semibold text-white shadow-pop`}
                  >
                    {s.name}
                  </motion.span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
