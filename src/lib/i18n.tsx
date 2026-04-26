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
  "home.badge": { en: "Available for freelance", id: "Tersedia untuk freelance" },
  "home.words": {
    en: "Hi, I'm Riyansyah — I build delightful things.",
    id: "Hai, Saya Riyansyah — Saya membuat hal-hal menakjubkan.",
  },
  "home.desc": {
    en: "Full-stack developer with 3+ years of shipping playful, performant products. I love Javascript, weird CSS, and making the web feel",
    id: "Full-stack developer dengan 3+ tahun pengalaman membangun produk yang menyenangkan dan berperforma tinggi. Saya suka Javascript, CSS yang unik, dan membuat web terasa",
  },
  "home.alive": { en: "alive", id: "hidup" },
  "home.seeWork": { en: "See my work →", id: "Lihat karya saya →" },
  "home.sayHi": { en: "Say hi 👋", id: "Halo 👋" },
  "home.dragHint": {
    en: "Try dragging the card — it swings like a real lanyard.",
    id: "Coba tarik kartunya — bergoyang seperti lanyard asli.",
  },
  "home.aboutMe": { en: "About me", id: "Tentang saya" },
  "home.projects": { en: "Projects", id: "Proyek" },

  // About
  "about.title": { en: "About", id: "Tentang" },
  "about.me": { en: "me", id: "saya" },
  "about.intro": {
    en: "I'm a full-stack developer based in Majalengka. I turn fuzzy product ideas into shippable, delightful interfaces - the kind that make users smile, then come back.",
    id: "Saya seorang full-stack developer berbasis di Majalengka. Saya mengubah ide produk yang samar menjadi antarmuka yang siap kirim dan menyenangkan - yang membuat pengguna tersenyum, lalu kembali lagi.",
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
    en: "Minimalist movie tracking application built with React.",
    id: "Aplikasi pelacak film minimalis yang dibangun dengan React.",
  },
  "projects.filmOrganizer.long": {
    en: "A React-based movie organizer that helps users keep track of films they want to watch, integrated with Vite for high performance and smooth UI.",
    id: "Pengatur film berbasis React yang membantu pengguna melacak film yang ingin mereka tonton, terintegrasi dengan Vite untuk performa tinggi dan UI yang mulus.",
  },
  "projects.pustakaConnect.desc": {
    en: "Modern digital library management system.",
    id: "Sistem manajemen perpustakaan digital modern.",
  },
  "projects.pustakaConnect.long": {
    en: "A full-stack library management application with features for borrowing books, rating/reviews, and admin management for collections and users. Built with Supabase for real-time data.",
    id: "Aplikasi manajemen perpustakaan full-stack dengan fitur peminjaman buku, rating/ulasan, dan manajemen admin untuk koleksi dan pengguna. Dibangun dengan Supabase untuk data real-time.",
  },
  "projects.soundcloudClone.desc": {
    en: "Modern music streaming web application.",
    id: "Aplikasi web streaming musik modern.",
  },
  "projects.soundcloudClone.long": {
    en: "A music streaming platform that allows users to play music, create playlists, and upload songs. Features a full-featured audio player powered by Howler.js.",
    id: "Platform streaming musik yang memungkinkan pengguna memutar musik, membuat playlist, dan mengunggah lagu. Memiliki pemutar audio lengkap yang didukung oleh Howler.js.",
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

  // Contact
  "contact.title": { en: "Let's", id: "Mari" },
  "contact.chat": { en: "chat", id: "ngobrol" },
  "contact.subtitle": {
    en: "Got a wild idea, a small bug, or just want to nerd out about CSS? Drop a message — I usually reply within a day.",
    id: "Punya ide liar, bug kecil, atau cuma mau ngobrolin CSS? Kirim pesan — saya biasanya balas dalam sehari.",
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
  "contact.send": { en: "Send message →", id: "Kirim pesan →" },
  "contact.sent": { en: "Sent! 🎉 Talk soon.", id: "Terkirim! 🎉 Sampai jumpa." },
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
