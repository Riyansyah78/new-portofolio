const SKILLS = [
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Tailwind",
  "Python",
  "Figma",
  "Vite",
  "Git",
  "Supabase",
];

export function SkillMarquee() {
  const items = [...SKILLS, ...SKILLS];
  return (
    <div className="relative overflow-hidden border-y-2 border-foreground/10 bg-foreground py-5 text-background">
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {items.map((s, i) => (
          <span
            key={i}
            className="flex items-center gap-10 text-2xl font-display tracking-tight md:text-3xl"
          >
            {s}
            <span className="text-3xl">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
