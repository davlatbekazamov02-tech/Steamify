/**
 * TEAM MEMBER BY ID API ROUTE
 * Admin Panel - Alohida a'zoni boshqarish
 * GET: A'zo ma'lumotlarini olish
 * PUT: A'zoni yangilash
 * DELETE: A'zoni o'chirish
 * PATCH: A'zo statusini o'zgartirish (faol/nofaol)
 */

import { NextRequest, NextResponse } from "next/server";
import {
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
  toggleTeamMemberStatus,
  reorderTeamMembers,
} from "@/lib/team-store";

export const dynamic = "force-dynamic";

/**
 * GET /api/team/[id]
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const member = getTeamMemberById(id);

    if (!member) {
      return NextResponse.json(
        {
          success: false,
          error: "A'zo topilmadi",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: member,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Serverda xatolik",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/team/[id]
 * Body: Partial<Omit<TeamMember, "id" | "createdAt">>
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updated = updateTeamMember(id, body);

    if (!updated) {
      return NextResponse.json(
        {
          success: false,
          error: "A'zo topilmadi",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "A'zo muvaffaqiyatli yangilandi",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Yangilashda xatolik",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/team/[id]
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = deleteTeamMember(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: "A'zo topilmadi",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "A'zo muvaffaqiyatli o'chirildi",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "O'chirishda xatolik",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/team/[id]
 * Query params:
 *   ?action=toggle - Statusni o'zgartirish
 *   ?action=reorder&order=5 - Tartibni o'zgartirish
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get("action");

    if (action === "toggle") {
      // Status o'zgartirish
      const toggled = toggleTeamMemberStatus(id);

      if (!toggled) {
        return NextResponse.json(
          {
            success: false,
            error: "A'zo topilmadi",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: toggled,
        message: "Status muvaffaqiyatli o'zgartirildi",
      });
    }

    if (action === "reorder") {
      // Tartib o'zgartirish
      const newOrder = parseInt(searchParams.get("order") || "1");

      if (isNaN(newOrder) || newOrder < 1) {
        return NextResponse.json(
          {
            success: false,
            error: "Noto'g'ri tartib raqami",
          },
          { status: 400 }
        );
      }

      const reordered = reorderTeamMembers(id, newOrder);

      if (!reordered) {
        return NextResponse.json(
          {
            success: false,
            error: "A'zo topilmadi",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Tartib muvaffaqiyatli o'zgartirildi",
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: "Noto'g'ri action parametri",
      },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Serverda xatolik",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
