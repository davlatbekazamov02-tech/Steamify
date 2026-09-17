import Link from "next/link";
import { type Metadata } from "next";
import { Shield, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Maxfiylik Siyosati",
  description: "STEMIFY platformasining maxfiylik siyosati va shaxsiy ma'lumotlarni himoya qilish qoidalari.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b14] text-slate-800 dark:text-slate-100 antialiased">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#070b14]/80 backdrop-blur-lg border-b border-slate-200 dark:border-cyan-500/20">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Bosh sahifaga qaytish</span>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <Shield className="w-6 h-6 text-cyan-400" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Maxfiylik Siyosati</h1>
            <p className="text-xs text-slate-500 mt-0.5">Oxirgi yangilanish: Sentyabr 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-white mb-3">1. Umumiy ma'lumot</h2>
            <p>
              STEMIFY ("biz", "bizning") O'zbekiston STEM Ta'lim va reyting platformasi bo'lib,
              foydalanuvchilarning shaxsiy ma'lumotlarini himoya qilishga qat'iy amal qiladi.
              Ushbu maxfiylik siyosati platformamizdan foydalanganda qanday ma'lumotlar
              to'planishi va ulardan qanday foydalanilishi haqida ma'lumot beradi.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">2. To'planadigan ma'lumotlar</h2>
            <ul className="space-y-2 list-disc list-inside text-slate-400">
              <li>Ism, familiya va elektron pochta manzili</li>
              <li>Yashash viloyati va hududi</li>
              <li>Ta'lim maskani va sinf/bosqich ma'lumotlari</li>
              <li>Platforma faoliyati (tadbirlarda ishtirok, XP ballar)</li>
              <li>Ijtimoiy tarmoq profil havolalari (ixtiyoriy)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">3. Ma'lumotlardan foydalanish</h2>
            <p className="mb-3">Sizning ma'lumotlaringiz faqat quyidagi maqsadlarda ishlatiladi:</p>
            <ul className="space-y-2 list-disc list-inside text-slate-400">
              <li>Hisob va profil yaratish hamda boshqarish</li>
              <li>Reyting tizimida o'rinni aniqlash</li>
              <li>Tadbirlar va dasturlarga ro'yxatdan o'tkazish</li>
              <li>Platforma xizmatlari haqida xabarlar yuborish</li>
              <li>Xizmat sifatini yaxshilash</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">4. Ma'lumotlarni saqlash</h2>
            <p>
              Barcha shaxsiy ma'lumotlar xavfsiz serverda saqlanadi va uchinchi shaxslarga
              sotilmaydi yoki uzatilmaydi. Ma'lumotlar faqat qonun talablari yoki
              foydalanuvchining roziligiga asosan ulashilishi mumkin.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">5. Cookie fayllar</h2>
            <p>
              Platformamiz foydalanuvchi sessiyasini saqlash uchun cookie fayllaridan foydalanadi.
              Bu fayllar brauzeringizda saqlanib, keyingi kirishda avtomatik autentifikatsiyani
              ta'minlaydi. Brauzer sozlamalaridan cookie fayllarni o'chirishingiz mumkin.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">6. Foydalanuvchi huquqlari</h2>
            <p className="mb-3">Siz quyidagi huquqlarga egasiz:</p>
            <ul className="space-y-2 list-disc list-inside text-slate-400">
              <li>O'z ma'lumotlaringizni ko'rish va tahrirlash</li>
              <li>Ma'lumotlaringizni o'chirish talabini yuborish</li>
              <li>Marketing xabarlaridan voz kechish</li>
              <li>Ma'lumotlar qayta ishlash haqida ma'lumot olish</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">7. Bog'lanish</h2>
            <p>
              Maxfiylik siyosatiga oid savollar uchun{" "}
              <a
                href="mailto:info@STEMIFY.uz"
                className="text-cyan-400 hover:text-cyan-300 transition-colors"
              >
                info@STEMIFY.uz
              </a>{" "}
              manziliga murojaat qiling.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-xl text-sm font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            Bosh sahifaga qaytish
          </Link>
        </div>
      </main>
    </div>
  );
}
