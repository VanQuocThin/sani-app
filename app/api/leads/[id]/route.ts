import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { status, notes } = await req.json();
  const rows = await sql`
    UPDATE leads SET
      status = COALESCE(${status ?? null}, status),
      notes  = COALESCE(${notes  ?? null}, notes)
    WHERE id = ${params.id}
    RETURNING *
  `;
  return NextResponse.json(rows[0]);
}
