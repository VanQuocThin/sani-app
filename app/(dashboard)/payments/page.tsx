"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Badge from "@/components/ui/Badge";

const payments = [
  { id: "HD001", date: "25/06/2026", patient: "Nguyễn Thị Hoa",    service: "Khám tổng quát",   amount: 350000,  method: "Tiền mặt", status: "paid",    invoice: true  },
  { id: "HD002", date: "25/06/2026", patient: "Trần Văn Minh",     service: "Tái khám",          amount: 200000,  method: "MoMo",     status: "paid",    invoice: true  },
  { id: "HD003", date: "25/06/2026", patient: "Lê Thị Mai",        service: "Khám + xét nghiệm", amount: 520000,  method: "VNPay",    status: "pending", invoice: false },
  { id: "HD004", date: "25/06/2026", patient: "Phạm Quốc Bảo",    service: "Siêu âm bụng",      amount: 450000,  method: "BHYT",     status: "paid",    invoice: true  },
  { id: "HD005", date: "24/06/2026", patient: "Võ Thị Lan",       service: "Khám da liễu",      amount: 280000,  method: "Tiền mặt", status: "paid",    invoice: false },
  { id: "HD006", date: "24/06/2026", patient: "Nguyễn Minh Tuấn", service: "Tái khám cột sống", amount: 250000,  method: "MoMo",     status: "paid",    invoice: true  },
  { id: "HD007", date: "23/06/2026", patient: "Đặng Thị Hương",   service: "Siêu âm tuyến giáp",amount: 380000,  method: "VNPay",    status: "refunded",invoice: false },
];

const statusVariant: Record<string, "green" | "yellow" | "red" | "gray"> = {
  paid: "green", pending: "yellow", refunded: "red",
};
const statusLabel: Record<string, string> = {
  paid: "Đã thanh toán", pending: "Chưa thanh toán", refunded: "Đã hoàn tiền",
};

const methodColor: Record<string, string> = {
  "MoMo":     "bg-pink-50 text-pink-700",
  "VNPay":    "bg-blue-50 text-blue-700",
  "Tiền mặt":"bg-slate-100 text-slate-700",
  "BHYT":     "bg-purple-50 text-purple-700",
};

const totalRevenue = payments.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0);
const totalPending = payments.filter(p => p.status === "pending").reduce((s, p) => s + p.amount, 0);

export default function PaymentsPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-full">
      <Header
        title="Thanh toán"
        subtitle="Quản lý hóa đơn và thu tiền"
        action={
          <button onClick={() => setShowModal(true)}
            className="bg-[#00b96b] hover:bg-[#009958] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            + Tạo hóa đơn
          </button>
        }
      />

      <div className="p-6 space-y-5">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Doanh thu hôm nay</p>
            <p className="text-2xl font-bold text-[#0f2235] mt-1">{(totalRevenue / 1000).toFixed(0)}k đ</p>
            <p className="text-xs text-[#00b96b] mt-0.5 font-medium">↑ 12% so với hôm qua</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Chưa thanh toán</p>
            <p className="text-2xl font-bold text-orange-500 mt-1">{(totalPending / 1000).toFixed(0)}k đ</p>
            <p className="text-xs text-slate-400 mt-0.5">{payments.filter(p => p.status === "pending").length} hóa đơn</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-sm text-slate-500">Tổng hóa đơn</p>
            <p className="text-2xl font-bold text-[#0f2235] mt-1">{payments.length}</p>
            <p className="text-xs text-slate-400 mt-0.5">Tháng này</p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 text-left">
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Mã HĐ</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Ngày</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Bệnh nhân</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Dịch vụ</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Số tiền</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Phương thức</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Trạng thái</th>
                <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wide">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 text-sm font-mono font-semibold text-slate-500">{p.id}</td>
                  <td className="px-5 py-3 text-sm text-slate-500">{p.date}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-[#0f2235]">{p.patient}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{p.service}</td>
                  <td className="px-5 py-3 text-sm font-bold text-[#0f2235]">
                    {p.amount.toLocaleString("vi-VN")}đ
                  </td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${methodColor[p.method]}`}>
                      {p.method}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={statusVariant[p.status]}>{statusLabel[p.status]}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex gap-2">
                      {p.invoice ? (
                        <button className="text-xs text-[#00b96b] hover:underline font-medium">In HĐ</button>
                      ) : (
                        <button className="text-xs text-blue-600 hover:underline font-medium">Xuất HĐ</button>
                      )}
                      {p.status === "pending" && (
                        <button className="text-xs text-orange-600 hover:underline font-medium">Thu tiền</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Bệnh nhân *</label>
                <input type="text" placeholder="Tìm tên hoặc SĐT bệnh nhân..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b]" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Dịch vụ *</label>
                <select className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b]">
                  <option>Khám tổng quát — 350.000đ</option>
                  <option>Tái khám — 200.000đ</option>
                  <option>Siêu âm bụng — 450.000đ</option>
                  <option>Xét nghiệm máu — 250.000đ</option>
                  <option>Khám + xét nghiệm — 520.000đ</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phương thức thanh toán *</label>
                <div className="grid grid-cols-4 gap-2">
                  {["Tiền mặt", "MoMo", "VNPay", "BHYT"].map((m) => (
                    <button key={m} className="py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:border-[#00b96b] hover:text-[#00b96b] transition-colors">
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Ghi chú</label>
                <input type="text" placeholder="Ghi chú thêm..." className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b]" />
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
                Hủy
              </button>
              <button onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg bg-[#00b96b] hover:bg-[#009958] text-white text-sm font-semibold transition-colors">
                Tạo hóa đơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
