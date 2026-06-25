"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Badge from "@/components/ui/Badge";

type Appointment = { id: string; scheduled_at: string; type: string; status: string; source: string; patient_name: string; patient_phone: string; doctor_name: string };

const statusVariant: Record<string, "green" | "blue" | "yellow" | "gray"> = { done: "green", confirmed: "blue", pending: "yellow", cancelled: "gray" };
const statusLabel: Record<string, string> = { done: "Hoàn thành", confirmed: "Đã xác nhận", pending: "Chờ xác nhận", cancelled: "Đã hủy" };

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ date: "", time: "", patient_name: "", patient_phone: "", type: "Khám tổng quát", notes: "" });

  useEffect(() => { fetchAppointments(); }, []);

  async function fetchAppointments() {
    setLoading(true);
    const data = await fetch("/api/appointments").then((r) => r.json());
    setAppointments(data);
    setLoading(false);
  }

  const [saveError, setSaveError] = useState("");

  async function saveAppointment() {
    if (!form.date || !form.time || !form.patient_name) return;
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, scheduled_at: `${form.date}T${form.time}:00` }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        setSaveError(err.error ?? `Lỗi ${res.status} — thử chạy /api/setup trước`);
        setSaving(false);
        return;
      }
      setShowModal(false);
      setForm({ date: "", time: "", patient_name: "", patient_phone: "", type: "Khám tổng quát", notes: "" });
      fetchAppointments();
    } catch {
      setSaveError("Không kết nối được server — kiểm tra DATABASE_URL");
    }
    setSaving(false);
  }

  async function updateStatus(id: string, status: string) {
    await fetch(`/api/appointments/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    fetchAppointments();
  }

  const filtered = appointments.filter((a) => {
    const matchSearch = (a.patient_name ?? "").toLowerCase().includes(search.toLowerCase()) || (a.patient_phone ?? "").includes(search);
    return matchSearch && (filter === "all" || a.status === filter);
  });

  return (
    <div className="min-h-full">
      <Header title="Lịch hẹn" subtitle={`${appointments.length} lịch hẹn`}
        action={<button onClick={() => setShowModal(true)} className="bg-[#00b96b] hover:bg-[#009958] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">+ Thêm lịch hẹn</button>}
      />
      <div className="p-6">
        <div className="flex items-center gap-3 mb-5">
          <input type="text" placeholder="Tìm tên hoặc số điện thoại..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-xs px-4 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] bg-white" />
          <div className="flex gap-1 bg-white border border-slate-200 rounded-lg p-1">
            {[{ value: "all", label: "Tất cả" }, { value: "pending", label: "Chờ xác nhận" }, { value: "confirmed", label: "Đã xác nhận" }, { value: "done", label: "Hoàn thành" }].map((tab) => (
              <button key={tab.value} onClick={() => setFilter(tab.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${filter === tab.value ? "bg-[#00b96b] text-white" : "text-slate-500 hover:text-[#0f2235]"}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-5 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400"><p className="text-4xl mb-2">📅</p><p className="font-medium">Chưa có lịch hẹn nào</p></div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left">
                  {["Giờ / Ngày", "Bệnh nhân", "Loại khám", "Bác sĩ", "Trạng thái", "Thao tác"].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((a) => {
                  const dt = new Date(a.scheduled_at);
                  return (
                    <tr key={a.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-3"><p className="text-sm font-bold text-[#0f2235]">{dt.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</p><p className="text-xs text-slate-400">{dt.toLocaleDateString("vi-VN")}</p></td>
                      <td className="px-5 py-3"><p className="text-sm font-semibold text-[#0f2235]">{a.patient_name ?? "—"}</p><p className="text-xs text-slate-400">{a.patient_phone}</p></td>
                      <td className="px-5 py-3"><p className="text-sm text-slate-600">{a.type}</p>{a.source === "zalo" && <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium">Zalo</span>}</td>
                      <td className="px-5 py-3 text-sm text-slate-500">{a.doctor_name ?? "—"}</td>
                      <td className="px-5 py-3"><Badge variant={statusVariant[a.status] ?? "gray"}>{statusLabel[a.status] ?? a.status}</Badge></td>
                      <td className="px-5 py-3">
                        <div className="flex gap-2">
                          {a.status === "pending" && <button onClick={() => updateStatus(a.id, "confirmed")} className="text-xs text-blue-600 hover:underline font-medium">Xác nhận</button>}
                          {a.status === "confirmed" && <button onClick={() => updateStatus(a.id, "done")} className="text-xs text-[#00b96b] hover:underline font-medium">Hoàn thành</button>}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-[#0f2235]">Thêm lịch hẹn mới</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-xs font-semibold text-slate-600 mb-1">Ngày khám *</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b]" /></div>
                <div><label className="block text-xs font-semibold text-slate-600 mb-1">Giờ khám *</label>
                  <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b]" /></div>
              </div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Tên bệnh nhân *</label>
                <input type="text" value={form.patient_name} onChange={(e) => setForm({ ...form, patient_name: e.target.value })} placeholder="Nguyễn Thị A" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b]" /></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Số điện thoại</label>
                <input type="tel" value={form.patient_phone} onChange={(e) => setForm({ ...form, patient_phone: e.target.value })} placeholder="0912 345 678" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b]" /></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Loại khám *</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b]">
                  <option>Khám tổng quát</option><option>Tái khám</option><option>Khách hàng mới</option><option>Siêu âm</option><option>Xét nghiệm</option>
                </select></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Ghi chú</label>
                <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Triệu chứng, ghi chú thêm..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] resize-none" /></div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              {saveError && <p className="text-xs text-red-500 font-medium col-span-2 mb-1">{saveError}</p>}
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Hủy</button>
              <button onClick={saveAppointment} disabled={saving || !form.date || !form.time || !form.patient_name}
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#00b96b] hover:bg-[#009958] disabled:opacity-50 text-white text-sm font-semibold">
                {saving ? "Đang lưu..." : "Lưu lịch hẹn"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
