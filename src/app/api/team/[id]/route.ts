/**
 * TEAM MEMBER BY ID API — Admin only
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sanitizeText, isValidImageUrl, validateLength } from "@/lib/security";
import { LIMITS } from "@/lib/constants";

export const dynamic = "force-dynamic";

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const role = cookieStore.get("steamify_role")?.value;
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

/** GET /api/team/[id] */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { getTeamMemberById } = await import("@/lib/team-store");
    const member = getTeamMemberById(id);

    if (!member) {
      return NextResponse.json(
        { success: false, error: "A'zo topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    console.error("[GET /api/team/[id]] error:", error);
    return NextResponse.json(
      { success: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}

/** PUT /api/team/[id] — Admin only */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: "Admin huquqi kerak" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Sanitize
    const sanitized: Record<string, unknown> = { ...body };
    if (body.firstName) sanitized.firstName = sanitizeText(body.firstName);
    if (body.lastName)  sanitized.lastName  = sanitizeText(body.lastName);
    if (body.role)      sanitized.role      = sanitizeText(body.role);
    if (body.bio)       sanitized.bio       = sanitizeText(body.bio);

    if (body.bio && !validateLength(body.bio, 10, LIMITS.MAX_BIO_LENGTH)) {
      return NextResponse.json({ success: false, error: "Bio noto'g'ri uzunlikda" }, { status: 400 });
    }
    if (body.photoUrl && !isValidImageUrl(body.photoUrl)) {
      return NextResponse.json({ success: false, error: "Rasm URL noto'g'ri" }, { status: 400 });
    }

    const { updateTeamMember } = await import("@/lib/team-store");
    const updated = updateTeamMember(id, sanitized);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: "A'zo topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "A'zo muvaffaqiyatli yangilandi",
    });
  } catch (error) {
    console.error("[PUT /api/team/[id]] error:", error);
    return NextResponse.json(
      { success: false, error: "Yangilashda xatolik" },
      { status: 500 }
    );
  }
}

/** DELETE /api/team/[id] — Admin only */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: "Admin huquqi kerak" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const { deleteTeamMember } = await import("@/lib/team-store");
    const deleted = deleteTeamMember(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "A'zo topilmadi" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "A'zo muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    console.error("[DELETE /api/team/[id]] error:", error);
    return NextResponse.json(
      { success: false, error: "O'chirishda xatolik" },
      { status: 500 }
    );
  }
}

/** PATCH /api/team/[id] — Admin only */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdmin())) {
      return NextResponse.json(
        { success: false, error: "Admin huquqi kerak" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const action = request.nextUrl.searchParams.get("action");

    if (action === "toggle") {
      const { toggleTeamMemberStatus } = await import("@/lib/team-store");
      const toggled = toggleTeamMemberStatus(id);
      if (!toggled) {
        return NextResponse.json({ success: false, error: "A'zo topilmadi" }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: toggled, message: "Status o'zgartirildi" });
    }

    if (action === "reorder") {
      const newOrder = parseInt(request.nextUrl.searchParams.get("order") || "");
      if (isNaN(newOrder) || newOrder < 1 || newOrder > 9999) {
        return NextResponse.json({ success: false, error: "Noto'g'ri tartib raqami" }, { status: 400 });
      }
      const { reorderTeamMembers } = await import("@/lib/team-store");
      const ok = reorderTeamMembers(id, newOrder);
      if (!ok) {
        return NextResponse.json({ success: false, error: "A'zo topilmadi" }, { status: 404 });
      }
      return NextResponse.json({ success: true, message: "Tartib o'zgartirildi" });
    }

    return NextResponse.json(
      { success: false, error: "Noto'g'ri action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("[PATCH /api/team/[id]] error:", error);
    return NextResponse.json(
      { success: false, error: "Serverda xatolik" },
      { status: 500 }
    );
  }
}
