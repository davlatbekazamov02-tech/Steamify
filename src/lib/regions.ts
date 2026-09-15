export interface RegionInfo {
  id: string;
  nameUz: string;
  nameEn: string;
  nameRu: string;
  name: {
    uz: string;
    en: string;
    ru: string;
  };
}

export const UZBEKISTAN_REGIONS: RegionInfo[] = [
  { id: 'andijon', nameUz: 'Andijon viloyati', nameEn: 'Andijan', nameRu: 'Андижан', name: { uz: 'Andijon viloyati', en: 'Andijan', ru: 'Андижан' } },
  { id: 'buxoro', nameUz: 'Buxoro viloyati', nameEn: 'Bukhara', nameRu: 'Бухара', name: { uz: 'Buxoro viloyati', en: 'Bukhara', ru: 'Бухара' } },
  { id: 'farg\'ona', nameUz: 'Farg\'ona viloyati', nameEn: 'Fergana', nameRu: 'Фергана', name: { uz: 'Farg\'ona viloyati', en: 'Fergana', ru: 'Фергана' } },
  { id: 'jizzax', nameUz: 'Jizzax viloyati', nameEn: 'Jizzakh', nameRu: 'Джизак', name: { uz: 'Jizzax viloyati', en: 'Jizzakh', ru: 'Джизак' } },
  { id: 'xorazm', nameUz: 'Xorazm viloyati', nameEn: 'Khorezm', nameRu: 'Хорезм', name: { uz: 'Xorazm viloyati', en: 'Khorezm', ru: 'Хорезм' } },
  { id: 'namangan', nameUz: 'Namangan viloyati', nameEn: 'Namangan', nameRu: 'Наманган', name: { uz: 'Namangan viloyati', en: 'Namangan', ru: 'Наманган' } },
  { id: 'navoiy', nameUz: 'Navoiy viloyati', nameEn: 'Navoi', nameRu: 'Навои', name: { uz: 'Navoiy viloyati', en: 'Navoi', ru: 'Навои' } },
  { id: 'qashqadaryo', nameUz: 'Qashqadaryo viloyati', nameEn: 'Kashkadarya', nameRu: 'Кашкадарья', name: { uz: 'Qashqadaryo viloyati', en: 'Kashkadarya', ru: 'Кашкадарья' } },
  { id: 'samarqand', nameUz: 'Samarqand viloyati', nameEn: 'Samarkand', nameRu: 'Самарканд', name: { uz: 'Samarqand viloyati', en: 'Samarkand', ru: 'Самарканд' } },
  { id: 'sirdaryo', nameUz: 'Sirdaryo viloyati', nameEn: 'Sirdaryo', nameRu: 'Сырдарья', name: { uz: 'Sirdaryo viloyati', en: 'Sirdaryo', ru: 'Сырдарья' } },
  { id: 'surxondaryo', nameUz: 'Surxondaryo viloyati', nameEn: 'Surkhandarya', nameRu: 'Сурхандарья', name: { uz: 'Surxondaryo viloyati', en: 'Surkhandarya', ru: 'Сурхандарья' } },
  { id: 'toshkent-viloyati', nameUz: 'Toshkent viloyati', nameEn: 'Tashkent Region', nameRu: 'Ташкентская область', name: { uz: 'Toshkent viloyati', en: 'Tashkent Region', ru: 'Ташкентская область' } },
  { id: 'toshkent-shahri', nameUz: 'Toshkent shahri', nameEn: 'Tashkent City', nameRu: 'г. Ташкент', name: { uz: 'Toshkent shahri', en: 'Tashkent City', ru: 'г. Ташкент' } },
  { id: 'qoraqalpog\'iston', nameUz: 'Qoraqalpog\'iston Respublikasi', nameEn: 'Karakalpakstan', nameRu: 'Каракалпакстан', name: { uz: 'Qoraqalpog\'iston Respublikasi', en: 'Karakalpakstan', ru: 'Каракалпакстан' } },
];

export function getRegionName(id: string, locale: string = 'uz'): string {
  if (id === 'all' || !id) {
    if (locale === 'en') return 'Uzbekistan';
    if (locale === 'ru') return 'Узбекистан';
    return 'O\'zbekiston';
  }
  const found = UZBEKISTAN_REGIONS.find((r) => r.id === id || r.id === id.replace('_', '-'));
  if (!found) return id;
  if (locale === 'en') return found.nameEn;
  if (locale === 'ru') return found.nameRu;
  return found.nameUz;
}
