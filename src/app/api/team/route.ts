import { NextRequest, NextResponse } from "next/server";
import { addTeamMember, getTeamMembers } from "@/lib/team-store";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

function checkAdminKey(req: NextRequest) {
  const adminKey = req.headers.get("x-admin-key");
  return adminKey === (process.env.ADMIN_SECRET_KEY || "jajabor-admin-2026");
}

// GET /api/team — public
export async function GET() {
  try {
    const members = await getTeamMembers();
    return NextResponse.json({ success: true, data: members });
  } catch (error) {
    console.error("GET /api/team error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch team members" }, { status: 500 });
  }
}

// POST /api/team — admin protected
export async function POST(req: NextRequest) {
  try {
    if (!checkAdminKey(req)) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim() || "";
    const specialization = (formData.get("specialization") as string)?.trim();
    const photoFile = formData.get("photo") as File | null;

    if (!name || !email || !specialization) {
      return NextResponse.json({ success: false, error: "Name, email, and specialization are required" }, { status: 400 });
    }

    let photo_url: string | null = null;

    if (photoFile && photoFile.size > 0) {
      const bytes = await photoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      await mkdir(uploadsDir, { recursive: true });
      const ext = photoFile.name.split(".").pop() || "jpg";
      const filename = `team-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const filepath = path.join(uploadsDir, filename);
      await writeFile(filepath, buffer);
      photo_url = `/uploads/${filename}`;
    }

    const member = await addTeamMember({ name, email, phone, specialization, photo_url });

    return NextResponse.json({ success: true, message: "Team member added successfully", data: member });
  } catch (error) {
    console.error("POST /api/team error:", error);
    const message = error instanceof Error ? error.message : "Failed to add team member";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
