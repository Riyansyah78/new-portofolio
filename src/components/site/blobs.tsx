export function FloatingBlobs() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -top-24 -left-24 h-[420px] w-[420px] animate-blob bg-gradient-warm opacity-60 blur-3xl"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="absolute top-1/3 -right-32 h-[480px] w-[480px] animate-blob bg-gradient-cool opacity-50 blur-3xl"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="absolute -bottom-32 left-1/3 h-[460px] w-[460px] animate-blob bg-gradient-fun opacity-50 blur-3xl"
        style={{ animationDelay: "-12s" }}
      />
    </div>
  );
}
