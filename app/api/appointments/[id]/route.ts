import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json();

  const validStatuses = ["pending", "confirmed", "done", "cancelled"];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: "Trạng thái không hợp lệ" }, { status: 400 });
  }

  const rows = await sql`
    UPDATE appointments SET status = ${status} WHERE id = ${id} RETURNING *
  `;
  if (rows.length === 0) {
    return NextResponse.json({ error: "Không tìm thấy lịch hẹn" }, { status: 404 });
  }
  return NextResponse.json(rows[0]);
}
