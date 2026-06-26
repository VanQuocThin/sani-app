import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await getSupabase().from("leads").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, phone, email, clinic, specialty, city, message, source } = body;
  if (!name) return NextResponse.json({ error: "Thiếu tên" }, { status: 400 });

  const { data, error } = await getSupabase().from("leads").insert([
    { name, phone, email, clinic, specialty, city, message, source: source ?? "register" }
  ]).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
