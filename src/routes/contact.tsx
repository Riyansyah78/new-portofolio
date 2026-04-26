import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";
import { FloatingBlobs } from "@/components/site/blobs";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Say hi to Riyansyah" },
      {
        name: "description",
        content:
          "Get in touch with Riyansyah. Available for freelance, collaborations, and a good chat.",
      },
      { property: "og:title", content: "Contact — Riyansyah" },
      {
        property: "og:description",
        content: "Reach out for projects, collabs, or just to say hi.",
      },
    ],
  }),
  component: ContactPage,
});

const socials = [
  {
    name: "X",
    href: "https://x.com/rynn_iam",
    color: "bg-foreground text-background",
    emoji: "🐦",
  },
  {
    name: "GitHub",
    href: "https://github.com/Riyansyah78",
    color: "bg-foreground text-background",
    emoji: "🐙",
  },
  {
    name: "Discord",
    href: "https://discord.com/users/514809747057278977",
    color: "bg-purple text-white",
    emoji: "🎮",
  },
];

function ContactPage() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <main className="relative min-h-screen overflow-hidden pt-28 noise">
      <FloatingBlobs />
      {/* floating emoji */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {["✦", "💌", "🚀", "🎉", "🌟", "👋"].map((e, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-70"
            initial={{ y: 0 }}
            animate={{ y: [-10, 10, -10], rotate: [0, 8, -8, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, delay: i * 0.4 }}
            style={{ top: `${10 + i * 12}%`, left: `${(i * 17) % 90}%` }}
          >
            {e}
          </motion.div>
        ))}
      </div>

      <div className="container relative mx-auto max-w-5xl px-6 py-12">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display text-5xl font-bold md:text-7xl"
        >
          {t("contact.title")} <span className="text-gradient-fun">{t("contact.chat")}</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-4 max-w-2xl text-lg text-muted-foreground"
        >
          {t("contact.subtitle")}
        </motion.p>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr]">
          {/* form */}
          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-5 rounded-3xl border-2 border-foreground bg-card p-8 shadow-card"
          >
            <Field
              label={t("contact.yourName")}
              name="name"
              placeholder={t("contact.namePlaceholder")}
            />
            <Field
              label={t("contact.email")}
              name="email"
              type="email"
              placeholder={t("contact.emailPlaceholder")}
            />
            <Field
              label={t("contact.message")}
              name="message"
              textarea
              placeholder={t("contact.messagePlaceholder")}
            />
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.02 }}
              type="submit"
              className="w-full rounded-full bg-gradient-fun px-6 py-4 font-display text-lg font-bold text-white shadow-pop"
            >
              {sent ? t("contact.sent") : t("contact.send")}
            </motion.button>
          </motion.form>

          {/* socials */}
          <div className="space-y-4">
            <div className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              {t("contact.findMe")}
            </div>
            {socials.map((s, i) => (
              <motion.a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                whileHover={{ scale: 1.03, rotate: -1 }}
                className={`flex items-center gap-4 rounded-3xl border-2 border-foreground ${s.color} p-5 shadow-card`}
              >
                <span className="text-3xl group-hover:animate-wiggle">{s.emoji}</span>
                <span className="font-display text-2xl font-bold">{s.name}</span>
                <span className="ml-auto text-2xl">→</span>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  textarea,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <label className="block">
      <motion.span
        animate={{
          scale: focused ? 1.05 : 1,
          color: focused ? "var(--purple)" : "var(--foreground)",
        }}
        className="mb-2 block origin-left text-sm font-semibold"
      >
        {label}
      </motion.span>
      <motion.div
        animate={{ scale: focused ? 1.01 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
      >
        {textarea ? (
          <textarea
            name={name}
            rows={4}
            placeholder={placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full rounded-2xl border-2 border-foreground bg-background px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/20"
          />
        ) : (
          <input
            name={name}
            type={type}
            placeholder={placeholder}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full rounded-2xl border-2 border-foreground bg-background px-4 py-3 outline-none focus:border-purple focus:ring-4 focus:ring-purple/20"
          />
        )}
      </motion.div>
    </label>
  );
}
