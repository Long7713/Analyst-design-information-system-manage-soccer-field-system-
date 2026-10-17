/**
 * SANBONGLON — Shared Modal & Drawer Controller (js/modal.js)
 */

(function () {
  function openModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) {
      el.hidden = false;
      el.setAttribute('aria-hidden', 'false');
    }
  }

  function closeModal(modalId) {
    const el = document.getElementById(modalId);
    if (el) {
      el.hidden = true;
      el.setAttribute('aria-hidden', 'true');
    }
  }

  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-modal-open]');
    if (openBtn) {
      openModal(openBtn.getAttribute('data-modal-open'));
    }
    const closeBtn = e.target.closest('[data-modal-close]');
    if (closeBtn) {
      closeModal(closeBtn.getAttribute('data-modal-close'));
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.sbl-overlay-backdrop, .sbl-drawer-backdrop').forEach((el) => {
        el.hidden = true;
      });
    }
  });

  window.SANBONGLON_Modal = { open: openModal, close: closeModal };
})();
