/**
 * SANBONGLON — Reusable Sidebar Component Loader & Controller (js/sidebar.js)
 * Loads components/sidebar.html via fetch(), renders Lucide SVG icons consistently,
 * manages expand/collapse, tooltips, keyboard navigation, and mobile off-canvas drawer.
 */

(function () {
  const LUCIDE_SVG_PATHS = {
    LayoutDashboard: '<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>',
    Calendar: '<path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/>',
    CalendarPlus: '<path d="M8 2v4"/><path d="M16 2v4"/><path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/><path d="M3 10h18"/><path d="M16 19h6"/><path d="M19 16v6"/>',
    UserRound: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
    ShoppingBag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/>',
    Wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    Package: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
    Users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    Wallet: '<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
    BarChart3: '<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
    ScrollText: '<path d="M15 12h-5"/><path d="M15 8h-5"/><path d="M19 17V5a2 2 0 0 0-2-2H4"/><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"/>',
    Settings: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    Globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    LogIn: '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/>',
  };

  function renderIconSvg(iconName, size = 20) {
    const inner = LUCIDE_SVG_PATHS[iconName] || LUCIDE_SVG_PATHS.LayoutDashboard;
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  }

  async function initSidebar(mountSelector = '#sblSidebarMount') {
    const config = window.SANBONGLON_SIDEBAR_CONFIG;
    if (!config) return;

    // Apply custom widths to CSS variables
    if (config.appearance?.expandedWidth) {
      document.documentElement.style.setProperty('--sidebar-width-expanded', config.appearance.expandedWidth);
    }
    if (config.appearance?.collapsedWidth) {
      document.documentElement.style.setProperty('--sidebar-width-collapsed', config.appearance.collapsedWidth);
    }

    let mountEl = document.querySelector(mountSelector);
    if (!mountEl) {
      mountEl = document.createElement('div');
      mountEl.id = 'sblSidebarMount';
      document.body.prepend(mountEl);
    }

    // Fetch reusable HTML fragment
    try {
      const response = await fetch('/components/sidebar.html');
      if (response.ok) {
        mountEl.innerHTML = await response.text();
      }
    } catch (_err) {
      // Fallback inline template if opened without HTTP server
      mountEl.innerHTML = `
        <div class="sbl-sidebar-backdrop" id="sblSidebarBackdrop"></div>
        <aside class="sbl-sidebar" id="sblSidebar" aria-label="Điều hướng hệ thống SANBONGLON">
          <div class="sbl-sidebar-brand">
            <a href="${config.brand.homeUrl}" class="sbl-brand-link">
              <span class="sbl-brand-mark" id="sblBrandLogo">${config.brand.logoText}</span>
              <span class="sbl-brand-text">
                <span class="sbl-brand-name" id="sblBrandName">${config.brand.name}</span>
                <span class="sbl-brand-sub" id="sblBrandSub">${config.brand.subtitle}</span>
              </span>
            </a>
            <button type="button" class="sbl-sidebar-toggle" id="sblSidebarToggleBtn" aria-label="Thu gọn hoặc mở rộng thanh bên"></button>
          </div>
          <nav class="sbl-sidebar-nav" id="sblSidebarNav"></nav>
          <div class="sbl-sidebar-footer" id="sblSidebarFooter"></div>
        </aside>
      `;
    }

    // Populate Brand & Operator
    const logoEl = document.getElementById('sblBrandLogo');
    const nameEl = document.getElementById('sblBrandName');
    const subEl = document.getElementById('sblBrandSub');
    if (logoEl) logoEl.textContent = config.brand.logoText;
    if (nameEl) nameEl.textContent = config.brand.name;
    if (subEl) subEl.textContent = config.brand.subtitle;

    const opInit = document.getElementById('sblOperatorInitials');
    const opName = document.getElementById('sblOperatorName');
    const opRole = document.getElementById('sblOperatorRole');
    if (opInit && config.operator) opInit.textContent = config.operator.initials;
    if (opName && config.operator) opName.textContent = config.operator.name;
    if (opRole && config.operator) opRole.textContent = config.operator.role;

    // Populate Navigation Groups & Items
    const navEl = document.getElementById('sblSidebarNav');
    const currentPath = window.location.pathname;
    const activePageAttr = document.body.getAttribute('data-page');

    if (navEl) {
      navEl.innerHTML = config.groups
        .map((group) => {
          const itemsHtml = group.items
            .map((item) => {
              const isActive =
                activePageAttr === item.id ||
                currentPath.endsWith(item.url) ||
                (currentPath === '/' && item.id === 'tong-quan');
              return `
                <a
                  href="${item.url}"
                  class="sbl-nav-item ${isActive ? 'is-active' : ''}"
                  data-nav-id="${item.id}"
                  data-tooltip="${item.label}"
                  ${isActive ? 'aria-current="page"' : ''}
                >
                  <span class="sbl-nav-icon">${renderIconSvg(item.icon, 20)}</span>
                  <span class="sbl-nav-label">${item.label}</span>
                  ${item.badge ? `<span class="sbl-nav-badge">${item.badge}</span>` : ''}
                </a>
              `;
            })
            .join('');

          return `
            <div class="sbl-nav-group" role="group" aria-label="${group.label}">
              <div class="sbl-nav-group-label">${group.label}</div>
              ${itemsHtml}
            </div>
          `;
        })
        .join('');
    }

    // Restore Collapsed State
    const sidebarEl = document.getElementById('sblSidebar');
    const backdropEl = document.getElementById('sblSidebarBackdrop');
    const toggleBtn = document.getElementById('sblSidebarToggleBtn');
    const storageKey = config.appearance?.storageKey || 'sanbonglon_sidebar_collapsed';
    const savedCollapsed = localStorage.getItem(storageKey) === 'true';

    function applyCollapsedState(collapsed) {
      if (!sidebarEl) return;
      sidebarEl.classList.toggle('is-collapsed', collapsed);
      document.body.classList.toggle('sidebar-collapsed', collapsed);
      localStorage.setItem(storageKey, String(collapsed));
    }

    applyCollapsedState(savedCollapsed);

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const nextState = !sidebarEl.classList.contains('is-collapsed');
        applyCollapsedState(nextState);
      });
    }

    // Mobile Off-Canvas Controls
    function closeMobileDrawer() {
      if (sidebarEl) sidebarEl.classList.remove('is-mobile-open');
      if (backdropEl) backdropEl.classList.remove('is-open');
    }

    function openMobileDrawer() {
      if (sidebarEl) sidebarEl.classList.add('is-mobile-open');
      if (backdropEl) backdropEl.classList.add('is-open');
    }

    if (backdropEl) {
      backdropEl.addEventListener('click', closeMobileDrawer);
    }

    document.querySelectorAll('[data-action="open-mobile-sidebar"]').forEach((btn) => {
      btn.addEventListener('click', openMobileDrawer);
    });

    // Close mobile drawer when a nav item is selected on mobile
    if (navEl) {
      navEl.addEventListener('click', (e) => {
        const link = e.target.closest('.sbl-nav-item');
        if (link && window.innerWidth <= 768) {
          closeMobileDrawer();
        }
      });
    }

    // Keyboard shortcut Ctrl+B and Escape for mobile drawer
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        applyCollapsedState(!sidebarEl.classList.contains('is-collapsed'));
      }
      if (e.key === 'Escape') {
        closeMobileDrawer();
      }
    });

    document.dispatchEvent(new CustomEvent('sbl:sidebar-ready'));
  }

  window.SANBONGLON_Sidebar = {
    init: initSidebar,
    renderIconSvg,
  };
})();
