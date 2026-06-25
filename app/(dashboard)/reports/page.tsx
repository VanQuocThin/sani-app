import Header from "@/components/Header";

const monthlyRevenue = [
  { month: "T1", value: 42 }, { month: "T2", value: 38 }, { month: "T3", value: 55 },
  { month: "T4", value: 48 }, { month: "T5", value: 62 }, { month: "T6", value: 71 },
];
const maxValue = Math.max(...monthlyRevenue.map(m => m.value));

const topServices = [
  { name: "Khám tổng quát",    count: 142, revenue: 49700000, pct: 100 },
  { name: "Tái khám",          count: 98,  revenue: 19600000, pct: 70  },
  { name: "Siêu âm",           count: 64,  revenue: 28800000, pct: 45  },
  { name: "Xét nghiệm",        count: 51,  revenue: 12750000, pct: 36  },
  { name: "Khám da liễu",      count: 39,  revenue: 10920000, pct: 27  },
];

const topDoctors = [
  { name: "BS. Nguyễn Văn A", visits: 210, revenue: 73500000 },
  { name: "BS. Trần Thị B",   visits: 143, revenue: 50050000 },
  { name: "BS. Lê Văn C",     visits: 88,  revenue: 30800000 },
];

export default function ReportsPage() {
  return (
    <div className="min-h-full">
      <Header
        title="Báo cáo"
        subtitle="Tháng 6 năm 2026"
        action={
          <button className="border border-slate-200 hover:border-[#00b96b] hover:text-[#00b96b] text-slate-600 text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            ↓ Xuất Excel
          </button>
        }
      />

      <div className="p-6 space-y-5">
        {/* KPI */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Tổng doanh thu", value: "154.350.000đ", sub: "Tháng 6/2026", up: true, delta: "+15%" },
            { label: "Tổng lịch hẹn",  value: "394",          sub: "Lịch hoàn thành", up: true, delta: "+8%" },
            { label: "Bệnh nhân mới",   value: "47",           sub: "Tháng này",    up: true, delta: "+12%" },
            { label: "Tỷ lệ lấp đầy",  value: "86%",          sub: "Trung bình tuần", up: false, delta: "-2%" },
          ].map((k) => (
            <div key={k.label} className="bg-white rounded-xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">{k.label}</p>
              <p className="text-2xl font-bold text-[#0f2235] mt-1">{k.value}</p>
              <p className="text-xs mt-0.5">
                <span className={k.up ? "text-[#00b96b]" : "text-red-500"}>{k.delta}</span>
                <span className="text-slate-400 ml-1">{k.sub}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Revenue chart */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-bold text-[#0f2235] mb-4">Doanh thu 6 tháng (triệu đ)</h3>
            <div className="flex items-end gap-3 h-36">
              {monthlyRevenue.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs font-semibold text-slate-500">{m.value}tr</span>
                  <div
                    className="w-full rounded-t-md bg-[#00b96b]/80 hover:bg-[#00b96b] transition-colors"
                    style={{ height: `${(m.value / maxValue) * 100}%`, minHeight: "8px" }}
                  />
                  <span className="text-xs text-slate-400 font-medium">{m.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top doctors */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <h3 className="font-bold text-[#0f2235] mb-4">Hiệu suất bác sĩ</h3>
            <div className="space-y-3">
              {topDoctors.map((d, i) => (
                <div key={d.name} className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#e8f9f2] flex items-center justify-center text-[#00b96b] font-bold text-xs flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-[#0f2235]">{d.name}</span>
                      <span className="text-xs text-slate-500">{d.visits} lịch</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#00b96b] rounded-full"
                        style={{ width: `${(d.visits / topDoctors[0].visits) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{(d.revenue / 1000000).toFixed(1)}tr đ</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top services */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h3 className="font-bold text-[#0f2235] mb-4">Dịch vụ phổ biến nhất</h3>
          <div className="space-y-3">
            {topServices.map((s) => (
              <div key={s.name} className="flex items-center gap-4">
                <span className="text-sm font-medium text-[#0f2235] w-40 flex-shrink-0">{s.name}</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#00b96b]/70 rounded-full" style={{ width: `${s.pct}%` }} />
                </div>
                <span className="text-xs font-semibold text-slate-500 w-12 text-right">{s.count} ca</span>
                <span className="text-xs font-bold text-[#0f2235] w-28 text-right">
                  {(s.revenue / 1000000).toFixed(1)}tr đ
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
