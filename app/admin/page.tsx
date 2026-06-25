"use client";

import { useEffect, useState } from "react";

type Lead = {
  id: string; name: string; phone: string; email: string;
  clinic: string; specialty: string; city: string; message: string;
  source: string; status: string; notes: string; created_at: string;
};

const ADMIN_PASS = "sani2026";

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  new:         { label: "Mới",          color: "#1e40af", bg: "#dbeafe" },
  contacted:   { label: "Đã liên hệ",   color: "#065f46", bg: "#d1fae5" },
  consulting:  { label: "Đang tư vấn",  color: "#92400e", bg: "#fef3c7" },
  converted:   { label: "Đã chốt",      color: "#ffffff", bg: "#00b96b" },
  lost:        { label: "Không tiềm năng", color: "#6b7280", bg: "#f3f4f6" },
};

export default function AdminPage() {
  const [auth, setAuth]         = useState(false);
  const [pass, setPass]         = useState("");
  const [leads, setLeads]       = useState<Lead[]>([]);
  const [loading, setLoading]   = useState(false);
  const [filter, setFilter]     = useState("all");
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [notes, setNotes]       = useState("");
  const [saving, setSaving]     = useState(false);

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (pass === ADMIN_PASS) { setAuth(true); load(); }
    else alert("Sai mật khẩu");
  }

  async function load() {
    setLoading(true);
    const data = await fetch("/api/leads").then(r => r.json());
    setLeads(data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  }

  async function saveNotes(id: string) {
    setSaving(true);
    await fetch(`/api/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    setLeads(prev => prev.map(l => l.id === id ? { ...l, notes } : l));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, notes } : null);
    setSaving(false);
  }

  function openDetail(lead: Lead) {
    setSelected(lead);
    setNotes(lead.notes ?? "");
  }

  function exportCSV() {
    const rows = [
      ["Tên","SĐT","Email","Phòng khám","Chuyên khoa","Tỉnh thành","Trạng thái","Nguồn","Ghi chú","Thời gian"],
      ...leads.map(l => [l.name, l.phone, l.email, l.clinic, l.specialty, l.city,
        STATUS_CONFIG[l.status]?.label ?? l.status, l.source === "contact" ? "Form tư vấn" : "Đăng ký app",
        l.notes ?? "", new Date(l.created_at).toLocaleString("vi-VN")]),
    ];
    const csv = rows.map(r => r.map(c => `"${(c ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `sani-leads-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  const filtered = leads.filter(l => {
    const matchStatus = filter === "all" || l.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || l.name?.toLowerCase().includes(q) || l.phone?.includes(q) || l.email?.toLowerCase().includes(q) || l.clinic?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const stats = {
    total:      leads.length,
    new:        leads.filter(l => l.status === "new").length,
    consulting: leads.filter(l => l.status === "consulting" || l.status === "contacted").length,
    converted:  leads.filter(l => l.status === "converted").length,
    today:      leads.filter(l => new Date(l.created_at).toDateString() === new Date().toDateString()).length,
  };

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f2235]">
        <form onSubmit={login} className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl">
          <div className="text-center mb-6">
            <span className="text-2xl font-bold text-[#00b96b]">Sani<span className="text-[#0f2235]">.</span></span>
            <p className="text-slate-500 text-sm mt-1">Admin — Quản lý người đăng ký</p>
          </div>
          <input type="password" value={pass} onChange={e => setPass(e.target.value)}
            placeholder="Mật khẩu admin" autoFocus
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#00b96b] mb-3" />
          <button type="submit" className="w-full bg-[#00b96b] text-white font-semibold py-2.5 rounded-lg text-sm hover:bg-[#009958]">Đăng nhập</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <span className="text-xl font-bold text-[#00b96b]">Sani<span className="text-[#0f2235]">.</span></span>
          <span className="text-sm text-slate-400 font-medium">CRM Leads</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} className="text-sm text-slate-500 hover:text-[#00b96b] transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100">↻ Làm mới</button>
          <button onClick={exportCSV} className="bg-[#0f2235] hover:bg-[#1a3550] text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors">↓ Xuất CSV</button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-5 gap-3 mb-5">
            {[
              { label: "Tổng leads",    value: stats.total,      color: "text-[#0f2235]" },
              { label: "Mới",           value: stats.new,        color: "text-blue-600"  },
              { label: "Đang tư vấn",   value: stats.consulting, color: "text-yellow-600"},
              { label: "Đã chốt",       value: stats.converted,  color: "text-[#00b96b]" },
              { label: "Hôm nay",       value: stats.today,      color: "text-purple-600"},
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-slate-200 text-center">
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-4">
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Tìm tên, SĐT, email, phòng khám..."
              className="flex-1 max-w-xs px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#00b96b] bg-white" />
            <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
              {[{ v: "all", l: "Tất cả" }, ...Object.entries(STATUS_CONFIG).map(([v, c]) => ({ v, l: c.label }))].map(tab => (
                <button key={tab.v} onClick={() => setFilter(tab.v)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${filter === tab.v ? "bg-[#00b96b] text-white" : "text-slate-500 hover:text-[#0f2235]"}`}>
                  {tab.l}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {loading ? (
              <div className="p-6 space-y-3">{Array.from({length:6}).map((_,i) => <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />)}</div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <p className="text-4xl mb-2">📋</p>
                <p className="font-medium">Chưa có leads nào</p>
                <p className="text-sm mt-1 text-slate-300">Người điền form trên landing page sẽ xuất hiện ở đây</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    {["Người đăng ký","Phòng khám","Chuyên khoa / Tỉnh","Nguồn","Trạng thái","Ngày đăng ký"].map(h => (
                      <th key={h} className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide text-left whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map(l => {
                    const st = STATUS_CONFIG[l.status] ?? STATUS_CONFIG.new;
                    return (
                      <tr key={l.id} onClick={() => openDetail(l)}
                        className={`hover:bg-slate-50 cursor-pointer transition-colors ${selected?.id === l.id ? "bg-[#e8f9f2]" : ""}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#e8f9f2] flex items-center justify-center text-[#00b96b] font-bold text-xs flex-shrink-0">
                              {l.name?.split(" ").pop()?.charAt(0) ?? "?"}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-[#0f2235]">{l.name}</p>
                              <p className="text-xs text-slate-400">{l.phone} {l.email ? `· ${l.email}` : ""}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{l.clinic || "—"}</td>
                        <td className="px-4 py-3"><p className="text-sm text-slate-600">{l.specialty || "—"}</p><p className="text-xs text-slate-400">{l.city || ""}</p></td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${l.source === "contact" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}`}>
                            {l.source === "contact" ? "Tư vấn" : "Đăng ký"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400 whitespace-nowrap">{new Date(l.created_at).toLocaleString("vi-VN")}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Detail panel */}
        {selected && (
          <div className="w-80 bg-white border-l border-slate-200 p-5 overflow-y-auto flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-[#0f2235]">Chi tiết</h3>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-slate-600 text-lg">×</button>
            </div>

            <div className="w-14 h-14 rounded-full bg-[#e8f9f2] flex items-center justify-center text-[#00b96b] font-bold text-xl mx-auto mb-3">
              {selected.name?.split(" ").pop()?.charAt(0) ?? "?"}
            </div>
            <p className="text-center font-bold text-[#0f2235] text-lg">{selected.name}</p>
            <p className="text-center text-sm text-slate-500 mb-4">{selected.clinic}</p>

            <div className="space-y-2 text-sm mb-5">
              {[["📞 SĐT", selected.phone],["📧 Email", selected.email],["🏥 Phòng khám", selected.clinic],["🩺 Chuyên khoa", selected.specialty],["📍 Tỉnh thành", selected.city]].map(([k,v]) => v ? (
                <div key={k} className="flex gap-2"><span className="text-slate-400 flex-shrink-0 w-28">{k}</span><span className="text-[#0f2235] font-medium">{v}</span></div>
              ) : null)}
              {selected.message && (
                <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 leading-relaxed">
                  <p className="font-semibold text-slate-500 mb-1">Quan tâm:</p>{selected.message}
                </div>
              )}
            </div>

            <div className="mb-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Trạng thái</p>
              <div className="grid grid-cols-1 gap-1.5">
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <button key={key} onClick={() => updateStatus(selected.id, key)}
                    className={`text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors border-2 ${selected.status === key ? "border-[#00b96b]" : "border-transparent hover:border-slate-200"}`}
                    style={{ background: cfg.bg, color: cfg.color }}>
                    {selected.status === key ? "✓ " : ""}{cfg.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Ghi chú</p>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Đã gọi lúc 14h, quan tâm Zalo OA..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none focus:border-[#00b96b] resize-none" />
              <button onClick={() => saveNotes(selected.id)} disabled={saving}
                className="w-full mt-2 bg-[#00b96b] hover:bg-[#009958] disabled:opacity-50 text-white text-sm font-semibold py-2 rounded-lg transition-colors">
                {saving ? "Đang lưu..." : "Lưu ghi chú"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
