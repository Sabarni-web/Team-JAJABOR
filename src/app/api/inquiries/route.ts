import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getInquiries } from "@/lib/inquiries-store";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const inquiries = await getInquiries();
    return NextResponse.json({ success: true, data: inquiries });
  } catch (error) {
    console.error("GET /api/inquiries error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch inquiries" }, { status: 500 });
  }
}
