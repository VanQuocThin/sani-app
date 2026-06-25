import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sani — Quản lý phòng khám thông minh",
  description: "Phần mềm quản lý phòng khám được xây dựng riêng cho thị trường Việt Nam",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
