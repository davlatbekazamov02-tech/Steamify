import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/error-boundary";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "STEMIFY — O'zbekiston STEM Ta'lim va Musobaqa Platformasi",
    template: "%s | STEMIFY",
  },
  description:
    "STEM platformasi — sessiyalar, tadbirlar, reyting va shaxsiy rivojlanish. Science, Technology, Engineering, Mathematics.",
  keywords: ["STEM", "ta'lim", "O'zbekiston", "reyting", "hackathon", "workshop"],
  authors: [{ name: "STEMIFY Team" }],
  creator: "STEMIFY",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz" suppressHydrationWarning className="h-full">
      <body className="bg-[var(--background)] text-[var(--foreground)] min-h-screen antialiased flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
