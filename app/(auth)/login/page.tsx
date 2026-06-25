import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-3xl font-bold text-[#00b96b]">Sani<span className="text-[#0f2235]">.</span></span>
          <p className="text-slate-500 mt-2">Đăng nhập vào phòng khám của bạn</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <form className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#0f2235] mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="bacle@phongkham.vn"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] focus:ring-2 focus:ring-[#00b96b]/10 bg-slate-50 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f2235] mb-1.5">
                Mật khẩu
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] focus:ring-2 focus:ring-[#00b96b]/10 bg-slate-50 focus:bg-white transition-all"
              />
              <div className="text-right mt-1.5">
                <a href="#" className="text-xs text-[#00b96b] hover:underline">Quên mật khẩu?</a>
              </div>
            </div>

            <Link
              href="/dashboard"
              className="block w-full text-center bg-[#00b96b] hover:bg-[#009958] text-white font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              Đăng nhập
            </Link>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Chưa có tài khoản?{" "}
              <Link href="/register" className="text-[#00b96b] font-semibold hover:underline">
                Dùng thử miễn phí 30 ngày
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          © 2026 Sani Software JSC · Hỗ trợ: 1800 xxxx
        </p>
      </div>
    </div>
  );
}
