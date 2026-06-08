import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { addBooking, getBookings } from "@/lib/bookings-store";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const bookings = await getBookings();
    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error("GET /api/bookings error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const client_name = body.client_name?.trim();
    const email = body.email?.trim();
    const service = body.service?.trim();

    if (!client_name || !email || !service) {
      return NextResponse.json(
        { success: false, error: "Client name, email, and service are required" },
        { status: 400 },
      );
    }

    const booking = await addBooking({
      client_name,
      email,
      phone: body.phone?.trim(),
      service,
      event_date: body.event_date?.trim(),
      venue: body.venue?.trim(),
      package_price: Number(body.package_price) || 0,
      status: body.status || "pending",
      notes: body.notes?.trim(),
      source: "admin",
    });

    return NextResponse.json({ success: true, data: booking });
  } catch (error) {
    console.error("POST /api/bookings error:", error);
    return NextResponse.json({ success: false, error: "Failed to add booking" }, { status: 500 });
  }
}
