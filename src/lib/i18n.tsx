import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type Locale = "en" | "id";

type Translations = Record<string, Record<Locale, string>>;

// ─── All translatable strings ───────────────────────────────────────────────
const translations: Translations = {
  // Nav
  "nav.home": { en: "Home", id: "Beranda" },
  "nav.about": { en: "About", id: "Tentang" },
  "nav.projects": { en: "Projects", id: "Proyek" },
  "nav.contact": { en: "Contact", id: "Kontak" },

  // Home hero
  "home.badge": {
    en: "Available for freelance & full-time",
    id: "Tersedia untuk freelance & full-time",
  },
  "home.words": {
    en: "Hi, I'm Riyansyah Building modern web apps.",
    id: "Hai, Saya Riyansyah Membangun aplikasi web modern.",
  },
  "home.desc": {
    en: "Full-stack engineer specializing in React, TypeScript, and high-performance interactive interfaces. Focused on clean architecture, fluid motion, and products that",
    id: "Full-stack engineer dengan fokus pada React, TypeScript, dan antarmuka interaktif berperforma tinggi. Menekankan arsitektur bersih, animasi mulus, dan produk yang",
  },
  "home.alive": { en: "actually deliver", id: "benar-benar terukur" },
  "home.seeWork": { en: "See my work", id: "Lihat karya saya" },
  "home.sayHi": { en: "Get in touch", id: "Hubungi saya" },
  "home.dragHint": {
    en: "Interactive physics badge grab and drag the card.",
    id: "Badge fisika interaktif tarik dan ayunkan kartunya.",
  },
  "home.aboutMe": { en: "About me", id: "Tentang saya" },
  "home.projects": { en: "Projects", id: "Proyek" },

  // About
  "about.title": { en: "About", id: "Tentang" },
  "about.me": { en: "me", id: "saya" },
  "about.intro": {
    en: "Full-stack engineer based in Majalengka, Indonesia. I design and build end-to-end web applications from database schemas to interactive 3D frontends, balancing rock-solid architecture with fast, intuitive user experiences.",
    id: "Full-stack engineer berbasis di Majalengka, Indonesia. Saya merancang dan membangun aplikasi web end-to-end dari skema basis data hingga frontend 3D interaktif, menyeimbangkan arsitektur yang kokoh dengan pengalaman pengguna yang cepat dan intuitif.",
  },
  "about.yearsBuilding": { en: "Years building", id: "Tahun membangun" },
  "about.projectsShipped": { en: "Projects shipped", id: "Proyek terkirim" },
  "about.happyClients": { en: "Happy clients", id: "Klien senang" },
  "about.caffeinated": { en: "Caffeinated", id: "Berkafein" },
  "about.theJourney": { en: "The", id: "Per" },
  "about.journey": { en: "journey", id: "jalanan" },
  "about.theStack": { en: "The", id: "Tech" },
  "about.stack": { en: "stack", id: "Stack" },

  // Projects
  "projects.filmOrganizer.desc": {
    en: "Personal cinema tracker with local watchlist state and movie metadata search.",
    id: "Aplikasi pelacak film personal dengan status watchlist lokal dan pencarian metadata film.",
  },
  "projects.filmOrganizer.long": {
    en: "Built a responsive film catalog for organizing watchlists and logging watched movies. Implemented fast client-side filtering, debounced search against TMDB API, and responsive poster grid layouts.",
    id: "Membangun katalog film responsif untuk mengatur daftar tontonan dan riwayat film. Mengimplementasikan pencarian ter-debounce dengan API TMDB, filter client-side instan, dan layout poster grid responsif.",
  },
  "projects.pustakaConnect.desc": {
    en: "Full-stack library catalog with Supabase auth, real-time loans, and member reviews.",
    id: "Katalog perpustakaan full-stack dengan autentikasi Supabase, peminjaman real-time, dan ulasan anggota.",
  },
  "projects.pustakaConnect.long": {
    en: "End-to-end circulation platform featuring role-based access (admin/member), Supabase PostgreSQL backend with Row-Level Security, real-time book loan tracking, and interactive community reviews.",
    id: "Platform sirkulasi buku end-to-end dengan kontrol akses berbasis peran (admin/anggota), backend PostgreSQL Supabase dengan Row-Level Security, pelacakan peminjaman buku real-time, dan ulasan interaktif.",
  },
  "projects.soundcloudClone.desc": {
    en: "Audio streaming app featuring playlist management, track uploads, and Howler.js playback.",
    id: "Aplikasi streaming audio dengan manajemen playlist, upload trek, dan playback audio Howler.js.",
  },
  "projects.soundcloudClone.long": {
    en: "Full-featured audio platform utilizing Howler.js for seamless playback, timeline scrubbing, and persistent audio state across page transitions managed via Zustand. Backed by Supabase storage for track uploads.",
    id: "Platform streaming audio interaktif menggunakan Howler.js untuk playback audio mulus, seekbar scrubbing, dan state audio persisten di seluruh navigasi halaman dengan Zustand, didukung penyimpanan Supabase.",
  },
  "projects.title": { en: "Selected", id: "Karya" },
  "projects.work": { en: "work", id: "pilihan" },
  "projects.subtitle": {
    en: "A few favorites from the last few years. Click a card for the story.",
    id: "Beberapa favorit dari beberapa tahun terakhir. Klik kartu untuk ceritanya.",
  },
  "projects.all": { en: "All", id: "Semua" },
  "projects.close": { en: "Close", id: "Tutup" },
  "projects.liveDemo": { en: "Live demo", id: "Demo langsung" },
  "projects.source": { en: "Source", id: "Kode sumber" },

  // Gallery
  "gallery.title": { en: "Visual", id: "Galeri" },
  "gallery.highlight": { en: "gallery", id: "visual" },
  "gallery.subtitle": {
    en: "Screenshots, interfaces, and details from shipped products.",
    id: "Tangkapan layar, antarmuka, dan detail dari produk yang dirilis.",
  },

  // Contact
  "contact.title": { en: "Let's", id: "Mari" },
  "contact.chat": { en: "chat", id: "ngobrol" },
  "contact.subtitle": {
    en: "Got a wild idea, a small bug, or just want to nerd out about CSS? Drop a message I usually reply within a day.",
    id: "Punya ide liar, bug kecil, atau cuma mau ngobrolin CSS? Kirim pesan saya biasanya balas dalam sehari.",
  },
  "contact.yourName": { en: "Your name", id: "Nama kamu" },
  "contact.email": { en: "Email", id: "Email" },
  "contact.message": { en: "Message", id: "Pesan" },
  "contact.namePlaceholder": { en: "Jane Cooper", id: "Jane Cooper" },
  "contact.emailPlaceholder": { en: "jane@company.com", id: "jane@perusahaan.com" },
  "contact.messagePlaceholder": {
    en: "Tell me about your project...",
    id: "Ceritakan tentang proyekmu...",
  },
  "contact.send": { en: "Send message", id: "Kirim pesan" },
  "contact.sent": { en: "Sent! Talk soon.", id: "Terkirim! Sampai jumpa." },
  "contact.findMe": { en: "Or find me on", id: "Atau temukan saya di" },

  // 404
  "404.title": { en: "Page not found", id: "Halaman tidak ditemukan" },
  "404.desc": {
    en: "The page you're looking for doesn't exist or has been moved.",
    id: "Halaman yang kamu cari tidak ada atau sudah dipindahkan.",
  },
  "404.goHome": { en: "Go home", id: "Ke beranda" },
};

// ─── Context ────────────────────────────────────────────────────────────────
interface I18nContextType {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType>({
  locale: "en",
  setLocale: () => {},
  t: (key: string) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("portfolio-lang") as Locale) || "en";
    }
    return "en";
  });

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("portfolio-lang", l);
    }
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = (key: string): string => {
    const entry = translations[key];
    if (!entry) return key;
    return entry[locale] || entry.en || key;
  };

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
