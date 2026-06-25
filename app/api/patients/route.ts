import { NextRequest, NextResponse } from "next/server";
import { sql, DEFAULT_CLINIC_ID } from "@/lib/db";

export async function GET() {
  const rows = await sql`
    SELECT * FROM patients
    WHERE clinic_id = ${DEFAULT_CLINIC_ID}
    ORDER BY created_at DESC
  `;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, dob, gender, address, bhyt_number, medical_history } = body;

  if (!name || !phone) {
    return NextResponse.json({ error: "Thiếu tên hoặc số điện thoại" }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO patients (clinic_id, name, phone, dob, gender, address, bhyt_number, medical_history)
    VALUES (
      ${DEFAULT_CLINIC_ID},
      ${name},
      ${phone},
      ${dob || null},
      ${gender || null},
      ${address || null},
      ${bhyt_number || null},
      ${medical_history || null}
    )
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}
