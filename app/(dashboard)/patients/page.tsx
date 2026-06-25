"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import { supabase } from "@/lib/supabase";

type Patient = {
  id: string;
  name: string;
  phone: string;
  dob: string;
  gender: string;
  medical_history: string;
  created_at: string;
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", dob: "", gender: "Nam", address: "", bhyt_number: "", medical_history: "" });

  useEffect(() => { fetchPatients(); }, []);

  async function fetchPatients() {
    setLoading(true);
    const { data } = await supabase.from("patients").select("*").order("created_at", { ascending: false });
    setPatients(data ?? []);
    setLoading(false);
  }

  async function savePatient() {
    if (!form.name || !form.phone) return;
    setSaving(true);
    await supabase.from("patients").insert([form]);
    setSaving(false);
    setShowModal(false);
    setForm({ name: "", phone: "", dob: "", gender: "Nam", address: "", bhyt_number: "", medical_history: "" });
    fetchPatients();
  }

  const filtered = patients.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.phone?.includes(search)
  );

  return (
    <div className="min-h-full">
      <Header
        title="Bệnh nhân"
        subtitle={`${patients.length} bệnh nhân trong hệ thống`}
        action={
          <button onClick={() => setShowModal(true)}
            className="bg-[#00b96b] hover:bg-[#009958] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            + Thêm bệnh nhân
          </button>
        }
      />

      <div className="p-6">
        <input
          type="text"
          placeholder="Tìm tên hoặc số điện thoại..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-5 w-full max-w-xs px-4 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] bg-white"
        />

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-3xl mb-2">⏳</p>
              <p className="text-sm">Đang tải...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <p className="text-4xl mb-2">👥</p>
              <p className="font-medium">{search ? "Không tìm thấy bệnh nhân" : "Chưa có bệnh nhân nào"}</p>
              {!search && <p className="text-sm mt-1">Nhấn &quot;+ Thêm bệnh nhân&quot; để bắt đầu</p>}
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left">
                  <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Bệnh nhân</th>
                  <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Ngày sinh / Giới tính</th>
                  <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Tiền sử bệnh</th>
                  <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Ngày tạo</th>
                  <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#e8f9f2] flex items-center justify-center text-[#00b96b] font-bold text-sm flex-shrink-0">
                          {p.name.split(" ").pop()?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#0f2235]">{p.name}</p>
                          <p className="text-xs text-slate-400">{p.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-slate-600">{p.dob ?? "—"}</p>
                      <p className="text-xs text-slate-400">{p.gender ?? "—"}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-500">{p.medical_history || "—"}</td>
                    <td className="px-5 py-3 text-sm text-slate-400">
                      {new Date(p.created_at).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-5 py-3">
                      <button className="text-xs text-[#00b96b] hover:underline font-medium">Xem hồ sơ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="font-bold text-[#0f2235]">Thêm bệnh nhân mới</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Họ và tên *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nguyễn Thị A"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b]" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Số điện thoại *</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="0912 345 678"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Ngày sinh</label>
                  <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b]" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Giới tính</label>
                  <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b]">
                    <option>Nam</option>
                    <option>Nữ</option>
                    <option>Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Số BHYT</label>
                  <input type="text" value={form.bhyt_number} onChange={(e) => setForm({ ...form, bhyt_number: e.target.value })}
                    placeholder="DN4012345678"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Địa chỉ</label>
                <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="123 Đường ABC, Quận 1, TP.HCM"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Tiền sử bệnh</label>
                <textarea rows={2} value={form.medical_history} onChange={(e) => setForm({ ...form, medical_history: e.target.value })}
                  placeholder="Dị ứng thuốc, bệnh mãn tính..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] resize-none" />
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                Hủy
              </button>
              <button onClick={savePatient} disabled={saving || !form.name || !form.phone}
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#00b96b] hover:bg-[#009958] disabled:opacity-50 text-white text-sm font-semibold transition-colors">
                {saving ? "Đang lưu..." : "Lưu bệnh nhân"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
