/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { X, CircleCheck, Plus } from 'lucide-react';
import {
  DEFAULT_SIDEBAR_CONFIG,
  type SidebarConfig,
  type NavItemId,
} from './config/sidebarConfig';
import {
  type PitchBooking,
  applyBookingAction,
  hasBookingConflict,
  formatHourLabel,
  formatVND,
} from './utils/sanbonglonLogic';
import {
  PITCH_LIST,
  INITIAL_BOOKINGS,
  INITIAL_CUSTOMERS,
  INITIAL_POS_PRODUCTS,
  INITIAL_EQUIPMENT_INCIDENTS,
  INITIAL_STOCK_MOVEMENTS,
  INITIAL_STAFF,
  INITIAL_REVENUE_TRANSACTIONS,
  INITIAL_AUDIT_LOGS,
  type CustomerRecord,
  type PosProduct,
  type EquipmentIncident,
  type StockMovementRecord,
  type RevenueTransaction,
  type AuditLogEntry,
} from './data/demoData';
import { ReusableSidebar } from './components/ReusableSidebar';
import { TopHeader } from './components/TopHeader';
import { ScheduleAndBookingView } from './components/ScheduleAndBookingView';
import { PosCounterView } from './components/PosCounterView';
import {
  DashboardView,
  CustomersView,
  EquipmentView,
  InventoryView,
  StaffView,
} from './components/OperationsViews';
import {
  RevenueView,
  AnalyticsView,
  AuditLogView,
  AccountSettingsView,
} from './components/FinanceAndAdminViews';
import { PublicWebsiteView, ShiftLoginView } from './components/StandaloneViews';

interface ToastItem {
  id: string;
  message: string;
}

