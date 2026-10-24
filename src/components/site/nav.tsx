import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/site/language-switcher";

export function Nav() {
  const { pathname } = useLocation();
  const { t } = useI18n();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

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
      transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.15 }}
      className="fixed left-1/2 top-5 z-50 -translate-x-1/2"
    >
      <div
        onMouseLeave={() => setHoveredPath(null)}
        className="relative flex items-center gap-1 rounded-full border border-border/60 bg-background/80 p-1.5 shadow-pop backdrop-blur-xl"
      >
        {links.map((link) => {
          const active = pathname === link.to;
          const hovered = hoveredPath === link.to;

          return (
            <Link
              key={link.to}
              to={link.to}
              data-nav-link={link.to}
              onMouseEnter={() => setHoveredPath(link.to)}
              className="relative rounded-full px-4 py-2 text-sm font-medium focus:outline-none"
            >
              {/* Hover pill */}
              {hovered && !active && (
                <motion.span
                  layoutId="nav-hover-pill"
                  className="absolute inset-0 rounded-full bg-foreground/8"
                  transition={{ type: "spring", stiffness: 450, damping: 30 }}
                />
              )}

              {/* Active liquid spring pill */}
              {active && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-full bg-foreground shadow-[inset_0_1px_1px_rgba(255,255,255,0.22),0_4px_14px_rgba(0,0,0,0.14)]"
                  transition={{
                    type: "spring",
                    stiffness: 360,
                    damping: 24,
                    mass: 0.65,
                  }}
                />
              )}

              <span
                className={`relative z-10 transition-colors duration-200 ${
                  active
                    ? "font-semibold text-background"
                    : "text-foreground/75 hover:text-foreground"
                }`}
              >
                {link.label}
              </span>
            </Link>
          );
        })}

        <div className="relative z-10 ml-1">
          <LanguageSwitcher />
        </div>
      </div>
    </motion.nav>
  );
}
