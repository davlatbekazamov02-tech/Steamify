import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Login talab qilinadigan sahifalar (prefix asosida)
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/events",
  "/my-qr",
  "/my-applications",
  "/referral",
  "/settings",
  "/onboarding",
  "/admin",
  "/mentor",
];

// Faqat ma'lum rollar kira oladigan sahifalar
const ROLE_PROTECTED: Record<string, string[]> = {
  "/admin": ["ADMIN", "SUPER_ADMIN"],
  "/mentor": ["MENTOR", "ADMIN", "SUPER_ADMIN"],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = request.cookies.get("steamify_role")?.value;

  // ✅ Allaqachon login qilgan → /login ga kelsa dashboardga yo'naltir
  if (pathname === "/login" && role) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Himoyalangan sahifami tekshirish
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // Login qilinmagan — /login ga yo'naltirish
  if (!role) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ✅ Cookie qiymatini faqat ruxsat etilgan rollar ichida tekshirish
  const VALID_ROLES = ["USER", "MENTOR", "ADMIN", "SUPER_ADMIN"];
  if (!VALID_ROLES.includes(role)) {
    // Noto'g'ri cookie — login ga qaytarish va cookie o'chirish
    const loginUrl = new URL("/login", request.url);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("steamify_role");
    return response;
  }

  // Rol tekshiruvi (admin va mentor uchun)
  for (const [prefix, allowedRoles] of Object.entries(ROLE_PROTECTED)) {
    if (pathname.startsWith(prefix) && !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // API, _next, statik fayllar va public resurslarni o'tkazib yuborish
    "/((?!api|_next/static|_next/image|images|favicon.ico|.*\\..*).+)",
  ],
};
