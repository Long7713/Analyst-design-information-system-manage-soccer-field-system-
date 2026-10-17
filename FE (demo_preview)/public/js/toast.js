/**
 * SANBONGLON — Shared Toast Notification Helper (js/toast.js)
 */

(function () {
  function showToast(message) {
    let container = document.getElementById('sblToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'sblToastContainer';
      container.className = 'sbl-toast-container';
      container.setAttribute('aria-live', 'polite');
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'sbl-toast animate-toast';
    toast.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-lime)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:2px;">
        <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
      </svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3400);
  }

  window.SANBONGLON_Toast = { show: showToast };
})();
