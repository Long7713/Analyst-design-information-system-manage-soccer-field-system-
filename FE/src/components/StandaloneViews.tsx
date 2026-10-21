import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  LogIn,
  CircleCheck,
  LayoutDashboard,
  Info,
  Menu,
  X,
} from 'lucide-react';
import { PITCH_LIST } from '../data/demoData';
import {
  type PitchBooking,
  formatHourLabel,
  formatVND,
  calculateTimelinePosition,
  OPERATING_START_HOUR,
  OPERATING_END_HOUR,
} from '../utils/sanbonglonLogic';
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const visiblePitches = PITCH_LIST.filter((p) =>
    pitchTypeFilter === 'all' ? true : p.type === pitchTypeFilter
  );

  return (
    <div
      className="homepage-reactive-bg relative min-h-screen w-full overflow-x-hidden"
      style={{
        backgroundColor: '#fef3c7',
        backgroundImage: `
          linear-gradient(rgba(137,193,78,0.38) 1px, transparent 1px),
          linear-gradient(90deg, rgba(137,193,78,0.38) 1px, transparent 1px),
          linear-gradient(0deg, #eae6dd 0%, #f4f1eb 100%)
        `,
        backgroundSize: '38px 38px, 38px 38px, 100% 100%',
        color: 'var(--text-primary)',
      }}
      onMouseMove={(e) => {
        setMousePos({ x: e.clientX, y: e.clientY });
      }}
      onMouseLeave={() => setMousePos(null)}
    >
      {/* Interactive Cursor Spotlight Glow Effect */}
      <div
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-150"
        style={{
          opacity: mousePos ? 1 : 0,
          background: mousePos
            ? `radial-gradient(620px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.48), rgba(137, 193, 78, 0.26) 32%, transparent 72%)`
            : 'transparent',
        }}
        aria-hidden="true"
      />

      {/* Main Content layer */}
      <div className="relative z-20">
        {/* Raycast-style Floating Glass Pill Header */}
        <header className="raycast-pill-header">
          <a
            href="#top"
            className="flex items-center gap-2.5 group shrink-0"
            style={{ textDecoration: 'none' }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <span
              className="w-7 h-7 rounded-full flex items-center justify-center font-mono-tech text-xs font-bold transition-transform group-hover:scale-105"
              style={{ backgroundColor: 'var(--accent-lime)', color: '#151910' }}
            >
              SB
            </span>
            <span
              className="font-editorial text-lg font-bold tracking-tight whitespace-nowrap"
              style={{ color: 'var(--text-primary)' }}
            >
              SANBONGLON
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold" aria-label="Menu công khai">
            <a
              href="#lich-san-trong"
              className="px-3.5 py-1.5 rounded-full transition-colors hover:bg-black/5"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              Lịch sân
            </a>
            <a
              href="#bang-gia-san"
              className="px-3.5 py-1.5 rounded-full transition-colors hover:bg-black/5"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              Bảng giá sân
            </a>
            <a
              href="#huong-dan-dat-san"
              className="px-3.5 py-1.5 rounded-full transition-colors hover:bg-black/5"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              Hướng dẫn đặt sân
            </a>
            <a
              href="#lien-he"
              className="px-3.5 py-1.5 rounded-full transition-colors hover:bg-black/5"
              style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}
            >
              Liên hệ hotline
            </a>
          </nav>

          {/* Desktop Action Buttons - Hidden on Mobile & Tablet (< 1024px), only visible on Desktop (>= lg) */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <button
              type="button"
              className="btn btn-secondary btn-sm rounded-full px-3.5"
              onClick={() => onSwitchToInternal('dang-nhap-ca-truc')}
            >
              <LogIn size={14} />
              <span>Đăng nhập ca</span>
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm rounded-full px-3.5"
              onClick={() => onSwitchToInternal('tong-quan')}
            >
              <LayoutDashboard size={14} />
              <span>Quản trị</span>
            </button>
          </div>

          {/* Mobile & Tablet 3-Bar Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              type="button"
              className="btn btn-ghost btn-sm rounded-full flex items-center justify-center p-2 cursor-pointer transition-colors"
              style={{
                width: '38px',
                height: '38px',
                border: '1px solid var(--border-color)',
                backgroundColor: mobileMenuOpen ? 'rgba(28,26,23,0.08)' : 'transparent',
              }}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label={mobileMenuOpen ? 'Đóng menu' : 'Mở danh mục menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X size={19} strokeWidth={2.2} />
              ) : (
                <Menu size={19} strokeWidth={2.2} />
              )}
            </button>
          </div>
        </header>

        {/* Mobile & Tablet Dropdown Backdrop and Menu Panel */}
        {mobileMenuOpen && (
          <>
            <div
              className="fixed inset-0 z-40 animate-fade-in"
              style={{
                backgroundColor: 'rgba(28, 26, 23, 0.45)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
              }}
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden="true"
            />
            <div
              className="fixed left-4 right-4 top-20 z-50 mx-auto max-w-lg p-5 rounded-2xl animate-scale-in"
              style={{
                backgroundColor: 'rgba(250, 248, 244, 0.95)',
                backdropFilter: 'blur(20px) saturate(190%)',
                WebkitBackdropFilter: 'blur(20px) saturate(190%)',
                border: '1px solid rgba(211, 203, 191, 0.85)',
                boxShadow: '0 16px 40px -8px rgba(28, 26, 23, 0.22)',
              }}
              role="dialog"
              aria-label="Danh mục điều hướng công khai"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <span className="font-editorial text-base font-bold">Danh Mục Điều Hướng</span>
                <button
                  type="button"
                  className="btn btn-ghost btn-icon btn-sm"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Đóng danh mục"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex flex-col gap-1.5 text-sm font-semibold">
                <a
                  href="#lich-san-trong"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 transition-colors"
                  style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Lịch sân</span>
                  <span className="text-xs font-mono-tech" style={{ color: 'var(--accent-moss)' }}>07:00 – 24:00</span>
                </a>
                <a
                  href="#bang-gia-san"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 transition-colors"
                  style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Bảng giá sân</span>
                  <span className="text-xs font-mono-tech" style={{ color: 'var(--text-muted)' }}>5 người & 7 người</span>
                </a>
                <a
                  href="#huong-dan-dat-san"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 transition-colors"
                  style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Hướng dẫn đặt sân</span>
                  <span className="text-xs font-mono-tech" style={{ color: 'var(--text-muted)' }}>3 bước</span>
                </a>
                <a
                  href="#lien-he"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-black/5 transition-colors"
                  style={{ color: 'var(--text-primary)', textDecoration: 'none' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span>Liên hệ hotline</span>
                  <span className="text-xs font-mono-tech font-bold" style={{ color: 'var(--accent-moss)' }}>0909 888 789</span>
                </a>
              </nav>

              <div className="flex flex-col sm:flex-row gap-2 pt-4 mt-3 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <button
                  type="button"
                  className="btn btn-secondary flex-1 rounded-xl justify-center"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSwitchToInternal('dang-nhap-ca-truc');
                  }}
                >
                  <LogIn size={15} />
                  <span>Đăng nhập ca</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary flex-1 rounded-xl justify-center"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onSwitchToInternal('tong-quan');
                  }}
                >
                  <LayoutDashboard size={15} />
                  <span>Quản trị</span>
                </button>
              </div>
            </div>
          </>
        )}

      <main className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-12">
        {/* Hero Editorial Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pb-8 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div>
              <div className="font-mono-tech text-xs mb-3" style={{ color: 'var(--accent-moss)' }}>
                TỔ HỢP 12 SÂN CỎ TIÊU CHUẨN FIFA PRO • 07:00 – 24:00
              </div>
              <h1 className="font-editorial text-4xl sm:text-5xl font-semibold leading-tight">
                Lịch Sân Công Khai & Tra Cứu Khung Giờ Trống Thời Gian Thực
              </h1>
              <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--text-secondary)', maxWidth: '64ch' }}>
                Hệ thống cụm 08 sân 5 người và 04 sân 7 người cỏ sợi kim cương, hệ thống chiếu sáng đèn pha LED chống chói 400W. Tra cứu khung giờ sân trống và liên hệ Hotline điều phối viên trong 60 giây.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#lich-san-trong" className="btn btn-lime btn-lg">
                <Calendar size={18} />
                <span>Xem giờ trống hôm nay</span>
              </a>
              <a href="#bang-gia-san" className="btn btn-secondary btn-lg">
                <span>Xem bảng giá thuê</span>
              </a>
            </div>
          </div>

          <div
            className="lg:col-span-5 p-6 rounded-md border flex flex-col justify-between gap-4"
            style={{ backgroundColor: 'var(--bg-sand)', borderColor: 'var(--border-strong)' }}
          >
            <div>
              <h2 className="font-editorial text-2xl font-semibold">Thông Tin Liên Hệ Nhanh</h2>
              <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                Bàn điều phối trực tiếp nhận cuộc gọi và tin nhắn Zalo từ 06:30 đến 24:00 mỗi ngày.
              </p>
            </div>
            <div className="flex flex-col gap-3 text-sm">
              <div className="p-3 rounded border" style={{ backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border-color)' }}>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Hotline & Zalo đặt sân:</div>
                <div className="font-mono-tech text-lg font-bold mt-0.5">0909 888 789 – 028 3899 4567</div>
              </div>
              <div className="p-3 rounded border" style={{ backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border-color)' }}>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Địa chỉ cụm sân:</div>
                <div className="font-semibold mt-0.5">Số 268 Điện Biên Phủ, Quận Bình Thạnh, TP. Hồ Chí Minh</div>
              </div>
              <div className="p-3 rounded border" style={{ backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border-color)' }}>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Tiện ích miễn phí tại sân:</div>
                <div className="text-xs font-medium mt-0.5">
                  Bãi giữ xe ô tô & xe máy rộng rãi • Wifi tốc độ cao • Phòng thay đồ & tắm nóng lạnh
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Public Field Availability Matrix (Dạng Schedule Timeline Chỉ Để Xem) */}
        <section id="lich-san-trong" className="flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-editorial text-2xl font-semibold">
                Lịch Sân Trực Tuyến & Khung Giờ Trống Hôm Nay
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Bảng timeline trực quan hiển thị các ca sân đang thi đấu, đã cọc và khoảng trống sẵn sàng nhận đặt.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
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
          </div>

          {/* Visual Legend */}
          <div className="flex flex-wrap items-center gap-4 px-4 py-2.5 rounded border text-xs" style={{ backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border-color)' }}>
            <span className="font-semibold text-xs" style={{ color: 'var(--text-secondary)' }}>
              Chú thích trạng thái:
            </span>
            <div className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs inline-block" style={{ backgroundColor: 'var(--status-success-bg)', border: '1px solid var(--status-success-border)' }}></span>
              <span className="font-medium" style={{ color: 'var(--status-success-text)' }}>Đang đá trên sân</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs inline-block" style={{ backgroundColor: 'var(--status-info-bg)', border: '1px solid var(--status-info-border)' }}></span>
              <span className="font-medium" style={{ color: 'var(--status-info-text)' }}>Đã cọc giữ sân</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs inline-block" style={{ backgroundColor: 'var(--status-warning-bg)', border: '1px solid var(--status-warning-border)' }}></span>
              <span className="font-medium" style={{ color: 'var(--status-warning-text)' }}>Chờ chuyển cọc</span>
            </div>
            <div className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-xs inline-block" style={{ backgroundColor: 'var(--bg-sand)', border: '1px dashed var(--border-strong)' }}></span>
              <span className="font-medium" style={{ color: 'var(--text-muted)' }}>Khung giờ trống (Gọi hotline đặt ngay)</span>
            </div>
          </div>

          {/* Timeline Schedule Container (Read-Only) */}
          <div className="sbl-schedule-container" style={{ userSelect: 'none' }}>
            <div className="sbl-schedule-scroll">
              <table className="sbl-timeline-table" aria-label="Bảng timeline lịch sân công khai 07:00 đến 24:00">
                <thead>
                  <tr>
                    <th className="sbl-timeline-pitch-col sbl-timeline-hour-header" style={{ textAlign: 'left', paddingLeft: '14px' }}>
                      SÂN / KHUNG GIỜ
                    </th>
                    {Array.from({ length: OPERATING_END_HOUR - OPERATING_START_HOUR }, (_, i) => OPERATING_START_HOUR + i).map((hour) => (
                      <th key={hour} className="sbl-timeline-hour-header">
                        {String(hour).padStart(2, '0')}:00
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visiblePitches.map((pitch) => {
                    const pitchBookings = bookings.filter(
                      (b) => b.pitchId === pitch.id && b.status !== 'cancelled' && b.status !== 'boom'
                    );

                    return (
                      <tr key={pitch.id} style={{ height: '62px' }}>
                        <td className="sbl-timeline-pitch-col sbl-pitch-cell">
                          <div className="sbl-pitch-name">
                            <span className="font-bold">{pitch.name}</span>
                            <span className="text-[10px] font-mono-tech px-1.5 py-0.5 rounded" style={{ backgroundColor: 'rgba(28,26,23,0.06)' }}>
                              {pitch.type}
                            </span>
                          </div>
                          <div className="sbl-pitch-type text-[11px]">
                            {formatVND(pitch.baseRatePrime)}/h
                          </div>
                        </td>

                        {/* 17 Hour Timeline Columns (Read-only view) */}
                        <td colSpan={OPERATING_END_HOUR - OPERATING_START_HOUR} style={{ position: 'relative', height: '62px' }}>
                          {/* Background Grid columns with subtle golden hour shading */}
                          <div
                            style={{
                              display: 'grid',
                              gridTemplateColumns: `repeat(${OPERATING_END_HOUR - OPERATING_START_HOUR}, 1fr)`,
                              position: 'absolute',
                              inset: 0,
                            }}
                          >
                            {Array.from({ length: OPERATING_END_HOUR - OPERATING_START_HOUR }, (_, i) => OPERATING_START_HOUR + i).map((h) => (
                              <div
                                key={h}
                                title={`${pitch.name} - Khung giờ ${String(h).padStart(2, '0')}:00`}
                                style={{
                                  borderRight: '1px dashed rgba(28, 26, 23, 0.08)',
                                  backgroundColor: h >= 17 && h <= 21 ? 'rgba(235, 230, 220, 0.28)' : 'transparent',
                                  cursor: 'default',
                                }}
                              />
                            ))}
                          </div>

                          {/* Read-Only Positioned Booking Blocks */}
                          {pitchBookings.map((bk) => {
                            const pos = calculateTimelinePosition(bk.startHour, bk.durationHours);
                            const statusLabel =
                              bk.status === 'checked-in'
                                ? 'ĐANG ĐÁ'
                                : bk.status === 'confirmed'
                                ? 'ĐÃ CỌC'
                                : 'CHỜ CỌC';

                            return (
                              <div
                                key={bk.id}
                                className={`sbl-booking-block state-${bk.status}`}
                                style={{
                                  left: `${pos.leftPercent}%`,
                                  width: `${pos.widthPercent}%`,
                                  cursor: 'default',
                                }}
                                title={`${pitch.name}: ${bk.teamName} (${formatHourLabel(bk.startHour)} – ${formatHourLabel(bk.startHour + bk.durationHours)}) – ${statusLabel}`}
                              >
                                <div className="font-bold text-xs truncate w-full leading-tight">
                                  {bk.teamName}
                                </div>
                                <div className="font-mono-tech text-[10px] font-semibold truncate w-full leading-tight">
                                  {formatHourLabel(bk.startHour)}–{formatHourLabel(bk.startHour + bk.durationHours)} • {statusLabel}
                                </div>
                              </div>
                            );
                          })}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Read-Only Notice Bar */}
            <div
              className="flex flex-wrap items-center justify-between gap-3 p-3.5 border-t text-xs"
              style={{ backgroundColor: 'var(--bg-sand)', borderColor: 'var(--border-color)' }}
            >
              <div className="flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                <Info size={15} style={{ color: 'var(--accent-moss)', flexShrink: 0 }} />
                <span>
                  Lịch sân ở chế độ xem trực tiếp. Các ô nền sọc trống là khung giờ chưa có người đá.
                </span>
              </div>
              <div className="font-medium">
                Hotline đặt giữ sân: <strong className="font-mono-tech font-bold" style={{ color: 'var(--accent-moss)' }}>0909 888 789</strong> (Zalo 24/7)
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Table */}
        <section id="bang-gia-san" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="sbl-panel">
            <div className="sbl-panel-header">
              <h2 className="sbl-panel-title">Bảng Giá Sân 5 Người (Sân 01 đến 08)</h2>
            </div>
            <div className="sbl-panel-body">
              <table className="sbl-table">
                <thead>
                  <tr>
                    <th>Khung Giờ Đá</th>
                    <th>Thứ 2 – Thứ 6</th>
                    <th style={{ textAlign: 'right' }}>Thứ 7 & Chủ Nhật</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-mono-tech text-xs font-semibold">07:00 – 16:00 (Khung ban ngày)</td>
                    <td className="font-mono-tech">200.000 đ / giờ</td>
                    <td className="font-mono-tech text-right font-bold">220.000 đ / giờ</td>
                  </tr>
                  <tr>
                    <td className="font-mono-tech text-xs font-semibold">16:00 – 21:30 (Khung giờ vàng)</td>
                    <td className="font-mono-tech">340.000 đ / giờ</td>
                    <td className="font-mono-tech text-right font-bold">360.000 đ / giờ</td>
                  </tr>
                  <tr>
                    <td className="font-mono-tech text-xs font-semibold">21:30 – 24:00 (Khung đêm muộn)</td>
                    <td className="font-mono-tech">260.000 đ / giờ</td>
                    <td className="font-mono-tech text-right font-bold">280.000 đ / giờ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="sbl-panel">
            <div className="sbl-panel-header">
              <h2 className="sbl-panel-title">Bảng Giá Sân 7 Người (Sân 09 đến 12)</h2>
            </div>
            <div className="sbl-panel-body">
              <table className="sbl-table">
                <thead>
                  <tr>
                    <th>Khung Giờ Đá</th>
                    <th>Thứ 2 – Thứ 6</th>
                    <th style={{ textAlign: 'right' }}>Thứ 7 & Chủ Nhật</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="font-mono-tech text-xs font-semibold">07:00 – 16:00 (Khung ban ngày)</td>
                    <td className="font-mono-tech">320.000 đ / giờ</td>
                    <td className="font-mono-tech text-right font-bold">350.000 đ / giờ</td>
                  </tr>
                  <tr>
                    <td className="font-mono-tech text-xs font-semibold">16:00 – 21:30 (Khung giờ vàng)</td>
                    <td className="font-mono-tech">550.000 đ / giờ</td>
                    <td className="font-mono-tech text-right font-bold">580.000 đ / giờ</td>
                  </tr>
                  <tr>
                    <td className="font-mono-tech text-xs font-semibold">21:30 – 24:00 (Khung đêm muộn)</td>
                    <td className="font-mono-tech">420.000 đ / giờ</td>
                    <td className="font-mono-tech text-right font-bold">440.000 đ / giờ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Booking Instructions & Contact */}
        <section id="huong-dan-dat-san" className="sbl-panel">
          <div className="sbl-panel-header">
            <h2 className="sbl-panel-title">Quy Trình & Nội Quy Giữ Sân</h2>
          </div>
          <div className="sbl-panel-body grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <div className="font-editorial text-lg font-bold mb-1">01. Kiểm tra giờ trống</div>
              <p style={{ color: 'var(--text-secondary)' }}>
                Xem bảng lịch công khai phía trên (5 người hoặc 7 người) và chọn khung giờ muốn đá.
              </p>
            </div>
            <div>
              <div className="font-editorial text-lg font-bold mb-1">02. Gọi Hotline hoặc nhắn Zalo</div>
              <p style={{ color: 'var(--text-secondary)' }}>
                Liên hệ <strong>0909 888 789</strong> để điều phối viên tạo phiếu giữ sân và cung cấp mã VietQR cọc.
              </p>
            </div>
            <div>
              <div className="font-editorial text-lg font-bold mb-1">03. Nhận sân & Thanh toán</div>
              <p style={{ color: 'var(--text-secondary)' }}>
                Đội trưởng báo bàn điều phối trước trận 10 phút, nhận bóng, áo Bib và vào sân thi đấu.
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
            <strong>SANBONGLON CENTRAL</strong> – Tổ hợp 12 sân cỏ tiêu chuẩn • Mở cửa: 07:00 – 24:00
          </div>
          <div className="flex items-center gap-4">
            <span>Hotline: 0909 888 789</span>
            <span aria-hidden="true">•</span>
            <button
              type="button"
              className="underline cursor-pointer bg-transparent border-0 p-0 text-xs font-semibold"
              onClick={() => onSwitchToInternal('dang-nhap-ca-truc')}
            >
              Cổng đăng nhập ca trực
            </button>
          </div>
        </div>
      </footer>
      </div>
    </div>
  );
};

/* ==========================================================================
   2. Shift & Admin Login View
   NOTE: As explicitly instructed:
   - "Xóa Tiền Tồn quỹ đầu ca và Ca làm việc nhận bàn giao ở phần đăng nhập."
   Both fields have been completely removed.
   ========================================================================== */
interface ShiftLoginViewProps {
  onSuccessLogin: () => void;
  onOpenPublicSite: () => void;
}

export const ShiftLoginView: React.FC<ShiftLoginViewProps> = ({
  onSuccessLogin,
  onOpenPublicSite,
}) => {
  const [staffCode, setStaffCode] = useState('SBL-NV01');
  const [password, setPassword] = useState('sanbonglon2026');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffCode.trim() || !password.trim()) {
      setError('Vui lòng nhập mã nhân viên và mật khẩu ca trực.');
      return;
    }
    setError('');
    onSuccessLogin();
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
              HỆ THỐNG ĐIỀU PHỐI & POS SÂN BÓNG
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
              XÁC THỰC NHÂN VIÊN VẬN HÀNH
            </div>
            <h1 className="font-editorial text-2xl font-semibold">Đăng Nhập Ca Trực & Quản Trị</h1>
          </div>

          <form onSubmit={handleSubmit} className="sbl-panel-body flex flex-col gap-4">
            {error && <div className="form-error">{error}</div>}

            <div className="form-group">
              <label htmlFor="loginStaffCode" className="form-label">
                Mã / Tài khoản điều phối:
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
              <span>Đăng nhập ca trực & Mở Trung tâm điều phối</span>
            </button>
          </form>
        </div>
      </main>

      <footer className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
        SANBONGLON Operational Shell – Warm Editorial Studio Design System
      </footer>
    </div>
  );
};
