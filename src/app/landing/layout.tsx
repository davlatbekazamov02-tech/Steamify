import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "STEMIFY — O'zbekiston STEM Ta'lim va Musobaqa Platformasi",
  description:
    "Science, Technology, Engineering, Mathematics sohalarida bilim va ko'nikmalaringizni oshiring. Tadbirlarda qatnashing, reyting tizimida o'z o'rningizni egallang.",
  keywords: ["STEM", "ta'lim", "musobaqa", "O'zbekiston", "reyting", "hackathon", "workshop"],
  openGraph: {
    title: "STEMIFY — O'zbekiston STEM Ta'lim Platformasi",
    description: "STEM Ta'lim va reyting platformasi — sessiyalar, tadbirlar, shaxsiy rivojlanish",
    type: "website",
  },
};

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
