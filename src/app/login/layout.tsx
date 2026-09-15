import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Tizimga Kirish",
  description:
    "STEAMIFY ga Google yoki Telegram orqali kiring. O'zbekiston STEAM ta'lim va reyting platformasiga xush kelibsiz.",
  keywords: ["kirish", "login", "Google", "Telegram", "STEAM", "autentifikatsiya"],
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
