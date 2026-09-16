import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Referal Dasturi — Do'stlaringizni Taklif Qiling",
  description:
    "Do'stlaringizni STEMIFY ga taklif qiling va har bir taklif uchun qo'shimcha XP ball qo'lga kiriting.",
};

export default function ReferralLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
