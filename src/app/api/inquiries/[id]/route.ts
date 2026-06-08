import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { getInquiryById, updateInquiryStatus } from "@/lib/inquiries-store";
import { addBooking, getBookings, updateBooking } from "@/lib/bookings-store";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    const inquiryId = Number(id);
    const body = await req.json();
    const status = body.status as "accepted" | "declined";

    if (status !== "accepted" && status !== "declined") {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    const inquiry = await updateInquiryStatus(inquiryId, status);
    if (!inquiry) {
      return NextResponse.json({ success: false, error: "Inquiry not found" }, { status: 404 });
    }

    if (status === "accepted") {
      const bookings = await getBookings();
      const linked = bookings.find((b) => b.inquiry_id === inquiryId);
      if (linked) {
        await updateBooking(linked.id, { status: "confirmed" });
      } else {
        await addBooking({
          client_name: inquiry.name,
          email: inquiry.email,
          phone: inquiry.phone,
          service: inquiry.service_type || "General",
          event_date: inquiry.event_date,
          venue: inquiry.message,
          status: "confirmed",
          notes: inquiry.message,
          source: "website",
          inquiry_id: inquiryId,
        });
      }
    }

    return NextResponse.json({ success: true, data: inquiry });
  } catch (error) {
    console.error("PATCH /api/inquiries error:", error);
    return NextResponse.json({ success: false, error: "Failed to update inquiry" }, { status: 500 });
  }
}
