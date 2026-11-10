import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Search,
  CircleCheck,
  TriangleAlert,
  UserRound,
  Wrench,
  Package,
  Wallet,
  X,
} from 'lucide-react';
import {
  type PitchBooking,
  formatHourLabel,
  formatVND,
  calculateBookingFinancials,
  classifyCustomerRisk,
  occupancyPercent,
} from '../utils/sanbonglonLogic';
import {
  PITCH_LIST,
  type CustomerRecord,
  type EquipmentIncident,
  type PosProduct,
  type StockMovementRecord,
  type StaffMember,
} from '../data/demoData';
import { type NavItemId } from '../config/sidebarConfig';
import { renderBookingStatusIndicator } from './ScheduleAndBookingView';

/* ==========================================================================
   1. Dashboard View (Tổng quan vận hành)
   ========================================================================== */
interface DashboardViewProps {
  bookings: PitchBooking[];
  incidents: EquipmentIncident[];
  products: PosProduct[];
  onNavigate: (id: NavItemId) => void;
  onOpenNewBooking: (pitchId?: string, hour?: number) => void;
  onCheckInBooking: (bookingId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  bookings,
  incidents,
  products,
  onNavigate,
  onOpenNewBooking,
  onCheckInBooking,
}) => {
  const activeBookings = bookings.filter((b) => b.status !== 'cancelled');
  const totalRevenueToday = activeBookings.reduce((sum, b) => {
    if (b.status === 'boom') return sum;
    return sum + calculateBookingFinancials(b).grandTotal;
  }, 0);

  const checkedInCount = activeBookings.filter((b) => b.status === 'checked-in').length;
  const openIncidents = incidents.filter((i) => i.status !== 'Đã khắc phục');
  const lowStockItems = products.filter((p) => p.stock <= p.minStock);

  const boomBookings = bookings.filter((b) => b.status === 'boom');
  const pendingBookings = activeBookings.filter((b) => b.status === 'pending');

  const hourlyBars = (
    [
      [7, 9],
      [9, 11],
      [14, 16],
      [16, 18],
      [18, 20],
      [20, 22],
      [22, 24],
    ] as const
  ).map(([from, to]) => ({
    label: `${String(from).padStart(2, '0')}-${String(to).padStart(2, '0')}h`,
    pct: Math.round(occupancyPercent(bookings, from, to, PITCH_LIST.length)),
  }));

  const primeOccupancy = occupancyPercent(bookings, 17, 21, PITCH_LIST.length);
  const primePitchCount = PITCH_LIST.filter((pitch) =>
    activeBookings.some(
      (b) =>
        b.pitchId === pitch.id &&
        b.status !== 'boom' &&
        b.startHour < 21 &&
        b.startHour + b.durationHours > 17
    )
  ).length;

  return (
    <div>
      <div className="sbl-page-header">
        <div>
          <h1 className="sbl-page-title">Tổng Quan Vận Hành Cụm 12 Sân</h1>
          <p className="sbl-page-subtitle">
            Báo cáo trực tiếp ca chiều ngày 17/10/2026 – Khung giờ hoạt động 07:00 – 24:00
          </p>
        </div>
        <div className="sbl-page-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onNavigate('lich-san')}
          >
            <Calendar size={16} strokeWidth={1.8} />
            <span>Mở Bảng Điều Phối 12 Sân</span>
          </button>
          <button
            type="button"
            className="btn btn-lime"
            onClick={() => onOpenNewBooking('Sân 01', 19.0)}
          >
            <Plus size={16} strokeWidth={2} />
            <span>+ Đặt sân mới</span>
          </button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="sbl-kpi-strip">
        <div className="sbl-kpi-card">
          <div className="sbl-kpi-label">
            <span>Doanh thu dự kiến hôm nay</span>
            <Wallet size={16} strokeWidth={1.8} style={{ color: 'var(--status-success-text)' }} />
          </div>
          <div className="sbl-kpi-value">{formatVND(totalRevenueToday)}</div>
          <div className="sbl-kpi-meta">
            <span>{checkedInCount} ca đã nhận sân</span>
            <span aria-hidden="true">•</span>
            <span>{activeBookings.length} ca trong ngày</span>
          </div>
        </div>

        <div className="sbl-kpi-card">
          <div className="sbl-kpi-label">
            <span>Công suất khung giờ vàng (17h–21h)</span>
            <Calendar size={16} strokeWidth={1.8} style={{ color: 'var(--status-info-text)' }} />
          </div>
          <div className="sbl-kpi-value">{primeOccupancy.toFixed(1)}%</div>
          <div className="sbl-kpi-meta">
            <span>{primePitchCount} / {PITCH_LIST.length} sân có lịch</span>
            <span aria-hidden="true">•</span>
            <span>{checkedInCount} ca đang đá</span>
          </div>
        </div>

        <div className="sbl-kpi-card">
          <div className="sbl-kpi-label">
            <span>Cảnh báo Boom & Chờ cọc</span>
            <TriangleAlert size={16} strokeWidth={1.8} style={{ color: 'var(--status-danger-text)' }} />
          </div>
          <div className="sbl-kpi-value">
            {boomBookings.length + pendingBookings.length} ca
          </div>
          <div className="sbl-kpi-meta">
            <span>{boomBookings.length} đơn Boom</span>
            <span aria-hidden="true">•</span>
            <span>{pendingBookings.length} đơn chờ chuyển cọc</span>
          </div>
        </div>

        <div className="sbl-kpi-card">
          <div className="sbl-kpi-label">
            <span>Sự cố thiết bị & Tồn kho</span>
            <Wrench size={16} strokeWidth={1.8} style={{ color: 'var(--status-warning-text)' }} />
          </div>
          <div className="sbl-kpi-value">{openIncidents.length + lowStockItems.length} mục</div>
          <div className="sbl-kpi-meta">
            <span>{openIncidents.length} sự cố sân</span>
            <span aria-hidden="true">•</span>
            <span>{lowStockItems.length} mặt hàng chạm ngưỡng</span>
          </div>
        </div>
      </div>

      {/* 2-Column Operational Split */}
      <div className="sbl-split-2col mb-6">
        {/* Left: Live 12-Pitch Matrix */}
        <div className="sbl-panel">
          <div className="sbl-panel-header">
            <div>
              <h2 className="sbl-panel-title">Trạng Thái Trực Tiếp 12 Sân Bóng (Sân 01 đến 12)</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Nhấp từng sân để xem ca đang đá hoặc tạo phiếu đặt
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('lich-san')}
            >
              Xem timeline 07:00–24:00
            </button>
          </div>

          <div className="sbl-panel-body">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {PITCH_LIST.map((pitch) => {
                const pitchBks = bookings
                  .filter((b) => b.pitchId === pitch.id && b.status !== 'cancelled')
                  .sort((x, y) => x.startHour - y.startHour);
                // Ưu tiên phiếu Boom (cần xử lý), rồi ca đang đá, rồi ca sắp tới sớm nhất.
                const currentBk =
                  pitchBks.find((b) => b.status === 'boom') ??
                  pitchBks.find((b) => b.status === 'checked-in') ??
                  pitchBks[0];
                const underMaintenance = pitch.lightingStatus === 'Bảo trì';

                return (
                  <div
                    key={pitch.id}
                    className="p-3.5 rounded border flex flex-col justify-between gap-2.5"
                    style={{
                      backgroundColor: currentBk?.status === 'boom' ? 'var(--status-danger-bg)' : 'var(--bg-cream)',
                      borderColor: 'var(--border-color)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm">{pitch.name}</span>
                        <span className="text-xs ml-2 font-mono-tech" style={{ color: 'var(--text-secondary)' }}>
                          ({pitch.type})
                        </span>
                      </div>
                      {currentBk ? (
                        renderBookingStatusIndicator(currentBk.status)
                      ) : (
                        <span className="status-indicator status-neutral">
                          {underMaintenance ? 'Bảo trì' : 'Sân trống'}
                        </span>
                      )}
                    </div>

                    {currentBk ? (
                      <div className="text-xs">
                        <div className="font-semibold truncate">{currentBk.teamName}</div>
                        <div className="font-mono-tech mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                          {formatHourLabel(currentBk.startHour)} –{' '}
                          {formatHourLabel(currentBk.startHour + currentBk.durationHours)} • {currentBk.customerName}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {underMaintenance
                          ? 'Đang bảo trì – không nhận đặt'
                          : 'Sẵn sàng nhận khách khung 17:30 – 22:00'}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                      <span className="font-mono-tech text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {pitch.lightingStatus}
                      </span>
                      {currentBk && currentBk.status !== 'checked-in' ? (
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ height: 26, padding: '0 8px' }}
                          onClick={() => onCheckInBooking(currentBk.id)}
                        >
                          Nhận sân
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-ghost btn-sm"
                          style={{ height: 26, padding: '0 8px' }}
                          disabled={underMaintenance}
                          onClick={() => onOpenNewBooking(pitch.id, 20.5)}
                        >
                          + Đặt giờ
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Hourly Occupancy & Urgent Alerts */}
        <div className="flex flex-col gap-5">
          <div className="sbl-panel">
            <div className="sbl-panel-header">
              <h2 className="sbl-panel-title">Mật Độ Lấp Đầy Theo Khung Giờ</h2>
            </div>
            <div className="sbl-panel-body flex flex-col gap-3">
              {hourlyBars.map((bar) => (
                <div key={bar.label} className="flex items-center gap-3 text-xs">
                  <span className="font-mono-tech w-16 shrink-0" style={{ color: 'var(--text-secondary)' }}>
                    {bar.label}
                  </span>
                  <div
                    className="flex-1 h-5 rounded overflow-hidden"
                    style={{ backgroundColor: 'var(--bg-sand)', border: '1px solid var(--border-color)' }}
                  >
                    <div
                      style={{
                        width: `${bar.pct}%`,
                        height: '100%',
                        backgroundColor: bar.pct >= 80 ? 'var(--accent-lime)' : 'var(--accent-moss)',
                      }}
                    />
                  </div>
                  <span className="font-mono-tech font-bold w-10 text-right">{bar.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="sbl-panel">
            <div className="sbl-panel-header">
              <h2 className="sbl-panel-title">Cảnh Báo Nóng Trong Ca</h2>
            </div>
            <div className="sbl-panel-body flex flex-col gap-3 text-xs">
              {boomBookings.map((bk) => (
                <div
                  key={bk.id}
                  className="p-3 rounded border"
                  style={{ backgroundColor: 'var(--status-danger-bg)', borderColor: 'var(--status-danger-border)' }}
                >
                  <div className="font-bold flex items-center justify-between" style={{ color: 'var(--status-danger-text)' }}>
                    <span>
                      Báo Boom: {bk.pitchId} ({formatHourLabel(bk.startHour)} – {formatHourLabel(bk.startHour + bk.durationHours)})
                    </span>
                    <span className="font-mono-tech">{bk.id}</span>
                  </div>
                  <p className="mt-1" style={{ color: 'var(--text-primary)' }}>
                    Đội {bk.teamName} đã bị báo Boom. Khuyến nghị mở sân giao hữu hoặc ghép kèo.
                  </p>
                </div>
              ))}

              {openIncidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-3 rounded border"
                  style={{ backgroundColor: 'var(--status-warning-bg)', borderColor: 'var(--status-warning-border)' }}
                >
                  <div className="font-bold flex items-center justify-between" style={{ color: 'var(--status-warning-text)' }}>
                    <span>
                      Sự cố {inc.category.toLowerCase()}: {inc.pitchId}
                    </span>
                    <span className="font-mono-tech">{inc.code}</span>
                  </div>
                  <p className="mt-1" style={{ color: 'var(--text-primary)' }}>
                    {inc.equipmentName} – {inc.description}
                  </p>
                </div>
              ))}

              {boomBookings.length === 0 && openIncidents.length === 0 && (
                <p style={{ color: 'var(--text-muted)' }}>Hiện không có cảnh báo nào trong ca.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   2. Customer & Team Management View
   ========================================================================== */
interface CustomersViewProps {
  customers: CustomerRecord[];
  onAddCustomer: (customer: Omit<CustomerRecord, 'id'>) => void;
}

export const CustomersView: React.FC<CustomersViewProps> = ({ customers, onAddCustomer }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('Tất cả');
  const [modalOpen, setModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [teamName, setTeamName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredPitch, setPreferredPitch] = useState('Sân 01 (5 người)');
  const [tier, setTier] = useState<CustomerRecord['tier']>('Khách cố định');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (tierFilter !== 'Tất cả' && c.tier !== tierFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          c.name.toLowerCase().includes(q) ||
          c.teamName.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [customers, tierFilter, searchQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !teamName.trim() || !phone.trim()) {
      setFormError('Vui lòng nhập Đội trưởng, Tên đội và Số điện thoại.');
      return;
    }

    onAddCustomer({
      name: name.trim(),
      teamName: teamName.trim(),
      phone: phone.trim(),
      tier,
      preferredPitch,
      totalBookings: 0,
      boomCount: 0,
      totalSpent: 0,
      lastVisit: '17/10/2026',
      notes: notes.trim() || 'Khách hàng mới đăng ký tại quầy.',
    });

    setModalOpen(false);
    setName('');
    setTeamName('');
    setPhone('');
    setNotes('');
    setFormError('');
  };

  return (
    <div>
      <div className="sbl-page-header">
        <div>
          <h1 className="sbl-page-title">Quản Lý Khách Hàng & Đội Bóng</h1>
          <p className="sbl-page-subtitle">
            Hồ sơ đội trưởng, hợp đồng sân cố định, phân hạng VIP và cảnh báo lịch sử Boom sân.
          </p>
        </div>
        <div className="sbl-page-actions">
          <button type="button" className="btn btn-lime" onClick={() => setModalOpen(true)}>
            <Plus size={16} strokeWidth={2} />
            <span>Thêm khách hàng</span>
          </button>
        </div>
      </div>

      <div className="sbl-panel">
        <div className="sbl-table-toolbar">
          <div className="sbl-segmented" role="group" aria-label="Phân nhóm khách hàng">
            {['Tất cả', 'Khách cố định', 'Khách VIP', 'Vãng lai', 'Cảnh báo Boom'].map((t) => (
              <button
                key={t}
                type="button"
                className={`sbl-segment-btn ${tierFilter === t ? 'is-active' : ''}`}
                onClick={() => setTierFilter(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="form-search-wrapper" style={{ minWidth: '260px' }}>
            <Search size={16} className="form-search-icon" />
            <input
              type="search"
              className="form-input form-search-input"
              placeholder="Tìm tên đội, đội trưởng, SĐT..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Tìm kiếm khách hàng"
            />
          </div>
        </div>

        <div className="sbl-table-scroll">
          <table className="sbl-table">
            <thead>
              <tr>
                <th>Mã KH</th>
                <th>Đội Bóng & Đội Trưởng</th>
                <th>Phân Hạng</th>
                <th>Sân Thích Hợp</th>
                <th style={{ textAlign: 'right' }}>Số Trận Đã Đá</th>
                <th>Tín Nhiệm / Boom</th>
                <th style={{ textAlign: 'right' }}>Tổng Chi Tiêu</th>
                <th>Ghi Chú Vận Hành</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c) => {
                const risk = classifyCustomerRisk(c.totalBookings, c.boomCount);
                return (
                  <tr key={c.id}>
                    <td className="font-mono-tech text-xs font-bold">{c.id}</td>
                    <td>
                      <div className="font-bold">{c.teamName}</div>
                      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <UserRound size={12} className="inline mr-1" />
                        {c.name} • <span className="font-mono-tech">{c.phone}</span>
                      </div>
                    </td>
                    <td className="text-xs font-semibold">{c.tier}</td>
                    <td className="text-xs">{c.preferredPitch}</td>
                    <td className="font-mono-tech text-right font-semibold">{c.totalBookings}</td>
                    <td>
                      <span
                        className={`status-indicator ${
                          risk.level === 'rui-ro-cao'
                            ? 'status-danger'
                            : risk.level === 'canh-bao'
                            ? 'status-warning'
                            : 'status-success'
                        }`}
                      >
                        {risk.level === 'rui-ro-cao' ? (
                          <TriangleAlert size={14} />
                        ) : (
                          <CircleCheck size={14} />
                        )}
                        <span>
                          {risk.label} ({c.boomCount} boom)
                        </span>
                      </span>
                    </td>
                    <td className="font-mono-tech text-right font-bold">{formatVND(c.totalSpent)}</td>
                    <td className="text-xs" style={{ color: 'var(--text-secondary)', maxWidth: '260px' }}>
                      {c.notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="sbl-overlay-backdrop animate-fade-in" onClick={() => setModalOpen(false)}>
          <div
            className="sbl-modal animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Thêm khách hàng mới"
          >
            <div className="sbl-panel-header">
              <h2 className="sbl-panel-title">Thêm Đội Bóng & Khách Hàng</h2>
              <button
                type="button"
                className="btn btn-ghost btn-icon btn-sm"
                onClick={() => setModalOpen(false)}
                aria-label="Đóng hộp thoại"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="sbl-panel-body flex flex-col gap-4">
              {formError && <div className="form-error">{formError}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="form-group">
                  <label htmlFor="custTeamInput" className="form-label">
                    Tên Đội Bóng (FC):
                  </label>
                  <input
                    id="custTeamInput"
                    type="text"
                    className="form-input"
                    placeholder="VD: FC Thủ Đức United"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="custNameInput" className="form-label">
                    Họ Tên Đội Trưởng:
                  </label>
                  <input
                    id="custNameInput"
                    type="text"
                    className="form-input"
                    placeholder="VD: Lê Minh Khang"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="form-group">
                  <label htmlFor="custPhoneInput" className="form-label">
                    Số Điện Thoại Liên Hệ:
                  </label>
                  <input
                    id="custPhoneInput"
                    type="tel"
                    className="form-input font-mono-tech"
                    placeholder="0909 xxx xxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="custTierSelect" className="form-label">
                    Phân Nhóm Khách Hàng:
                  </label>
                  <select
                    id="custTierSelect"
                    className="form-select"
                    value={tier}
                    onChange={(e) => setTier(e.target.value as CustomerRecord['tier'])}
                  >
                    <option value="Khách cố định">Khách cố định</option>
                    <option value="Khách VIP">Khách VIP</option>
                    <option value="Vãng lai">Vãng lai</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="custPitchSelect" className="form-label">
                  Sân Ưu Tiên:
                </label>
                <select
                  id="custPitchSelect"
                  className="form-select"
                  value={preferredPitch}
                  onChange={(e) => setPreferredPitch(e.target.value)}
                >
                  {PITCH_LIST.map((p) => (
                    <option key={p.id} value={`${p.name} (${p.type})`}>
                      {p.name} ({p.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="custNotesInput" className="form-label">
                  Ghi Chú:
                </label>
                <textarea
                  id="custNotesInput"
                  className="form-textarea"
                  placeholder="Ghi chú lịch cố định, yêu cầu phụ kiện..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-lime">
                  Lưu khách hàng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   3. Equipment & Incident Reporting View
   ========================================================================== */
interface EquipmentViewProps {
  incidents: EquipmentIncident[];
  onCreateIncident: (incident: Omit<EquipmentIncident, 'id' | 'code' | 'reportedAt'>) => void;
  onResolveIncident: (id: string) => void;
}

export const EquipmentView: React.FC<EquipmentViewProps> = ({
  incidents,
  onCreateIncident,
  onResolveIncident,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [pitchId, setPitchId] = useState('Sân 05');
  const [equipmentName, setEquipmentName] = useState('');
  const [category, setCategory] = useState<EquipmentIncident['category']>('Hệ thống chiếu sáng');
  const [severity, setSeverity] = useState<EquipmentIncident['severity']>('Trung bình');
  const [description, setDescription] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(350000);
  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!equipmentName.trim() || !description.trim()) {
      setFormError('Vui lòng nhập hạng mục thiết bị và mô tả chi tiết.');
      return;
    }

    onCreateIncident({
      pitchId,
      equipmentName: equipmentName.trim(),
      category,
      severity,
      status: 'Đang xử lý',
      reportedBy: 'Trương Thịnh Phát',
      description: description.trim(),
      estimatedCost: Number(estimatedCost) || 0,
    });

    setModalOpen(false);
    setEquipmentName('');
    setDescription('');
    setFormError('');
  };

  return (
    <div>
      <div className="sbl-page-header">
        <div>
          <h1 className="sbl-page-title">Quản Lý Thiết Bị & Bảo Trì Sân</h1>
          <p className="sbl-page-subtitle">
            Theo dõi cụm đèn pha LED 400W, mặt cỏ nhân tạo, lưới chắn bóng, bóng thi đấu và lịch sử bảo trì kỹ thuật.
          </p>
        </div>
        <div className="sbl-page-actions">
          <button type="button" className="btn btn-lime" onClick={() => setModalOpen(true)}>
            <Plus size={16} strokeWidth={2} />
            <span>Báo sự cố mới</span>
          </button>
        </div>
      </div>

      <div className="sbl-panel">
        <div className="sbl-panel-header">
          <h2 className="sbl-panel-title">Danh Sách Phiếu Sự Cố & Bảo Trì Kỹ Thuật ({incidents.length})</h2>
        </div>

        <div className="sbl-table-scroll">
          <table className="sbl-table">
            <thead>
              <tr>
                <th>Mã Sự Cố</th>
                <th>Vị Trí Sân</th>
                <th>Thiết Bị / Hạng Mục</th>
                <th>Mức Độ</th>
                <th>Trạng Thái</th>
                <th>Mô Tả Kỹ Thuật</th>
                <th style={{ textAlign: 'right' }}>Dự Toán</th>
                <th style={{ textAlign: 'right' }}>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => (
                <tr key={inc.id}>
                  <td className="font-mono-tech text-xs font-bold">{inc.code}</td>
                  <td className="font-semibold">{inc.pitchId}</td>
                  <td>
                    <div className="font-semibold">{inc.equipmentName}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {inc.category} • Báo lúc {inc.reportedAt} bởi {inc.reportedBy}
                    </div>
                  </td>
                  <td className="text-xs font-semibold">{inc.severity}</td>
                  <td>
                    <span
                      className={`status-indicator ${
                        inc.status === 'Đã khắc phục'
                          ? 'status-success'
                          : inc.status === 'Đang xử lý'
                          ? 'status-warning'
                          : 'status-danger'
                      }`}
                    >
                      {inc.status === 'Đã khắc phục' ? <CircleCheck size={14} /> : <TriangleAlert size={14} />}
                      <span>{inc.status}</span>
                    </span>
                  </td>
                  <td className="text-xs" style={{ maxWidth: '280px', color: 'var(--text-secondary)' }}>
                    {inc.description}
                  </td>
                  <td className="font-mono-tech text-right font-semibold">{formatVND(inc.estimatedCost)}</td>
                  <td style={{ textAlign: 'right' }}>
                    {inc.status !== 'Đã khắc phục' ? (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => onResolveIncident(inc.id)}
                      >
                        Xác nhận hoàn tất
                      </button>
                    ) : (
                      <span className="text-xs font-mono-tech" style={{ color: 'var(--text-muted)' }}>
                        ✓ Đã nghiệm thu
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="sbl-overlay-backdrop animate-fade-in" onClick={() => setModalOpen(false)}>
          <div
            className="sbl-modal animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Báo sự cố thiết bị"
          >
            <div className="sbl-panel-header">
              <h2 className="sbl-panel-title">Lập Phiếu Sự Cố Thiết Bị</h2>
              <button
                type="button"
                className="btn btn-ghost btn-icon btn-sm"
                onClick={() => setModalOpen(false)}
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="sbl-panel-body flex flex-col gap-4">
              {formError && <div className="form-error">{formError}</div>}
              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label htmlFor="incPitchSelect" className="form-label">
                    Sân xảy ra sự cố:
                  </label>
                  <select
                    id="incPitchSelect"
                    className="form-select"
                    value={pitchId}
                    onChange={(e) => setPitchId(e.target.value)}
                  >
                    {PITCH_LIST.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="incSeveritySelect" className="form-label">
                    Mức độ ưu tiên:
                  </label>
                  <select
                    id="incSeveritySelect"
                    className="form-select"
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as EquipmentIncident['severity'])}
                  >
                    <option value="Cao">Cao – Xử lý ngay trong ca</option>
                    <option value="Trung bình">Trung bình – Xử lý trong 24h</option>
                    <option value="Thấp">Thấp – Bảo trì định kỳ</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="incEquipInput" className="form-label">
                  Tên thiết bị / hạng mục:
                </label>
                <input
                  id="incEquipInput"
                  type="text"
                  className="form-input"
                  placeholder="VD: Đèn pha LED cột số 3, Lưới cầu môn..."
                  value={equipmentName}
                  onChange={(e) => setEquipmentName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="form-group">
                  <label htmlFor="incCatSelect" className="form-label">
                    Nhóm kỹ thuật:
                  </label>
                  <select
                    id="incCatSelect"
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EquipmentIncident['category'])}
                  >
                    <option value="Hệ thống chiếu sáng">Hệ thống chiếu sáng</option>
                    <option value="Mặt cỏ & Lưới">Mặt cỏ & Lưới</option>
                    <option value="Bóng & Áo Bib">Bóng & Áo Bib</option>
                    <option value="Hệ thống cấp thoát nước">Hệ thống cấp thoát nước</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="incCostInput" className="form-label">
                    Chi phí dự toán (VNĐ):
                  </label>
                  <input
                    id="incCostInput"
                    type="number"
                    className="form-input font-mono-tech"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="incDescInput" className="form-label">
                  Mô tả hiện trạng:
                </label>
                <textarea
                  id="incDescInput"
                  className="form-textarea"
                  placeholder="Mô tả chi tiết tình trạng hỏng hóc..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-lime">
                  Gửi phiếu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   4. Inventory & Goods Receipt View
   ========================================================================== */
interface InventoryViewProps {
  products: PosProduct[];
  movements: StockMovementRecord[];
  onReceiveStock: (productId: string, addedQty: number, note: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  movements,
  onReceiveStock,
}) => {
  const [activeTab, setActiveTab] = useState<'stock' | 'movements'>('stock');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProdId, setSelectedProdId] = useState(products[0]?.id || 'POS-01');
  const [addedQty, setAddedQty] = useState(48);
  const [note, setNote] = useState('Nhập bổ sung hàng giải khát cuối tuần');

  const handleReceive = (e: React.FormEvent) => {
    e.preventDefault();
    if (addedQty <= 0) return;
    onReceiveStock(selectedProdId, addedQty, note);
    setModalOpen(false);
  };

  return (
    <div>
      <div className="sbl-page-header">
        <div>
          <h1 className="sbl-page-title">Quản Lý Kho Hàng & Tồn Kho Dịch Vụ</h1>
          <p className="sbl-page-subtitle">
            Kiểm soát định mức tồn kho nước uống, phụ kiện cho thuê và lịch sử phiếu nhập xuất kho.
          </p>
        </div>
        <div className="sbl-page-actions">
          <button type="button" className="btn btn-lime" onClick={() => setModalOpen(true)}>
            <Package size={16} strokeWidth={2} />
            <span>Tạo phiếu nhập kho</span>
          </button>
        </div>
      </div>

      <div className="sbl-panel">
        <div className="sbl-table-toolbar">
          <div className="sbl-segmented" role="tablist" aria-label="Chế độ xem kho hàng">
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'stock'}
              className={`sbl-segment-btn ${activeTab === 'stock' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('stock')}
            >
              Danh mục tồn kho ({products.length})
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'movements'}
              className={`sbl-segment-btn ${activeTab === 'movements' ? 'is-active' : ''}`}
              onClick={() => setActiveTab('movements')}
            >
              Thẻ kho & Lịch sử nhập xuất ({movements.length})
            </button>
          </div>
        </div>

        {activeTab === 'stock' ? (
          <div className="sbl-table-scroll">
            <table className="sbl-table">
              <thead>
                <tr>
                  <th>Mã SKU</th>
                  <th>Tên Hàng / Dịch Vụ</th>
                  <th>Nhóm Hàng</th>
                  <th style={{ textAlign: 'right' }}>Đơn Giá Bán</th>
                  <th style={{ textAlign: 'right' }}>Tồn Hiện Tại</th>
                  <th style={{ textAlign: 'right' }}>Định Mức Tối Thiểu</th>
                  <th>Trạng Thái Kho</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const low = p.stock <= p.minStock;
                  return (
                    <tr key={p.id}>
                      <td className="font-mono-tech text-xs font-bold">{p.sku}</td>
                      <td className="font-semibold">{p.name}</td>
                      <td className="text-xs">{p.category}</td>
                      <td className="font-mono-tech text-right">{formatVND(p.price)}</td>
                      <td className="font-mono-tech text-right font-bold">
                        {p.stock} {p.unit}
                      </td>
                      <td className="font-mono-tech text-right" style={{ color: 'var(--text-secondary)' }}>
                        {p.minStock} {p.unit}
                      </td>
                      <td>
                        {low ? (
                          <span className="status-indicator status-warning">
                            <TriangleAlert size={14} />
                            <span>Sắp hết – cần nhập thêm</span>
                          </span>
                        ) : (
                          <span className="status-indicator status-success">
                            <CircleCheck size={14} />
                            <span>Đủ định mức</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="sbl-table-scroll">
            <table className="sbl-table">
              <thead>
                <tr>
                  <th>Mã Giao Dịch</th>
                  <th>Thời Gian</th>
                  <th>Loại Nghiệp Vụ</th>
                  <th>Mặt Hàng</th>
                  <th style={{ textAlign: 'right' }}>Biến Động</th>
                  <th>Nhân Viên Thực Hiện</th>
                  <th>Diễn Giải</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((m) => (
                  <tr key={m.id}>
                    <td className="font-mono-tech text-xs font-bold">{m.id}</td>
                    <td className="font-mono-tech text-xs">{m.timestamp}</td>
                    <td className="text-xs font-semibold">{m.type}</td>
                    <td className="font-semibold">{m.productName}</td>
                    <td
                      className="font-mono-tech text-right font-bold"
                      style={{
                        color: m.quantityChange > 0 ? 'var(--status-success-text)' : 'var(--status-warning-text)',
                      }}
                    >
                      {m.quantityChange > 0 ? `+${m.quantityChange}` : m.quantityChange}
                    </td>
                    <td className="text-xs">{m.staffName}</td>
                    <td className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                      {m.note}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="sbl-overlay-backdrop animate-fade-in" onClick={() => setModalOpen(false)}>
          <div
            className="sbl-modal animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Tạo phiếu nhập kho"
          >
            <div className="sbl-panel-header">
              <h2 className="sbl-panel-title">Tạo Phiếu Nhập Kho Hàng Hóa</h2>
              <button
                type="button"
                className="btn btn-ghost btn-icon btn-sm"
                onClick={() => setModalOpen(false)}
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReceive} className="sbl-panel-body flex flex-col gap-4">
              <div className="form-group">
                <label htmlFor="recvProdSelect" className="form-label">
                  Chọn mặt hàng nhập kho:
                </label>
                <select
                  id="recvProdSelect"
                  className="form-select"
                  value={selectedProdId}
                  onChange={(e) => setSelectedProdId(e.target.value)}
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Hiện có: {p.stock} {p.unit})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="recvQtyInput" className="form-label">
                  Số lượng nhập thêm:
                </label>
                <input
                  id="recvQtyInput"
                  type="number"
                  min={1}
                  className="form-input font-mono-tech"
                  value={addedQty}
                  onChange={(e) => setAddedQty(Math.max(1, Number(e.target.value)))}
                />
              </div>

              <div className="form-group">
                <label htmlFor="recvNoteInput" className="form-label">
                  Chứng từ / Nhà cung cấp:
                </label>
                <input
                  id="recvNoteInput"
                  type="text"
                  className="form-input"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="btn btn-secondary" onClick={() => setModalOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-lime">
                  Xác nhận nhập kho
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   5. Staff & Shift Management View
   ========================================================================== */
export const StaffView: React.FC<{ staff: StaffMember[] }> = ({ staff }) => {
  return (
    <div>
      <div className="sbl-page-header">
        <div>
          <h1 className="sbl-page-title">Nhân Sự & Phân Ca Trực Vận Hành</h1>
          <p className="sbl-page-subtitle">
            Danh sách điều phối viên, thu ngân POS, kỹ thuật và lịch bàn giao ca trực trong ngày.
          </p>
        </div>
      </div>

      <div className="sbl-panel">
        <div className="sbl-panel-header">
          <h2 className="sbl-panel-title">Bảng Phân Công Nhân Sự Hôm Nay ({staff.length} nhân viên)</h2>
        </div>

        <div className="sbl-table-scroll">
          <table className="sbl-table">
            <thead>
              <tr>
                <th>Mã NV</th>
                <th>Họ Tên Nhân Viên</th>
                <th>Vị Trí Đảm Nhiệm</th>
                <th>Ca Trực</th>
                <th>Số Điện Thoại</th>
                <th style={{ textAlign: 'right' }}>Phiếu Đã Xử Lý</th>
                <th style={{ textAlign: 'right' }}>Tỷ Lệ Đúng Giờ</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((st) => (
                <tr key={st.id}>
                  <td className="font-mono-tech text-xs font-bold">{st.code}</td>
                  <td className="font-bold">{st.name}</td>
                  <td className="text-xs font-semibold">{st.role}</td>
                  <td className="font-mono-tech text-xs">{st.shift}</td>
                  <td className="font-mono-tech text-xs">{st.phone}</td>
                  <td className="font-mono-tech text-right font-semibold">{st.completedOrders}</td>
                  <td className="font-mono-tech text-right">{st.punctualityRate}</td>
                  <td>
                    <span
                      className={`status-indicator ${
                        st.status === 'Đang trực' || st.status === 'Tăng ca'
                          ? 'status-success'
                          : 'status-neutral'
                      }`}
                    >
                      <CircleCheck size={14} />
                      <span>{st.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
