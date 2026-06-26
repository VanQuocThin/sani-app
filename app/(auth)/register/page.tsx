"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveUser } from "@/lib/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", email: "", clinic: "", specialty: "", city: "", password: "" });

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    saveUser({ name: form.name, clinic: form.clinic, specialty: form.specialty, email: form.email });
    fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, phone: form.phone, email: form.email, clinic: form.clinic, specialty: form.specialty, city: form.city, source: "register" }),
    }).catch(() => {});
    router.push("/dashboard");
  }

  const f = (field: keyof typeof form) => ({ value: form[field], onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setForm({ ...form, [field]: e.target.value }) });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-[#00b96b]">Sani<span className="text-[#0f2235]">.</span></Link>
          <p className="text-slate-500 mt-2">Tạo tài khoản — miễn phí 30 ngày, không cần thẻ</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0f2235] mb-1.5">Họ và tên *</label>
                <input type="text" {...f("name")} placeholder="BS. Nguyễn Văn A" required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] bg-slate-50 focus:bg-white transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f2235] mb-1.5">Số điện thoại *</label>
                <input type="tel" {...f("phone")} placeholder="0912 345 678" required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] bg-slate-50 focus:bg-white transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f2235] mb-1.5">Email *</label>
              <input type="email" {...f("email")} placeholder="bacle@phongkham.vn" required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] bg-slate-50 focus:bg-white transition-all" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f2235] mb-1.5">Tên phòng khám *</label>
              <input type="text" {...f("clinic")} placeholder="Phòng khám Đa khoa ABC" required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] bg-slate-50 focus:bg-white transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#0f2235] mb-1.5">Chuyên khoa *</label>
                <select {...f("specialty")} required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] bg-slate-50 focus:bg-white transition-all">
                  <option value="">Chọn chuyên khoa</option>
                  {["Đa khoa","Nội tổng quát","Nội tim mạch","Nội tiêu hóa","Nội thần kinh","Nội hô hấp","Nội tiết - Đái tháo đường","Nội thận - Tiết niệu","Nội khớp - Cơ xương","Nhi khoa","Nhi sơ sinh","Sản phụ khoa","Hiếm muộn - IVF","Da liễu","Thẩm mỹ da","Răng hàm mặt","Chỉnh nha","Implant","Mắt","Khúc xạ","Tai mũi họng","Phẫu thuật tổng quát","Phẫu thuật thẩm mỹ","Chấn thương chỉnh hình","Cột sống","Ung bướu","Huyết học","Tim mạch can thiệp","Lồng ngực - Mạch máu","Tiết niệu","Nam khoa","Thần kinh - Tâm lý","Tâm thần","Phục hồi chức năng","Y học cổ truyền","Châm cứu","Dinh dưỡng","Siêu âm - Chẩn đoán hình ảnh","Xét nghiệm","Vật lý trị liệu","Tiêm chủng","Sức khỏe tổng quát","Khác"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#0f2235] mb-1.5">Tỉnh/thành *</label>
                <select {...f("city")} required
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] bg-slate-50 focus:bg-white transition-all">
                  <option value="">Chọn tỉnh thành</option>
                  {["TP. Hồ Chí Minh","Hà Nội","Đà Nẵng","Hải Phòng","Cần Thơ","Huế","An Giang","Bắc Ninh","Cao Bằng","Cà Mau","Đắk Lắk","Điện Biên","Đồng Nai","Đồng Tháp","Gia Lai","Hà Tĩnh","Hưng Yên","Khánh Hòa","Lai Châu","Lâm Đồng","Lạng Sơn","Lào Cai","Nghệ An","Ninh Bình","Phú Thọ","Quảng Ngãi","Quảng Ninh","Quảng Trị","Sơn La","Tây Ninh","Thái Nguyên","Thanh Hóa","Tuyên Quang","Vĩnh Long"].map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0f2235] mb-1.5">Mật khẩu *</label>
              <input type="password" {...f("password")} placeholder="Tối thiểu 8 ký tự" required
                className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-[#00b96b] bg-slate-50 focus:bg-white transition-all" />
            </div>

            <button type="submit"
              className="block w-full text-center bg-[#00b96b] hover:bg-[#009958] text-white font-semibold py-2.5 rounded-lg transition-colors text-sm mt-2">
              Bắt đầu dùng thử miễn phí →
            </button>

            <p className="text-xs text-slate-400 text-center">
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <a href="#" className="text-[#00b96b]">Điều khoản sử dụng</a> và{" "}
              <a href="#" className="text-[#00b96b]">Chính sách bảo mật</a>
            </p>
          </form>

          <div className="mt-5 pt-5 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">Đã có tài khoản?{" "}
              <Link href="/login" className="text-[#00b96b] font-semibold hover:underline">Đăng nhập</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
