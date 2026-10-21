/**
 * SANBONGLON – Centralized Sidebar Configuration (js/sidebar-config.js)
 * Customize application logo, name, navigation labels, icons, URLs, grouping, and widths in one place.
 */

window.SANBONGLON_SIDEBAR_CONFIG = {
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
    initials: 'TTP',
    name: 'Trương Thịnh Phát',
    role: 'Ca Chiều – Điều phối viên',
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
        },
        {
          id: 'lich-san',
          label: 'Lịch & Đặt sân',
          icon: 'Calendar',
          url: '/pages/schedule.html',
          badge: '07–24h',
        },
        {
          id: 'khach-hang',
          label: 'Khách hàng',
          icon: 'UserRound',
          url: '/pages/customers.html',
        },
      ],
    },
    {
      id: 'dich-vu-kho',
      label: 'DỊCH VỤ & CẬT CHẤT',
      items: [
        {
          id: 'dich-vu',
          label: 'Dịch vụ',
          icon: 'ShoppingBag',
          url: '/pages/pos.html',
          badge: 'POS',
        },
        {
          id: 'thiet-bi',
          label: 'Thiết bị',
          icon: 'Wrench',
          url: '/pages/equipment.html',
          badge: '2 sự cố',
        },
        {
          id: 'kho-hang',
          label: 'Kho hàng',
          icon: 'Package',
          url: '/pages/inventory.html',
        },
        {
          id: 'nhan-vien',
          label: 'Nhân viên',
          icon: 'Users',
          url: '/pages/staff.html',
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
        },
        {
          id: 'thong-ke',
          label: 'Thống kê',
          icon: 'BarChart3',
          url: '/pages/analytics.html',
          badge: '5 mảng',
        },
        {
          id: 'nhat-ky-hoat-dong',
          label: 'Nhật ký',
          icon: 'ScrollText',
          url: '/pages/audit-log.html',
        },
        {
          id: 'cai-dat-he-thong',
          label: 'Cài đặt',
          icon: 'Settings',
          url: '/pages/account-settings.html',
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
        },
        {
          id: 'dang-nhap-ca-truc',
          label: 'Đăng nhập ca trực',
          icon: 'LogIn',
          url: '/pages/login.html',
        },
      ],
    },
  ],
};
