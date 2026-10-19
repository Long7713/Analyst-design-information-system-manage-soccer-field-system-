import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Search,
  CircleCheck,
  TriangleAlert,
  CircleX,
  UserRound,
  ShoppingBag,
  Eye,
  X,
} from 'lucide-react';
import {
  type PitchBooking,
  type BookingStatus,
  formatHourLabel,
  formatVND,
  calculateTimelinePosition,
  calculateBookingFinancials,
  OPERATING_START_HOUR,
  OPERATING_END_HOUR,
} from '../utils/sanbonglonLogic';
import { PITCH_LIST, type PosProduct } from '../data/demoData';

interface ScheduleAndBookingViewProps {
  mode: 'schedule' | 'bookings';
  bookings: PitchBooking[];
  posProducts: PosProduct[];
  selectedDate: string;
  onChangeDate: (date: string) => void;
  onBookingAction: (
    bookingId: string,
    action: 'nhan-san' | 'them-gio' | 'doi-gio' | 'bao-boom' | 'huy-san',
    payload?: { newStartHour?: number; extraHours?: number; extraRatePerHour?: number }
  ) => void;
  onAddPosToBooking: (bookingId: string, product: PosProduct, qty: number) => void;
  onOpenNewBookingModal: (prefillPitchId?: string, prefillHour?: number) => void;
}

const HOURS_ARRAY = Array.from(
  { length: OPERATING_END_HOUR - OPERATING_START_HOUR },
  (_, i) => OPERATING_START_HOUR + i
);

export function renderBookingStatusIndicator(status: BookingStatus) {
  switch (status) {
    case 'checked-in':
      return (
        <span className="status-indicator status-success">
          <CircleCheck size={14} strokeWidth={2} />
          <span>Đang đá</span>
        </span>
      );
    case 'confirmed':
      return (
        <span className="status-indicator status-info">
          <Calendar size={14} strokeWidth={2} />
          <span>Đã cọc giữ sân</span>
        </span>
      );
    case 'pending':
      return (
        <span className="status-indicator status-warning">
          <Clock size={14} strokeWidth={2} />
          <span>Chờ chuyển cọc</span>
        </span>
      );
    case 'boom':
      return (
        <span className="status-indicator status-danger">
          <TriangleAlert size={14} strokeWidth={2} />
          <span>Báo Boom</span>
        </span>
      );
    case 'cancelled':
      return (
        <span className="status-indicator status-neutral">
          <CircleX size={14} strokeWidth={2} />
          <span>Đã hủy</span>
        </span>
      );
  }
}

