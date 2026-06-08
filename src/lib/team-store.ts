import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";

export interface TeamMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  photo_url: string | null;
  created_at: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "team-members.json");

function useMysql() {
  return Boolean(process.env.MYSQL_URL?.trim());
}

async function readFileStore(): Promise<TeamMember[]> {
  try {
    const raw = await readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeFileStore(members: TeamMember[]) {
  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify(members, null, 2), "utf-8");
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  if (useMysql()) {
    const { createTeamTable, getAllTeamMembers } = await import("@/lib/mysql");
    await createTeamTable();
    return (await getAllTeamMembers()) as TeamMember[];
  }
  return readFileStore();
}

export async function addTeamMember(input: {
  name: string;
  email: string;
  phone?: string;
  specialization: string;
  photo_url?: string | null;
}): Promise<TeamMember> {
  if (useMysql()) {
    const { createTeamTable, insertTeamMember } = await import("@/lib/mysql");
    await createTeamTable();
    await insertTeamMember({ ...input, photo_url: input.photo_url ?? undefined });
    const members = await getTeamMembers();
    return members[0];
  }

  const members = await readFileStore();
  const nextId = members.length > 0 ? Math.max(...members.map((m) => m.id)) + 1 : 1;
  const member: TeamMember = {
    id: nextId,
    name: input.name,
    email: input.email,
    phone: input.phone || "",
    specialization: input.specialization,
    photo_url: input.photo_url ?? null,
    created_at: new Date().toISOString(),
  };
  members.unshift(member);
  await writeFileStore(members);
  return member;
}

export async function removeTeamMember(id: number): Promise<void> {
  if (useMysql()) {
    const { deleteTeamMember } = await import("@/lib/mysql");
    await deleteTeamMember(id);
    return;
  }

  const members = await readFileStore();
  await writeFileStore(members.filter((m) => m.id !== id));
}
