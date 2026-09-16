import { type Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Mentor Panel",
    template: "%s — Mentor | STEMIFY",
  },
  description: "STEMIFY mentor paneli. QR skaner, sessiyalar va jamoalarni boshqaring.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
