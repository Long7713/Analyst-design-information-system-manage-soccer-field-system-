/**
 * SANBONGLON — Main Application Initializer for Modular HTML Pages (js/app.js)
 * Waits for the reusable Sidebar component to load before binding page-level interactive controls.
 */

(function () {
  function initPageInteractions() {
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
  }

  document.addEventListener('sbl:sidebar-ready', initPageInteractions);
  document.addEventListener('DOMContentLoaded', () => {
    if (document.body.hasAttribute('data-standalone')) {
      initPageInteractions();
    }
  });
})();
