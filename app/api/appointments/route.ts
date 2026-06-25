import { NextRequest, NextResponse } from "next/server";
import { sql, DEFAULT_CLINIC_ID } from "@/lib/db";

export async function GET() {
  const rows = await sql`
    SELECT
      a.*,
      p.name  AS patient_name,
      p.phone AS patient_phone,
      d.name  AS doctor_name
    FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.id
    LEFT JOIN doctors  d ON a.doctor_id  = d.id
    WHERE a.clinic_id = ${DEFAULT_CLINIC_ID}
    ORDER BY a.scheduled_at ASC
  `;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { patient_name, patient_phone, scheduled_at, type, notes, doctor_id } = body;

  if (!patient_name || !scheduled_at) {
    return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
  }

  // Tìm hoặc tạo bệnh nhân
  let patientId: string | null = null;
  if (patient_phone) {
    const existing = await sql`
      SELECT id FROM patients WHERE phone = ${patient_phone} AND clinic_id = ${DEFAULT_CLINIC_ID} LIMIT 1
    `;
    if (existing.length > 0) {
      patientId = existing[0].id;
    }
  }
  if (!patientId) {
    const newP = await sql`
      INSERT INTO patients (clinic_id, name, phone)
      VALUES (${DEFAULT_CLINIC_ID}, ${patient_name}, ${patient_phone || null})
      RETURNING id
    `;
    patientId = newP[0].id;
  }

  const rows = await sql`
    INSERT INTO appointments (clinic_id, patient_id, doctor_id, scheduled_at, type, notes, status)
    VALUES (
      ${DEFAULT_CLINIC_ID},
      ${patientId},
      ${doctor_id || null},
      ${scheduled_at},
      ${type || "Khám tổng quát"},
      ${notes || null},
      'pending'
    )
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}
