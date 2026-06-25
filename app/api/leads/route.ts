import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  const rows = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, email, clinic, specialty, city, message, source } = body;
  if (!name) return NextResponse.json({ error: "Thiếu tên" }, { status: 400 });

  const rows = await sql`
    INSERT INTO leads (name, phone, email, clinic, specialty, city, message, source)
    VALUES (${name}, ${phone ?? null}, ${email ?? null}, ${clinic ?? null}, ${specialty ?? null}, ${city ?? null}, ${message ?? null}, ${source ?? "register"})
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}
