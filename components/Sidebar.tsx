"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getUser, clearUser, type AuthUser } from "@/lib/auth";

const nav = [
  { href: "/dashboard",    icon: "📊", label: "Tổng quan" },
  { href: "/appointments", icon: "📅", label: "Lịch hẹn" },
  { href: "/patients",     icon: "👥", label: "Bệnh nhân" },
  { href: "/payments",     icon: "💳", label: "Thanh toán" },
  { href: "/reports",      icon: "📈", label: "Báo cáo" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => { setUser(getUser()); }, []);

  function logout() {
    clearUser();
    router.push("/login");
  }

  const initials = user?.name?.split(" ").pop()?.slice(0, 2).toUpperCase() ?? "BS";

  return (
    <aside className="w-56 flex-shrink-0 bg-[#0f2235] flex flex-col h-full">
      <div className="px-5 py-5 border-b border-white/10">
        <Link href="/">
          <span className="text-2xl font-bold text-[#00b96b]">Sani<span className="text-white">.</span></span>
        </Link>
        {user?.clinic && <p className="text-xs text-slate-400 mt-0.5 truncate">{user.clinic}</p>}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? "bg-[#00b96b]/20 text-[#00b96b]" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-4 border-t border-white/10 pt-3 space-y-0.5">
        <Link href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors">
          <span className="text-base leading-none">⚙️</span> Cài đặt
        </Link>

        <div className="flex items-center gap-3 px-3 py-3 mt-1 rounded-lg bg-white/5">
          <div className="w-8 h-8 rounded-full bg-[#00b96b]/20 flex items-center justify-center text-[#00b96b] font-bold text-sm flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-white text-xs font-semibold truncate">{user?.name ?? "Bác sĩ"}</p>
            <p className="text-slate-400 text-xs truncate">{user?.specialty ?? "Đa khoa"}</p>
          </div>
          <button onClick={logout} title="Đăng xuất" className="text-slate-500 hover:text-red-400 transition-colors text-sm ml-1">↩</button>
        </div>
      </div>
    </aside>
  );
}
