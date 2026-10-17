import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Plus,
  PanelLeftOpen,
  TriangleAlert,
  CircleCheck,
  Clock,
  Calendar,
} from 'lucide-react';
import { type NavItemId } from '../config/sidebarConfig';

interface TopHeaderProps {
  groupLabel: string;
  pageLabel: string;
  boomAlertCount: number;
  incidentAlertCount: number;
  onOpenMobileSidebar: () => void;
  onOpenNewBooking: () => void;
  onNavigate: (id: NavItemId) => void;
}

function getVietnameseLiveTime(): string {
  const now = new Date();
  const dayIndex = now.getDay();
  const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
  const dayName = days[dayIndex];
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${dayName}  ${hh}:${mm}:${ss}`;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  groupLabel,
  pageLabel,
  boomAlertCount,
  incidentAlertCount,
  onOpenMobileSidebar,
  onOpenNewBooking,
  onNavigate,
}) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [liveClock, setLiveClock] = useState<string>(getVietnameseLiveTime);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveClock(getVietnameseLiveTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setNotifOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const totalAlerts = boomAlertCount + incidentAlertCount;

  return (
    <header className="sbl-top-header">
      {/* Zone 1: Mobile Trigger & Contextual Breadcrumb */}
      <div className="sbl-header-left">
        <button
          type="button"
          className="btn btn-secondary btn-icon btn-sm sbl-mobile-menu-trigger"
          onClick={onOpenMobileSidebar}
          aria-label="Mở menu thanh bên"
        >
          <PanelLeftOpen size={18} strokeWidth={1.8} />
        </button>

        <div className="sbl-breadcrumb" aria-label="Breadcrumb">
          <span className="font-mono-tech text-xs">SANBONGLON</span>
          <span aria-hidden="true">/</span>
          <span className="hidden md:inline">{groupLabel}</span>
          <span className="hidden md:inline" aria-hidden="true">/</span>
          <span className="sbl-breadcrumb-current">{pageLabel}</span>
        </div>
      </div>

      {/* Zone 2: Live Clock: Thứ  Giờ:phút:giây */}
      <div className="flex items-center gap-2">
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border font-mono-tech text-xs font-bold"
          style={{
            backgroundColor: 'var(--bg-sand)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-primary)',
            letterSpacing: '0.04em',
          }}
          title="Thời gian thực hệ thống"
        >
          <Clock size={14} className="text-[#586955]" />
          <span>{liveClock}</span>
        </div>
      </div>

      {/* Zone 3: Notification Bell & Primary Action */}
      <div className="sbl-header-right" ref={dropdownRef}>
        <div className="relative">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setNotifOpen((prev) => !prev)}
            aria-expanded={notifOpen}
            aria-label={`Thông báo ca trực (${totalAlerts})`}
          >
            <Bell size={16} strokeWidth={1.8} />
            <span className="font-mono-tech text-xs">{totalAlerts}</span>
          </button>

          {notifOpen && (
            <div
              className="glass-overlay animate-scale-in"
              style={{
                position: 'absolute',
                right: 0,
                top: 'calc(100% + 8px)',
                width: '340px',
                borderRadius: 'var(--radius-md)',
                zIndex: 'var(--z-dropdown)',
                padding: '12px',
              }}
              role="region"
              aria-label="Danh sách thông báo ca"
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b" style={{ borderColor: 'var(--border-color)' }}>
                <span className="font-semibold text-xs">Cảnh báo ca trực hôm nay</span>
                <span className="font-mono-tech text-xs" style={{ color: 'var(--text-muted)' }}>
                  {totalAlerts} mục cần chú ý
                </span>
              </div>
              <div className="flex flex-col gap-2 text-xs">
                <button
                  type="button"
                  className="text-left p-2 rounded hover:bg-black/5 transition-colors flex items-start gap-2 cursor-pointer"
                  onClick={() => {
                    setNotifOpen(false);
                    onNavigate('lich-san');
                  }}
                >
                  <TriangleAlert size={16} strokeWidth={1.8} style={{ color: 'var(--status-danger-text)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div className="font-semibold">Sân 03 - Báo Boom khung 17:30</div>
                    <div style={{ color: 'var(--text-secondary)' }}>FC Tự Do Quận 3 quá 25 phút chưa nhận sân</div>
                  </div>
                </button>
                <button
                  type="button"
                  className="text-left p-2 rounded hover:bg-black/5 transition-colors flex items-start gap-2 cursor-pointer"
                  onClick={() => {
                    setNotifOpen(false);
                    onNavigate('thiet-bi');
                  }}
                >
                  <Clock size={16} strokeWidth={1.8} style={{ color: 'var(--status-warning-text)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div className="font-semibold">Sân 05 - Đèn pha góc Đông Bắc</div>
                    <div style={{ color: 'var(--text-secondary)' }}>Kỹ thuật đang xử lý driver nguồn số 2</div>
                  </div>
                </button>
                <button
                  type="button"
                  className="text-left p-2 rounded hover:bg-black/5 transition-colors flex items-start gap-2 cursor-pointer"
                  onClick={() => {
                    setNotifOpen(false);
                    onNavigate('doanh-thu');
                  }}
                >
                  <CircleCheck size={16} strokeWidth={1.8} style={{ color: 'var(--status-success-text)', flexShrink: 0, marginTop: 2 }} />
                  <div>
                    <div className="font-semibold">Sân 12 - Đã thanh toán 1.360.000 đ</div>
                    <div style={{ color: 'var(--text-secondary)' }}>FC Thành Đồng chuyển khoản QR thành công</div>
                  </div>
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="btn btn-lime btn-sm"
          onClick={onOpenNewBooking}
        >
          <Plus size={16} strokeWidth={2} />
          <span>Đặt sân mới</span>
        </button>
      </div>
    </header>
  );
};
