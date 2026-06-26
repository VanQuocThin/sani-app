"use client";

import { useState } from "react";
import Link from "next/link";

export default function LandingPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "", clinic: "", specialty: "", city: "", message: "" });

  async function handleContact(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...contactForm, source: "contact" }),
    }).catch(() => {});
    setFormSubmitted(true);
  }

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --green: #00b96b; --green-dark: #009958; --green-light: #e8f9f2;
          --navy: #0f2235; --gray: #64748b; --gray-light: #f1f5f9; --radius: 12px;
          --shadow: 0 4px 24px rgba(0,0,0,0.08);
        }
        body { font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; color: var(--navy); line-height: 1.6; background: #fff; }
        nav { position: sticky; top: 0; z-index: 100; background: rgba(255,255,255,0.95); backdrop-filter: blur(8px); border-bottom: 1px solid #e2e8f0; padding: 0 5%; display: flex; align-items: center; justify-content: space-between; height: 64px; }
        .logo { font-size: 1.5rem; font-weight: 800; color: var(--green); letter-spacing: -0.5px; text-decoration: none; }
        .logo span { color: var(--navy); }
        .nav-links { display: flex; gap: 2rem; list-style: none; }
        .nav-links a { text-decoration: none; color: var(--gray); font-size: 0.95rem; font-weight: 500; transition: color .2s; }
        .nav-links a:hover { color: var(--green); }
        .nav-cta { display: flex; gap: 0.75rem; align-items: center; }
        .btn { padding: 0.55rem 1.25rem; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; border: none; transition: all .2s; text-decoration: none; display: inline-block; }
        .btn-outline { background: transparent; border: 1.5px solid #cbd5e1; color: var(--navy); }
        .btn-outline:hover { border-color: var(--green); color: var(--green); }
        .btn-primary { background: var(--green); color: white; }
        .btn-primary:hover { background: var(--green-dark); transform: translateY(-1px); }
        .btn-lg { padding: 0.85rem 2rem; font-size: 1rem; border-radius: 10px; }
        .hero { padding: 6rem 5% 4rem; display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; max-width: 1200px; margin: 0 auto; }
        .hero-badge { display: inline-flex; align-items: center; gap: 0.5rem; background: var(--green-light); color: var(--green-dark); padding: 0.35rem 1rem; border-radius: 100px; font-size: 0.85rem; font-weight: 600; margin-bottom: 1.5rem; }
        .hero h1 { font-size: 3rem; font-weight: 800; line-height: 1.15; letter-spacing: -1px; margin-bottom: 1.25rem; }
        .hero h1 em { color: var(--green); font-style: normal; }
        .hero p { font-size: 1.1rem; color: var(--gray); margin-bottom: 2rem; max-width: 440px; }
        .hero-actions { display: flex; gap: 1rem; align-items: center; flex-wrap: wrap; }
        .hero-note { font-size: 0.82rem; color: var(--gray); margin-top: 1rem; }
        .hero-img { background: var(--green-light); border-radius: 20px; padding: 2rem; box-shadow: var(--shadow); }
        .app-ui { background: white; border-radius: 12px; box-shadow: 0 8px 32px rgba(0,0,0,0.12); overflow: hidden; }
        .app-topbar { background: var(--navy); padding: 0.75rem 1rem; display: flex; align-items: center; gap: 0.5rem; }
        .dot { width: 10px; height: 10px; border-radius: 50%; }
        .app-body { display: flex; height: 320px; }
        .app-sidebar { width: 140px; background: #f8fafc; border-right: 1px solid #e2e8f0; padding: 1rem 0.75rem; }
        .app-sidebar-item { padding: 0.5rem 0.75rem; border-radius: 8px; font-size: 0.78rem; font-weight: 600; color: var(--gray); margin-bottom: 4px; }
        .app-sidebar-item.active { background: var(--green-light); color: var(--green-dark); }
        .app-main { flex: 1; padding: 1rem; overflow: hidden; }
        .app-main-title { font-size: 0.85rem; font-weight: 700; margin-bottom: 0.75rem; color: var(--navy); }
        .appt-item { display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.6rem; border-radius: 8px; background: var(--gray-light); margin-bottom: 4px; font-size: 0.72rem; }
        .appt-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .appt-name { font-weight: 600; color: var(--navy); }
        .appt-time { color: var(--gray); font-size: 0.68rem; }
        .appt-tag { margin-left: auto; padding: 2px 6px; border-radius: 100px; font-size: 0.63rem; font-weight: 700; }
        .social-proof { background: var(--green-light); padding: 2rem 5%; text-align: center; }
        .social-proof p { font-size: 0.9rem; color: var(--green-dark); font-weight: 600; }
        .stats { display: flex; justify-content: center; gap: 4rem; margin-top: 1.5rem; flex-wrap: wrap; }
        .stat-num { font-size: 2rem; font-weight: 800; color: var(--green-dark); }
        .stat-label { font-size: 0.82rem; color: var(--gray); }
        section { padding: 5rem 5%; max-width: 1200px; margin: 0 auto; }
        .section-tag { display: inline-block; background: var(--green-light); color: var(--green-dark); padding: 0.3rem 0.9rem; border-radius: 100px; font-size: 0.8rem; font-weight: 700; margin-bottom: 1rem; }
        h2 { font-size: 2.2rem; font-weight: 800; line-height: 1.2; letter-spacing: -0.5px; margin-bottom: 1rem; }
        h2 em { color: var(--green); font-style: normal; }
        .section-sub { font-size: 1.05rem; color: var(--gray); max-width: 540px; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 3rem; }
        .feature-card { background: var(--gray-light); border-radius: var(--radius); padding: 1.75rem; transition: transform .2s, box-shadow .2s; }
        .feature-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
        .feature-icon { width: 48px; height: 48px; border-radius: 12px; background: var(--green-light); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin-bottom: 1rem; }
        .feature-card h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; }
        .feature-card p { font-size: 0.88rem; color: var(--gray); line-height: 1.6; }
        .diff-section { background: var(--navy); color: white; padding: 5rem 5%; }
        .diff-inner { max-width: 1200px; margin: 0 auto; }
        .diff-section h2 { color: white; }
        .diff-section .section-sub { color: #94a3b8; }
        .diff-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1.5rem; margin-top: 3rem; }
        .diff-card { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius); padding: 1.75rem; }
        .diff-card h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.5rem; color: white; }
        .diff-card p { font-size: 0.88rem; color: #94a3b8; line-height: 1.6; }
        .diff-badge { display: inline-block; background: var(--green); color: white; padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.72rem; font-weight: 700; margin-bottom: 0.75rem; }
        .pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 3rem; }
        .pricing-card { border: 2px solid #e2e8f0; border-radius: 16px; padding: 2rem; position: relative; transition: border-color .2s, box-shadow .2s; }
        .pricing-card:hover { border-color: var(--green); box-shadow: var(--shadow); }
        .pricing-card.featured { border-color: var(--green); background: var(--green-light); }
        .popular-badge { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background: var(--green); color: white; padding: 0.25rem 1rem; border-radius: 100px; font-size: 0.78rem; font-weight: 700; white-space: nowrap; }
        .plan-name { font-size: 1rem; font-weight: 700; color: var(--gray); margin-bottom: 0.5rem; }
        .plan-price { font-size: 2.5rem; font-weight: 800; color: var(--navy); line-height: 1; }
        .plan-price span { font-size: 1rem; font-weight: 500; color: var(--gray); }
        .plan-desc { font-size: 0.85rem; color: var(--gray); margin: 0.75rem 0 1.5rem; }
        .plan-features { list-style: none; margin-bottom: 2rem; }
        .plan-features li { font-size: 0.88rem; color: var(--navy); padding: 0.4rem 0; border-bottom: 1px solid #f1f5f9; display: flex; align-items: flex-start; gap: 0.5rem; }
        .plan-features li::before { content: "✓"; color: var(--green); font-weight: 700; flex-shrink: 0; }
        .testimonials-bg { background: var(--gray-light); padding: 5rem 5%; }
        .testimonials-inner { max-width: 1200px; margin: 0 auto; }
        .testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 3rem; }
        .testimonial-card { background: white; border-radius: var(--radius); padding: 1.75rem; box-shadow: var(--shadow); }
        .stars { color: #f59e0b; font-size: 0.9rem; margin-bottom: 1rem; }
        .testimonial-card blockquote { font-size: 0.92rem; color: var(--navy); line-height: 1.7; margin-bottom: 1.25rem; }
        .testimonial-author { display: flex; align-items: center; gap: 0.75rem; }
        .avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--green-light); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--green-dark); font-size: 0.9rem; flex-shrink: 0; }
        .author-name { font-size: 0.88rem; font-weight: 700; color: var(--navy); }
        .author-role { font-size: 0.78rem; color: var(--gray); }
        .cta-section { background: var(--green); padding: 5rem 5%; text-align: center; }
        .cta-section h2 { color: white; font-size: 2.5rem; }
        .cta-section p { color: rgba(255,255,255,0.85); margin: 1rem auto 2rem; max-width: 480px; font-size: 1.05rem; }
        .btn-white { background: white; color: var(--green-dark); }
        .btn-white:hover { background: #f0fdf4; transform: translateY(-2px); }
        .btn-ghost { background: rgba(255,255,255,0.15); color: white; border: 1.5px solid rgba(255,255,255,0.4); }
        .btn-ghost:hover { background: rgba(255,255,255,0.25); }
        footer { background: var(--navy); color: #94a3b8; padding: 3rem 5% 2rem; }
        .footer-inner { max-width: 1200px; margin: 0 auto; }
        .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem; margin-bottom: 3rem; }
        .footer-logo { font-size: 1.4rem; font-weight: 800; color: white; margin-bottom: 0.75rem; }
        .footer-tagline { font-size: 0.85rem; line-height: 1.6; }
        .footer-col h4 { color: white; font-size: 0.9rem; font-weight: 700; margin-bottom: 1rem; }
        .footer-col ul { list-style: none; }
        .footer-col ul li { margin-bottom: 0.5rem; }
        .footer-col ul li a { color: #94a3b8; text-decoration: none; font-size: 0.85rem; transition: color .2s; }
        .footer-col ul li a:hover { color: var(--green); }
        .footer-bottom { border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
        .footer-bottom p { font-size: 0.82rem; }
        .footer-badges { display: flex; gap: 0.75rem; }
        .badge { background: rgba(255,255,255,0.08); border-radius: 6px; padding: 0.3rem 0.7rem; font-size: 0.72rem; color: #cbd5e1; }
        .contact-section { background: var(--gray-light); padding: 5rem 5%; }
        .contact-inner { max-width: 800px; margin: 0 auto; }
        .contact-inner h2 { text-align: center; }
        .contact-inner .section-sub { text-align: center; margin: 0 auto 2.5rem; }
        .contact-form { background: white; border-radius: 20px; padding: 2.5rem; box-shadow: var(--shadow); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .form-group.full { grid-column: 1 / -1; }
        .form-group label { font-size: 0.85rem; font-weight: 600; color: var(--navy); }
        .form-group label span { color: #ef4444; margin-left: 2px; }
        .form-group input, .form-group select, .form-group textarea { padding: 0.7rem 1rem; border: 1.5px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; color: var(--navy); background: #f8fafc; transition: border-color .2s; outline: none; font-family: inherit; width: 100%; }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--green); background: white; box-shadow: 0 0 0 3px rgba(0,185,107,0.1); }
        .form-group textarea { resize: vertical; min-height: 100px; }
        .form-submit { margin-top: 1.75rem; text-align: center; }
        .form-submit .btn { width: 100%; padding: 1rem; font-size: 1rem; border-radius: 10px; }
        .form-note { font-size: 0.78rem; color: var(--gray); margin-top: 0.75rem; text-align: center; }
        .form-success { text-align: center; padding: 2rem; color: var(--green-dark); background: var(--green-light); border-radius: 12px; margin-top: 1rem; font-weight: 600; }
        @media (max-width: 900px) {
          .hero { grid-template-columns: 1fr; }
          .features-grid, .diff-grid, .pricing-grid, .testimonials-grid, .footer-grid { grid-template-columns: 1fr; }
          h2 { font-size: 1.8rem; }
          .hero h1 { font-size: 2.2rem; }
          .stats { gap: 2rem; }
          .nav-links { display: none; }
          .form-row { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* NAV */}
      <nav>
        <Link href="/" className="logo">Sani<span>.</span></Link>
        <ul className="nav-links">
          <li><a href="#features">Tính năng</a></li>
          <li><a href="#pricing">Bảng giá</a></li>
          <li><a href="#testimonials">Khách hàng</a></li>
          <li><a href="#contact">Đăng ký tư vấn</a></li>
        </ul>
        <div className="nav-cta">
          <Link href="/login" className="btn btn-outline">Đăng nhập</Link>
          <Link href="/register" className="btn btn-primary">Dùng thử miễn phí</Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div className="hero">
          <div className="hero-content">
            <div className="hero-badge">🇻🇳 Được tạo ra cho thị trường Việt Nam</div>
            <h1>Quản lý phòng khám <em>thông minh hơn</em></h1>
            <p>Đặt lịch qua Zalo, ghi hồ sơ bệnh nhân, thu tiền qua MoMo/VNPay và xuất hóa đơn điện tử — tất cả trong một nền tảng duy nhất.</p>
            <div className="hero-actions">
              <Link href="/register" className="btn btn-primary btn-lg">Dùng thử 30 ngày miễn phí</Link>
              <Link href="/dashboard" className="btn btn-outline btn-lg">Xem demo</Link>
            </div>
            <p className="hero-note">✓ Không cần thẻ tín dụng &nbsp;·&nbsp; ✓ Cài đặt trong 15 phút &nbsp;·&nbsp; ✓ Hỗ trợ tiếng Việt 24/7</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[
              { icon: "📅", title: "Đặt lịch qua Zalo", desc: "Bệnh nhân đặt lịch qua Zalo OA, nhắc lịch tự động, không cần gọi điện" },
              { icon: "📋", title: "Hồ sơ bệnh nhân số", desc: "Hồ sơ chuẩn Bộ Y tế, SOAP note, lịch sử khám toàn bộ trong một màn hình" },
              { icon: "💳", title: "Thu tiền MoMo/VNPay", desc: "QR code tại quầy, thanh toán online, hỗ trợ MoMo, VNPay, ZaloPay, tiền mặt" },
              { icon: "🧾", title: "Hóa đơn điện tử", desc: "Tự động xuất hóa đơn ký số theo NĐ 123/2020, kết nối MISA, VNPT-Invoice" },
              { icon: "🏥", title: "Tích hợp BHYT", desc: "Tra cứu thẻ BHYT real-time, tính đồng chi trả tự động, in đúng mẫu BHXH" },
              { icon: "📊", title: "Báo cáo & Phân tích", desc: "Doanh thu theo ngày/tháng, phân tích bệnh nhân, tỷ lệ tái khám, xuất Excel" },
            ].map(f => (
              <div key={f.title} style={{ background: "white", borderRadius: 12, padding: "1.25rem", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#0f2235", marginBottom: "0.35rem" }}>{f.title}</div>
                <div style={{ fontSize: "0.78rem", color: "#64748b", lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SOCIAL PROOF */}
      <div className="social-proof">
        <p>Được tin dùng bởi hàng nghìn phòng khám và cơ sở y tế trên toàn quốc</p>
        <div className="stats">
          {[["3.200+", "Phòng khám đang dùng"], ["850.000+", "Lịch hẹn mỗi tháng"], ["98%", "Khách hàng hài lòng"], ["63/63", "Tỉnh thành phủ sóng"]].map(([num, label]) => (
            <div key={label}><div className="stat-num">{num}</div><div className="stat-label">{label}</div></div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section id="features">
        <div className="section-tag">Tính năng</div>
        <h2>Mọi thứ bạn cần để <em>vận hành phòng khám</em></h2>
        <p className="section-sub">Từ đặt lịch đến thu tiền — Sani xử lý toàn bộ quy trình để bạn tập trung vào bệnh nhân.</p>
        <div className="features-grid">
          {[
            ["📅", "Đặt lịch qua Zalo", "Bệnh nhân đặt lịch trực tiếp qua Zalo OA. Nhắc lịch tự động, xác nhận tức thì — không cần gọi điện."],
            ["📋", "Hồ sơ bệnh nhân số", "Mẫu bệnh án chuẩn Bộ Y tế, hỗ trợ SOAP note, chụp ảnh lâm sàng, lịch sử khám toàn bộ trong một màn hình."],
            ["💳", "Thu tiền MoMo / VNPay", "QR code tại quầy, thanh toán online, lưu thẻ để tái khám. Tích hợp sẵn MoMo, VNPay, ZaloPay, tiền mặt."],
            ["🧾", "Hóa đơn điện tử", "Tự động xuất hóa đơn điện tử ký số theo Nghị định 123/2020. Kết nối với MISA, FAST, VNPT-Invoice."],
            ["🏥", "Thanh toán BHYT", "Tra cứu thẻ BHYT, tính đồng chi trả tự động, in giấy tờ thanh toán đúng mẫu BHXH Việt Nam."],
            ["🤖", "AI ghi chú tiếng Việt", "Ghi âm buổi khám, AI tự động tạo hồ sơ bệnh án. Bác sĩ kiểm tra và ký số — tiết kiệm 40 phút mỗi ngày."],
            ["📊", "Báo cáo kinh doanh", "Doanh thu theo ngày/tháng, tỷ lệ lấp đầy lịch, bác sĩ hiệu quả nhất — xuất Excel một click."],
            ["🔔", "Nhắc tái khám tự động", "Tự động nhắc bệnh nhân tái khám qua Zalo sau X ngày. Giảm no-show, tăng retention."],
            ["👨‍👩‍👧", "Quản lý đa bác sĩ", "Một phòng khám, nhiều bác sĩ. Phân quyền linh hoạt, lịch riêng cho từng người, báo cáo tổng hợp."],
          ].map(([icon, title, desc]) => (
            <div key={title} className="feature-card">
              <div className="feature-icon">{icon}</div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <div className="diff-section">
        <div className="diff-inner">
          <div className="section-tag" style={{ background: "rgba(0,185,107,0.2)", color: "#4ade80" }}>Tại sao Sani?</div>
          <h2>Được xây dựng <em style={{ color: "#4ade80" }}>cho Việt Nam</em> — không phải dịch từ nước ngoài</h2>
          <p className="section-sub">Các phần mềm ngoại nhập không hiểu Zalo, không hiểu BHYT, không hiểu hóa đơn điện tử. Sani thì có.</p>
          <div className="diff-grid">
            {[
              ["🇻🇳 Made in Vietnam", "Zalo — không phải SMS", "97% người Việt dùng Zalo mỗi ngày. Sani tích hợp Zalo OA để gửi xác nhận, nhắc lịch — tỷ lệ đọc 90%+, không mất phí SMS."],
              ["💳 Thanh toán VN", "MoMo, VNPay — không phải Stripe", "Bệnh nhân Việt thanh toán bằng MoMo và VNPay. Sani tích hợp sẵn, không cần cài thêm bất kỳ ứng dụng nào."],
              ["🏥 BHYT", "Bảo hiểm y tế Việt Nam", "Tra cứu thẻ BHYT real-time, tính đồng chi trả chính xác — workflow mà không phần mềm ngoại nào hỗ trợ được."],
              ["🧾 Pháp lý VN", "Hóa đơn điện tử theo luật VN", "Nghị định 123/2020 yêu cầu hóa đơn điện tử từ 2022. Sani tự động xuất, ký số, gửi cho khách — đúng luật."],
            ].map(([badge, title, desc]) => (
              <div key={title} className="diff-card">
                <div className="diff-badge">{badge}</div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PRICING */}
      <section id="pricing">
        <div className="section-tag">Bảng giá</div>
        <h2>Giá phù hợp với <em>mọi quy mô</em></h2>
        <p className="section-sub">Không phí ẩn. Không hợp đồng dài hạn. Hủy bất cứ lúc nào.</p>
        <div className="pricing-grid">
          <div className="pricing-card">
            <div className="plan-name">CƠ BẢN</div>
            <div className="plan-price">Miễn phí</div>
            <div className="plan-desc">1 bác sĩ · 30 lịch hẹn/tháng</div>
            <ul className="plan-features">
              {["Đặt lịch online qua link", "Hồ sơ bệnh nhân cơ bản", "Nhắc lịch qua Zalo", "Báo cáo doanh thu đơn giản", "Hỗ trợ chat tiếng Việt"].map((f) => <li key={f}>{f}</li>)}
            </ul>
            <Link href="/register" className="btn btn-outline" style={{ display: "block", textAlign: "center", padding: "0.8rem" }}>Bắt đầu miễn phí</Link>
          </div>
          <div className="pricing-card featured">
            <div className="popular-badge">⭐ Phổ biến nhất</div>
            <div className="plan-name">PHÒNG KHÁM</div>
            <div className="plan-price">990k <span>/ tháng</span></div>
            <div className="plan-desc">Bao gồm 1 bác sĩ · +350k/bác sĩ thêm</div>
            <ul className="plan-features">
              {["Không giới hạn lịch hẹn", "Zalo OA nhắc tự động", "Hồ sơ bệnh nhân đầy đủ", "Thu tiền MoMo/VNPay", "Hóa đơn điện tử", "Báo cáo nâng cao", "Nhắc tái khám tự động"].map((f) => <li key={f}>{f}</li>)}
            </ul>
            <Link href="/register" className="btn btn-primary" style={{ display: "block", textAlign: "center", padding: "0.8rem" }}>Dùng thử 30 ngày</Link>
          </div>
          <div className="pricing-card">
            <div className="plan-name">ĐA KHOA</div>
            <div className="plan-price">1.990k <span>/ tháng</span></div>
            <div className="plan-desc">Bao gồm 3 bác sĩ · +300k/bác sĩ thêm</div>
            <ul className="plan-features">
              {["Tất cả từ gói Phòng Khám", "BHYT tích hợp", "AI ghi chú tiếng Việt", "Quản lý nhiều phòng/thiết bị", "Phân quyền theo bác sĩ", "API mở rộng", "Hỗ trợ điện thoại ưu tiên"].map((f) => <li key={f}>{f}</li>)}
            </ul>
            <Link href="/register" className="btn btn-outline" style={{ display: "block", textAlign: "center", padding: "0.8rem" }}>Liên hệ tư vấn</Link>
          </div>
        </div>
        <p style={{ textAlign: "center", color: "var(--gray)", fontSize: "0.85rem", marginTop: "2rem" }}>
          Có từ 5 bác sĩ trở lên? <Link href="/register" style={{ color: "var(--green)", fontWeight: 600 }}>Liên hệ để được báo giá riêng →</Link>
        </p>
      </section>

      {/* TESTIMONIALS */}
      <div className="testimonials-bg" id="testimonials">
        <div className="testimonials-inner">
          <div className="section-tag">Khách hàng nói gì</div>
          <h2>Hơn 3.200 phòng khám <em>đã tin dùng</em></h2>
          <div className="testimonials-grid">
            {[
              ["TH", "\"Từ khi dùng Sani, Zalo OA tự nhắc hết — lễ tân tôi giờ có thêm thời gian làm việc khác.\"", "BS. Trần Hữu Thắng", "PK Đa khoa Thắng Lợi, Hà Nội"],
              ["NL", "\"Tính năng hóa đơn điện tử của Sani giúp tôi tiết kiệm được hàng giờ mỗi tuần.\"", "Nguyễn Thị Lan", "Quản lý, PK Da liễu An Phú, TP.HCM"],
              ["PM", "\"Từ khi tích hợp Zalo OA, tỷ lệ đặt lịch online tăng 3 lần.\"", "BS. Phạm Thị Minh", "PK Nội tổng quát, Đà Nẵng"],
            ].map(([initials, quote, name, role]) => (
              <div key={name} className="testimonial-card">
                <div className="stars">★★★★★</div>
                <blockquote>{quote}</blockquote>
                <div className="testimonial-author">
                  <div className="avatar">{initials}</div>
                  <div><div className="author-name">{name}</div><div className="author-role">{role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-section">
        <h2>Bắt đầu ngay hôm nay</h2>
        <p>Cài đặt trong 15 phút. Dùng thử miễn phí 30 ngày. Không cần thẻ tín dụng.</p>
        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/register" className="btn btn-white btn-lg">Dùng thử miễn phí</Link>
          <Link href="/dashboard" className="btn btn-ghost btn-lg">Xem demo</Link>
        </div>
      </div>

      {/* CONTACT FORM */}
      <div className="contact-section" id="contact">
        <div className="contact-inner">
          <div className="section-tag" style={{ display: "block", textAlign: "center" }}>Đăng ký tư vấn miễn phí</div>
          <h2>Để lại thông tin — chúng tôi <em>liên hệ trong 2 giờ</em></h2>
          <p className="section-sub">Đội ngũ tư vấn của Sani sẽ hỗ trợ bạn cài đặt và dùng thử miễn phí 30 ngày.</p>
          <div className="contact-form">
            {formSubmitted ? (
              <div className="form-success">✅ Cảm ơn bạn đã đăng ký! Đội ngũ Sani sẽ liên hệ trong vòng 2 giờ làm việc.</div>
            ) : (
              <form onSubmit={handleContact}>
                <div className="form-row">
                  <div className="form-group"><label>Họ và tên<span>*</span></label><input type="text" value={contactForm.name} onChange={e => setContactForm({...contactForm, name: e.target.value})} placeholder="BS. Nguyễn Văn A" required /></div>
                  <div className="form-group"><label>Số điện thoại<span>*</span></label><input type="tel" value={contactForm.phone} onChange={e => setContactForm({...contactForm, phone: e.target.value})} placeholder="0912 345 678" required /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Email</label><input type="email" value={contactForm.email} onChange={e => setContactForm({...contactForm, email: e.target.value})} placeholder="bacle@phongkham.vn" /></div>
                  <div className="form-group"><label>Tên phòng khám<span>*</span></label><input type="text" value={contactForm.clinic} onChange={e => setContactForm({...contactForm, clinic: e.target.value})} placeholder="Phòng khám Đa khoa ABC" required /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Chuyên khoa<span>*</span></label>
                    <select value={contactForm.specialty} onChange={e => setContactForm({...contactForm, specialty: e.target.value})} required>
                      <option value="" disabled>Chọn chuyên khoa</option>
                      {["Đa khoa","Nội tổng quát","Nội tim mạch","Nội tiêu hóa","Nội thần kinh","Nội hô hấp","Nội tiết - Đái tháo đường","Nội thận - Tiết niệu","Nội khớp - Cơ xương","Nhi khoa","Nhi sơ sinh","Sản phụ khoa","Hiếm muộn - IVF","Da liễu","Thẩm mỹ da","Răng hàm mặt","Chỉnh nha","Implant","Mắt","Khúc xạ","Tai mũi họng","Phẫu thuật tổng quát","Phẫu thuật thẩm mỹ","Chấn thương chỉnh hình","Cột sống","Ung bướu","Huyết học","Tim mạch can thiệp","Lồng ngực - Mạch máu","Tiết niệu","Nam khoa","Thần kinh - Tâm lý","Tâm thần","Phục hồi chức năng","Y học cổ truyền","Châm cứu","Dinh dưỡng","Siêu âm - Chẩn đoán hình ảnh","Xét nghiệm","Vật lý trị liệu","Tiêm chủng","Sức khỏe tổng quát","Khác"].map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group"><label>Tỉnh / Thành phố<span>*</span></label>
                    <select value={contactForm.city} onChange={e => setContactForm({...contactForm, city: e.target.value})} required>
                      <option value="" disabled>Chọn tỉnh thành</option>
                      {["TP. Hồ Chí Minh","Hà Nội","Đà Nẵng","Hải Phòng","Cần Thơ","Huế","An Giang","Bắc Ninh","Cao Bằng","Cà Mau","Đắk Lắk","Điện Biên","Đồng Nai","Đồng Tháp","Gia Lai","Hà Tĩnh","Hưng Yên","Khánh Hòa","Lai Châu","Lâm Đồng","Lạng Sơn","Lào Cai","Nghệ An","Ninh Bình","Phú Thọ","Quảng Ngãi","Quảng Ninh","Quảng Trị","Sơn La","Tây Ninh","Thái Nguyên","Thanh Hóa","Tuyên Quang","Vĩnh Long"].map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group full"><label>Bạn quan tâm tính năng nào nhất?</label>
                    <textarea value={contactForm.message} onChange={e => setContactForm({...contactForm, message: e.target.value})} placeholder="Ví dụ: tôi muốn tích hợp Zalo OA và thanh toán MoMo..." />
                  </div>
                </div>
                <div className="form-submit">
                  <button type="submit" className="btn btn-primary">Đăng ký tư vấn miễn phí →</button>
                  <p className="form-note">🔒 Thông tin của bạn được bảo mật tuyệt đối. Chúng tôi không spam.</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <div className="footer-logo">Sani.</div>
              <p className="footer-tagline">Phần mềm quản lý phòng khám được xây dựng riêng cho thị trường Việt Nam. Tích hợp Zalo, MoMo, BHYT và hóa đơn điện tử.</p>
              <div style={{ marginTop: "1rem", fontSize: "0.82rem" }}>
                📞 1800 xxxx (miễn phí)<br />
                📧 support@sani.com<br />
                🌐 sani.com<br />
                🏢 TP. Hồ Chí Minh, Hà Nội, Đà Nẵng
              </div>
            </div>
            <div className="footer-col"><h4>Sản phẩm</h4><ul>
              {[["Đặt lịch Zalo","#"],["Hồ sơ bệnh nhân","#"],["Thanh toán","#"],["Hóa đơn điện tử","#"],["AI ghi chú","#"]].map(([l,h]) => <li key={l}><a href={h}>{l}</a></li>)}
            </ul></div>
            <div className="footer-col"><h4>Hỗ trợ</h4><ul>
              {[["Hướng dẫn sử dụng","#"],["Video tutorial","#"],["Câu hỏi thường gặp","#"],["Liên hệ hỗ trợ","#"]].map(([l,h]) => <li key={l}><a href={h}>{l}</a></li>)}
            </ul></div>
            <div className="footer-col"><h4>Công ty</h4><ul>
              {[["Về chúng tôi","#"],["Bảng giá","#pricing"],["Blog","#"],["Tuyển dụng","#"],["Chính sách bảo mật","#"],["Điều khoản sử dụng","#"]].map(([l,h]) => <li key={l}><a href={h}>{l}</a></li>)}
            </ul></div>
          </div>
          <div className="footer-bottom">
            <p>© 2026 Sani Software JSC · sani.com · Mã số thuế: 0123456789</p>
            <div className="footer-badges">
              <span className="badge">ISO 27001</span><span className="badge">Tuân thủ NĐ 13/2023</span><span className="badge">Bộ Y tế</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
