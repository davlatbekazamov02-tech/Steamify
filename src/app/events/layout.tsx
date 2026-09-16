import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Tadbirlar — Sessiyalar va Musobaqalar",
  description:
    "STEMIFY tadbirlari: sessiyalar, hackathonlar, workshoplar va lagerlarga ro'yxatdan o'ting. QR pasport oling va XP ballar jamg'aring.",
  keywords: ["tadbirlar", "sessiya", "hackathon", "workshop", "lager", "STEM", "QR"],
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
