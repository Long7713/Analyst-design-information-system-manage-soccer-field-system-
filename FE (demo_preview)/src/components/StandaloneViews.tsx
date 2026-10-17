import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Phone,
  MapPin,
  LogIn,
  CircleCheck,
  LayoutDashboard,
  FileCode,
  BookOpen,
  Flame,
  Sparkles,
  PhoneCall,
  X,
  ChevronRight,
  Info,
  CalendarDays,
  Plus,
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
  const [scheduleViewMode, setScheduleViewMode] = useState<'timeline' | 'cards'>('timeline');
  const [selectedQuickSlot, setSelectedQuickSlot] = useState<{
    pitchId: string;
    pitchType: string;
    startHour: number;
    duration: number;
    price: number;
  } | null>(null);
  const [bookingSuccessMsg, setBookingSuccessMsg] = useState('');

  const publicPrimeSlots = [7.5, 9.0, 16.0, 17.5, 19.0, 20.5, 22.0];
  const hoursRange = Array.from(
    { length: OPERATING_END_HOUR - OPERATING_START_HOUR },
    (_, i) => OPERATING_START_HOUR + i
  );

  const visiblePitches = PITCH_LIST.filter((p) =>
    pitchTypeFilter === 'all' ? true : p.type === pitchTypeFilter
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-cream)', color: 'var(--text-primary)' }}>
      {/* Clean 3-Zone Top Bar Contract for Public Website */}
      <header
        className="glass-nav sticky top-0 z-30 flex items-center justify-between gap-6 px-6 py-4 border-b"
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
            Lịch sân trống
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
            <span className="hidden sm:inline">Đăng nhập ca trực</span>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => onSwitchToInternal('tong-quan')}
          >
            <LayoutDashboard size={15} />
            <span>Vào Quản trị</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 flex flex-col gap-12">
        {/* Hero Editorial Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch pb-8 border-b" style={{ borderColor: 'var(--border-color)' }}>
          <div className="lg:col-span-7 flex flex-col justify-between gap-6">
            <div>
              <div className="font-mono-tech text-xs mb-3" style={{ color: 'var(--accent-moss)' }}>
                TỔ HỢP 12 SÂN BÓNG TIÊU CHUẨN FIFA PRO · 07:00 – 24:00
              </div>
              <h1 className="font-editorial text-4xl sm:text-5xl font-semibold leading-tight">
                Lịch Sân Công Khai & Tra Cứu Khung Giờ Trống Thời Gian Thực
              </h1>
              <p className="mt-4 text-base leading-relaxed" style={{ color: 'var(--text-secondary)', maxWidth: '64ch' }}>
                Hệ thống gồm 08 sân 5 người và 04 sân 7 người sợi kim cương chống lật sơmi, đèn pha LED chống chói 400W. Tra cứu khung giờ sân trống dưới đây hoặc gọi Hotline điều phối viên trong 60 giây.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#lich-san-trong" className="btn btn-lime btn-lg">
                <Calendar size={18} />
                <span>Xem giờ trống hôm nay (17/10)</span>
              </a>
              <a href="#bang-gia-san" className="btn btn-secondary btn-lg">
                <span>Xem bảng giá chi tiết</span>
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
                Bộ phận điều phối trực tiếp nhận cuộc gọi và tin nhắn Zalo từ 06:30 đến 24:00 mỗi ngày.
              </p>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div className="p-3 rounded border" style={{ backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border-color)' }}>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Hotline & Zalo đặt sân:</div>
                <div className="font-mono-tech text-lg font-bold mt-0.5">0909 888 789 · 028 3899 4567</div>
              </div>
              <div className="p-3 rounded border" style={{ backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border-color)' }}>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Địa chỉ cụm sân:</div>
                <div className="font-semibold mt-0.5">Số 268 Điện Biên Phủ, Quận Bình Thạnh, TP. Hồ Chí Minh</div>
              </div>
              <div className="p-3 rounded border" style={{ backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border-color)' }}>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Tiện ích miễn phí tại sân:</div>
                <div className="text-xs font-medium mt-0.5">
                  Bãi giữ xe ô tô & xe máy rộng rãi · Wifi tốc độ cao · Phòng thay đồ & tắm nóng lạnh.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Public Field Availability Schedule (Schedule-like Style) */}
        <section id="lich-san-trong" className="flex flex-col gap-5">
          {/* Schedule Header & Controls */}
          <div className="flex flex-wrap items-end justify-between gap-4 pb-2 border-b" style={{ borderColor: 'var(--border-subtle)' }}>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-mono font-bold"
                  style={{ backgroundColor: 'var(--accent-lime-soft)', color: 'var(--status-success-text)', border: '1px solid var(--accent-lime-border)' }}
                >
                  <CalendarDays size={14} strokeWidth={2.2} />
                  <span>LỊCH TRÌNH THỜI GIAN THỰC (07:00 – 24:00)</span>
                </span>
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  Hôm nay: Thứ Bảy, 17/10/2026
                </span>
              </div>
              <h2 className="font-editorial text-3xl font-semibold">
                Lịch Thi Đấu & Giờ Trống Cụm 12 Sân
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Hiển thị theo định dạng <strong>Lịch dòng thời gian (Schedule Timeline)</strong>. Nhấn vào bất kỳ ô giờ trống nào để xem giá và đặt giữ sân ngay.
              </p>
            </div>

            {/* Mode & Category Selectors */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="sbl-segmented" role="tablist" aria-label="Chế độ hiển thị lịch">
                <button
                  type="button"
                  role="tab"
                  aria-selected={scheduleViewMode === 'timeline'}
                  className={`sbl-segment-btn ${scheduleViewMode === 'timeline' ? 'is-active' : ''}`}
                  onClick={() => setScheduleViewMode('timeline')}
                >
                  <Clock size={13} className="inline mr-1" />
                  <span>Dòng Thời Gian (Timeline)</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={scheduleViewMode === 'cards'}
                  className={`sbl-segment-btn ${scheduleViewMode === 'cards' ? 'is-active' : ''}`}
                  onClick={() => setScheduleViewMode('cards')}
                >
                  <Calendar size={13} className="inline mr-1" />
                  <span>Thẻ Theo Ca (Shift Cards)</span>
                </button>
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
          </div>

          {/* Schedule Legend Strip */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-md border text-xs"
            style={{ backgroundColor: 'var(--bg-sand)', borderColor: 'var(--border-color)' }}
          >
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-semibold text-xs" style={{ color: 'var(--text-secondary)' }}>
                Chú giải lịch:
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs border border-dashed border-[#7AC238] bg-[#E3EFE6]" />
                <span className="font-medium">Khung giờ trống (Nhấn đặt sân)</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#E3ECF5] border border-[#A3C1DC]" />
                <span className="font-medium">Đã có trận thi đấu</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[rgba(222,185,134,0.35)] border border-[#DEB986]" />
                <span className="font-medium flex items-center gap-1">
                  <Flame size={12} className="text-amber-700" />
                  <span>Khung Giờ Vàng (16:00 – 21:30)</span>
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <span className="font-medium text-red-700">Đường đỏ: Thời gian thực (17:15)</span>
              </span>
            </div>

            <div className="font-mono-tech text-xs" style={{ color: 'var(--text-muted)' }}>
              Hotline hỗ trợ: <strong className="text-[var(--text-primary)]">0909 888 789</strong>
            </div>
          </div>

          {/* Schedule View Mode 1: Interactive Timeline Schedule */}
          {scheduleViewMode === 'timeline' && (
            <div className="sbl-panel shadow-sm">
              <div className="sbl-schedule-scroll">
                <table className="sbl-timeline-table" aria-label="Lịch thi đấu dòng thời gian 07:00 đến 24:00">
                  <thead>
                    {/* Golden Hour Super-Header */}
                    <tr>
                      <th
                        className="sbl-timeline-pitch-col"
                        style={{
                          backgroundColor: 'var(--bg-sand)',
                          padding: '6px 12px',
                          textAlign: 'left',
                          fontSize: '11px',
                          color: 'var(--text-secondary)',
                          borderBottom: '1px solid var(--border-subtle)',
                        }}
                      >
                        KHUNG GIỜ HOẠT ĐỘNG
                      </th>
                      {/* 07:00 to 16:00 (9 hours) */}
                      <th
                        colSpan={9}
                        style={{
                          backgroundColor: 'var(--bg-paper)',
                          fontSize: '11px',
                          textAlign: 'center',
                          color: 'var(--text-muted)',
                          borderBottom: '1px solid var(--border-subtle)',
                          padding: '6px 0',
                        }}
                      >
                        KHUNG BAN NGÀY (07:00 – 16:00) · Giảm 35% giá sân
                      </th>
                      {/* 16:00 to 21:30 (5.5h / 6 cols 16-22) */}
                      <th
                        colSpan={6}
                        style={{
                          backgroundColor: 'rgba(247, 236, 220, 0.85)',
                          fontSize: '11px',
                          textAlign: 'center',
                          color: '#8F520D',
                          fontWeight: 700,
                          borderBottom: '1px solid var(--border-strong)',
                          padding: '6px 0',
                        }}
                      >
                        ⚡ KHUNG GIỜ VÀNG CAO ĐIỂM (16:00 – 21:30) · ĐÈN LED 400W
                      </th>
                      {/* 22:00 to 24:00 (2 hours) */}
                      <th
                        colSpan={2}
                        style={{
                          backgroundColor: 'var(--bg-paper)',
                          fontSize: '11px',
                          textAlign: 'center',
                          color: 'var(--text-muted)',
                          borderBottom: '1px solid var(--border-subtle)',
                          padding: '6px 0',
                        }}
                      >
                        KHUNG ĐÊM (22:00 – 24:00)
                      </th>
                    </tr>

                    {/* Hourly Tick Headers */}
                    <tr>
                      <th className="sbl-timeline-pitch-col sbl-timeline-hour-header" style={{ textAlign: 'left', paddingLeft: '12px' }}>
                        SÂN BÓNG / LOẠI
                      </th>
                      {hoursRange.map((hour) => {
                        const isPrime = hour >= 16 && hour <= 21;
                        return (
                          <th
                            key={hour}
                            className="sbl-timeline-hour-header"
                            style={{
                              backgroundColor: isPrime ? 'rgba(247, 236, 220, 0.65)' : 'var(--bg-sand)',
                              color: isPrime ? '#8F520D' : 'var(--text-secondary)',
                            }}
                          >
                            {String(hour).padStart(2, '0')}:00
                          </th>
                        );
                      })}
                    </tr>
                  </thead>

                  <tbody>
                    {visiblePitches.map((pitch) => {
                      const pitchBookings = bookings.filter(
                        (b) => b.pitchId === pitch.id && b.status !== 'cancelled' && b.status !== 'boom'
                      );

                      return (
                        <tr key={pitch.id} style={{ height: '72px' }}>
                          {/* Left Sticky Pitch Card Column */}
                          <td className="sbl-timeline-pitch-col sbl-pitch-cell">
                            <div className="sbl-pitch-name">
                              <span>{pitch.name}</span>
                              <span
                                className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold"
                                style={{
                                  backgroundColor: pitch.type === '7 người' ? 'rgba(88, 105, 85, 0.15)' : 'rgba(122, 194, 56, 0.16)',
                                  color: pitch.type === '7 người' ? 'var(--accent-moss)' : 'var(--status-success-text)',
                                }}
                              >
                                {pitch.type}
                              </span>
                            </div>
                            <div className="sbl-pitch-type truncate">
                              {pitch.surface}
                            </div>
                            <div className="flex items-center justify-between mt-1 text-[11px] font-mono">
                              <span style={{ color: 'var(--text-secondary)' }}>
                                {formatVND(pitch.baseRatePrime)}/h
                              </span>
                              <span className="text-[10px] text-emerald-700 font-semibold">
                                ● {pitch.lightingStatus}
                              </span>
                            </div>
                          </td>

                          {/* 17 Hours Interactive Timeline Track */}
                          <td colSpan={hoursRange.length} style={{ position: 'relative', height: '72px' }}>
                            {/* Visual Grid Column Backgrounds */}
                            <div
                              style={{
                                display: 'grid',
                                gridTemplateColumns: `repeat(${hoursRange.length}, 1fr)`,
                                position: 'absolute',
                                inset: 0,
                              }}
                            >
                              {hoursRange.map((h) => {
                                const isPrime = h >= 16 && h <= 21;
                                return (
                                  <div
                                    key={h}
                                    style={{
                                      borderRight: '1px dashed rgba(28, 26, 23, 0.09)',
                                      backgroundColor: isPrime ? 'rgba(235, 230, 220, 0.28)' : 'transparent',
                                    }}
                                  />
                                );
                              })}
                            </div>

                            {/* Red Current Time Hairline Indicator (at 17:15 = 17.25h) */}
                            {(() => {
                              const nowHour = 17.25;
                              const nowPct = ((nowHour - OPERATING_START_HOUR) / (OPERATING_END_HOUR - OPERATING_START_HOUR)) * 100;
                              return (
                                <div
                                  style={{
                                    position: 'absolute',
                                    left: `${nowPct}%`,
                                    top: 0,
                                    bottom: 0,
                                    width: '2px',
                                    backgroundColor: '#DC2626',
                                    zIndex: 12,
                                    pointerEvents: 'none',
                                  }}
                                >
                                  <span
                                    className="px-1 py-0.5 rounded text-[9px] font-mono font-bold text-white bg-red-600 shadow"
                                    style={{
                                      position: 'absolute',
                                      top: '2px',
                                      left: '50%',
                                      transform: 'translateX(-50%)',
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    17:15
                                  </span>
                                </div>
                              );
                            })()}

                            {/* Public Prime Interactive Empty Slots for Quick Reservation */}
                            {publicPrimeSlots.map((slotHour) => {
                              const occupied = pitchBookings.some(
                                (b) => slotHour < b.startHour + b.durationHours && slotHour + 1.5 > b.startHour
                              );
                              if (occupied) return null;

                              const pos = calculateTimelinePosition(slotHour, 1.5);
                              const rate =
                                slotHour >= 16 && slotHour <= 21.5
                                  ? pitch.baseRatePrime
                                  : slotHour < 16
                                  ? pitch.baseRateMorning
                                  : pitch.baseRateLate;
                              const estimatedSlotPrice = Math.round(rate * 1.5);

                              return (
                                <button
                                  key={slotHour}
                                  type="button"
                                  className="group"
                                  style={{
                                    position: 'absolute',
                                    left: `${pos.leftPercent}%`,
                                    width: `${pos.widthPercent}%`,
                                    top: '6px',
                                    bottom: '6px',
                                    borderRadius: 'var(--radius-xs)',
                                    border: '1px dashed #7AC238',
                                    backgroundColor: 'rgba(227, 239, 230, 0.70)',
                                    color: '#235732',
                                    padding: '4px 6px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    textAlign: 'left',
                                    cursor: 'pointer',
                                    zIndex: 4,
                                    transition: 'all 140ms ease-out',
                                  }}
                                  onClick={() =>
                                    setSelectedQuickSlot({
                                      pitchId: pitch.name,
                                      pitchType: pitch.type,
                                      startHour: slotHour,
                                      duration: 1.5,
                                      price: estimatedSlotPrice,
                                    })
                                  }
                                  title={`Còn trống: ${pitch.name} lúc ${formatHourLabel(slotHour)} - ${formatHourLabel(slotHour + 1.5)}`}
                                >
                                  <div className="font-bold text-[11px] leading-tight flex items-center justify-between w-full">
                                    <span className="text-emerald-800 flex items-center gap-1">
                                      <Plus size={11} strokeWidth={2.5} />
                                      <span>Còn trống</span>
                                    </span>
                                    <span className="font-mono text-[10px] font-bold text-emerald-900">
                                      {formatVND(estimatedSlotPrice)}
                                    </span>
                                  </div>
                                  <div className="font-mono text-[10px] text-emerald-700 truncate mt-0.5">
                                    {formatHourLabel(slotHour)}–{formatHourLabel(slotHour + 1.5)} · Nhấn đặt
                                  </div>
                                </button>
                              );
                            })}

                            {/* Real Occupied Schedule Event Blocks */}
                            {pitchBookings.map((bk) => {
                              const pos = calculateTimelinePosition(bk.startHour, bk.durationHours);
                              return (
                                <div
                                  key={bk.id}
                                  className={`sbl-booking-block state-${bk.status}`}
                                  style={{
                                    left: `${pos.leftPercent}%`,
                                    width: `${pos.widthPercent}%`,
                                    top: '6px',
                                    bottom: '6px',
                                    boxShadow: 'var(--shadow-xs)',
                                  }}
                                  title={`${bk.pitchId} — ${bk.teamName} (${formatHourLabel(bk.startHour)} – ${formatHourLabel(
                                    bk.startHour + bk.durationHours
                                  )})`}
                                >
                                  <div className="font-bold text-xs truncate w-full leading-tight flex items-center justify-between">
                                    <span>{bk.teamName}</span>
                                    <span className="text-[10px] font-mono opacity-80">
                                      {bk.durationHours}h
                                    </span>
                                  </div>
                                  <div className="font-mono-tech text-[10px] font-semibold truncate w-full leading-tight mt-0.5">
                                    {formatHourLabel(bk.startHour)} – {formatHourLabel(bk.startHour + bk.durationHours)}
                                  </div>
                                  <div className="text-[10px] truncate w-full opacity-80 leading-tight">
                                    {bk.status === 'checked-in' ? '● Đang thi đấu' : '✓ Đã giữ chỗ'}
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
            </div>
          )}

          {/* Schedule View Mode 2: Shift Cards Schedule */}
          {scheduleViewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  id: 'shift-morning',
                  name: 'Ca Sáng (07:00 – 12:00)',
                  badge: 'Tiết Kiệm',
                  badgeColor: 'var(--status-success-bg)',
                  textColor: 'var(--status-success-text)',
                  desc: 'Thời tiết mát mẻ, phù hợp rèn luyện sức khỏe đầu ngày.',
                  priceRange: '200.000 – 350.000 đ/h',
                  slots: [7.5, 9.0, 10.5],
                },
                {
                  id: 'shift-afternoon',
                  name: 'Ca Chiều (12:00 – 16:00)',
                  badge: 'Thoải Mái',
                  badgeColor: 'var(--status-info-bg)',
                  textColor: 'var(--status-info-text)',
                  desc: 'Dễ dàng chọn sân yêu thích, không lo cháy giờ.',
                  priceRange: '200.000 – 350.000 đ/h',
                  slots: [14.0, 15.5],
                },
                {
                  id: 'shift-prime',
                  name: 'Ca Giờ Vàng (16:00 – 21:30)',
                  badge: '⚡ Cao Điểm VIP',
                  badgeColor: 'var(--status-warning-bg)',
                  textColor: '#8F520D',
                  desc: 'Sôi động nhất ngày, đèn pha LED 400W sáng rực rỡ.',
                  priceRange: '340.000 – 580.000 đ/h',
                  slots: [16.0, 17.5, 19.0, 20.5],
                },
                {
                  id: 'shift-night',
                  name: 'Ca Đêm Muộn (21:30 – 24:00)',
                  badge: 'Giao Lưu Khuya',
                  badgeColor: 'var(--bg-sand)',
                  textColor: 'var(--text-secondary)',
                  desc: 'Không khí mát mẻ, thích hợp các trận cầu giao hữu khuya.',
                  priceRange: '260.000 – 440.000 đ/h',
                  slots: [21.5, 22.5],
                },
              ].map((shift) => (
                <div key={shift.id} className="sbl-panel flex flex-col justify-between">
                  <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-sand)' }}>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span
                        className="px-2 py-0.5 rounded text-[11px] font-mono font-bold"
                        style={{ backgroundColor: shift.badgeColor, color: shift.textColor }}
                      >
                        {shift.badge}
                      </span>
                      <span className="font-mono text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                        {shift.priceRange}
                      </span>
                    </div>
                    <h3 className="font-editorial text-lg font-bold">{shift.name}</h3>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      {shift.desc}
                    </p>
                  </div>

                  <div className="p-3 flex-1 flex flex-col gap-2 max-h-[360px] overflow-y-auto">
                    {visiblePitches.slice(0, 6).map((p) => {
                      return (
                        <div
                          key={p.id}
                          className="p-2.5 rounded border flex items-center justify-between gap-2 text-xs"
                          style={{ backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border-subtle)' }}
                        >
                          <div>
                            <div className="font-bold flex items-center gap-1.5">
                              <span>{p.name}</span>
                              <span className="font-mono text-[10px] text-muted">({p.type})</span>
                            </div>
                            <div className="font-mono text-[10px] text-muted mt-0.5">
                              Các ca: {shift.slots.map((s) => formatHourLabel(s)).join(', ')}
                            </div>
                          </div>

                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            style={{ height: '28px', padding: '0 8px' }}
                            onClick={() =>
                              setSelectedQuickSlot({
                                pitchId: p.name,
                                pitchType: p.type,
                                startHour: shift.slots[0],
                                duration: 1.5,
                                price: Math.round(p.baseRatePrime * 1.5),
                              })
                            }
                          >
                            <Plus size={12} />
                            <span>Đặt ca</span>
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="p-3 border-t bg-[var(--bg-cream)] text-center text-xs" style={{ borderColor: 'var(--border-color)' }}>
                    <a href="#lien-he" className="underline font-semibold" style={{ color: 'var(--accent-moss)' }}>
                      Liên hệ Hotline để giữ slot ca này →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Booking Success Notice */}
          {bookingSuccessMsg && (
            <div
              className="p-4 rounded-md border flex items-center justify-between gap-3 text-sm animate-scale-in"
              style={{ backgroundColor: 'var(--status-success-bg)', borderColor: 'var(--status-success-border)', color: 'var(--status-success-text)' }}
            >
              <div className="flex items-center gap-2 font-medium">
                <CircleCheck size={18} strokeWidth={2} />
                <span>{bookingSuccessMsg}</span>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => setBookingSuccessMsg('')}
              >
                Đóng
              </button>
            </div>
          )}

          {/* Quick Schedule Booking Modal */}
          {selectedQuickSlot && (
            <div
              className="sbl-overlay-backdrop animate-fade-in"
              onClick={() => setSelectedQuickSlot(null)}
              role="dialog"
              aria-modal="true"
              aria-label="Đặt lịch sân nhanh"
            >
              <div
                className="sbl-modal animate-scale-in"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: '480px' }}
              >
                <div className="sbl-panel-header">
                  <div>
                    <span className="font-mono text-xs uppercase font-bold" style={{ color: 'var(--accent-moss)' }}>
                      GIỮ KHUNG GIỜ SÂN BÓNG
                    </span>
                    <h2 className="sbl-panel-title mt-0.5">
                      {selectedQuickSlot.pitchId} — {formatHourLabel(selectedQuickSlot.startHour)} đến{' '}
                      {formatHourLabel(selectedQuickSlot.startHour + selectedQuickSlot.duration)}
                    </h2>
                  </div>
                  <button
                    type="button"
                    className="btn btn-ghost btn-icon btn-sm"
                    onClick={() => setSelectedQuickSlot(null)}
                    aria-label="Đóng"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="sbl-panel-body flex flex-col gap-4">
                  <div
                    className="p-3.5 rounded border flex flex-col gap-2 text-xs"
                    style={{ backgroundColor: 'var(--bg-sand)', borderColor: 'var(--border-color)' }}
                  >
                    <div className="flex items-center justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Loại sân:</span>
                      <span className="font-bold">Sân {selectedQuickSlot.pitchType} (Tiêu chuẩn)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ color: 'var(--text-secondary)' }}>Thời lượng trận:</span>
                      <span className="font-mono font-bold">{selectedQuickSlot.duration} giờ (90 phút)</span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t font-bold text-sm" style={{ borderColor: 'var(--border-subtle)' }}>
                      <span>Giá thuê dự kiến:</span>
                      <span className="font-mono text-[var(--accent-moss)]">{formatVND(selectedQuickSlot.price)}</span>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    Để hoàn tất giữ sân và kích hoạt mã VietQR cọc 50%, vui lòng gọi trực tiếp hotline điều phối viên hoặc nhắn Zalo trong 60 giây:
                  </p>

                  <div className="flex flex-col gap-2">
                    <a
                      href="tel:0909888789"
                      className="btn btn-lime w-full text-center"
                      onClick={() => {
                        setBookingSuccessMsg(`Đã tạo yêu cầu giữ sân ${selectedQuickSlot.pitchId} lúc ${formatHourLabel(selectedQuickSlot.startHour)}. Điều phối viên đang kết nối!`);
                        setSelectedQuickSlot(null);
                      }}
                    >
                      <PhoneCall size={16} strokeWidth={2} />
                      <span>Gọi Điều Phối Viên: 0909 888 789</span>
                    </a>

                    <button
                      type="button"
                      className="btn btn-secondary w-full"
                      onClick={() => {
                        setBookingSuccessMsg(`Đã gửi yêu cầu giữ ${selectedQuickSlot.pitchId} qua Zalo. Quý khách vui lòng kiểm tra tin nhắn.`);
                        setSelectedQuickSlot(null);
                      }}
                    >
                      <span>Nhắn Tin Đặt Qua Zalo (0909 888 789)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
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
                Xem bảng lịch công khai phía trên (5 người hoặc 7 người) và chọn khung giờ phù hợp với hai đội.
              </p>
            </div>
            <div>
              <div className="font-editorial text-lg font-bold mb-1">02. Gọi Hotline hoặc nhắn Zalo</div>
              <p style={{ color: 'var(--text-secondary)' }}>
                Liên hệ <strong>0909 888 789</strong> để điều phối viên tạo phiếu giữ sân và cung cấp mã VietQR chuyển cọc.
              </p>
            </div>
            <div>
              <div className="font-editorial text-lg font-bold mb-1">03. Nhận sân & Thanh toán</div>
              <p style={{ color: 'var(--text-secondary)' }}>
                Đội trưởng có mặt tại quầy điều phối trước trận 10 phút để nhận bóng, áo Bib và kích hoạt ca đá.
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
            <strong>SANBONGLON CENTRAL</strong> — Cụm 12 sân bóng tiêu chuẩn FIFA Pro. Mở cửa: 07:00 – 24:00.
          </div>
          <div className="flex items-center gap-4">
            <span>Hotline: 0909 888 789</span>
            <span aria-hidden="true">·</span>
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
  );
};

/* ==========================================================================
   2. Shift & Admin Login View
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
      setError('Vui lòng nhập Mã nhân viên và Mật khẩu đăng nhập.');
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
              XÁC THỰC TÀI KHOẢN VẬN HÀNH
            </div>
            <h1 className="font-editorial text-2xl font-semibold">Đăng Nhập Quản Trị Hệ Thống</h1>
          </div>
          <form onSubmit={handleSubmit} className="sbl-panel-body flex flex-col gap-4">
            {error && <div className="form-error">{error}</div>}
            <div className="form-group">
              <label htmlFor="loginStaffCode" className="form-label">
                Mã / Tài khoản nhân viên:
              </label>
              <input
                id="loginStaffCode"
                type="text"
                className="form-input font-mono-tech font-semibold"
                value={staffCode}
                onChange={(e) => setStaffCode(e.target.value)}
              />
              <div className="text-[11px] text-muted">
                Nhân viên mặc định: <strong>Trương Thịnh Phát</strong> (SBL-NV01)
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="loginPassword" className="form-label">
                Mật khẩu:
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
              <span>Đăng nhập vào Trung tâm điều phối</span>
            </button>
          </form>
        </div>
      </main>

      <footer className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
        SANBONGLON Operational Shell — Warm Editorial Studio Design System
      </footer>
    </div>
  );
};
