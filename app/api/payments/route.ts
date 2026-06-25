import { NextRequest, NextResponse } from "next/server";
import { sql, DEFAULT_CLINIC_ID } from "@/lib/db";

export async function GET() {
  const rows = await sql`
    SELECT
      pay.*,
      p.name AS patient_name
    FROM payments pay
    LEFT JOIN patients p ON pay.patient_id = p.id
    WHERE pay.clinic_id = ${DEFAULT_CLINIC_ID}
    ORDER BY pay.created_at DESC
  `;
  return NextResponse.json(rows);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { patient_id, service, amount, method, appointment_id } = body;

  if (!service || !amount) {
    return NextResponse.json({ error: "Thiếu thông tin bắt buộc" }, { status: 400 });
  }

  const rows = await sql`
    INSERT INTO payments (clinic_id, patient_id, appointment_id, service, amount, method, status, paid_at)
    VALUES (
      ${DEFAULT_CLINIC_ID},
      ${patient_id || null},
      ${appointment_id || null},
      ${service},
      ${amount},
      ${method || "cash"},
      'paid',
      NOW()
    )
    RETURNING *
  `;
  return NextResponse.json(rows[0], { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { id, status, invoice_issued } = await req.json();
  const rows = await sql`
    UPDATE payments
    SET
      status = COALESCE(${status ?? null}, status),
      invoice_issued = COALESCE(${invoice_issued ?? null}, invoice_issued),
      paid_at = CASE WHEN ${status ?? null} = 'paid' THEN NOW() ELSE paid_at END
    WHERE id = ${id}
    RETURNING *
  `;
  return NextResponse.json(rows[0]);
}
