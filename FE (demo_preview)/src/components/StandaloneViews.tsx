import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Phone,
  MapPin,
  LogIn,
  CircleCheck,
  LayoutDashboard,
} from 'lucide-react';
import { PITCH_LIST } from '../data/demoData';
import { type PitchBooking, formatHourLabel, formatVND } from '../utils/sanbonglonLogic';
import { type NavItemId } from '../config/sidebarConfig';

/* ==========================================================================
   1. Public Website View (Trang chủ / Lịch sân công khai)
   NOTE: Strictly NO administrative Sidebar on the Public Website.
   ========================================================================== */
interface PublicWebsiteViewProps {
  bookings: PitchBooking[];
  onSwitchToInternal: (id: NavItemId) => void;
}

export const PublicWebsiteView: React.FC<PublicWebsiteViewProps> = ({
  bookings,
  onSwitchToInternal,
}) => {
  const [pitchTypeFilter, setPitchTypeFilter] = useState<'all' | '5 người' | '7 người'>('all');
  const publicPrimeSlots = [7.5, 9.0, 16.0, 17.5, 19.0, 20.5, 22.0];

  const visiblePitches = PITCH_LIST.filter((p) =>
    pitchTypeFilter === 'all' ? true : p.type === pitchTypeFilter
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-cream)', color: 'var(--text-primary)' }}>
      {/* Clean 3-Zone Top Bar Contract for Public Website */}
      <header
        className="glass-nav sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-4 border-b"
        style={{ borderColor: 'var(--border-color)' }}
      >
        <a
          href="#top"
          className="font-editorial text-xl font-bold tracking-tight whitespace-nowrap shrink-0"
          style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
        >
          SANBONGLON
        </a>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium" aria-label="Menu công khai">
          <a href="#lich-san-trong" className="hover:underline whitespace-nowrap shrink-0" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            Lịch sân công khai
          </a>
          <a href="#bang-gia-san" className="hover:underline whitespace-nowrap shrink-0" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            Bảng giá sân
          </a>
          <a href="#huong-dan-dat-san" className="hover:underline whitespace-nowrap shrink-0" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            Hướng dẫn đặt sân
          </a>
          <a href="#lien-he" className="hover:underline whitespace-nowrap shrink-0" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>
            Liên hệ
          </a>
        </nav>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onSwitchToInternal('dang-nhap-ca-truc')}
          >
            <LogIn size={15} />
            <span>Đăng nhập ca trực</span>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => onSwitchToInternal('tong-quan')}
          >
            <LayoutDashboard size={15} />
            <span>Vào trang Quản trị</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-12">
        {/* Hero Editorial Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pb-8 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div>
              <div className="font-mono-tech text-xs mb-3" style={{ color: 'var(--accent-moss)' }}>
                TỔ HỢP 12 SÂN CỎ NHÂN TẠO TIÊU CHUẨN FIFA PRO · 07:00 – 24:00
              </div>
              <h1 className="font-editorial text-4xl sm:text-5xl font-semibold leading-tight">
                Lịch Sân Công Khai & Tra Cứu Khung Giờ Trống Thời Gian Thực
              </h1>
              <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--text-secondary)', maxWidth: '64ch' }}>
                Hệ thống cụm 08 sân 5 người và 04 sân 7 người mặt cỏ sợi kim cương êm chân, đèn pha LED chống chói 400W. Tra cứu khung giờ còn trống dưới đây và liên hệ Hotline điều phối viên để giữ sân trong 60 giây.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#lich-san-trong" className="btn btn-lime btn-lg">
                <Calendar size={18} />
                <span>Xem giờ trống hôm nay (17/10)</span>
              </a>
              <a href="#bang-gia-san" className="btn btn-secondary btn-lg">
                <span>Xem bảng giá niêm yết</span>
              </a>
            </div>
          </div>

          <div
            className="lg:col-span-5 p-6 rounded-md border flex flex-col justify-between gap-4"
            style={{ backgroundColor: 'var(--bg-sand)', borderColor: 'var(--border-strong)' }}
          >
            <div>
              <h2 className="font-editorial text-2xl font-semibold">Thông Tin Liên Hệ Đặt Sân Nhanh</h2>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Bàn điều phối trực tiếp nhận cuộc gọi và tin nhắn Zalo từ 06:30 đến 24:00 mỗi ngày.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div className="p-3 rounded border" style={{ backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border-color)' }}>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Hotline & Zalo Đặt Sân:</div>
                <div className="font-mono-tech text-lg font-bold mt-0.5">0909 888 789 · 028 3899 4567</div>
              </div>
              <div className="p-3 rounded border" style={{ backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border-color)' }}>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Địa chỉ cụm sân:</div>
                <div className="font-semibold mt-0.5">Số 268 Điện Biên Phủ, Quận Bình Thạnh, TP. Hồ Chí Minh</div>
              </div>
              <div className="p-3 rounded border" style={{ backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border-color)' }}>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Tiện ích miễn phí tại sân:</div>
                <div className="text-xs font-medium mt-0.5">
                  Bãi giữ xe ô tô & xe máy rộng rãi · Wifi tốc độ cao · Phòng thay đồ & tắm nóng lạnh
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Public Field Availability Matrix */}
        <section id="lich-san-trong" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-editorial text-2xl font-semibold">
                Bảng Giờ Sân Trống Hôm Nay (Thứ Bảy, 17/10/2026)
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Các ô hiển thị <strong>Còn trống</strong> có thể liên hệ Hotline/Zalo để đặt giữ sân ngay.
              </p>
            </div>

            <div className="sbl-segmented" role="group" aria-label="Lọc loại sân công khai">
              {(['all', '5 người', '7 người'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`sbl-segment-btn ${pitchTypeFilter === t ? 'is-active' : ''}`}
                  onClick={() => setPitchTypeFilter(t)}
                >
                  {t === 'all' ? 'Tất cả 12 sân' : `Sân ${t}`}
                </button>
              ))}
            </div>
          </div>

          <div className="sbl-panel">
            <div className="sbl-table-scroll">
              <table className="sbl-table">
                <thead>
                  <tr>
                    <th>Sân Bóng</th>
                    <th>Loại Sân</th>
                    {publicPrimeSlots.map((slot) => (
                      <th key={slot} style={{ textAlign: 'center' }} className="font-mono-tech">
                        {formatHourLabel(slot)} – {formatHourLabel(slot + 1.5)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visiblePitches.map((pitch) => (
                    <tr key={pitch.id}>
                      <td className="font-bold">{pitch.name}</td>
                      <td className="text-xs font-mono-tech">Sân {pitch.type}</td>
                      {publicPrimeSlots.map((slot) => {
                        const occupied = bookings.some(
                          (b) =>
                            b.pitchId === pitch.id &&
                            b.status !== 'cancelled' &&
                            b.status !== 'boom' &&
                            slot < b.startHour + b.durationHours &&
                            slot + 1.5 > b.startHour
                        );
                        return (
                          <td key={slot} style={{ textAlign: 'center' }}>
                            {occupied ? (
                              <span className="status-indicator status-neutral">
                                <Clock size={13} />
                                <span>Đã có đội</span>
                              </span>
                            ) : (
                              <span className="status-indicator status-success">
                                <CircleCheck size={13} />
                                <span>Còn trống</span>
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Pricing Table (Bảng giá sân) */}
        <section id="bang-gia-san" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="sbl-panel">
            <div className="sbl-panel-header">
              <h2 className="sbl-panel-title">Bảng Giá Niêm Yết Sân 5 Người (Sân 01 – Sân 08)</h2>
            </div>
            <div className="sbl-panel-body">
              <table className="sbl-table">
                <thead>
                  <tr>
                    <th>Khung Giờ Hoạt Động</th>
                    <th>Thứ 2 – Thứ 6</th>
                    <th style={{ textAlign: 'right' }}>Thứ 7 & Chủ Nhật</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-mono-tech text-xs font-semibold">07:00 – 16:00 (Khung ban ngày)</td>
                    <td className="font-mono-tech">200.000 ₫ / giờ</td>
                    <td className="font-mono-tech text-right font-bold">220.000 ₫ / giờ</td>
                  </tr>
                  <tr>
                    <td className="font-mono-tech text-xs font-semibold">16:00 – 21:30 (Khung giờ vàng)</td>
                    <td className="font-mono-tech">340.000 ₫ / giờ</td>
                    <td className="font-mono-tech text-right font-bold">360.000 ₫ / giờ</td>
                  </tr>
                  <tr>
                    <td className="font-mono-tech text-xs font-semibold">21:30 – 24:00 (Khung đêm muộn)</td>
                    <td className="font-mono-tech">260.000 ₫ / giờ</td>
                    <td className="font-mono-tech text-right font-bold">280.000 ₫ / giờ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="sbl-panel">
            <div className="sbl-panel-header">
              <h2 className="sbl-panel-title">Bảng Giá Niêm Yết Sân 7 Người (Sân 09 – Sân 12)</h2>
            </div>
            <div className="sbl-panel-body">
              <table className="sbl-table">
                <thead>
                  <tr>
                    <th>Khung Giờ Hoạt Động</th>
                    <th>Thứ 2 – Thứ 6</th>
                    <th style={{ textAlign: 'right' }}>Thứ 7 & Chủ Nhật</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-mono-tech text-xs font-semibold">07:00 – 16:00 (Khung ban ngày)</td>
                    <td className="font-mono-tech">320.000 ₫ / giờ</td>
                    <td className="font-mono-tech text-right font-bold">350.000 ₫ / giờ</td>
                  </tr>
                  <tr>
                    <td className="font-mono-tech text-xs font-semibold">16:00 – 21:30 (Khung giờ vàng)</td>
                    <td className="font-mono-tech">550.000 ₫ / giờ</td>
                    <td className="font-mono-tech text-right font-bold">580.000 ₫ / giờ</td>
                  </tr>
                  <tr>
                    <td className="font-mono-tech text-xs font-semibold">21:30 – 24:00 (Khung đêm muộn)</td>
                    <td className="font-mono-tech">420.000 ₫ / giờ</td>
                    <td className="font-mono-tech text-right font-bold">440.000 ₫ / giờ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Booking Instructions & Contact */}
        <section id="huong-dan-dat-san" className="sbl-panel">
          <div className="sbl-panel-header">
            <h2 className="sbl-panel-title">Quy Trình Đặt Sân & Nội Quy Giữ Sân</h2>
          </div>
          <div className="sbl-panel-body grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-editorial text-lg font-bold mb-1">01. Kiểm tra giờ trống</div>
              <p style={{ color: 'var(--text-secondary)' }}>
                Xem bảng lịch công khai phía trên để chọn sân (5 người hoặc 7 người) và khung giờ phù hợp với đội bóng.
              </p>
            </div>
            <div>
              <div className="font-editorial text-lg font-bold mb-1">02. Gọi Hotline hoặc nhắn Zalo</div>
              <p style={{ color: 'var(--text-secondary)' }}>
                Liên hệ <strong>0909 888 789</strong> để điều phối viên tạo phiếu giữ sân và cung cấp mã VietQR đặt cọc.
              </p>
            </div>
            <div>
              <div className="font-editorial text-lg font-bold mb-1">03. Nhận sân & Thanh toán</div>
              <p style={{ color: 'var(--text-secondary)' }}>
                Đội trưởng báo tên đội tại quầy điều phối trước trận 10 phút để nhận bóng, áo Bib và nước uống.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer
        id="lien-he"
        className="border-t py-6 px-6 text-xs"
        style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-sand)', color: 'var(--text-secondary)' }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <strong>SANBONGLON CENTRAL</strong> · Tổ hợp 12 sân cỏ nhân tạo tiêu chuẩn · Giờ mở cửa: 07:00 – 24:00
          </div>
          <div className="flex items-center gap-4">
            <span>Hotline: 0909 888 789</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              className="underline cursor-pointer bg-transparent border-0 p-0 text-xs font-semibold"
              onClick={() => onSwitchToInternal('dang-nhap-ca-truc')}
            >
              Cổng nhân sự ca trực
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

/* ==========================================================================
   2. Shift & Admin Login View (Đăng nhập ca trực và quản trị)
   ========================================================================== */
interface ShiftLoginViewProps {
  onSuccessLogin: (shiftLabel: string) => void;
  onOpenPublicSite: () => void;
}

export const ShiftLoginView: React.FC<ShiftLoginViewProps> = ({
  onSuccessLogin,
  onOpenPublicSite,
}) => {
  const [staffCode, setStaffCode] = useState('SBL-NV01');
  const [password, setPassword] = useState('sanbonglon2026');
  const [shift, setShift] = useState('Ca Chiều (14:00 - 22:00)');
  const [cashFloat, setCashFloat] = useState('4500000');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffCode.trim() || !password.trim()) {
      setError('Vui lòng nhập Mã nhân viên trực và Mật khẩu ca trực.');
      return;
    }
    setError('');
    onSuccessLogin(shift);
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between p-6"
      style={{ backgroundColor: 'var(--bg-cream)', color: 'var(--text-primary)' }}
    >
      <header className="max-w-5xl w-full mx-auto flex items-center justify-between py-2">
        <div className="flex items-center gap-3">
          <span className="sbl-brand-mark">SB</span>
          <div>
            <div className="font-editorial font-bold text-lg leading-none">SANBONGLON CENTRAL</div>
            <div className="font-mono-tech text-xs" style={{ color: 'var(--text-secondary)' }}>
              HỆ THỐNG ĐIỀU PHỐI & POS NỘI BỘ
            </div>
          </div>
        </div>

        <button type="button" className="btn btn-secondary btn-sm" onClick={onOpenPublicSite}>
          <Calendar size={15} />
          <span>Xem lịch sân công khai</span>
        </button>
      </header>

      <main className="my-auto py-8">
        <div
          className="max-w-md w-full mx-auto sbl-panel animate-scale-in"
          style={{ boxShadow: 'var(--shadow-md)' }}
        >
          <div className="sbl-panel-header flex-col items-start gap-1">
            <div className="font-mono-tech text-xs" style={{ color: 'var(--accent-moss)' }}>
              XÁC THỰC BÀN GIAO CA TRỰC
            </div>
            <h1 className="font-editorial text-2xl font-semibold">Đăng Nhập Ca Trực & Quản Trị</h1>
          </div>

          <form onSubmit={handleSubmit} className="sbl-panel-body flex flex-col gap-4">
            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="loginStaffCode" className="form-label">
                Mã nhân sự / Tài khoản điều phối:
              </label>
              <input
                id="loginStaffCode"
                type="text"
                className="form-input font-mono-tech font-semibold"
                value={staffCode}
                onChange={(e) => setStaffCode(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="loginShiftSelect" className="form-label">
                Ca làm việc nhận bàn giao:
              </label>
              <select
                id="loginShiftSelect"
                className="form-select"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
              >
                <option value="Ca Sáng (06:30 - 14:30)">Ca Sáng (06:30 - 14:30)</option>
                <option value="Ca Chiều (14:00 - 22:00)">Ca Chiều (14:00 - 22:00)</option>
                <option value="Ca Đêm (18:00 - 24:30)">Ca Đêm (18:00 - 24:30)</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="loginCashFloat" className="form-label">
                Tồn quỹ tiền mặt đầu ca (VNĐ):
              </label>
              <input
                id="loginCashFloat"
                type="number"
                className="form-input font-mono-tech"
                value={cashFloat}
                onChange={(e) => setCashFloat(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="loginPassword" className="form-label">
                Mật khẩu ca trực:
              </label>
              <input
                id="loginPassword"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-lime w-full mt-2">
              <LogIn size={17} />
              <span>Nhận bàn giao ca & Mở Trung tâm điều phối</span>
            </button>
          </form>
        </div>
      </main>

      <footer className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
        SANBONGLON Operational Shell · Warm Editorial Studio Design System
      </footer>
    </div>
  );
};
