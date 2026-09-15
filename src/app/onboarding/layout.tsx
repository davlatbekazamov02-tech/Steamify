import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Profilni To'ldirish — Ro'yxatdan O'tish",
  description:
    "STEAMIFY profilingizni to'ldiring. Viloyatingizni tanlang va shaxsiy reytingingizni shakllantiring.",
};

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
