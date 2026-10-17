import React, { useState, useMemo } from 'react';
import {
  Wallet,
  Download,
  Search,
  CircleCheck,
  Clock,
  BarChart3,
  ScrollText,
  Settings,
  UserRound,
  TriangleAlert,
} from 'lucide-react';
import { formatVND } from '../utils/sanbonglonLogic';
import {
  type RevenueTransaction,
  type AuditLogEntry,
  PITCH_LIST,
} from '../data/demoData';
import { type SidebarConfig, DEFAULT_SIDEBAR_CONFIG } from '../config/sidebarConfig';

/* ==========================================================================
   1. Revenue & Financial Reporting View (Báo cáo doanh thu và tài chính)
   ========================================================================== */
interface RevenueViewProps {
  transactions: RevenueTransaction[];
  onExportCsv: (title: string) => void;
}

export const RevenueView: React.FC<RevenueViewProps> = ({ transactions, onExportCsv }) => {
  const [categoryFilter, setCategoryFilter] = useState<string>('Tất cả');
  const [dateRange, setDateRange] = useState<'hom-nay' | 'tuan-nay' | 'thang-10'>('hom-nay');

  const filteredTx = useMemo(() => {
    return transactions.filter((t) =>
      categoryFilter === 'Tất cả' ? true : t.category === categoryFilter
    );
  }, [transactions, categoryFilter]);

  const summary = useMemo(() => {
    const pitchRev = transactions
      .filter((t) => t.category === 'Tiền thuê sân' || t.category === 'Tiền cọc giữ sân')
      .reduce((s, t) => s + t.amount, 0);
    const posRev = transactions
      .filter((t) => t.category === 'Bán hàng POS')
      .reduce((s, t) => s + t.amount, 0);
    const expense = transactions
      .filter((t) => t.amount < 0)
      .reduce((s, t) => s + Math.abs(t.amount), 0);
    const netCashflow = pitchRev + posRev - expense;
    return { pitchRev, posRev, expense, netCashflow };
  }, [transactions]);

  return (
    <div>
      <div className="sbl-page-header">
        <div>
          <h1 className="sbl-page-title">Báo Cáo Doanh Thu & Tài Chính Sân</h1>
          <p className="sbl-page-subtitle">
            Đối soát dòng tiền thuê sân, tiền cọc QR, doanh thu quầy POS và chi phí vận hành theo ca trực.
          </p>
        </div>
        <div className="sbl-page-actions">
          <div className="sbl-segmented" role="group" aria-label="Kỳ báo cáo doanh thu">
            {[
              { id: 'hom-nay', label: 'Hôm nay (17/10)' },
              { id: 'tuan-nay', label: 'Tuần này' },
              { id: 'thang-10', label: 'Tháng 10/2026' },
            ].map((d) => (
              <button
                key={d.id}
                type="button"
                className={`sbl-segment-btn ${dateRange === d.id ? 'is-active' : ''}`}
                onClick={() => setDateRange(d.id as typeof dateRange)}
              >
                {d.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => onExportCsv('Bao-Cao-Doanh-Thu-SANBONGLON.csv')}
          >
            <Download size={16} strokeWidth={1.8} />
            <span>Xuất sổ quỹ CSV</span>
          </button>
        </div>
      </div>

      <div className="sbl-kpi-strip">
        <div className="sbl-kpi-card">
          <div className="sbl-kpi-label">
            <span>Doanh thu thuê sân & Cọc</span>
            <Wallet size={16} style={{ color: 'var(--status-success-text)' }} />
          </div>
          <div className="sbl-kpi-value">{formatVND(summary.pitchRev)}</div>
          <div className="sbl-kpi-meta">Chiếm 92.6% tổng thu</div>
        </div>

        <div className="sbl-kpi-card">
          <div className="sbl-kpi-label">
            <span>Doanh thu Dịch vụ & POS</span>
            <Wallet size={16} style={{ color: 'var(--status-info-text)' }} />
          </div>
          <div className="sbl-kpi-value">{formatVND(summary.posRev)}</div>
          <div className="sbl-kpi-meta">Nước giải khát, Bib, Giày, Trọng tài</div>
        </div>

        <div className="sbl-kpi-card">
          <div className="sbl-kpi-label">
            <span>Chi phí bảo trì & Vật tư</span>
            <Wallet size={16} style={{ color: 'var(--status-danger-text)' }} />
          </div>
          <div className="sbl-kpi-value">- {formatVND(summary.expense)}</div>
          <div className="sbl-kpi-meta">Phiếu chi đã duyệt trong ca</div>
        </div>

        <div className="sbl-kpi-card">
          <div className="sbl-kpi-label">
            <span>Thực thu ròng (Net Cashflow)</span>
            <CircleCheck size={16} style={{ color: 'var(--status-success-text)' }} />
          </div>
          <div className="sbl-kpi-value">{formatVND(summary.netCashflow)}</div>
          <div className="sbl-kpi-meta">Đã khớp tồn quỹ ca trực</div>
        </div>
      </div>

      <div className="sbl-panel">
        <div className="sbl-table-toolbar">
          <div className="sbl-segmented" role="group" aria-label="Lọc loại giao dịch tài chính">
            {['Tất cả', 'Tiền thuê sân', 'Bán hàng POS', 'Tiền cọc giữ sân', 'Chi phí bảo trì'].map((c) => (
              <button
                key={c}
                type="button"
                className={`sbl-segment-btn ${categoryFilter === c ? 'is-active' : ''}`}
                onClick={() => setCategoryFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="sbl-table-scroll">
          <table className="sbl-table">
            <thead>
              <tr>
                <th>Mã Chứng Từ</th>
                <th>Thời Gian</th>
                <th>Sân / Điểm Thu</th>
                <th>Khách Hàng / Nội Dung</th>
                <th>Hạng Mục</th>
                <th>Phương Thức</th>
                <th style={{ textAlign: 'right' }}>Số Tiền</th>
                <th>Thu Ngân</th>
                <th>Trạng Thái</th>
              </tr>
            </thead>
            <tbody>
              {filteredTx.map((tx) => (
                <tr key={tx.id}>
                  <td className="font-mono-tech text-xs font-bold">{tx.code}</td>
                  <td className="font-mono-tech text-xs">{tx.timestamp}</td>
                  <td className="font-semibold">{tx.pitchOrCounter}</td>
                  <td>{tx.customerOrTeam}</td>
                  <td className="text-xs font-semibold">{tx.category}</td>
                  <td className="text-xs">{tx.paymentMethod}</td>
                  <td
                    className="font-mono-tech text-right font-bold"
                    style={{
                      color: tx.amount < 0 ? 'var(--status-danger-text)' : 'var(--status-success-text)',
                    }}
                  >
                    {tx.amount > 0 ? `+${formatVND(tx.amount)}` : formatVND(tx.amount)}
                  </td>
                  <td className="text-xs">{tx.cashier}</td>
                  <td>
                    <span
                      className={`status-indicator ${
                        tx.status === 'Đã quyết toán' ? 'status-success' : 'status-warning'
                      }`}
                    >
                      {tx.status === 'Đã quyết toán' ? <CircleCheck size={14} /> : <Clock size={14} />}
                      <span>{tx.status}</span>
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

/* ==========================================================================
   2. Deep Operational Analytics View (Thống kê vận hành & phân tích chuyên sâu)
   Preserves all 5 required analytical areas:
   1. Thống kê sân
   2. Khách hàng và rủi ro
   3. Hiệu suất nhân sự
   4. Doanh thu dòng tiền
   5. Dịch vụ và tồn kho thiết bị
   ========================================================================== */
export const AnalyticsView: React.FC = () => {
  const [activeArea, setActiveArea] = useState<
    'thong-ke-san' | 'khach-hang-rui-ro' | 'hieu-suat-nhan-su' | 'doanh-thu-dong-tien' | 'dich-vu-ton-kho'
  >('thong-ke-san');

  const analyticalAreas = [
    { id: 'thong-ke-san', label: '1. Thống kê sân' },
    { id: 'khach-hang-rui-ro', label: '2. Khách hàng và rủi ro' },
    { id: 'hieu-suat-nhan-su', label: '3. Hiệu suất nhân sự' },
    { id: 'doanh-thu-dong-tien', label: '4. Doanh thu dòng tiền' },
    { id: 'dich-vu-ton-kho', label: '5. Dịch vụ và tồn kho thiết bị' },
  ] as const;

  return (
    <div>
      <div className="sbl-page-header">
        <div>
          <h1 className="sbl-page-title">Thống Kê Vận Hành & Phân Tích Chuyên Sâu</h1>
          <p className="sbl-page-subtitle">
            Báo cáo phân tích đa chiều theo 5 trụ cột vận hành của hệ thống SANBONGLON.
          </p>
        </div>
      </div>

      {/* 5 Analytical Pillars Selector */}
      <div className="mb-6">
        <div className="sbl-segmented flex-wrap" role="tablist" aria-label="5 phân khu phân tích chuyên sâu">
          {analyticalAreas.map((area) => (
            <button
              key={area.id}
              type="button"
              role="tab"
              aria-selected={activeArea === area.id}
              className={`sbl-segment-btn ${activeArea === area.id ? 'is-active' : ''}`}
              onClick={() => setActiveArea(area.id)}
            >
              {area.label}
            </button>
          ))}
        </div>
      </div>

      {activeArea === 'thong-ke-san' && (
        <div className="sbl-panel animate-fade-in">
          <div className="sbl-panel-header">
            <h2 className="sbl-panel-title">1. Thống Kê Hiệu Suất Khai Thác 12 Sân Bóng (Tháng 10/2026)</h2>
          </div>
          <div className="sbl-table-scroll">
            <table className="sbl-table">
              <thead>
                <tr>
                  <th>Sân Bóng</th>
                  <th>Loại Sân</th>
                  <th style={{ textAlign: 'right' }}>Tổng Giờ Khai Thác</th>
                  <th style={{ textAlign: 'right' }}>Tỷ Lệ Lấp Đầy Giờ Vàng</th>
                  <th style={{ textAlign: 'right' }}>Doanh Thu Luỹ Kế Tháng</th>
                  <th>Đánh Giá Hiệu Quả</th>
                </tr>
              </thead>
              <tbody>
                {PITCH_LIST.map((p, idx) => {
                  const hours = p.type === '7 người' ? 148 - idx * 3 : 132 - idx * 2;
                  const goldenPct = p.type === '7 người' ? 94 - idx : 89 - idx;
                  const rev = hours * p.baseRatePrime;
                  return (
                    <tr key={p.id}>
                      <td className="font-bold">{p.name}</td>
                      <td className="text-xs">Sân {p.type}</td>
                      <td className="font-mono-tech text-right font-semibold">{hours} giờ</td>
                      <td className="font-mono-tech text-right font-bold">{goldenPct}%</td>
                      <td className="font-mono-tech text-right font-bold">{formatVND(rev)}</td>
                      <td>
                        <span className="status-indicator status-success">
                          <CircleCheck size={14} />
                          <span>Đạt chuẩn khai thác cao</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeArea === 'khach-hang-rui-ro' && (
        <div className="sbl-panel animate-fade-in">
          <div className="sbl-panel-header">
            <h2 className="sbl-panel-title">2. Phân Tích Khách Hàng, Tỷ Lệ Giữ Chân & Rủi Ro Boom Sân</h2>
          </div>
          <div className="sbl-panel-body">
            <div className="sbl-kpi-strip">
              <div className="sbl-kpi-card">
                <div className="sbl-kpi-label">Tỷ lệ đội cố định tái ký</div>
                <div className="sbl-kpi-value">94.8%</div>
                <div className="sbl-kpi-meta">42 đội duy trì hợp đồng tháng</div>
              </div>
              <div className="sbl-kpi-card">
                <div className="sbl-kpi-label">Tỷ lệ Boom sân toàn hệ thống</div>
                <div className="sbl-kpi-value">1.8%</div>
                <div className="sbl-kpi-meta">Giảm 2.4% nhờ chính sách cọc QR</div>
              </div>
              <div className="sbl-kpi-card">
                <div className="sbl-kpi-label">Khung giờ rủi ro Boom cao nhất</div>
                <div className="sbl-kpi-value">17:30 – 19:00</div>
                <div className="sbl-kpi-meta">Đội vãng lai đặt sát giờ</div>
              </div>
              <div className="sbl-kpi-card">
                <div className="sbl-kpi-label">Thu hồi cọc từ ca hủy sát giờ</div>
                <div className="sbl-kpi-value">{formatVND(3450000)}</div>
                <div className="sbl-kpi-meta">Bù đắp 82% chi phí trống sân</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeArea === 'hieu-suat-nhan-su' && (
        <div className="sbl-panel animate-fade-in">
          <div className="sbl-panel-header">
            <h2 className="sbl-panel-title">3. Hiệu Suất Nhân Sự Điều Phối & Thu Ngân POS</h2>
          </div>
          <div className="sbl-panel-body">
            <div className="sbl-kpi-strip">
              <div className="sbl-kpi-card">
                <div className="sbl-kpi-label">Thời gian trung bình xử lý Check-in</div>
                <div className="sbl-kpi-value">42 giây</div>
                <div className="sbl-kpi-meta">Mục tiêu tiêu chuẩn: ≤ 60 giây</div>
              </div>
              <div className="sbl-kpi-card">
                <div className="sbl-kpi-label">Tỷ lệ khớp quỹ bàn giao ca</div>
                <div className="sbl-kpi-value">100%</div>
                <div className="sbl-kpi-meta">30 ca liên tiếp không lệch quỹ</div>
              </div>
              <div className="sbl-kpi-card">
                <div className="sbl-kpi-label">Doanh số POS trung bình / Ca trực</div>
                <div className="sbl-kpi-value">{formatVND(2850000)}</div>
                <div className="sbl-kpi-meta">Ca chiều đạt hiệu suất cao nhất</div>
              </div>
              <div className="sbl-kpi-card">
                <div className="sbl-kpi-label">Thời gian phản hồi sự cố kỹ thuật</div>
                <div className="sbl-kpi-value">8.5 phút</div>
                <div className="sbl-kpi-meta">Đội kỹ thuật trực chiến tại sân</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeArea === 'doanh-thu-dong-tien' && (
        <div className="sbl-panel animate-fade-in">
          <div className="sbl-panel-header">
            <h2 className="sbl-panel-title">4. Phân Tích Doanh Thu & Cấu Trúc Dòng Tiền</h2>
          </div>
          <div className="sbl-panel-body">
            <div className="sbl-kpi-strip">
              <div className="sbl-kpi-card">
                <div className="sbl-kpi-label">Tỷ trọng Chuyển khoản QR</div>
                <div className="sbl-kpi-value">78.4%</div>
                <div className="sbl-kpi-meta">VietQR tự động đối soát</div>
              </div>
              <div className="sbl-kpi-card">
                <div className="sbl-kpi-label">Tỷ trọng Tiền mặt tại quầy</div>
                <div className="sbl-kpi-value">14.2%</div>
                <div className="sbl-kpi-meta">Chủ yếu từ mua lẻ nước uống</div>
              </div>
              <div className="sbl-kpi-card">
                <div className="sbl-kpi-label">Công nợ Hợp đồng Doanh nghiệp</div>
                <div className="sbl-kpi-value">7.4%</div>
                <div className="sbl-kpi-meta">Tất toán định kỳ ngày 28 hàng tháng</div>
              </div>
              <div className="sbl-kpi-card">
                <div className="sbl-kpi-label">Biên lợi nhuận gộp vận hành</div>
                <div className="sbl-kpi-value">68.5%</div>
                <div className="sbl-kpi-meta">Sau khấuấu hao điện, nước & nhân sự</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeArea === 'dich-vu-ton-kho' && (
        <div className="sbl-panel animate-fade-in">
          <div className="sbl-panel-header">
            <h2 className="sbl-panel-title">5. Phân Tích Dịch Vụ POS & Vòng Quay Tồn Kho Thiết Bị</h2>
          </div>
          <div className="sbl-panel-body">
            <div className="sbl-kpi-strip">
              <div className="sbl-kpi-card">
                <div className="sbl-kpi-label">Mặt hàng bán chạy số 1</div>
                <div className="sbl-kpi-value">Aquafina & Revive</div>
                <div className="sbl-kpi-meta">Chiếm 64% sản lượng nước giải khát</div>
              </div>
              <div className="sbl-kpi-card">
                <div className="sbl-kpi-label">Tỷ lệ thuê kèm Áo Bib / Giày</div>
                <div className="sbl-kpi-value">38.0%</div>
                <div className="sbl-kpi-meta">Trung bình 3.8 trên 10 trận</div>
              </div>
              <div className="sbl-kpi-card">
                <div className="sbl-kpi-label">Tuổi thọ trung bình bóng thi đấu</div>
                <div className="sbl-kpi-value">115 trận</div>
                <div className="sbl-kpi-meta">Bóng Động Lực UHV 2.07</div>
              </div>
              <div className="sbl-kpi-card">
                <div className="sbl-kpi-label">Tỷ lệ hao hụt kho nước uống</div>
                <div className="sbl-kpi-value">0.2%</div>
                <div className="sbl-kpi-meta">Kiểm kê chéo mỗi cuối ca</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ==========================================================================
   3. Audit Log View (Nhật ký hoạt động và vết kiểm toán)
   ========================================================================== */
interface AuditLogViewProps {
  logs: AuditLogEntry[];
  onExportLogs: () => void;
}

export const AuditLogView: React.FC<AuditLogViewProps> = ({ logs, onExportLogs }) => {
  const [catFilter, setCatFilter] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      if (catFilter !== 'Tất cả' && l.category !== catFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          l.actionSummary.toLowerCase().includes(q) ||
          l.actor.toLowerCase().includes(q) ||
          l.traceId.toLowerCase().includes(q) ||
          l.targetRef.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [logs, catFilter, searchQuery]);

  return (
    <div>
      <div className="sbl-page-header">
        <div>
          <h1 className="sbl-page-title">Nhật Ký Hoạt Động & Vết Kiểm Toán (Audit Log)</h1>
          <p className="sbl-page-subtitle">
            Lưu vết toàn bộ thao tác đặt sân, đổi giờ, báo boom, xuất kho POS và bàn giao quỹ theo thời gian thực.
          </p>
        </div>
        <div className="sbl-page-actions">
          <button type="button" className="btn btn-secondary" onClick={onExportLogs}>
            <Download size={16} strokeWidth={1.8} />
            <span>Xuất nhật ký kiểm toán</span>
          </button>
        </div>
      </div>

      <div className="sbl-panel">
        <div className="sbl-table-toolbar">
          <div className="sbl-segmented flex-wrap" role="group" aria-label="Phân loại sự kiện kiểm toán">
            {[
              'Tất cả',
              'Điều phối sân',
              'Thanh toán & POS',
              'Cảnh báo Boom',
              'Kho & Thiết bị',
              'Bảo mật ca trực',
            ].map((c) => (
              <button
                key={c}
                type="button"
                className={`sbl-segment-btn ${catFilter === c ? 'is-active' : ''}`}
                onClick={() => setCatFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="form-search-wrapper" style={{ minWidth: '250px' }}>
            <Search size={16} className="form-search-icon" />
            <input
              type="search"
              className="form-input form-search-input"
              placeholder="Tìm mã TRC-, nhân viên, nội dung..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Tìm kiếm vết kiểm toán"
            />
          </div>
        </div>

        <div className="sbl-table-scroll">
          <table className="sbl-table">
            <thead>
              <tr>
                <th>Mã Trace</th>
                <th>Thời Gian Ghi Nhận</th>
                <th>Nhân Sự Thực Hiện</th>
                <th>Phân Nhóm</th>
                <th>Chi Tiết Thao Tác Nghiệp Vụ</th>
                <th>Đối Tượng</th>
                <th>Địa Chỉ IP</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td className="font-mono-tech text-xs font-bold">{log.traceId}</td>
                  <td className="font-mono-tech text-xs">{log.timestamp}</td>
                  <td>
                    <div className="font-semibold text-xs">{log.actor}</div>
                    <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {log.role}
                    </div>
                  </td>
                  <td className="text-xs font-semibold">{log.category}</td>
                  <td className="text-xs">{log.actionSummary}</td>
                  <td className="font-mono-tech text-xs font-semibold">{log.targetRef}</td>
                  <td className="font-mono-tech text-xs" style={{ color: 'var(--text-muted)' }}>
                    {log.ipAddress}
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

/* ==========================================================================
   4. Account, Security & Live Sidebar Configurator View (Cài đặt hệ thống)
   ========================================================================== */
interface AccountSettingsViewProps {
  sidebarConfig: SidebarConfig;
  onUpdateSidebarConfig: (next: SidebarConfig) => void;
  onShowToast: (msg: string) => void;
}

export const AccountSettingsView: React.FC<AccountSettingsViewProps> = ({
  sidebarConfig,
  onUpdateSidebarConfig,
  onShowToast,
}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdError, setPwdError] = useState('');

  // Editable Sidebar fields
  const [brandName, setBrandName] = useState(sidebarConfig.brand.name);
  const [brandLogo, setBrandLogo] = useState(sidebarConfig.brand.logoText);
  const [brandSubtitle, setBrandSubtitle] = useState(sidebarConfig.brand.subtitle);
  const [expandedWidth, setExpandedWidth] = useState(sidebarConfig.appearance.expandedWidth);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      setPwdError('Vui lòng nhập mật khẩu hiện tại và mật khẩu mới.');
      return;
    }
    if (newPassword.length < 6) {
      setPwdError('Mật khẩu ca trực mới phải có tối thiểu 6 ký tự.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('Mật khẩu xác nhận không khớp.');
      return;
    }
    setPwdError('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    onShowToast('Đã cập nhật mật khẩu bảo mật ca trực thành công.');
  };

  const handleApplySidebarChanges = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SidebarConfig = {
      ...sidebarConfig,
      brand: {
        ...sidebarConfig.brand,
        name: brandName.trim() || 'SANBONGLON',
        logoText: brandLogo.trim() || 'SB',
        subtitle: brandSubtitle.trim() || 'CENTRAL PITCH OPS',
      },
      appearance: {
        ...sidebarConfig.appearance,
        expandedWidth: expandedWidth || '256px',
      },
    };
    document.documentElement.style.setProperty('--sidebar-width-expanded', updated.appearance.expandedWidth);
    onUpdateSidebarConfig(updated);
    onShowToast('Đã áp dụng cấu hình Sidebar dùng chung (js/sidebar-config.js) ngay lập tức.');
  };

  const handleResetSidebar = () => {
    setBrandName(DEFAULT_SIDEBAR_CONFIG.brand.name);
    setBrandLogo(DEFAULT_SIDEBAR_CONFIG.brand.logoText);
    setBrandSubtitle(DEFAULT_SIDEBAR_CONFIG.brand.subtitle);
    setExpandedWidth(DEFAULT_SIDEBAR_CONFIG.appearance.expandedWidth);
    document.documentElement.style.setProperty(
      '--sidebar-width-expanded',
      DEFAULT_SIDEBAR_CONFIG.appearance.expandedWidth
    );
    onUpdateSidebarConfig(DEFAULT_SIDEBAR_CONFIG);
    onShowToast('Đã khôi phục cấu hình Sidebar mặc định của SANBONGLON.');
  };

  return (
    <div>
      <div className="sbl-page-header">
        <div>
          <h1 className="sbl-page-title">Tài Khoản, Bảo Mật & Cấu Hình Sidebar Dùng Chung</h1>
          <p className="sbl-page-subtitle">
            Quản lý thông tin điều phối viên ca trực, đổi mật khẩu, kiểm soát phiên đăng nhập và tùy biến trực tiếp Sidebar tập trung.
          </p>
        </div>
      </div>

      <div className="sbl-split-2col">
        {/* Left: Live Reusable Sidebar Configurator */}
        <div className="sbl-panel">
          <div className="sbl-panel-header">
            <div>
              <h2 className="sbl-panel-title">Cấu Hình Sidebar Tập Trung (js/sidebar-config.js)</h2>
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Chỉnh sửa tại một nơi — tự động đồng bộ trên toàn bộ 12 trang vận hành nội bộ.
              </p>
            </div>
          </div>

          <form onSubmit={handleApplySidebarChanges} className="sbl-panel-body flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="form-group">
                <label htmlFor="cfgLogoInput" className="form-label">
                  Ký hiệu Logo:
                </label>
                <input
                  id="cfgLogoInput"
                  type="text"
                  maxLength={3}
                  className="form-input font-mono-tech font-bold"
                  value={brandLogo}
                  onChange={(e) => setBrandLogo(e.target.value)}
                />
              </div>

              <div className="form-group sm:col-span-2">
                <label htmlFor="cfgBrandNameInput" className="form-label">
                  Tên hệ thống hiển thị:
                </label>
                <input
                  id="cfgBrandNameInput"
                  type="text"
                  className="form-input font-semibold"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="form-group">
                <label htmlFor="cfgBrandSubInput" className="form-label">
                  Nhãn phụ (Subtitle):
                </label>
                <input
                  id="cfgBrandSubInput"
                  type="text"
                  className="form-input font-mono-tech"
                  value={brandSubtitle}
                  onChange={(e) => setBrandSubtitle(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="cfgWidthSelect" className="form-label">
                  Độ rộng khi mở rộng (--sidebar-width-expanded):
                </label>
                <select
                  id="cfgWidthSelect"
                  className="form-select font-mono-tech"
                  value={expandedWidth}
                  onChange={(e) => setExpandedWidth(e.target.value)}
                >
                  <option value="240px">240px (Gọn)</option>
                  <option value="256px">256px (Tiêu chuẩn)</option>
                  <option value="280px">280px (Rộng rãi)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <button type="button" className="btn btn-secondary btn-sm" onClick={handleResetSidebar}>
                Khôi phục mặc định
              </button>
              <button type="submit" className="btn btn-lime btn-sm">
                Áp dụng lên Sidebar ngay
              </button>
            </div>
          </form>
        </div>

        {/* Right: Password & Session Security */}
        <div className="sbl-panel">
          <div className="sbl-panel-header">
            <h2 className="sbl-panel-title">Đổi Mật Khẩu Ca Trực & Phiên Đăng Nhập</h2>
          </div>

          <form onSubmit={handlePasswordSubmit} className="sbl-panel-body flex flex-col gap-4">
            {pwdError && <div className="form-error">{pwdError}</div>}

            <div className="form-group">
              <label htmlFor="curPwdInput" className="form-label">
                Mật khẩu ca trực hiện tại:
              </label>
              <input
                id="curPwdInput"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPwdInput" className="form-label">
                Mật khẩu mới (tối thiểu 6 ký tự):
              </label>
              <input
                id="newPwdInput"
                type="password"
                className="form-input"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cfmPwdInput" className="form-label">
                Xác nhận mật khẩu mới:
              </label>
              <input
                id="cfmPwdInput"
                type="password"
                className="form-input"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Cập nhật mật khẩu bảo mật
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
