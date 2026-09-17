import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

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

const ROLE_PROTECTED: Record<string, string[]> = {
  "/admin": ["ADMIN", "SUPER_ADMIN"],
  "/mentor": ["MENTOR", "ADMIN", "SUPER_ADMIN"],
};

const VALID_ROLES = ["USER", "MENTOR", "ADMIN", "SUPER_ADMIN"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ✅ Cookie nomi: steamify_role (barcha joyda bir xil)
  const role = request.cookies.get("steamify_role")?.value;

  // Allaqachon login qilgan → /login ga kelsa dashboardga
  if (pathname === "/login" && role && VALID_ROLES.includes(role)) {
    switch (role) {
      case "SUPER_ADMIN": return NextResponse.redirect(new URL("/admin/admins", request.url));
      case "ADMIN":       return NextResponse.redirect(new URL("/admin", request.url));
      case "MENTOR":      return NextResponse.redirect(new URL("/mentor/scanner", request.url));
      default:            return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Himoyalangan sahifami?
  const isProtected = PROTECTED_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!isProtected) return NextResponse.next();

  // Login qilinmagan → /login ga
  if (!role || !VALID_ROLES.includes(role)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    const response = NextResponse.redirect(loginUrl);
    // Noto'g'ri cookie bo'lsa o'chirish
    if (role) response.cookies.delete("steamify_role");
    return response;
  }

  // Rol tekshiruvi
  for (const [prefix, allowedRoles] of Object.entries(ROLE_PROTECTED)) {
    if (pathname.startsWith(prefix) && !allowedRoles.includes(role)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|.*\\..*).+)",
  ],
};
