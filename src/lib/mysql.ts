import mysql from "mysql2/promise";

let pool: mysql.Pool | null = null;

function getPool() {
  const connectionString = process.env.MYSQL_URL;

  if (!connectionString) {
    throw new Error("MYSQL_URL is not set");
  }

  if (!pool) {
    pool = mysql.createPool(connectionString);
  }

  return pool;
}

export async function createLeadTable() {
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS leads (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NULL,
      email VARCHAR(255) NOT NULL,
      company VARCHAR(255) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const newColumns = [
    { name: "phone", definition: "VARCHAR(50) NULL" },
    { name: "event_date", definition: "VARCHAR(100) NULL" },
    { name: "service_type", definition: "VARCHAR(100) NULL" },
    { name: "message", definition: "TEXT NULL" }
  ];

  for (const col of newColumns) {
    try {
      await pool.query(`ALTER TABLE leads ADD COLUMN ${col.name} ${col.definition}`);
    } catch (err) {
      // Ignore duplicate column errors
    }
  }
}

export async function insertLead(input: {
  name: string;
  email: string;
  phone?: string;
  event_date?: string;
  service_type?: string;
  message?: string;
  company?: string;
}) {
  await getPool().execute(
    "INSERT INTO leads (name, email, phone, event_date, service_type, message, company) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      input.name || null,
      input.email,
      input.phone || null,
      input.event_date || null,
      input.service_type || null,
      input.message || null,
      input.company || null,
    ],
  );
}

// ─── Team Members ────────────────────────────────────────────────────────────

export async function createTeamTable() {
  const pool = getPool();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS team_members (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NULL,
      specialization VARCHAR(100) NOT NULL,
      photo_url VARCHAR(500) NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export async function insertTeamMember(input: {
  name: string;
  email: string;
  phone?: string;
  specialization: string;
  photo_url?: string;
}) {
  const result = await getPool().execute(
    "INSERT INTO team_members (name, email, phone, specialization, photo_url) VALUES (?, ?, ?, ?, ?)",
    [input.name, input.email, input.phone || null, input.specialization, input.photo_url || null]
  );
  return result;
}

export async function getAllTeamMembers() {
  const pool = getPool();
  const [rows] = await pool.query(
    "SELECT * FROM team_members ORDER BY created_at DESC"
  );
  return rows;
}

export async function deleteTeamMember(id: number) {
  const pool = getPool();
  await pool.execute("DELETE FROM team_members WHERE id = ?", [id]);
}
