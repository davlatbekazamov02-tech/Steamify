import Link from "next/link";
import { type Metadata } from "next";
import { FileText, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Foydalanish Shartlari",
  description: "STEMIFY platformasidan foydalanish shartlari va qoidalari.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 antialiased">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#070b14]/80 backdrop-blur-lg border-b border-cyan-500/20">
        <div className="container mx-auto px-4 h-16 flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors text-sm font-semibold"
          >
            <ArrowLeft className="w-4 h-4" aria-hidden="true" />
            <span>Bosh sahifaga qaytish</span>
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
            <FileText className="w-6 h-6 text-cyan-400" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Foydalanish Shartlari</h1>
            <p className="text-xs text-slate-500 mt-0.5">Oxirgi yangilanish: Sentyabr 2026</p>
          </div>
        </div>

        <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-base font-bold text-white mb-3">1. Umumiy qoidalar</h2>
            <p>
              STEMIFY platformasidan foydalanish orqali siz ushbu foydalanish shartlariga
              to&apos;liq rozilik bildirasiz. Agar siz ushbu shartlarga rozi bo&apos;lmasangiz,
              platformadan foydalanishni to&apos;xtating.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">2. Platformadan foydalanish</h2>
            <ul className="space-y-2 list-disc list-inside text-slate-400">
              <li>Platform faqat ta&apos;lim va reyting maqsadlarida ishlatiladi</li>
              <li>Hisob ma&apos;lumotlarini boshqalarga berish taqiqlanadi</li>
              <li>Platformaga zarar yetkazadigan harakatlar qat&apos;iyan man etiladi</li>
              <li>Boshqa foydalanuvchilarga nisbatan hurmatli munosabat talab etiladi</li>
              <li>Soxta ma&apos;lumot kiritish hisobni bloklashga olib kelishi mumkin</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">3. Hisob va xavfsizlik</h2>
            <p className="mb-3">
              Siz o&apos;z hisob ma&apos;lumotlaringiz (telefon raqam va parol) xavfsizligi uchun
              to&apos;liq javobgarsiz. Quyidagi talablar majburiy:
            </p>
            <ul className="space-y-2 list-disc list-inside text-slate-400">
              <li>Kuchli parol tanlang (kamida 6 belgi)</li>
              <li>Parolni muntazam ravishda yangilang</li>
              <li>Shubhali faoliyatni darhol adminga xabarlang</li>
              <li>Umumiy qurilmalarda hisobdan chiqishni unutmang</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">4. XP ballar va reyting</h2>
            <p className="mb-3">
              XP ballar tizimi quyidagi qoidalar asosida ishlaydi:
            </p>
            <ul className="space-y-2 list-disc list-inside text-slate-400">
              <li>Ballar faqat rasmiy tadbirlarda ishtirok orqali to&apos;planadi</li>
              <li>Soxta davomat yoki firibgarlik orqali bal to&apos;plash taqiqlanadi</li>
              <li>Admin aniqlangan holatda ballarni bekor qilish huquqiga ega</li>
              <li>Reyting natijalari har 24 soatda yangilanadi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">5. Taqiqlangan harakatlar</h2>
            <ul className="space-y-2 list-disc list-inside text-slate-400">
              <li>Spam yoki keraksiz xabarlar tarqatish</li>
              <li>Platform kodini buzishga urinish (hacking)</li>
              <li>Boshqa foydalanuvchilar nomidan harakat qilish</li>
              <li>Noto&apos;g&apos;ri ma&apos;lumot kiritib reyting oshirish</li>
              <li>Tijorat maqsadlarida platformadan foydalanish (ruxsatsiz)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">6. Hisobni bloklash</h2>
            <p>
              STEMIFY ma&apos;muriyati quyidagi holatlarda foydalanuvchi hisobini
              ogohlantirishsiz bloklash huquqini o&apos;zida saqlaydi:
            </p>
            <ul className="space-y-2 list-disc list-inside text-slate-400 mt-3">
              <li>Qoidalarni qayta-qayta buzish</li>
              <li>Boshqa foydalanuvchilarga zarar yetkazish</li>
              <li>Firibgarlik yoki noto&apos;g&apos;ri ma&apos;lumot kiritish</li>
            </ul>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">7. O&apos;zgartirishlar</h2>
            <p>
              STEMIFY ushbu shartlarni istalgan vaqtda o&apos;zgartirish huquqini o&apos;zida
              saqlaydi. Muhim o&apos;zgartirishlar haqida foydalanuvchilar platformada xabar
              orqali ogohlantiriladi.
            </p>
          </section>

          <section>
            <h2 className="text-base font-bold text-white mb-3">8. Bog&apos;lanish</h2>
            <p>
              Savollar va shikoyatlar uchun{" "}
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
