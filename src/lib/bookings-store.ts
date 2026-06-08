import { readJsonFile, writeJsonFile, nextId } from "@/lib/json-store";

export type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Booking {
  id: number;
  client_name: string;
  email: string;
  phone: string;
  service: string;
  event_date: string;
  venue: string;
  package_price: number;
  status: BookingStatus;
  notes: string;
  source: "website" | "admin";
  inquiry_id?: number;
  created_at: string;
}

const FILE = "bookings.json";

export async function getBookings(): Promise<Booking[]> {
  const items = await readJsonFile<Booking[]>(FILE, []);
  return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function addBooking(input: {
  client_name: string;
  email: string;
  phone?: string;
  service: string;
  event_date?: string;
  venue?: string;
  package_price?: number;
  status?: BookingStatus;
  notes?: string;
  source?: "website" | "admin";
  inquiry_id?: number;
}): Promise<Booking> {
  const items = await readJsonFile<Booking[]>(FILE, []);
  const booking: Booking = {
    id: nextId(items),
    client_name: input.client_name,
    email: input.email,
    phone: input.phone || "",
    service: input.service,
    event_date: input.event_date || "",
    venue: input.venue || "",
    package_price: input.package_price ?? 0,
    status: input.status || "pending",
    notes: input.notes || "",
    source: input.source || "admin",
    inquiry_id: input.inquiry_id,
    created_at: new Date().toISOString(),
  };
  items.unshift(booking);
  await writeJsonFile(FILE, items);
  return booking;
}

export async function updateBooking(
  id: number,
  updates: Partial<Omit<Booking, "id" | "created_at">>
): Promise<Booking | null> {
  const items = await readJsonFile<Booking[]>(FILE, []);
  const idx = items.findIndex((b) => b.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...updates };
  await writeJsonFile(FILE, items);
  return items[idx];
}

export async function deleteBooking(id: number): Promise<boolean> {
  const items = await readJsonFile<Booking[]>(FILE, []);
  const filtered = items.filter((b) => b.id !== id);
  if (filtered.length === items.length) return false;
  await writeJsonFile(FILE, filtered);
  return true;
}
