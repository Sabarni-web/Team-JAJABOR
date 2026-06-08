import { NextRequest } from "next/server";

export function isAdminRequest(req: NextRequest): boolean {
  const adminKey = req.headers.get("x-admin-key");
  return adminKey === (process.env.ADMIN_SECRET_KEY || "jajabor-admin-2026");
}

export const ADMIN_KEY = "jajabor-admin-2026";
