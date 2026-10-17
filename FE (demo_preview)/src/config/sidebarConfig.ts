/**
 * SANBONGLON — Centralized Sidebar Configuration (TypeScript Mirror of js/sidebar-config.js)
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
    initials: 'HN',
    name: 'Lê Hoàng Nam',
    role: 'Ca Chiều · Điều phối viên',
    shiftCode: 'CA-02 (14:00 - 22:00)',
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
          badge: '18 đơn',
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
      label: 'DỊCH VỤ & CƠ SỞ VẬT CHẤT',
      items: [
        {
          id: 'dich-vu',
          label: 'Dịch vụ',
          icon: 'ShoppingBag',
          url: '/pages/pos.html',
          badge: 'POS',
          groupLabel: 'Dịch vụ & Cơ sở vật chất',
        },
        {
          id: 'thiet-bi',
          label: 'Thiết bị',
          icon: 'Wrench',
          url: '/pages/equipment.html',
          badge: '2 sự cố',
          groupLabel: 'Dịch vụ & Cơ sở vật chất',
        },
        {
          id: 'kho-hang',
          label: 'Kho hàng',
          icon: 'Package',
          url: '/pages/inventory.html',
          groupLabel: 'Dịch vụ & Cơ sở vật chất',
        },
        {
          id: 'nhan-vien',
          label: 'Nhân viên',
          icon: 'Users',
          url: '/pages/staff.html',
          groupLabel: 'Dịch vụ & Cơ sở vật chất',
        },
      ],
    },
    {
      id: 'tai-chinh-quan-tri',
      label: 'TÀI CHÍNH & QUẢN TRỊ',
      items: [
        {
          id: 'doanh-thu',
          label: 'Doanh thu',
          icon: 'Wallet',
          url: '/pages/revenue.html',
          groupLabel: 'Tài chính & Quản trị',
        },
        {
          id: 'thong-ke',
          label: 'Thống kê',
          icon: 'BarChart3',
          url: '/pages/analytics.html',
          badge: '5 mục',
          groupLabel: 'Tài chính & Quản trị',
        },
        {
          id: 'nhat-ky-hoat-dong',
          label: 'Nhật ký hoạt động',
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
