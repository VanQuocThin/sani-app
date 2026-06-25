"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

type Stats = {
  appointments_today: number;
  appointments_pending: number;
  total_patients: number;
  revenue_today: number;
  revenue_month: number;
};

type Appointment = {
  id: string;
  scheduled_at: string;
  type: string;
  status: string;
  source: string;
  patient_name: string;
};

const statusVariant: Record<string, "green" | "blue" | "yellow" | "gray"> = {
  done: "green", confirmed: "blue", pending: "yellow", cancelled: "gray",
};
const statusLabel: Record<string, string> = {
  done: "Hoàn thành", confirmed: "Đã xác nhận", pending: "Chờ xác nhận", cancelled: "Đã hủy",
};

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then((data) => { setStats(data.stats); setAppointments(data.today_appointments); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const today = new Date().toLocaleDateString("vi-VN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  const statCards = stats ? [
    { label: "Lịch hẹn hôm nay",   value: String(stats.appointments_today),                           sub: `${stats.appointments_pending} chưa xác nhận`, icon: "📅", color: "text-blue-600 bg-blue-50" },
    { label: "Tổng bệnh nhân",      value: String(stats.total_patients),                               sub: "Trong hệ thống",                              icon: "👥", color: "text-[#00b96b] bg-[#e8f9f2]" },
    { label: "Doanh thu hôm nay",   value: stats.revenue_today.toLocaleString("vi-VN") + "đ",          sub: "Đã thu",                                      icon: "💰", color: "text-purple-600 bg-purple-50" },
    { label: "Doanh thu tháng này", value: (stats.revenue_month / 1_000_000).toFixed(1) + "tr đ",      sub: "Tháng hiện tại",                              icon: "📊", color: "text-orange-500 bg-orange-50" },
  ] : [];

  return (
    <div className="min-h-full">
      <Header title="Tổng quan" subtitle={today}
        action={
          <Link href="/appointments" className="bg-[#00b96b] hover:bg-[#009958] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            + Thêm lịch hẹn
          </Link>
        }
      />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-4 gap-4">
          {loading ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-2/3 mb-3" /><div className="h-8 bg-slate-200 rounded w-1/2" />
            </div>
          )) : statCards.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">{s.label}</p>
                  <p className="text-2xl font-bold text-[#0f2235] mt-1">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${s.color}`}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-white rounded-xl border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-[#0f2235]">Lịch hẹn hôm nay</h2>
              <Link href="/appointments" className="text-sm text-[#00b96b] hover:underline font-medium">Xem tất cả →</Link>
            </div>
            {loading ? (
              <div className="p-5 space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />)}</div>
            ) : appointments.length === 0 ? (
              <div className="text-center py-12 text-slate-400"><p className="text-3xl mb-2">📅</p><p className="text-sm">Chưa có lịch hẹn hôm nay</p></div>
            ) : (
              <div className="divide-y divide-slate-50">
                {appointments.map((a) => (
                  <div key={a.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors">
                    <span className="text-sm font-bold text-slate-400 w-12 flex-shrink-0">
                      {new Date(a.scheduled_at).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0f2235] truncate">{a.patient_name}</p>
                      <p className="text-xs text-slate-400">{a.type}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {a.source === "zalo" && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">Zalo</span>}
                      <Badge variant={statusVariant[a.status] ?? "gray"}>{statusLabel[a.status] ?? a.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-bold text-[#0f2235] mb-3">Thao tác nhanh</h2>
              <div className="space-y-1">
                {[
                  { icon: "📅", label: "Thêm lịch hẹn", href: "/appointments" },
                  { icon: "👤", label: "Thêm bệnh nhân", href: "/patients" },
                  { icon: "💳", label: "Tạo hóa đơn", href: "/payments" },
                  { icon: "📊", label: "Xem báo cáo", href: "/reports" },
                ].map((item) => (
                  <Link key={item.label} href={item.href}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm text-[#0f2235] font-medium">
                    <span className="text-base">{item.icon}</span>{item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div className="bg-[#e8f9f2] rounded-xl border border-[#00b96b]/20 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💡</span>
                <h3 className="text-sm font-bold text-[#0f2235]">Kết nối Zalo OA</h3>
              </div>
              <p className="text-xs text-slate-600 mb-3">Tự động nhắc lịch hẹn qua Zalo, tăng tỷ lệ xác nhận lên 90%.</p>
              <button className="w-full bg-[#00b96b] text-white text-xs font-semibold py-2 rounded-lg hover:bg-[#009958] transition-colors">Kết nối ngay</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
