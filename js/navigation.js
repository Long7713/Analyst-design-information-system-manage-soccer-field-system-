/**
 * SANBONGLON – Navigation & Active State Manager (js/navigation.js)
 * Coordinates shared component loading, active route highlighting, and SPA/MPA transitions.
 */

(function () {
  function highlightActiveNav(pageId) {
    const items = document.querySelectorAll('.sbl-nav-item');
    items.forEach((el) => {
      const id = el.getAttribute('data-nav-id');
      const isActive = id === pageId;
      el.classList.toggle('is-active', isActive);
      if (isActive) {
        el.setAttribute('aria-current', 'page');
      } else {
        el.removeAttribute('aria-current');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    const isStandalonePage = document.body.hasAttribute('data-standalone');
    if (!isStandalonePage && window.SANBONGLON_Sidebar) {
      window.SANBONGLON_Sidebar.init('#sblSidebarMount');
    }
  });

  window.SANBONGLON_Navigation = {
    highlightActiveNav,
  };
})();
