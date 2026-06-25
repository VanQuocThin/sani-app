import { NextResponse } from "next/server";
import { sql, DEFAULT_CLINIC_ID } from "@/lib/db";

export async function GET() {
  const today = new Date().toISOString().split("T")[0];

  const [apptToday, apptPending, patients, revenueToday, revenueMonth] = await Promise.all([
    sql`
      SELECT COUNT(*) AS count FROM appointments
      WHERE clinic_id = ${DEFAULT_CLINIC_ID}
        AND DATE(scheduled_at) = ${today}
    `,
    sql`
      SELECT COUNT(*) AS count FROM appointments
      WHERE clinic_id = ${DEFAULT_CLINIC_ID}
        AND DATE(scheduled_at) = ${today}
        AND status = 'pending'
    `,
    sql`
      SELECT COUNT(*) AS count FROM patients
      WHERE clinic_id = ${DEFAULT_CLINIC_ID}
    `,
    sql`
      SELECT COALESCE(SUM(amount), 0) AS total FROM payments
      WHERE clinic_id = ${DEFAULT_CLINIC_ID}
        AND status = 'paid'
        AND DATE(paid_at) = ${today}
    `,
    sql`
      SELECT COALESCE(SUM(amount), 0) AS total FROM payments
      WHERE clinic_id = ${DEFAULT_CLINIC_ID}
        AND status = 'paid'
        AND DATE_TRUNC('month', paid_at) = DATE_TRUNC('month', NOW())
    `,
  ]);

  const todayAppointments = await sql`
    SELECT
      a.id, a.scheduled_at, a.type, a.status, a.source,
      p.name  AS patient_name,
      p.phone AS patient_phone
    FROM appointments a
    LEFT JOIN patients p ON a.patient_id = p.id
    WHERE a.clinic_id = ${DEFAULT_CLINIC_ID}
      AND DATE(a.scheduled_at) = ${today}
    ORDER BY a.scheduled_at ASC
    LIMIT 10
  `;

  return NextResponse.json({
    stats: {
      appointments_today:   Number(apptToday[0].count),
      appointments_pending: Number(apptPending[0].count),
      total_patients:       Number(patients[0].count),
      revenue_today:        Number(revenueToday[0].total),
      revenue_month:        Number(revenueMonth[0].total),
    },
    today_appointments: todayAppointments,
  });
}
