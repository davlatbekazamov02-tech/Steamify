import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "STEAMIFY — O'zbekiston STEAM Ta'lim va Musobaqa Platformasi",
  description:
    "Science, Technology, Engineering, Arts, Mathematics sohalarida bilim va ko'nikmalaringizni oshiring. Tadbirlarda qatnashing, reyting tizimida o'z o'rningizni egallang.",
  keywords: ["STEAM", "ta'lim", "musobaqa", "O'zbekiston", "reyting", "hackathon", "workshop"],
  openGraph: {
    title: "STEAMIFY — O'zbekiston STEAM Ta'lim Platformasi",
    description: "STEAM ta'lim va reyting platformasi — sessiyalar, tadbirlar, shaxsiy rivojlanish",
    type: "website",
  },
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
