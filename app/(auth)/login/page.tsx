"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveUser } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", clinic: "", email: "", password: "" });
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email) { setError("Vui lòng điền đầy đủ thông tin"); return; }
    saveUser({ name: form.name, clinic: form.clinic || "Phòng khám của tôi", specialty: "Đa khoa", email: form.email });
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-[#00b96b]">Sani<span className="text-[#0f2235]">.</span></Link>
          <p className="text-slate-500 mt-2">Đăng nhập vào phòng khám của bạn</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#0f2235] mb-1.5">Họ và tên bác sĩ *</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="BS. Nguyễn Văn A"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] focus:ring-2 focus:ring-[#00b96b]/10 bg-slate-50 focus:bg-white transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f2235] mb-1.5">Tên phòng khám</label>
              <input type="text" value={form.clinic} onChange={(e) => setForm({ ...form, clinic: e.target.value })}
                placeholder="Phòng khám Đa khoa ABC"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] focus:ring-2 focus:ring-[#00b96b]/10 bg-slate-50 focus:bg-white transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f2235] mb-1.5">Email *</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="bacle@phongkham.vn"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] focus:ring-2 focus:ring-[#00b96b]/10 bg-slate-50 focus:bg-white transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f2235] mb-1.5">Mật khẩu</label>
              <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] focus:ring-2 focus:ring-[#00b96b]/10 bg-slate-50 focus:bg-white transition-all" />
              <div className="text-right mt-1.5"><a href="#" className="text-xs text-[#00b96b] hover:underline">Quên mật khẩu?</a></div>
            </div>

            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

            <button type="submit"
              className="block w-full text-center bg-[#00b96b] hover:bg-[#009958] text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
              Đăng nhập
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">Chưa có tài khoản?{" "}
              <Link href="/register" className="text-[#00b96b] font-semibold hover:underline">Dùng thử miễn phí 30 ngày</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
