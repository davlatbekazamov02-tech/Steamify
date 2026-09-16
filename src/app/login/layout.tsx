import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Tizimga Kirish",
  description:
    "STEMIFY ga telefon raqam va parol bilan kiring. O'zbekiston STEM Ta'lim va reyting platformasiga xush kelibsiz.",
  keywords: ["kirish", "login", "telefon", "parol", "STEM", "autentifikatsiya"],
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
