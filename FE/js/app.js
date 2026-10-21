/**
 * SANBONGLON – Main Application Initializer for Modular HTML Pages (js/app.js)
 * Waits for the reusable Sidebar component to load before binding page-level interactive controls.
 */

(function () {
  function formatVietnameseClock(date = new Date()) {
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const dayName = days[date.getDay()];
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    return `${dayName} ${hh}:${mm}:${ss}`;
  }

  function startTopBarClock() {
    const clockElements = document.querySelectorAll('#sblTopClock, [data-clock]');
    if (clockElements.length === 0) return;

    function update() {
      const formatted = formatVietnameseClock();
      clockElements.forEach((el) => {
        el.textContent = formatted;
      });
    }

    update();
    setInterval(update, 1000);
  }

  function initPageInteractions() {
    startTopBarClock();

    // Bind action buttons with data-toast attribute
    document.querySelectorAll('[data-toast]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const msg = btn.getAttribute('data-toast');
        if (msg && window.SANBONGLON_Toast) {
          window.SANBONGLON_Toast.show(msg);
        }
      });
    });

    // Bind segmented tab controls
    document.querySelectorAll('[data-tab-target]').forEach((tabBtn) => {
      tabBtn.addEventListener('click', () => {
        const group = tabBtn.closest('.sbl-segmented');
        if (group) {
          group.querySelectorAll('.sbl-segment-btn').forEach((b) => b.classList.remove('is-active'));
        }
        tabBtn.classList.add('is-active');

        const targetId = tabBtn.getAttribute('data-tab-target');
        if (targetId) {
          document.querySelectorAll('[data-tab-panel]').forEach((panel) => {
            panel.hidden = panel.getAttribute('data-tab-panel') !== targetId;
          });
        }
      });
    });

    // Bind live table search inputs
    document.querySelectorAll('[data-table-search]').forEach((input) => {
      input.addEventListener('input', (e) => {
        const q = (e.target.value || '').toLowerCase();
        const tableSelector = input.getAttribute('data-table-search');
        const rows = document.querySelectorAll(`${tableSelector} tbody tr`);
        rows.forEach((row) => {
          const text = (row.textContent || '').toLowerCase();
          row.style.display = text.includes(q) ? '' : 'none';
        });
      });
    });

    // Track mouse position for background spotlight
    window.addEventListener('mousemove', (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    }, { passive: true });
  }

  document.addEventListener('sbl:sidebar-ready', initPageInteractions);
  document.addEventListener('DOMContentLoaded', () => {
    initPageInteractions();
  });
})();
