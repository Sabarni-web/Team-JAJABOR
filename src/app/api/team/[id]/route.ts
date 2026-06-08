import { NextRequest, NextResponse } from "next/server";
import { removeTeamMember } from "@/lib/team-store";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminKey = req.headers.get("x-admin-key");
    if (adminKey !== (process.env.ADMIN_SECRET_KEY || "jajabor-admin-2026")) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await removeTeamMember(Number(id));
    return NextResponse.json({ success: true, message: "Member deleted" });
  } catch (error) {
    console.error("DELETE /api/team error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete" }, { status: 500 });
  }
}
