/**
 * CAS M.Tech CSE — Light Mode Enforcer (theme.js)
 * Permanently locks application to Apple Light Mode.
 * Removes dark mode overrides and guarantees zero color overlapping.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'mtech_cas_theme';

  function enforceLightMode() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}

    document.documentElement.setAttribute('data-theme', 'light');
    document.documentElement.style.colorScheme = 'light';

    // Update meta theme-color for browser address bar to Apple light canvas
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', '#f5f5f7');
    }

    // Hide or remove any lingering toggle buttons
    const buttons = document.querySelectorAll('.theme-toggle-btn');
    buttons.forEach(btn => {
      btn.style.display = 'none';
      btn.remove();
    });
  }

  // Enforce immediately
  enforceLightMode();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', enforceLightMode);
  }

  window.getPreferredTheme = function () {
    return 'light';
  };

  window.toggleTheme = function () {
    enforceLightMode();
  };
})();
