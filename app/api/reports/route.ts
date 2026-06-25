import { NextResponse } from "next/server";
import { sql, DEFAULT_CLINIC_ID } from "@/lib/db";

export async function GET() {
  const [
    totalPatients,
    newPatientsMonth,
    genderStats,
    ageGroups,
    topConditions,
    visitFrequency,
    monthlyPatients,
    recentPatients,
  ] = await Promise.all([
    // Tổng bệnh nhân
    sql`SELECT COUNT(*) AS count FROM patients WHERE clinic_id = ${DEFAULT_CLINIC_ID}`,

    // Bệnh nhân mới tháng này
    sql`SELECT COUNT(*) AS count FROM patients
        WHERE clinic_id = ${DEFAULT_CLINIC_ID}
        AND DATE_TRUNC('month', created_at) = DATE_TRUNC('month', NOW())`,

    // Phân bố giới tính
    sql`SELECT gender, COUNT(*) AS count FROM patients
        WHERE clinic_id = ${DEFAULT_CLINIC_ID} AND gender IS NOT NULL
        GROUP BY gender ORDER BY count DESC`,

    // Nhóm tuổi
    sql`SELECT
          CASE
            WHEN EXTRACT(YEAR FROM AGE(dob)) < 18 THEN 'Dưới 18'
            WHEN EXTRACT(YEAR FROM AGE(dob)) BETWEEN 18 AND 35 THEN '18–35'
            WHEN EXTRACT(YEAR FROM AGE(dob)) BETWEEN 36 AND 55 THEN '36–55'
            ELSE 'Trên 55'
          END AS age_group,
          COUNT(*) AS count
        FROM patients
        WHERE clinic_id = ${DEFAULT_CLINIC_ID} AND dob IS NOT NULL
        GROUP BY age_group ORDER BY count DESC`,

    // Bệnh/tình trạng phổ biến
    sql`SELECT medical_history AS condition, COUNT(*) AS count
        FROM patients
        WHERE clinic_id = ${DEFAULT_CLINIC_ID}
          AND medical_history IS NOT NULL AND medical_history != ''
        GROUP BY medical_history
        ORDER BY count DESC LIMIT 8`,

    // Tần suất khám: bệnh nhân theo số lần khám
    sql`SELECT
          CASE
            WHEN visit_count = 1 THEN 'Mới (1 lần)'
            WHEN visit_count BETWEEN 2 AND 4 THEN 'Tái khám (2–4 lần)'
            ELSE 'Thường xuyên (5+ lần)'
          END AS group,
          COUNT(*) AS patients
        FROM (
          SELECT patient_id, COUNT(*) AS visit_count
          FROM appointments
          WHERE clinic_id = ${DEFAULT_CLINIC_ID}
          GROUP BY patient_id
        ) t
        GROUP BY "group" ORDER BY patients DESC`,

    // Bệnh nhân mới theo tháng (6 tháng gần nhất)
    sql`SELECT
          TO_CHAR(DATE_TRUNC('month', created_at), 'MM/YYYY') AS month,
          COUNT(*) AS count
        FROM patients
        WHERE clinic_id = ${DEFAULT_CLINIC_ID}
          AND created_at >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY DATE_TRUNC('month', created_at)`,

    // Bệnh nhân gần đây nhất
    sql`SELECT p.name, p.phone, p.gender, p.dob, p.medical_history, p.created_at,
               COUNT(a.id) AS visit_count,
               MAX(a.scheduled_at) AS last_visit
        FROM patients p
        LEFT JOIN appointments a ON a.patient_id = p.id
        WHERE p.clinic_id = ${DEFAULT_CLINIC_ID}
        GROUP BY p.id, p.name, p.phone, p.gender, p.dob, p.medical_history, p.created_at
        ORDER BY p.created_at DESC LIMIT 10`,
  ]);

  return NextResponse.json({
    summary: {
      total_patients:      Number(totalPatients[0].count),
      new_this_month:      Number(newPatientsMonth[0].count),
    },
    gender_stats:    genderStats,
    age_groups:      ageGroups,
    top_conditions:  topConditions,
    visit_frequency: visitFrequency,
    monthly_patients: monthlyPatients,
    recent_patients: recentPatients,
  });
}
