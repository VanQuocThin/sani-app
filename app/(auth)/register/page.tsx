import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-[#00b96b]">Sani<span className="text-[#0f2235]">.</span></span>
          <p className="text-slate-500 mt-2">Tạo tài khoản — miễn phí 30 ngày, không cần thẻ</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0f2235] mb-1.5">Họ và tên *</label>
                <input type="text" placeholder="BS. Nguyễn Văn A"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] focus:ring-2 focus:ring-[#00b96b]/10 bg-slate-50 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f2235] mb-1.5">Số điện thoại *</label>
                <input type="tel" placeholder="0912 345 678"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] focus:ring-2 focus:ring-[#00b96b]/10 bg-slate-50 focus:bg-white transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f2235] mb-1.5">Email *</label>
              <input type="email" placeholder="bacle@phongkham.vn"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] focus:ring-2 focus:ring-[#00b96b]/10 bg-slate-50 focus:bg-white transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f2235] mb-1.5">Tên phòng khám *</label>
              <input type="text" placeholder="Phòng khám Đa khoa ABC"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] focus:ring-2 focus:ring-[#00b96b]/10 bg-slate-50 focus:bg-white transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0f2235] mb-1.5">Chuyên khoa *</label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] focus:ring-2 focus:ring-[#00b96b]/10 bg-slate-50 focus:bg-white transition-all">
                  <option value="">Chọn chuyên khoa</option>
                  <option>Đa khoa</option>
                  <option>Nội tổng quát</option>
                  <option>Nhi khoa</option>
                  <option>Da liễu</option>
                  <option>Răng hàm mặt</option>
                  <option>Mắt</option>
                  <option>Tai mũi họng</option>
                  <option>Sản phụ khoa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f2235] mb-1.5">Tỉnh/thành *</label>
                <select className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] focus:ring-2 focus:ring-[#00b96b]/10 bg-slate-50 focus:bg-white transition-all">
                  <option value="">Chọn tỉnh thành</option>
                  <option>TP. Hồ Chí Minh</option>
                  <option>Hà Nội</option>
                  <option>Đà Nẵng</option>
                  <option>Cần Thơ</option>
                  <option>Hải Phòng</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f2235] mb-1.5">Mật khẩu *</label>
              <input type="password" placeholder="Tối thiểu 8 ký tự"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] focus:ring-2 focus:ring-[#00b96b]/10 bg-slate-50 focus:bg-white transition-all" />
            </div>

            <Link href="/dashboard"
              className="block w-full text-center bg-[#00b96b] hover:bg-[#009958] text-white font-semibold py-2.5 rounded-lg transition-colors text-sm mt-2">
              Bắt đầu dùng thử miễn phí →
            </Link>

            <p className="text-xs text-slate-400 text-center">
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <a href="#" className="text-[#00b96b]">Điều khoản sử dụng</a> và{" "}
              <a href="#" className="text-[#00b96b]">Chính sách bảo mật</a>
            </p>
          </form>

          <div className="mt-5 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Đã có tài khoản?{" "}
              <Link href="/login" className="text-[#00b96b] font-semibold hover:underline">Đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
