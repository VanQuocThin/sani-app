import { NextResponse } from "next/server";
import { sql, DEFAULT_CLINIC_ID } from "@/lib/db";

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS clinics (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        specialty TEXT,
        city TEXT,
        phone TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS doctors (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        specialty TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS patients (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        phone TEXT,
        dob DATE,
        gender TEXT,
        address TEXT,
        bhyt_number TEXT,
        medical_history TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS appointments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
        patient_id UUID REFERENCES patients(id),
        doctor_id UUID REFERENCES doctors(id),
        scheduled_at TIMESTAMPTZ NOT NULL,
        type TEXT,
        status TEXT DEFAULT 'pending',
        source TEXT DEFAULT 'direct',
        notes TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        clinic_id UUID REFERENCES clinics(id) ON DELETE CASCADE,
        appointment_id UUID REFERENCES appointments(id),
        patient_id UUID REFERENCES patients(id),
        service TEXT NOT NULL,
        amount BIGINT NOT NULL,
        method TEXT DEFAULT 'cash',
        status TEXT DEFAULT 'pending',
        invoice_issued BOOLEAN DEFAULT FALSE,
        paid_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;

    // Tạo clinic mặc định nếu chưa có
    await sql`
      INSERT INTO clinics (id, name, specialty, city, phone)
      VALUES (
        ${DEFAULT_CLINIC_ID},
        'Phòng khám Sani Demo',
        'Đa khoa',
        'TP. Hồ Chí Minh',
        '0900 000 000'
      )
      ON CONFLICT (id) DO NOTHING
    `;

    // Tạo bác sĩ mặc định
    await sql`
      INSERT INTO doctors (clinic_id, name, specialty)
      VALUES
        (${DEFAULT_CLINIC_ID}, 'BS. Nguyễn Văn A', 'Đa khoa'),
        (${DEFAULT_CLINIC_ID}, 'BS. Trần Thị B', 'Da liễu'),
        (${DEFAULT_CLINIC_ID}, 'BS. Lê Văn C', 'Mắt')
      ON CONFLICT DO NOTHING
    `;

    return NextResponse.json({ ok: true, message: "Database setup hoàn tất" });
  } catch (err) {
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
