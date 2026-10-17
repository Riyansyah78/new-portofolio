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

function SkillTrack() {
  return (
    <div className="flex shrink-0 items-center gap-10 pr-10">
      {SKILLS.map((s, i) => (
        <span
          key={i}
          className="flex items-center gap-10 text-2xl font-display tracking-tight md:text-3xl"
        >
          {s}
          <span className="text-3xl">✦</span>
        </span>
      ))}
    </div>
  );
}

export function SkillMarquee() {
  return (
    <div className="relative overflow-hidden border-y-2 border-foreground/10 bg-foreground py-5 text-background">
      <div className="flex w-max animate-marquee">
        <SkillTrack />
        <SkillTrack />
      </div>
    </div>
  );
}
