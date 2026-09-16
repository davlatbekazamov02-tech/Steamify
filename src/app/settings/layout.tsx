import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Sozlamalar — Profil va Xavfsizlik",
  description:
    "STEMIFY profil sozlamalari: shaxsiy ma'lumotlar, ijtimoiy tarmoqlar, xavfsizlik va referal dasturi.",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
