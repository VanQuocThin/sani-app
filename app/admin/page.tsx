"use client";

import { useEffect, useState } from "react";

type Lead = { id: string; name: string; phone: string; email: string; clinic: string; specialty: string; city: string; message: string; source: string; created_at: string };

const ADMIN_PASS = "sani2026";

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (pass === ADMIN_PASS) { setAuth(true); loadLeads(); }
    else alert("Sai mật khẩu");
  }

  async function loadLeads() {
    setLoading(true);
    const data = await fetch("/api/leads").then((r) => r.json());
    setLeads(data);
    setLoading(false);
  }

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <form onSubmit={login} className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
          <h1 className="text-xl font-bold text-[#0f2235] mb-1">Admin Panel</h1>
          <p className="text-sm text-slate-500 mb-5">Quản lý người đăng ký Sani</p>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)}
            placeholder="Mật khẩu admin" autoFocus
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#00b96b] mb-3" />
          <button type="submit" className="w-full bg-[#00b96b] text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-[#009958]">Đăng nhập</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between">
        <div>
          <span className="text-xl font-bold text-[#00b96b]">Sani<span className="text-[#0f2235]">.</span></span>
          <span className="ml-3 text-sm text-slate-500 font-medium">Admin — Người đăng ký</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-[#00b96b]">{leads.length} leads</span>
          <button onClick={loadLeads} className="text-sm text-slate-500 hover:text-[#00b96b] transition-colors">↻ Làm mới</button>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: "Tổng đăng ký", value: leads.length, color: "text-[#00b96b]" },
            { label: "Từ form đăng ký", value: leads.filter(l => l.source === "register").length, color: "text-blue-600" },
            { label: "Từ form tư vấn", value: leads.filter(l => l.source === "contact").length, color: "text-purple-600" },
            { label: "Hôm nay", value: leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length, color: "text-orange-500" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-xl p-5 border border-slate-200">
              <p className="text-sm text-slate-500">{s.label}</p>
              <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100">
            <h2 className="font-bold text-[#0f2235]">Danh sách người đăng ký</h2>
          </div>
          {loading ? (
            <div className="p-6 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />)}</div>
          ) : leads.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-4xl mb-2">📋</p>
              <p className="font-medium">Chưa có ai đăng ký</p>
              <p className="text-sm mt-1">Người đăng ký qua form sẽ xuất hiện tại đây</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    {["Tên", "Email", "Số điện thoại", "Phòng khám", "Chuyên khoa", "Tỉnh/thành", "Nguồn", "Thời gian"].map(h => (
                      <th key={h} className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {leads.map(l => (
                    <tr key={l.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 text-sm font-semibold text-[#0f2235] whitespace-nowrap">{l.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{l.email || "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{l.phone || "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{l.clinic || "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{l.specialty || "—"}</td>
                      <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">{l.city || "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${l.source === "contact" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}>
                          {l.source === "contact" ? "Tư vấn" : "Đăng ký"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{new Date(l.created_at).toLocaleString("vi-VN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
