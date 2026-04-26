import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/site/language-switcher";

export function Nav() {
  const { pathname } = useLocation();
  const { t } = useI18n();

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/about", label: t("nav.about") },
    { to: "/projects", label: t("nav.projects") },
    { to: "/contact", label: t("nav.contact") },
  ] as const;

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.2 }}
      className="fixed left-1/2 top-5 z-50 -translate-x-1/2"
    >
      <div className="flex items-center gap-1 rounded-full border border-border/60 bg-background/70 p-1.5 shadow-pop backdrop-blur-xl">
        {links.map((l) => {
          const active = pathname === l.to;
          return (
            <Link
              key={l.to}
              to={l.to}
              className="relative rounded-full px-4 py-2 text-sm font-medium transition-colors"
            >
              {active && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-full bg-gradient-fun"
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                />
              )}
              <span
                className={`relative z-10 ${active ? "text-white" : "text-foreground/80 hover:text-foreground"}`}
              >
                {l.label}
              </span>
            </Link>
          );
        })}
        <div className="ml-1">
          <LanguageSwitcher />
        </div>
      </div>
    </motion.nav>
  );
}