export const ScheduleAndBookingView: React.FC<ScheduleAndBookingViewProps> = ({
  mode,
  bookings,
  posProducts,
  selectedDate,
  onChangeDate,
  onBookingAction,
  onAddPosToBooking,
  onOpenNewBookingModal,
}) => {
  const [pitchFilter, setPitchFilter] = useState<'all' | '5 người' | '7 người'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | BookingStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [rescheduleHour, setRescheduleHour] = useState<number | null>(null);
  const [quickPosProductId, setQuickPosProductId] = useState<string>(posProducts[0]?.id || 'POS-01');
  const [quickPosQty, setQuickPosQty] = useState<number>(6);

  const selectedBooking = useMemo(
    () => bookings.find((b) => b.id === selectedBookingId) || null,
    [bookings, selectedBookingId]
  );

  const filteredPitches = useMemo(() => {
    return PITCH_LIST.filter((p) => (pitchFilter === 'all' ? true : p.type === pitchFilter));
  }, [pitchFilter]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      if (pitchFilter !== 'all' && b.pitchType !== pitchFilter) return false;
      if (statusFilter !== 'all' && b.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          b.customerName.toLowerCase().includes(q) ||
          b.teamName.toLowerCase().includes(q) ||
          b.phone.toLowerCase().includes(q) ||
          b.id.toLowerCase().includes(q) ||
          b.pitchId.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [bookings, pitchFilter, statusFilter, searchQuery]);

  const stats = useMemo(() => {
    const active = bookings.filter((b) => b.status !== 'cancelled');
    const checkedInCount = active.filter((b) => b.status === 'checked-in').length;
    const confirmedCount = active.filter((b) => b.status === 'confirmed').length;
    const pendingCount = active.filter((b) => b.status === 'pending').length;
    const boomCount = active.filter((b) => b.status === 'boom').length;
    return { total: active.length, checkedInCount, confirmedCount, pendingCount, boomCount };
  }, [bookings]);

  const openBookingDrawer = (booking: PitchBooking) => {
    setSelectedBookingId(booking.id);
    setRescheduleHour(booking.startHour);
  };

  return (
    <div>
      {/* Page Heading */}
      <div className="sbl-page-header">
        <div>
          <h1 className="sbl-page-title">
            Trung Tâm Điều Phối, Lịch Sân & Đặt Chỗ (07:00 – 24:00)
          </h1>
          <p className="sbl-page-subtitle">
            Cụm 12 sân tiêu chuẩn (Sân 01 đến 08: 5 người | Sân 09 đến 12: 7 người). Ngày trực:{' '}
            <strong className="font-mono-tech">{selectedDate}</strong> (Thứ 7 – Cao điểm cuối tuần)
          </p>
        </div>
        <div className="sbl-page-actions">
          <div className="flex items-center gap-2">
            <label htmlFor="scheduleDateInput" className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Ngày:
            </label>
            <input
              id="scheduleDateInput"
              type="date"
              className="form-input font-mono-tech"
              style={{ width: '152px', height: '34px' }}
              value={selectedDate}
              onChange={(e) => onChangeDate(e.target.value)}
            />
          </div>
          <button
            type="button"
            className="btn btn-lime"
            onClick={() => onOpenNewBookingModal('Sân 01', 17.5)}
          >
            <Plus size={18} strokeWidth={2} />
            <span>+ Đặt sân mới</span>
          </button>
        </div>
      </div>

      {/* Summary Operational Strip */}
      <div className="sbl-kpi-strip">
        <div className="sbl-kpi-card">
          <div className="sbl-kpi-label">
            <span>Đang đá trên sân</span>
            <CircleCheck size={16} strokeWidth={1.8} style={{ color: 'var(--status-success-text)' }} />
          </div>
          <div className="sbl-kpi-value">{stats.checkedInCount} ca</div>
          <div className="sbl-kpi-meta">
            <span>Đã check-in đúng giờ</span>
            <span aria-hidden="true">•</span>
            <span>Sân 01 đến 12</span>
          </div>
        </div>

        <div className="sbl-kpi-card">
          <div className="sbl-kpi-label">
            <span>Đã cọc giữ sân</span>
            <Calendar size={16} strokeWidth={1.8} style={{ color: 'var(--status-info-text)' }} />
          </div>
          <div className="sbl-kpi-value">{stats.confirmedCount} ca</div>
          <div className="sbl-kpi-meta">
            <span>Chờ đến nhận sân</span>
            <span aria-hidden="true">•</span>
            <span>Đã đối soát cọc</span>
          </div>
        </div>

        <div className="sbl-kpi-card">
          <div className="sbl-kpi-label">
            <span>Chờ chuyển khoản cọc</span>
            <Clock size={16} strokeWidth={1.8} style={{ color: 'var(--status-warning-text)' }} />
          </div>
          <div className="sbl-kpi-value">{stats.pendingCount} ca</div>
          <div className="sbl-kpi-meta">
            <span>Cần xác nhận trước 60p</span>
          </div>
        </div>

        <div className="sbl-kpi-card">
          <div className="sbl-kpi-label">
            <span>Báo Boom / Quá giờ</span>
            <TriangleAlert size={16} strokeWidth={1.8} style={{ color: 'var(--status-danger-text)' }} />
          </div>
          <div className="sbl-kpi-value">{stats.boomCount} ca</div>
          <div className="sbl-kpi-meta">
            <span>Cần giải phóng khung giờ vàng</span>
          </div>
        </div>
      </div>

      {/* Contextual Filter Toolbar */}
      <div className="sbl-panel mb-6">
        <div className="sbl-table-toolbar">
          <div className="flex flex-wrap items-center gap-3">
            <div className="sbl-segmented" role="group" aria-label="Lọc loại sân">
              {(['all', '5 người', '7 người'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  className={`sbl-segment-btn ${pitchFilter === type ? 'is-active' : ''}`}
                  onClick={() => setPitchFilter(type)}
                >
                  {type === 'all' ? 'Tất cả 12 sân' : `Sân ${type}`}
                </button>
              ))}
            </div>

            <div className="sbl-segmented" role="group" aria-label="Lọc trạng thái sân">
              {(
                [
                  { id: 'all', label: 'Mọi trạng thái' },
                  { id: 'checked-in', label: 'Đang đá' },
                  { id: 'confirmed', label: 'Đã cọc' },
                  { id: 'pending', label: 'Chờ cọc' },
                  { id: 'boom', label: 'Báo Boom' },
                ] as const
              ).map((st) => (
                <button
                  key={st.id}
                  type="button"
                  className={`sbl-segment-btn ${statusFilter === st.id ? 'is-active' : ''}`}
                  onClick={() => setStatusFilter(st.id)}
                >
                  {st.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-search-wrapper" style={{ minWidth: '260px' }}>
            <Search size={16} className="form-search-icon" />
            <input
              type="search"
              className="form-input form-search-input"
              placeholder="Tìm tên đội, SĐT, mã đơn (SBL-)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Tìm kiếm lịch đặt"
            />
          </div>
        </div>

        {/* Visual Timeline Matrix (07:00 - 24:00 across Sân 01 - Sân 12) */}
        <div className="sbl-schedule-scroll">
          <table className="sbl-timeline-table" aria-label="Bảng điều phối lịch sân 07:00 đến 24:00">
            <thead>
              <tr>
                <th className="sbl-timeline-pitch-col sbl-timeline-hour-header" style={{ textAlign: 'left', paddingLeft: '12px' }}>
                  SÂN / KHUNG GIỜ
                </th>
                {HOURS_ARRAY.map((hour) => (
                  <th key={hour} className="sbl-timeline-hour-header">
                    {String(hour).padStart(2, '0')}:00
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredPitches.map((pitch) => {
                const pitchBookings = filteredBookings.filter(
                  (b) => b.pitchId === pitch.id && b.status !== 'cancelled'
                );

                return (
                  <tr key={pitch.id} style={{ height: '66px' }}>
                    <td className="sbl-timeline-pitch-col sbl-pitch-cell">
                      <div className="sbl-pitch-name">
                        <span>{pitch.name}</span>
                        <button
                          type="button"
                          className="btn btn-ghost btn-icon btn-sm"
                          style={{ width: 24, height: 24 }}
                          title={`Đặt nhanh ${pitch.name}`}
                          aria-label={`Đặt nhanh ${pitch.name}`}
                          onClick={() => onOpenNewBookingModal(pitch.id, 19.0)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <div className="sbl-pitch-type">
                        Sân {pitch.type} • {formatVND(pitch.baseRatePrime)}/h
                      </div>
                    </td>

                    {/* 17 Hour Columns with Positioned Booking Blocks */}
                    <td colSpan={HOURS_ARRAY.length} style={{ position: 'relative', height: '66px' }}>
                      {/* Hour grid hairlines */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: `repeat(${HOURS_ARRAY.length}, 1fr)`,
                          position: 'absolute',
                          inset: 0,
                        }}
                      >
                        {HOURS_ARRAY.map((h) => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => onOpenNewBookingModal(pitch.id, h)}
                            title={`Tạo lịch ${pitch.name} lúc ${String(h).padStart(2, '0')}:00`}
                            aria-label={`Trống ${pitch.name} lúc ${String(h).padStart(2, '0')}:00`}
                            style={{
                              border: 'none',
                              borderRight: '1px dashed rgba(28, 26, 23, 0.08)',
                              background: h >= 17 && h <= 21 ? 'rgba(235, 230, 220, 0.25)' : 'transparent',
                              cursor: 'pointer',
                            }}
                          />
                        ))}
                      </div>

                      {/* Rendered Booking Blocks */}
                      {pitchBookings.map((bk) => {
                        const pos = calculateTimelinePosition(bk.startHour, bk.durationHours);
                        const statusShortLabel =
                          bk.status === 'checked-in'
                            ? 'ĐANG ĐÁ'
                            : bk.status === 'confirmed'
                            ? 'ĐÃ CỌC'
                            : bk.status === 'pending'
                            ? 'CHỜ CỌC'
                            : 'BOOM';

                        return (
                          <button
                            key={bk.id}
                            type="button"
                            className={`sbl-booking-block state-${bk.status}`}
                            style={{
                              left: `${pos.leftPercent}%`,
                              width: `${pos.widthPercent}%`,
                            }}
                            onClick={() => openBookingDrawer(bk)}
                            aria-label={`${bk.pitchId} - ${bk.teamName} (${formatHourLabel(bk.startHour)} - ${formatHourLabel(
                              bk.startHour + bk.durationHours
                            )}) - ${statusShortLabel}`}
                          >
                            <div className="font-bold text-xs truncate w-full leading-tight">
                              {bk.teamName}
                            </div>
                            <div className="font-mono-tech text-[10px] font-semibold truncate w-full leading-tight">
                              {formatHourLabel(bk.startHour)}–{formatHourLabel(bk.startHour + bk.durationHours)} • {statusShortLabel}
                            </div>
                            <div className="text-[10px] truncate w-full opacity-85 leading-tight">
                              {bk.customerName}
                            </div>
                          </button>
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

      {/* Detailed Operational Booking Table */}
      <div className="sbl-panel">
        <div className="sbl-panel-header">
          <div>
            <h2 className="sbl-panel-title">Danh sách Phiên Sân Trong Ca ({filteredBookings.length} phiếu)</h2>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Nhấp dòng hoặc nút điều phối phía trước để thực hiện Nhận sân, Đổi giờ, Thêm giờ, Thêm món POS, Báo boom hoặc Hủy.
            </p>
          </div>
        </div>

        <div className="sbl-table-scroll">
          <table className="sbl-table">
            <thead>
              <tr>
                <th>Mã Phiếu</th>
                <th>Sân</th>
                <th>Khung Giờ</th>
                <th>Đội Bóng / Khách Đặt</th>
                <th>Trạng Thái</th>
                <th style={{ textAlign: 'right' }}>Tiền Sân + POS</th>
                <th style={{ textAlign: 'right' }}>Đã Cọc</th>
                <th style={{ textAlign: 'right' }}>Còn Thu</th>
                <th style={{ textAlign: 'right' }}>Thao Tác Nhanh</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((bk) => {
                const fin = calculateBookingFinancials(bk);
                return (
                  <tr key={bk.id}>
                    <td className="font-mono-tech text-xs font-bold">{bk.id}</td>
                    <td>
                      <div className="font-semibold">{bk.pitchId}</div>
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        Sân {bk.pitchType}
                      </div>
                    </td>
                    <td className="font-mono-tech text-xs">
                      {formatHourLabel(bk.startHour)} – {formatHourLabel(bk.startHour + bk.durationHours)}
                      <div style={{ color: 'var(--text-muted)' }}>({bk.durationHours} giờ)</div>
                    </td>
                    <td>
                      <div className="font-semibold">{bk.teamName}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {bk.customerName} • <span className="font-mono-tech">{bk.phone}</span>
                      </div>
                    </td>
                    <td>{renderBookingStatusIndicator(bk.status)}</td>
                    <td className="font-mono-tech text-right font-semibold">{formatVND(fin.grandTotal)}</td>
                    <td className="font-mono-tech text-right" style={{ color: 'var(--text-secondary)' }}>
                      {formatVND(bk.depositPaid)}
                    </td>
                    <td
                      className="font-mono-tech text-right font-bold"
                      style={{ color: fin.remainingBalance > 0 ? 'var(--status-warning-text)' : 'var(--status-success-text)' }}
                    >
                      {formatVND(fin.remainingBalance)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div className="inline-flex items-center gap-1">
                        {bk.status !== 'checked-in' && bk.status !== 'cancelled' && (
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => onBookingAction(bk.id, 'nhan-san')}
                          >
                            Nhận sân
                          </button>
                        )}
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          onClick={() => openBookingDrawer(bk)}
                          aria-label={`Chi tiết phiếu ${bk.id}`}
                        >
                          <Eye size={15} />
                          <span>Điều phối</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Detail & Operational Actions Side Drawer */}
      {selectedBooking && (
        <div
          className="sbl-drawer-backdrop animate-fade-in"
          onClick={() => setSelectedBookingId(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Chi tiết điều phối phiếu ${selectedBooking.id}`}
        >
          <div className="sbl-drawer animate-slide-right" onClick={(e) => e.stopPropagation()}>
            <div
              className="flex items-center justify-between p-5 border-b"
              style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-sand)' }}
            >
              <div>
                <div className="font-mono-tech text-xs" style={{ color: 'var(--text-secondary)' }}>
                  PHIẾU ĐIỀU PHỐI #{selectedBooking.id}
                </div>
                <h3 className="font-editorial text-xl mt-0.5">
                  {selectedBooking.pitchId} – {selectedBooking.teamName}
                </h3>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-icon btn-sm"
                onClick={() => setSelectedBookingId(null)}
                aria-label="Đóng bảng chi tiết"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 flex-1 flex flex-col gap-5">
              {/* Status & Customer Info */}
              <div
                className="p-4 rounded border flex flex-col gap-2"
                style={{ backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border-color)' }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                    Trạng thái hiện tại:
                  </span>
                  {renderBookingStatusIndicator(selectedBooking.status)}
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Người đại diện:</span>
                  <span className="font-semibold inline-flex items-center gap-1">
                    <UserRound size={14} />
                    {selectedBooking.customerName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Số điện thoại:</span>
                  <span className="font-mono-tech font-semibold">{selectedBooking.phone}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span style={{ color: 'var(--text-secondary)' }}>Khung giờ đặt:</span>
                  <span className="font-mono-tech font-bold">
                    {formatHourLabel(selectedBooking.startHour)} –{' '}
                    {formatHourLabel(selectedBooking.startHour + selectedBooking.durationHours)} (
                    {selectedBooking.durationHours}h)
                  </span>
                </div>
                {selectedBooking.notes && (
                  <div className="text-xs pt-2 border-t" style={{ borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>
                    Ghi chú: {selectedBooking.notes}
                  </div>
                )}
              </div>

              {/* Primary Operational Actions */}
              <div>
                <h4 className="text-xs font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  TÁC VỤ ĐIỀU PHỐI
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="btn btn-lime btn-sm"
                    disabled={selectedBooking.status === 'checked-in'}
                    onClick={() => onBookingAction(selectedBooking.id, 'nhan-san')}
                  >
                    <CircleCheck size={15} />
                    <span>Nhận sân</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() =>
                      onBookingAction(selectedBooking.id, 'them-gio', {
                        extraHours: 0.5,
                        extraRatePerHour: selectedBooking.pitchType === '7 người' ? 580000 : 360000,
                      })
                    }
                  >
                    <Clock size={15} />
                    <span>Thêm giờ (+30p)</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => onBookingAction(selectedBooking.id, 'bao-boom')}
                  >
                    <TriangleAlert size={15} />
                    <span>Báo boom</span>
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => onBookingAction(selectedBooking.id, 'huy-san')}
                  >
                    <CircleX size={15} />
                    <span>Hủy sân</span>
                  </button>
                </div>

                {/* Đổi giờ control */}
                <div
                  className="mt-3 p-3 rounded border flex items-center justify-between gap-2"
                  style={{ backgroundColor: 'var(--bg-sand)', borderColor: 'var(--border-color)' }}
                >
                  <label htmlFor="rescheduleHourSelect" className="text-xs font-semibold">
                    Đổi giờ đá:
                  </label>
                  <div className="flex items-center gap-2">
                    <select
                      id="rescheduleHourSelect"
                      className="form-select font-mono-tech text-xs"
                      style={{ width: '110px', height: '32px' }}
                      value={rescheduleHour ?? selectedBooking.startHour}
                      onChange={(e) => setRescheduleHour(Number(e.target.value))}
                    >
                      {[7, 7.5, 8, 8.5, 9, 14, 15, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22].map(
                        (h) => (
                          <option key={h} value={h}>
                            {formatHourLabel(h)}
                          </option>
                        )
                      )}
                    </select>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        onBookingAction(selectedBooking.id, 'doi-gio', {
                          newStartHour: rescheduleHour ?? selectedBooking.startHour,
                        })
                      }
                    >
                      Đổi giờ
                    </button>
                  </div>
                </div>
              </div>

              {/* Thêm món POS trực tiếp */}
              <div>
                <h4 className="text-xs font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>
                  THÊM NƯỚC & DỊCH VỤ POS VÀO SÂN
                </h4>
                <div
                  className="p-3 rounded border flex flex-col gap-2"
                  style={{ backgroundColor: 'var(--bg-paper)', borderColor: 'var(--border-color)' }}
                >
                  <div className="flex items-center gap-2">
                    <select
                      className="form-select text-xs flex-1"
                      style={{ height: '34px' }}
                      value={quickPosProductId}
                      onChange={(e) => setQuickPosProductId(e.target.value)}
                      aria-label="Chọn món POS thêm"
                    >
                      {posProducts.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name} ({formatVND(p.price)})
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      className="form-input font-mono-tech text-xs"
                      style={{ width: '64px', height: '34px' }}
                      value={quickPosQty}
                      onChange={(e) => setQuickPosQty(Math.max(1, Number(e.target.value)))}
                      aria-label="Số lượng món"
                    />
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        const prod = posProducts.find((p) => p.id === quickPosProductId);
                        if (prod) {
                          onAddPosToBooking(selectedBooking.id, prod, quickPosQty);
                        }
                      }}
                    >
                      <ShoppingBag size={14} />
                      <span>Thêm</span>
                    </button>
                  </div>

                  {selectedBooking.posItems.length > 0 ? (
                    <div className="mt-2 pt-2 border-t flex flex-col gap-1 text-xs" style={{ borderColor: 'var(--border-subtle)' }}>
                      {selectedBooking.posItems.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between">
                          <span>
                            {item.name} × <strong className="font-mono-tech">{item.qty}</strong>
                          </span>
                          <span className="font-mono-tech font-semibold">{formatVND(item.price * item.qty)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Chưa phát sinh nước uống hoặc thuê phụ kiện cho ca sân này.
                    </div>
                  )}
                </div>
              </div>

              {/* Financial Breakdown */}
              {(() => {
                const fin = calculateBookingFinancials(selectedBooking);
                return (
                  <div
                    className="mt-auto p-4 rounded border flex flex-col gap-2"
                    style={{ backgroundColor: 'var(--bg-sand)', borderColor: 'var(--border-strong)' }}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span>Tiền thuê sân ({selectedBooking.durationHours} giờ):</span>
                      <span className="font-mono-tech font-semibold">{formatVND(fin.pitchTotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Dịch vụ & Nước uống (POS):</span>
                      <span className="font-mono-tech font-semibold">{formatVND(fin.posTotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Đã cọc trước:</span>
                      <span className="font-mono-tech font-semibold">- {formatVND(selectedBooking.depositPaid)}</span>
                    </div>
                    <div
                      className="flex items-center justify-between pt-2 border-t text-base font-bold"
                      style={{ borderColor: 'var(--border-color)' }}
                    >
                      <span>Còn thu tại quầy:</span>
                      <span className="font-mono-tech">{formatVND(fin.remainingBalance)}</span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