export default function App() {
  const [sidebarConfig, setSidebarConfig] = useState<SidebarConfig>(DEFAULT_SIDEBAR_CONFIG);
  const [activeNavId, setActiveNavId] = useState<NavItemId>('tong-quan');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-17');

  // Core Operational State
  const [bookings, setBookings] = useState<PitchBooking[]>(INITIAL_BOOKINGS);
  const [customers, setCustomers] = useState<CustomerRecord[]>(INITIAL_CUSTOMERS);
  const [posProducts, setPosProducts] = useState<PosProduct[]>(INITIAL_POS_PRODUCTS);
  const [incidents, setIncidents] = useState<EquipmentIncident[]>(INITIAL_EQUIPMENT_INCIDENTS);
  const [stockMovements, setStockMovements] = useState<StockMovementRecord[]>(INITIAL_STOCK_MOVEMENTS);
  const [revenueTx, setRevenueTx] = useState<RevenueTransaction[]>(INITIAL_REVENUE_TRANSACTIONS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);

  // New Booking Modal State
  const [newBookingOpen, setNewBookingOpen] = useState<boolean>(false);
  const [nbPitchId, setNbPitchId] = useState<string>('Sân 01');
  const [nbStartHour, setNbStartHour] = useState<number>(19.0);
  const [nbDuration, setNbDuration] = useState<number>(1.5);
  const [nbTeamName, setNbTeamName] = useState<string>('');
  const [nbCustomerName, setNbCustomerName] = useState<string>('');
  const [nbPhone, setNbPhone] = useState<string>('');
  const [nbDeposit, setNbDeposit] = useState<number>(200000);
  const [nbNotes, setNbNotes] = useState<string>('');
  const [nbError, setNbError] = useState<string>('');

  // Toast Notifications
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = (message: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  };

  // Keyboard shortcuts: Ctrl+B for Sidebar, Escape for Modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setSidebarCollapsed((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setNewBookingOpen(false);
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Cursor-reactive spotlight effect for background
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Append Audit Log Helper
  const recordAudit = (
    category: AuditLogEntry['category'],
    actionSummary: string,
    targetRef: string
  ) => {
    const entry: AuditLogEntry = {
      id: `AUD-${Date.now()}`,
      traceId: `TRC-${Math.floor(1000 + Math.random() * 9000)}X`,
      timestamp: '17/10/2026 – Vừa xong',
      actor: sidebarConfig.operator.name,
      role: 'Điều phối viên',
      category,
      actionSummary,
      targetRef,
      ipAddress: '192.168.1.14',
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  // Booking Operational Action Handler
  const handleBookingAction = (
    bookingId: string,
    action: 'nhan-san' | 'them-gio' | 'doi-gio' | 'bao-boom' | 'huy-san',
    payload?: { newStartHour?: number; extraHours?: number; extraRatePerHour?: number }
  ) => {
    const target = bookings.find((b) => b.id === bookingId);
    if (!target) return;

    if (action === 'doi-gio' && payload?.newStartHour !== undefined) {
      const conflict = hasBookingConflict(bookings, {
        id: target.id,
        pitchId: target.pitchId,
        date: target.date,
        startHour: payload.newStartHour,
        durationHours: target.durationHours,
      });

      if (conflict) {
        showToast(`Khung giờ ${formatHourLabel(payload.newStartHour)} tại ${target.pitchId} đã có đội khác đặt.`);
        return;
      }
    }

    const updated = applyBookingAction(target, action, payload);
    setBookings((prev) => prev.map((b) => (b.id === bookingId ? updated : b)));

    const actionLabels: Record<typeof action, string> = {
      'nhan-san': `Xác nhận Nhận sân (Check-in) cho đội ${target.teamName} tại ${target.pitchId}`,
      'them-gio': `Gia hạn thêm 30 phút cho đội ${target.teamName} tại ${target.pitchId}`,
      'doi-gio': `Đổi giờ thi đấu sang ${formatHourLabel(updated.startHour)} cho đội ${target.teamName}`,
      'bao-boom': `Đánh dấu Báo Boom đơn ${target.id} (${target.teamName}) tại ${target.pitchId}`,
      'huy-san': `Hủy phiên sân ${target.id} (${target.teamName})`,
    };

    recordAudit(
      action === 'bao-boom' ? 'Cảnh báo Boom' : 'Điều phối sân',
      actionLabels[action],
      `${target.pitchId} – ${target.id}`
    );
    showToast(actionLabels[action]);
  };

  // Add POS Item directly to a Booking
  const handleAddPosToBooking = (bookingId: string, product: PosProduct, qty: number) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b;
        const existingIdx = b.posItems.findIndex((i) => i.productId === product.id);
        let nextItems = [...b.posItems];
        if (existingIdx >= 0) {
          nextItems[existingIdx] = {
            ...nextItems[existingIdx],
            qty: nextItems[existingIdx].qty + qty,
          };
        } else {
          nextItems.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            qty,
          });
        }
        return { ...b, posItems: nextItems };
      })
    );

    setPosProducts((prev) =>
      prev.map((p) => (p.id === product.id ? { ...p, stock: Math.max(0, p.stock - qty) } : p))
    );

    recordAudit(
      'Thanh toán & POS',
      `Thêm ${qty} ${product.unit} ${product.name} vào phiếu ${bookingId}`,
      bookingId
    );
    showToast(`Đã thêm ${qty} ${product.name} vào phiếu ${bookingId}.`);
  };

  // Complete POS Counter Order
  const handleCompletePosOrder = (payload: {
    targetBookingId: string | 'walk-in';
    paymentMethod: 'Tiền mặt' | 'Chuyển khoản QR';
    items: { product: PosProduct; qty: number }[];
  }) => {
    const orderTotal = payload.items.reduce((s, i) => s + i.product.price * i.qty, 0);

    if (payload.targetBookingId !== 'walk-in') {
      payload.items.forEach((item) => {
        handleAddPosToBooking(payload.targetBookingId, item.product, item.qty);
      });
    } else {
      // Deduct inventory
      setPosProducts((prev) =>
        prev.map((p) => {
          const found = payload.items.find((i) => i.product.id === p.id);
          return found ? { ...p, stock: Math.max(0, p.stock - found.qty) } : p;
        })
      );
    }

    const newTx: RevenueTransaction = {
      id: `FIN-${Date.now()}`,
      code: `PT-261017-${revenueTx.length + 10}`,
      timestamp: '17/10/2026 – Vừa xong',
      pitchOrCounter:
        payload.targetBookingId === 'walk-in'
          ? 'Quầy POS Trung tâm'
          : `Phiếu ${payload.targetBookingId}`,
      customerOrTeam:
        payload.targetBookingId === 'walk-in'
          ? 'Khách mua lẻ tại quầy'
          : `Gán vào phiếu ${payload.targetBookingId}`,
      category: 'Bán hàng POS',
      paymentMethod: payload.paymentMethod,
      amount: orderTotal,
      cashier: sidebarConfig.operator.name,
      status: 'Đã quyết toán',
    };

    setRevenueTx((prev) => [newTx, ...prev]);
    recordAudit(
      'Thanh toán & POS',
      `Tất toán đơn POS ${formatVND(orderTotal)} (${payload.paymentMethod})`,
      newTx.code
    );
    showToast(`Đã thanh toán đơn POS (${formatVND(orderTotal)}) qua ${payload.paymentMethod}.`);
  };

  // Open New Booking Modal
  const openNewBookingModal = (prefillPitchId = 'Sân 01', prefillHour = 19.0) => {
    setNbPitchId(prefillPitchId);
    setNbStartHour(prefillHour);
    setNbDuration(1.5);
    setNbError('');
    setNewBookingOpen(true);
  };

  // Submit New Booking
  const handleCreateNewBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nbTeamName.trim() || !nbCustomerName.trim() || !nbPhone.trim()) {
      setNbError('Vui lòng nhập Tên đội, Họ tên người đặt và Số điện thoại.');
      return;
    }

    const conflict = hasBookingConflict(bookings, {
      pitchId: nbPitchId,
      date: selectedDate,
      startHour: nbStartHour,
      durationHours: nbDuration,
    });

    if (conflict) {
      setNbError(
        `Khung giờ ${formatHourLabel(nbStartHour)} – ${formatHourLabel(
          nbStartHour + nbDuration
        )} tại ${nbPitchId} đã có đội đặt trước. Vui lòng chọn sân hoặc giờ khác.`
      );
      return;
    }

    const pitchObj = PITCH_LIST.find((p) => p.id === nbPitchId) || PITCH_LIST[0];
    const hourlyRate =
      nbStartHour >= 16 && nbStartHour <= 21.5
        ? pitchObj.baseRatePrime
        : nbStartHour < 16
        ? pitchObj.baseRateMorning
        : pitchObj.baseRateLate;
    const calculatedPrice = Math.round(hourlyRate * nbDuration);

    const newBooking: PitchBooking = {
      id: `SBL-${24119 + bookings.length}`,
      pitchId: nbPitchId,
      pitchType: pitchObj.type,
      customerName: nbCustomerName.trim(),
      teamName: nbTeamName.trim(),
      phone: nbPhone.trim(),
      date: selectedDate,
      startHour: nbStartHour,
      durationHours: nbDuration,
      pitchPrice: calculatedPrice,
      depositPaid: Number(nbDeposit) || 0,
      status: Number(nbDeposit) > 0 ? 'confirmed' : 'pending',
      notes: nbNotes.trim() || undefined,
      posItems: [],
    };

    setBookings((prev) => [newBooking, ...prev]);
    setNewBookingOpen(false);
    setNbTeamName('');
    setNbCustomerName('');
    setNbPhone('');
    setNbNotes('');
    setNbError('');

    recordAudit(
      'Điều phối sân',
      `Tạo phiếu đặt mới ${newBooking.id} cho đội ${newBooking.teamName} (${newBooking.pitchId}, ${formatHourLabel(
        newBooking.startHour
      )})`,
      newBooking.id
    );
    showToast(`Tạo phiếu đặt sân ${newBooking.id} (${newBooking.pitchId}) thành công.`);
  };

  // Current Nav Item Metadata
  const currentNavMeta = useMemo(() => {
    for (const grp of sidebarConfig.groups) {
      const found = grp.items.find((i) => i.id === activeNavId);
      if (found) return { groupLabel: grp.label, pageLabel: found.label };
    }
    return { groupLabel: 'ĐIỀU PHỐI & LỊCH SÂN', pageLabel: 'Tổng quan' };
  }, [sidebarConfig, activeNavId]);

  // Standalone Pages: Public Website & Shift Login (no administrative Sidebar)
  if (activeNavId === 'lich-san-cong-khai') {
    return (
      <PublicWebsiteView
        bookings={bookings}
        onSwitchToInternal={(targetId) => setActiveNavId(targetId)}
      />
    );
  }

  if (activeNavId === 'dang-nhap-ca-truc') {
    return (
      <ShiftLoginView
        onSuccessLogin={() => {
          setActiveNavId('tong-quan');
          showToast('Đăng nhập ca trực thành công.');
        }}
        onOpenPublicSite={() => setActiveNavId('lich-san-cong-khai')}
      />
    );
  }

  const boomAlertCount = bookings.filter((b) => b.status === 'boom').length;
  const incidentAlertCount = incidents.filter((i) => i.status !== 'Đã khắc phục').length;

  return (
    <div className={`sbl-app-shell ${sidebarCollapsed ? 'is-collapsed' : ''}`}>
      {/* Single Reusable Sidebar */}
      <ReusableSidebar
        config={sidebarConfig}
        activeNavId={activeNavId}
        collapsed={sidebarCollapsed}
        mobileOpen={mobileSidebarOpen}
        onSelectNav={(id) => setActiveNavId(id)}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Shared Application Shell Main Wrapper */}
      <div className="sbl-main-wrapper">
        <TopHeader
          groupLabel={currentNavMeta.groupLabel}
          pageLabel={currentNavMeta.pageLabel}
          boomAlertCount={boomAlertCount}
          incidentAlertCount={incidentAlertCount}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenNewBooking={() => openNewBookingModal('Sân 01', 19.0)}
          onNavigate={(id) => setActiveNavId(id)}
        />

        <main className="sbl-main-content">
          {activeNavId === 'tong-quan' && (
            <DashboardView
              bookings={bookings}
              incidents={incidents}
              products={posProducts}
              onNavigate={(id) => setActiveNavId(id)}
              onOpenNewBooking={openNewBookingModal}
              onCheckInBooking={(id) => handleBookingAction(id, 'nhan-san')}
            />
          )}

          {(activeNavId === 'lich-san' || activeNavId === 'dat-san') && (
            <ScheduleAndBookingView
              mode={activeNavId === 'lich-san' ? 'schedule' : 'bookings'}
              bookings={bookings}
              posProducts={posProducts}
              selectedDate={selectedDate}
              onChangeDate={setSelectedDate}
              onBookingAction={handleBookingAction}
              onAddPosToBooking={handleAddPosToBooking}
              onOpenNewBookingModal={openNewBookingModal}
            />
          )}

          {activeNavId === 'khach-hang' && (
            <CustomersView
              customers={customers}
              onAddCustomer={(newCust) => {
                const created: CustomerRecord = {
                  ...newCust,
                  id: `KH-00${customers.length + 1}`,
                };
                setCustomers((prev) => [created, ...prev]);
                showToast(`Đã thêm khách hàng ${created.teamName}.`);
              }}
            />
          )}

          {activeNavId === 'dich-vu' && (
            <PosCounterView
              products={posProducts}
              activeBookings={bookings}
              onCompletePosOrder={handleCompletePosOrder}
            />
          )}

          {activeNavId === 'thiet-bi' && (
            <EquipmentView
              incidents={incidents}
              onCreateIncident={(inc) => {
                const created: EquipmentIncident = {
                  ...inc,
                  id: `INC-${Date.now()}`,
                  code: `SC-2026-09${incidents.length + 1}`,
                  reportedAt: '17/10/2026 – Vừa xong',
                };
                setIncidents((prev) => [created, ...prev]);
                recordAudit('Kho & Thiết bị', `Báo sự cố ${created.code} tại ${created.pitchId}`, created.code);
                showToast(`Đã ghi nhận phiếu sự cố ${created.code}.`);
              }}
              onResolveIncident={(id) => {
                setIncidents((prev) =>
                  prev.map((i) => (i.id === id ? { ...i, status: 'Đã khắc phục' } : i))
                );
                showToast('Đã cập nhật trạng thái khắc phục.');
              }}
            />
          )}

          {activeNavId === 'kho-hang' && (
            <InventoryView
              products={posProducts}
              movements={stockMovements}
              onReceiveStock={(prodId, addedQty, note) => {
                const prod = posProducts.find((p) => p.id === prodId);
                if (!prod) return;
                setPosProducts((prev) =>
                  prev.map((p) => (p.id === prodId ? { ...p, stock: p.stock + addedQty } : p))
                );
                const mov: StockMovementRecord = {
                  id: `MOV-${905 + stockMovements.length}`,
                  timestamp: '17/10/2026 – Vừa xong',
                  type: 'Nhập kho',
                  productName: prod.name,
                  quantityChange: addedQty,
                  staffName: sidebarConfig.operator.name,
                  note,
                };
                setStockMovements((prev) => [mov, ...prev]);
                recordAudit('Kho & Thiết bị', `Nhập kho +${addedQty} ${prod.name}`, mov.id);
                showToast(`Đã nhập kho +${addedQty} ${prod.unit} ${prod.name}.`);
              }}
            />
          )}

          {activeNavId === 'nhan-vien' && <StaffView staff={INITIAL_STAFF} />}

          {activeNavId === 'doanh-thu' && (
            <RevenueView
              transactions={revenueTx}
              onExportCsv={(filename) =>
                showToast(`Đã kết xuất báo cáo tài chính: ${filename}`)
              }
            />
          )}

          {activeNavId === 'thong-ke' && <AnalyticsView />}

          {activeNavId === 'nhat-ky-hoat-dong' && (
            <AuditLogView
              logs={auditLogs}
              onExportLogs={() =>
                showToast('Đã xuất nhật ký kiểm toán ca trực (Audit-Log-SANBONGLON.csv).')
              }
            />
          )}

          {activeNavId === 'cai-dat-he-thong' && (
            <AccountSettingsView
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* Global New Booking Modal */}
      {newBookingOpen && (
        <div className="sbl-overlay-backdrop animate-fade-in" onClick={() => setNewBookingOpen(false)}>
          <div
            className="sbl-modal animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Tạo phiếu đặt sân mới"
          >
            <div className="sbl-panel-header">
              <div>
                <h2 className="sbl-panel-title">Đặt Sân Mới – Trung Tâm Điều Phối</h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                  Hệ thống tự động kiểm tra trùng giờ trên cụm 12 sân (07:00 – 24:00).
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost btn-icon btn-sm"
                onClick={() => setNewBookingOpen(false)}
                aria-label="Đóng hộp thoại"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewBooking} className="sbl-panel-body flex flex-col gap-4">
              {nbError && <div className="form-error">{nbError}</div>}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="form-group">
                  <label htmlFor="nbPitchSelect" className="form-label">
                    Chọn sân:
                  </label>
                  <select
                    id="nbPitchSelect"
                    className="form-select font-semibold"
                    value={nbPitchId}
                    onChange={(e) => setNbPitchId(e.target.value)}
                  >
                    {PITCH_LIST.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.type})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="nbStartHourSelect" className="form-label">
                    Giờ bắt đầu:
                  </label>
                  <select
                    id="nbStartHourSelect"
                    className="form-select font-mono-tech"
                    value={nbStartHour}
                    onChange={(e) => setNbStartHour(Number(e.target.value))}
                  >
                    {[7, 7.5, 8, 8.5, 9, 9.5, 10, 14, 15, 16, 16.5, 17, 17.5, 18, 18.5, 19, 19.5, 20, 20.5, 21, 21.5, 22].map(
                      (h) => (
                        <option key={h} value={h}>
                          {formatHourLabel(h)}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="nbDurationSelect" className="form-label">
                    Thời lượng:
                  </label>
                  <select
                    id="nbDurationSelect"
                    className="form-select font-mono-tech"
                    value={nbDuration}
                    onChange={(e) => setNbDuration(Number(e.target.value))}
                  >
                    <option value={1.0}>1.0 giờ (60p)</option>
                    <option value={1.5}>1.5 giờ (90p)</option>
                    <option value={2.0}>2.0 giờ (120p)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="form-group">
                  <label htmlFor="nbTeamInput" className="form-label">
                    Tên Đội Bóng (FC):
                  </label>
                  <input
                    id="nbTeamInput"
                    type="text"
                    className="form-input"
                    placeholder="VD: FC Sài Gòn United"
                    value={nbTeamName}
                    onChange={(e) => setNbTeamName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nbCustInput" className="form-label">
                    Tên người đặt / Đội trưởng:
                  </label>
                  <input
                    id="nbCustInput"
                    type="text"
                    className="form-input"
                    placeholder="VD: Nguyễn Văn An"
                    value={nbCustomerName}
                    onChange={(e) => setNbCustomerName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="form-group">
                  <label htmlFor="nbPhoneInput" className="form-label">
                    Số điện thoại liên hệ:
                  </label>
                  <input
                    id="nbPhoneInput"
                    type="tel"
                    className="form-input font-mono-tech"
                    placeholder="0909 xxx xxx"
                    value={nbPhone}
                    onChange={(e) => setNbPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="nbDepositInput" className="form-label">
                    Tiền cọc trước (VNĐ):
                  </label>
                  <input
                    id="nbDepositInput"
                    type="number"
                    min={0}
                    step={50000}
                    className="form-input font-mono-tech"
                    value={nbDeposit}
                    onChange={(e) => setNbDeposit(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="nbNotesInput" className="form-label">
                  Ghi chú điều phối (Thuê trọng tài, áo Bib, nước suối...):
                </label>
                <input
                  id="nbNotesInput"
                  type="text"
                  className="form-input"
                  placeholder="Ghi chú thêm cho ca trực..."
                  value={nbNotes}
                  onChange={(e) => setNbNotes(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setNewBookingOpen(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-lime">
                  <Plus size={16} strokeWidth={2} />
                  <span>Xác nhận tạo phiếu đặt sân</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification Container */}
      <div className="sbl-toast-container" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="sbl-toast animate-toast">
            <CircleCheck size={16} style={{ color: 'var(--accent-lime)', flexShrink: 0, marginTop: 2 }} />
            <span>{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
