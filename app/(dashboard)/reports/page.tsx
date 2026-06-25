"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { getUser } from "@/lib/auth";

type ReportData = {
  summary: { total_patients: number; new_this_month: number };
  gender_stats: { gender: string; count: number }[];
  age_groups: { age_group: string; count: number }[];
  top_conditions: { condition: string; count: number }[];
  visit_frequency: { group: string; patients: number }[];
  monthly_patients: { month: string; count: number }[];
  recent_patients: { name: string; phone: string; gender: string; dob: string; medical_history: string; created_at: string; visit_count: number; last_visit: string }[];
};

export default function ReportsPage() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const user = getUser();

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const maxMonthly = Math.max(...(data?.monthly_patients.map((m) => Number(m.count)) ?? [1]));
  const maxCondition = Math.max(...(data?.top_conditions.map((c) => Number(c.count)) ?? [1]));
  const totalGender = data?.gender_stats.reduce((s, g) => s + Number(g.count), 0) ?? 1;

  return (
    <div className="min-h-full">
      <Header
        title="Phân tích bệnh nhân"
        subtitle={user ? `Phòng khám: ${user.clinic}` : "Báo cáo chuyên sâu"}
        action={
          <button className="border border-slate-200 hover:border-[#00b96b] hover:text-[#00b96b] text-slate-600 text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            ↓ Xuất Excel
          </button>
        }
      />

      <div className="p-6 space-y-5">
        {/* Tổng quan */}
        <div className="grid grid-cols-4 gap-4">
          {loading ? Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 border border-slate-200 animate-pulse"><div className="h-4 bg-slate-200 rounded w-2/3 mb-3" /><div className="h-8 bg-slate-200 rounded w-1/2" /></div>
          )) : [
            { label: "Tổng bệnh nhân",     value: String(data?.summary.total_patients ?? 0),   icon: "👥", color: "text-[#00b96b] bg-[#e8f9f2]" },
            { label: "Bệnh nhân mới tháng này", value: String(data?.summary.new_this_month ?? 0), icon: "🆕", color: "text-blue-600 bg-blue-50" },
            { label: "Bệnh nhân tái khám",  value: String(data?.visit_frequency.find(v => v.group.includes("Tái"))?.patients ?? 0), icon: "🔄", color: "text-purple-600 bg-purple-50" },
            { label: "Bệnh nhân thường xuyên", value: String(data?.visit_frequency.find(v => v.group.includes("Thường"))?.patients ?? 0), icon: "⭐", color: "text-orange-500 bg-orange-50" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">{s.label}</p>
                  <p className="text-2xl font-bold text-[#0f2235] mt-1">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${s.color}`}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Bệnh nhân mới theo tháng */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-bold text-[#0f2235] mb-4">Bệnh nhân mới theo tháng</h3>
            {loading ? <div className="h-36 bg-slate-100 rounded animate-pulse" /> : data?.monthly_patients.length === 0 ? (
              <div className="h-36 flex items-center justify-center text-slate-400 text-sm">Chưa có dữ liệu</div>
            ) : (
              <div className="flex items-end gap-3 h-36">
                {data?.monthly_patients.map((m) => (
                  <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-semibold text-slate-500">{m.count}</span>
                    <div className="w-full rounded-t-md bg-[#00b96b]/80 hover:bg-[#00b96b] transition-colors"
                      style={{ height: `${(Number(m.count) / maxMonthly) * 100}%`, minHeight: 8 }} />
                    <span className="text-xs text-slate-400 font-medium">{m.month.split("/")[0]}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Phân bố giới tính & nhóm tuổi */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-bold text-[#0f2235] mb-4">Giới tính & Nhóm tuổi</h3>
            {loading ? <div className="h-36 bg-slate-100 rounded animate-pulse" /> : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Giới tính</p>
                  {data?.gender_stats.length === 0 ? <p className="text-xs text-slate-400">Chưa có dữ liệu</p> : (
                    <div className="space-y-2">
                      {data?.gender_stats.map((g) => (
                        <div key={g.gender}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-600 font-medium">{g.gender}</span>
                            <span className="text-slate-500">{Math.round((Number(g.count) / totalGender) * 100)}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full">
                            <div className="h-full bg-[#00b96b] rounded-full" style={{ width: `${(Number(g.count) / totalGender) * 100}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Nhóm tuổi</p>
                  {data?.age_groups.length === 0 ? <p className="text-xs text-slate-400">Chưa có dữ liệu</p> : (
                    <div className="space-y-1.5">
                      {data?.age_groups.map((a) => (
                        <div key={a.age_group} className="flex justify-between items-center text-xs">
                          <span className="text-slate-600">{a.age_group}</span>
                          <span className="font-bold text-[#0f2235]">{a.count} người</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Tình trạng bệnh phổ biến */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-bold text-[#0f2235] mb-4">Tình trạng bệnh phổ biến</h3>
            {loading ? <div className="h-48 bg-slate-100 rounded animate-pulse" /> : data?.top_conditions.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                <p className="text-3xl mb-2">📋</p>
                <p className="text-sm">Chưa có dữ liệu tiền sử bệnh</p>
                <p className="text-xs mt-1 text-slate-300">Thêm bệnh nhân với tiền sử bệnh để xem thống kê</p>
              </div>
            ) : (
              <div className="space-y-3">
                {data?.top_conditions.map((c) => (
                  <div key={c.condition} className="flex items-center gap-3">
                    <span className="text-sm text-[#0f2235] font-medium w-36 flex-shrink-0 truncate">{c.condition}</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full">
                      <div className="h-full bg-[#00b96b]/70 rounded-full" style={{ width: `${(Number(c.count) / maxCondition) * 100}%` }} />
                    </div>
                    <span className="text-xs font-bold text-slate-500 w-12 text-right">{c.count} BN</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tần suất khám */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-bold text-[#0f2235] mb-4">Tần suất khám</h3>
            {loading ? <div className="h-48 bg-slate-100 rounded animate-pulse" /> : data?.visit_frequency.length === 0 ? (
              <div className="h-48 flex flex-col items-center justify-center text-slate-400">
                <p className="text-3xl mb-2">📅</p>
                <p className="text-sm">Chưa có lịch hẹn nào</p>
              </div>
            ) : (
              <div className="space-y-4 mt-2">
                {data?.visit_frequency.map((v) => {
                  const total = data.visit_frequency.reduce((s, x) => s + Number(x.patients), 0);
                  const pct = Math.round((Number(v.patients) / total) * 100);
                  const colors = ["bg-[#00b96b]", "bg-blue-400", "bg-purple-400"];
                  const colorIdx = data.visit_frequency.indexOf(v);
                  return (
                    <div key={v.group}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-[#0f2235]">{v.group}</span>
                        <span className="text-xs text-slate-500">{v.patients} bệnh nhân ({pct}%)</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full">
                        <div className={`h-full rounded-full ${colors[colorIdx] ?? "bg-slate-400"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Danh sách bệnh nhân gần đây */}
        <div className="bg-white rounded-xl border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-[#0f2235]">Bệnh nhân gần đây</h3>
            <span className="text-xs text-slate-400">10 bệnh nhân mới nhất</span>
          </div>
          {loading ? (
            <div className="p-5 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-10 bg-slate-100 rounded animate-pulse" />)}</div>
          ) : !data?.recent_patients.length ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-3xl mb-2">👥</p>
              <p className="font-medium">Chưa có bệnh nhân nào</p>
              <p className="text-sm mt-1">Thêm bệnh nhân ở trang Bệnh nhân để xem phân tích</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left">
                  {["Bệnh nhân", "Giới tính / Tuổi", "Tình trạng bệnh", "Số lần khám", "Lần khám gần nhất"].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.recent_patients.map((p) => {
                  const age = p.dob ? Math.floor((Date.now() - new Date(p.dob).getTime()) / (1000 * 60 * 60 * 24 * 365)) : null;
                  return (
                    <tr key={p.name + p.phone} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#e8f9f2] flex items-center justify-center text-[#00b96b] font-bold text-xs flex-shrink-0">
                            {p.name.split(" ").pop()?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#0f2235]">{p.name}</p>
                            <p className="text-xs text-slate-400">{p.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-600">{p.gender ?? "—"} {age ? `· ${age} tuổi` : ""}</td>
                      <td className="px-5 py-3 text-sm text-slate-500">{p.medical_history || "—"}</td>
                      <td className="px-5 py-3">
                        <span className="text-sm font-bold text-[#0f2235]">{p.visit_count}</span>
                        <span className="text-xs text-slate-400 ml-1">lần</span>
                      </td>
                      <td className="px-5 py-3 text-sm text-slate-400">
                        {p.last_visit ? new Date(p.last_visit).toLocaleDateString("vi-VN") : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
