import Header from "@/components/Header";
import Badge from "@/components/ui/Badge";
import Link from "next/link";

const stats = [
  { label: "Lịch hẹn hôm nay", value: "8", sub: "3 chưa xác nhận", icon: "📅", color: "text-blue-600 bg-blue-50" },
  { label: "Bệnh nhân mới tháng này", value: "47", sub: "+12% so với tháng trước", icon: "👥", color: "text-[#00b96b] bg-[#e8f9f2]" },
  { label: "Doanh thu hôm nay", value: "4.200.000đ", sub: "8 lịch hoàn thành", icon: "💰", color: "text-purple-600 bg-purple-50" },
  { label: "Tỷ lệ lấp đầy", value: "86%", sub: "Tuần này", icon: "📊", color: "text-orange-500 bg-orange-50" },
];

const todayAppointments = [
  { time: "08:00", name: "Nguyễn Thị Hoa", type: "Khám tổng quát", status: "done", statusLabel: "Hoàn thành", via: "" },
  { time: "09:30", name: "Trần Văn Minh", type: "Tái khám", status: "confirmed", statusLabel: "Đã xác nhận", via: "Zalo" },
  { time: "10:00", name: "Lê Thị Mai", type: "Khách hàng mới", status: "pending", statusLabel: "Chờ xác nhận", via: "" },
  { time: "11:00", name: "Phạm Quốc Bảo", type: "Siêu âm", status: "confirmed", statusLabel: "BHYT", via: "" },
  { time: "13:30", name: "Võ Thị Lan", type: "Khám da liễu", status: "pending", statusLabel: "Chờ xác nhận", via: "Zalo" },
  { time: "14:30", name: "Nguyễn Minh Tuấn", type: "Tái khám", status: "confirmed", statusLabel: "Đã xác nhận", via: "" },
];

const statusVariant: Record<string, "green" | "blue" | "yellow" | "gray"> = {
  done: "green",
  confirmed: "blue",
  pending: "yellow",
};

export default function DashboardPage() {
  return (
    <div className="min-h-full">
      <Header
        title="Tổng quan"
        subtitle="Thứ Tư, 25 tháng 6 năm 2026"
        action={
          <Link href="/appointments"
            className="bg-[#00b96b] hover:bg-[#009958] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            + Thêm lịch hẹn
          </Link>
        }
      />

      <div className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-white rounded-xl p-5 border border-slate-200">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500 font-medium">{s.label}</p>
                  <p className="text-2xl font-bold text-[#0f2235] mt-1">{s.value}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{s.sub}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${s.color}`}>
                  {s.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Today's appointments */}
          <div className="col-span-2 bg-white rounded-xl border border-slate-200">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="font-bold text-[#0f2235]">Lịch hẹn hôm nay</h2>
              <Link href="/appointments" className="text-sm text-[#00b96b] hover:underline font-medium">
                Xem tất cả →
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {todayAppointments.map((appt) => (
                <div key={appt.time + appt.name} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <span className="text-sm font-bold text-slate-400 w-12 flex-shrink-0">{appt.time}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0f2235] truncate">{appt.name}</p>
                    <p className="text-xs text-slate-400">{appt.type}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {appt.via && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">{appt.via}</span>
                    )}
                    <Badge variant={statusVariant[appt.status]}>{appt.statusLabel}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-bold text-[#0f2235] mb-3">Thao tác nhanh</h2>
              <div className="space-y-2">
                {[
                  { icon: "📅", label: "Thêm lịch hẹn", href: "/appointments" },
                  { icon: "👤", label: "Thêm bệnh nhân mới", href: "/patients" },
                  { icon: "💳", label: "Tạo hóa đơn", href: "/payments" },
                  { icon: "📋", label: "Ghi hồ sơ bệnh án", href: "/patients" },
                ].map((item) => (
                  <Link key={item.label} href={item.href}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors text-sm text-[#0f2235] font-medium">
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-[#e8f9f2] rounded-xl border border-[#00b96b]/20 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">💡</span>
                <h3 className="text-sm font-bold text-[#0f2235]">Kết nối Zalo OA</h3>
              </div>
              <p className="text-xs text-slate-600 mb-3">
                Tự động nhắc lịch hẹn qua Zalo, tăng tỷ lệ xác nhận lên 90%.
              </p>
              <button className="w-full bg-[#00b96b] text-white text-xs font-semibold py-2 rounded-lg hover:bg-[#009958] transition-colors">
                Kết nối ngay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
