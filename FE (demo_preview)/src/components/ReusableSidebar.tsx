import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  CalendarPlus,
  UserRound,
  ShoppingBag,
  Wrench,
  Package,
  Users,
  Wallet,
  BarChart3,
  ScrollText,
  Settings,
  Globe,
  LogIn,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { type SidebarConfig, type NavItemId, type SidebarNavItem } from '../config/sidebarConfig';

interface ReusableSidebarProps {
  config: SidebarConfig;
  activeNavId: NavItemId;
  collapsed: boolean;
  mobileOpen: boolean;
  onSelectNav: (id: NavItemId) => void;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

export function renderStandardIcon(iconName: SidebarNavItem['icon'], size = 20) {
  const props = { size, strokeWidth: 1.8, 'aria-hidden': true as const };
  switch (iconName) {
    case 'LayoutDashboard':
      return <LayoutDashboard {...props} />;
    case 'Calendar':
      return <Calendar {...props} />;
    case 'CalendarPlus':
      return <CalendarPlus {...props} />;
    case 'UserRound':
      return <UserRound {...props} />;
    case 'ShoppingBag':
      return <ShoppingBag {...props} />;
    case 'Wrench':
      return <Wrench {...props} />;
    case 'Package':
      return <Package {...props} />;
    case 'Users':
      return <Users {...props} />;
    case 'Wallet':
      return <Wallet {...props} />;
    case 'BarChart3':
      return <BarChart3 {...props} />;
    case 'ScrollText':
      return <ScrollText {...props} />;
    case 'Settings':
      return <Settings {...props} />;
    case 'Globe':
      return <Globe {...props} />;
    case 'LogIn':
      return <LogIn {...props} />;
    default:
      return <LayoutDashboard {...props} />;
  }
}

export const ReusableSidebar: React.FC<ReusableSidebarProps> = ({
  config,
  activeNavId,
  collapsed,
  mobileOpen,
  onSelectNav,
  onToggleCollapse,
  onCloseMobile,
}) => {
  return (
    <>
      <div
        className={`sbl-sidebar-backdrop ${mobileOpen ? 'is-open' : ''}`}
        onClick={onCloseMobile}
        aria-hidden="true"
      />
      <aside
        id="sblSidebar"
        className={`sbl-sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`}
        aria-label="Điều hướng hệ thống SANBONGLON"
      >
        <div className="sbl-sidebar-brand">
          <a
            href={config.brand.homeUrl}
            className="sbl-brand-link"
            onClick={(e) => {
              e.preventDefault();
              onSelectNav('tong-quan');
              onCloseMobile();
            }}
          >
            <span className="sbl-brand-mark">{config.brand.logoText}</span>
            <span className="sbl-brand-text">
              <span className="sbl-brand-name">{config.brand.name}</span>
              <span className="sbl-brand-sub">{config.brand.subtitle}</span>
            </span>
          </a>
          <button
            type="button"
            className="sbl-sidebar-toggle"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Mở rộng thanh bên' : 'Thu gọn thanh bên'}
            title={collapsed ? 'Mở rộng thanh bên (Ctrl+B)' : 'Thu gọn thanh bên (Ctrl+B)'}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} strokeWidth={1.8} />
            ) : (
              <PanelLeftClose size={18} strokeWidth={1.8} />
            )}
          </button>
        </div>

        <nav className="sbl-sidebar-nav" role="navigation" aria-label="Menu vận hành chính">
          {config.groups.map((group) => (
            <div key={group.id} className="sbl-nav-group" role="group" aria-label={group.label}>
              <div className="sbl-nav-group-label">{group.label}</div>
              {group.items.map((item) => {
                const isActive = item.id === activeNavId;
                return (
                  <a
                    key={item.id}
                    href={item.url}
                    className={`sbl-nav-item ${isActive ? 'is-active' : ''}`}
                    data-nav-id={item.id}
                    data-tooltip={item.label}
                    aria-current={isActive ? 'page' : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectNav(item.id);
                      onCloseMobile();
                    }}
                  >
                    <span className="sbl-nav-icon">{renderStandardIcon(item.icon, 20)}</span>
                    <span className="sbl-nav-label">{item.label}</span>
                    {item.badge && <span className="sbl-nav-badge">{item.badge}</span>}
                  </a>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sbl-sidebar-footer">
          <div className="sbl-operator-card">
            <span className="sbl-operator-avatar">{config.operator.initials}</span>
            <div className="sbl-operator-meta">
              <div className="sbl-operator-name">{config.operator.name}</div>
              <div className="sbl-operator-role">{config.operator.role}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
