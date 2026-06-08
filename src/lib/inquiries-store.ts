import { readJsonFile, writeJsonFile, nextId } from "@/lib/json-store";

export type InquiryStatus = "new" | "accepted" | "declined";

export interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  event_date: string;
  service_type: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
}

const FILE = "inquiries.json";

export async function getInquiries(): Promise<Inquiry[]> {
  const items = await readJsonFile<Inquiry[]>(FILE, []);
  return items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function addInquiry(input: {
  name: string;
  email: string;
  phone?: string;
  event_date?: string;
  service_type?: string;
  message?: string;
}): Promise<Inquiry> {
  const items = await readJsonFile<Inquiry[]>(FILE, []);
  const inquiry: Inquiry = {
    id: nextId(items),
    name: input.name,
    email: input.email,
    phone: input.phone || "",
    event_date: input.event_date || "",
    service_type: input.service_type || "",
    message: input.message || "",
    status: "new",
    created_at: new Date().toISOString(),
  };
  items.unshift(inquiry);
  await writeJsonFile(FILE, items);
  return inquiry;
}

export async function updateInquiryStatus(id: number, status: InquiryStatus): Promise<Inquiry | null> {
  const items = await readJsonFile<Inquiry[]>(FILE, []);
  const idx = items.findIndex((i) => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], status };
  await writeJsonFile(FILE, items);
  return items[idx];
}

export async function getInquiryById(id: number): Promise<Inquiry | null> {
  const items = await readJsonFile<Inquiry[]>(FILE, []);
  return items.find((i) => i.id === id) ?? null;
}
