import { NextResponse } from "next/server";
import { addInquiry } from "@/lib/inquiries-store";
import { addBooking } from "@/lib/bookings-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string;
      email?: string;
      phone?: string;
      eventDate?: string;
      serviceType?: string;
      message?: string;
    };

    const email = body.email?.trim();
    const name = body.name?.trim();

    if (!email || !name) {
      return NextResponse.json({ message: "Name and email are required." }, { status: 400 });
    }

    const inquiry = await addInquiry({
      name,
      email,
      phone: body.phone?.trim(),
      event_date: body.eventDate?.trim(),
      service_type: body.serviceType?.trim(),
      message: body.message?.trim(),
    });

    await addBooking({
      client_name: name,
      email,
      phone: body.phone?.trim(),
      service: body.serviceType?.trim() || "General",
      event_date: body.eventDate?.trim(),
      venue: body.message?.trim() || "",
      status: "pending",
      notes: body.message?.trim(),
      source: "website",
      inquiry_id: inquiry.id,
    });

    return NextResponse.json({ message: "Booking request submitted successfully! We will contact you shortly." });
  } catch (error) {
    console.error("Booking submission failed", error);
    return NextResponse.json(
      { message: "Unable to save your booking request right now." },
      { status: 500 },
    );
  }
}
