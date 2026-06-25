"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Badge from "@/components/ui/Badge";

type Payment = { id: string; created_at: string; patient_name: string; service: string; amount: number; method: string; status: string; invoice_issued: boolean };

const statusVariant: Record<string, "green" | "yellow" | "red"> = { paid: "green", pending: "yellow", refunded: "red" };
const statusLabel: Record<string, string> = { paid: "Đã thanh toán", pending: "Chưa thanh toán", refunded: "Đã hoàn tiền" };
const methodColor: Record<string, string> = { cash: "bg-slate-100 text-slate-700", momo: "bg-pink-50 text-pink-700", vnpay: "bg-blue-50 text-blue-700", bhyt: "bg-purple-50 text-purple-700" };
const methodLabel: Record<string, string> = { cash: "Tiền mặt", momo: "MoMo", vnpay: "VNPay", bhyt: "BHYT" };

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ service: "Khám tổng quát", amount: "350000", method: "cash", patient_name: "" });

  useEffect(() => { fetchPayments(); }, []);

  async function fetchPayments() {
    setLoading(true);
    const data = await fetch("/api/payments").then((r) => r.json());
    setPayments(data);
    setLoading(false);
  }

  async function savePayment() {
    if (!form.service || !form.amount) return;
    setSaving(true);
    await fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service: form.service, amount: Number(form.amount), method: form.method }),
    });
    setSaving(false);
    setShowModal(false);
    setForm({ service: "Khám tổng quát", amount: "350000", method: "cash", patient_name: "" });
    fetchPayments();
  }

  async function markPaid(id: string) {
    await fetch("/api/payments", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: "paid" }) });
    fetchPayments();
  }

  const totalRevenue = payments.filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount), 0);
  const totalPending = payments.filter((p) => p.status === "pending").reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div className="min-h-full">
      <Header title="Thanh toán" subtitle="Quản lý hóa đơn và thu tiền"
        action={<button onClick={() => setShowModal(true)} className="bg-[#00b96b] hover:bg-[#009958] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">+ Tạo hóa đơn</button>}
      />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5"><p className="text-sm text-slate-500">Tổng đã thu</p><p className="text-2xl font-bold text-[#0f2235] mt-1">{totalRevenue.toLocaleString("vi-VN")}đ</p></div>
          <div className="bg-white rounded-xl border border-slate-200 p-5"><p className="text-sm text-slate-500">Chưa thanh toán</p><p className="text-2xl font-bold text-orange-500 mt-1">{totalPending.toLocaleString("vi-VN")}đ</p><p className="text-xs text-slate-400 mt-0.5">{payments.filter((p) => p.status === "pending").length} hóa đơn</p></div>
          <div className="bg-white rounded-xl border border-slate-200 p-5"><p className="text-sm text-slate-500">Tổng hóa đơn</p><p className="text-2xl font-bold text-[#0f2235] mt-1">{payments.length}</p></div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="p-5 space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-12 bg-slate-100 rounded animate-pulse" />)}</div>
          ) : payments.length === 0 ? (
            <div className="text-center py-16 text-slate-400"><p className="text-4xl mb-2">💳</p><p className="font-medium">Chưa có hóa đơn nào</p></div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 text-left">
                  {["Ngày", "Bệnh nhân", "Dịch vụ", "Số tiền", "Phương thức", "Trạng thái", "Thao tác"].map((h) => (
                    <th key={h} className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 text-sm text-slate-500">{new Date(p.created_at).toLocaleDateString("vi-VN")}</td>
                    <td className="px-5 py-3 text-sm font-semibold text-[#0f2235]">{p.patient_name ?? "—"}</td>
                    <td className="px-5 py-3 text-sm text-slate-600">{p.service}</td>
                    <td className="px-5 py-3 text-sm font-bold text-[#0f2235]">{Number(p.amount).toLocaleString("vi-VN")}đ</td>
                    <td className="px-5 py-3"><span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${methodColor[p.method] ?? "bg-slate-100 text-slate-700"}`}>{methodLabel[p.method] ?? p.method}</span></td>
                    <td className="px-5 py-3"><Badge variant={statusVariant[p.status] ?? "gray"}>{statusLabel[p.status] ?? p.status}</Badge></td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        {p.status === "pending" && <button onClick={() => markPaid(p.id)} className="text-xs text-orange-600 hover:underline font-medium">Thu tiền</button>}
                        {p.invoice_issued ? <button className="text-xs text-[#00b96b] hover:underline font-medium">In HĐ</button> : <button className="text-xs text-blue-600 hover:underline font-medium">Xuất HĐ</button>}
                      </div>
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
              <h2 className="font-bold text-[#0f2235]">Tạo hóa đơn mới</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Dịch vụ *</label>
                <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b]">
                  <option>Khám tổng quát</option><option>Tái khám</option><option>Siêu âm bụng</option><option>Xét nghiệm máu</option><option>Khám da liễu</option>
                </select></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Số tiền (đ) *</label>
                <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="350000" className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b]" /></div>
              <div><label className="block text-xs font-semibold text-slate-600 mb-1">Phương thức thanh toán *</label>
                <div className="grid grid-cols-4 gap-2">
                  {[{ value: "cash", label: "Tiền mặt" }, { value: "momo", label: "MoMo" }, { value: "vnpay", label: "VNPay" }, { value: "bhyt", label: "BHYT" }].map((m) => (
                    <button key={m.value} onClick={() => setForm({ ...form, method: m.value })}
                      className={`py-2 rounded-lg border text-xs font-semibold transition-colors ${form.method === m.value ? "border-[#00b96b] text-[#00b96b] bg-[#e8f9f2]" : "border-slate-200 text-slate-600 hover:border-[#00b96b]"}`}>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50">Hủy</button>
              <button onClick={savePayment} disabled={saving} className="flex-1 px-4 py-2.5 rounded-lg bg-[#00b96b] hover:bg-[#009958] disabled:opacity-50 text-white text-sm font-semibold">
                {saving ? "Đang lưu..." : "Tạo hóa đơn"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
