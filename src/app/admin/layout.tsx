import { type Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel",
    template: "%s — Admin | STEMIFY",
  },
  description: "STEMIFY admin boshqaruv paneli. Foydalanuvchilar, tadbirlar va tizim sozlamalarini boshqaring.",
  robots: {
    index: false,   // Admin sahifalar qidiruv tizimlarida ko'rinmasin
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
