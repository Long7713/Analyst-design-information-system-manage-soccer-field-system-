/**
 * SANBONGLON - Centralized Sidebar Configuration
 * Single source of truth for logo, brand name, navigation items, icons, URLs, grouping, and widths.
 */

export type NavItemId =
  | 'tong-quan'
  | 'lich-san'
  | 'dat-san'
  | 'khach-hang'
  | 'dich-vu'
  | 'thiet-bi'
  | 'kho-hang'
  | 'nhan-vien'
  | 'doanh-thu'
  | 'thong-ke'
  | 'nhat-ky-hoat-dong'
  | 'cai-dat-he-thong'
  | 'lich-san-cong-khai'
  | 'dang-nhap-ca-truc';

export interface SidebarNavItem {
  id: NavItemId;
  label: string;
  icon:
    | 'LayoutDashboard'
    | 'Calendar'
    | 'CalendarPlus'
    | 'UserRound'
    | 'ShoppingBag'
    | 'Wrench'
    | 'Package'
    | 'Users'
    | 'Wallet'
    | 'BarChart3'
    | 'ScrollText'
    | 'Settings'
    | 'Globe'
    | 'LogIn';
  url: string;
  badge?: string;
  groupLabel: string;
}

export interface SidebarGroup {
  id: string;
  label: string;
  items: SidebarNavItem[];
}

export interface SidebarConfig {
  brand: {
    logoText: string;
    name: string;
    subtitle: string;
    homeUrl: string;
  };
  appearance: {
    expandedWidth: string;
    collapsedWidth: string;
    defaultCollapsedDesktop: boolean;
    storageKey: string;
  };
  operator: {
    initials: string;
    name: string;
    role: string;
    shiftCode: string;
  };
  groups: SidebarGroup[];
}

export const DEFAULT_SIDEBAR_CONFIG: SidebarConfig = {
  brand: {
    logoText: 'SB',
    name: 'SANBONGLON',
    subtitle: 'CENTRAL PITCH OPS',
    homeUrl: '/pages/dashboard.html',
  },
  appearance: {
    expandedWidth: '256px',
    collapsedWidth: '72px',
    defaultCollapsedDesktop: false,
    storageKey: 'sanbonglon_sidebar_collapsed',
  },
  operator: {
    initials: 'TP',
    name: 'Trương Thịnh Phát',
    role: 'Điều phối viên trưởng',
    shiftCode: 'CA-02',
  },
  groups: [
    {
      id: 'dieu-phoi',
      label: 'ĐIỀU PHỐI & LỊCH SÂN',
      items: [
        {
          id: 'tong-quan',
          label: 'Tổng quan',
          icon: 'LayoutDashboard',
          url: '/pages/dashboard.html',
          badge: '12 sân',
          groupLabel: 'Điều phối & Lịch sân',
        },
        {
          id: 'lich-san',
          label: 'Lịch sân',
          icon: 'Calendar',
          url: '/pages/schedule.html',
          badge: '07–24h',
          groupLabel: 'Điều phối & Lịch sân',
        },
        {
          id: 'dat-san',
          label: 'Đặt sân',
          icon: 'CalendarPlus',
          url: '/pages/bookings.html',
          badge: '18 ca',
          groupLabel: 'Điều phối & Lịch sân',
        },
        {
          id: 'khach-hang',
          label: 'Khách hàng',
          icon: 'UserRound',
          url: '/pages/customers.html',
          groupLabel: 'Điều phối & Lịch sân',
        },
      ],
    },
    {
      id: 'dich-vu-kho',
      label: 'DỊCH VỤ & CƠ TÍCH HỢP',
      items: [
        {
          id: 'dich-vu',
          label: 'Dịch vụ & POS',
          icon: 'ShoppingBag',
          url: '/pages/pos.html',
          badge: 'POS',
          groupLabel: 'Dịch vụ & Cơ tích hợp',
        },
        {
          id: 'thiet-bi',
          label: 'Thiết bị & Đèn',
          icon: 'Wrench',
          url: '/pages/equipment.html',
          badge: '2 sự cố',
          groupLabel: 'Dịch vụ & Cơ tích hợp',
        },
        {
          id: 'kho-hang',
          label: 'Kho hàng',
          icon: 'Package',
          url: '/pages/inventory.html',
          groupLabel: 'Dịch vụ & Cơ tích hợp',
        },
        {
          id: 'nhan-vien',
          label: 'Nhân sự ca',
          icon: 'Users',
          url: '/pages/staff.html',
          groupLabel: 'Dịch vụ & Cơ tích hợp',
        },
      ],
    },
    {
      id: 'tai-chinh-quan-tri',
      label: 'TÀI CHÍNH & QUẢN TRỊ',
      items: [
        {
          id: 'doanh-thu',
          label: 'Doanh thu & Quỹ',
          icon: 'Wallet',
          url: '/pages/revenue.html',
          groupLabel: 'Tài chính & Quản trị',
        },
        {
          id: 'thong-ke',
          label: 'Thống kê chuyên sâu',
          icon: 'BarChart3',
          url: '/pages/analytics.html',
          badge: '5 mảng',
          groupLabel: 'Tài chính & Quản trị',
        },
        {
          id: 'nhat-ky-hoat-dong',
          label: 'Nhật ký kiểm toán',
          icon: 'ScrollText',
          url: '/pages/audit-log.html',
          groupLabel: 'Tài chính & Quản trị',
        },
        {
          id: 'cai-dat-he-thong',
          label: 'Cài đặt hệ thống',
          icon: 'Settings',
          url: '/pages/account-settings.html',
          groupLabel: 'Tài chính & Quản trị',
        },
      ],
    },
    {
      id: 'cong-khai-ca-truc',
      label: 'CỔNG CÔNG KHAI & CA TRỰC',
      items: [
        {
          id: 'lich-san-cong-khai',
          label: 'Trang chủ / Lịch công khai',
          icon: 'Globe',
          url: '/public/index.html',
          groupLabel: 'Cổng công khai & Ca trực',
        },
        {
          id: 'dang-nhap-ca-truc',
          label: 'Đăng nhập ca trực',
          icon: 'LogIn',
          url: '/pages/login.html',
          groupLabel: 'Cổng công khai & Ca trực',
        },
      ],
    },
  ],
};
