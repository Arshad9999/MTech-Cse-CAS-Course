/**
 * CAS M.Tech CSE — Universal Theme Controller (theme.js)
 * Supports Apple-Inspired Light & Dark Mode with zero flicker and localStorage persistence.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'mtech_cas_theme';

  function getPreferredTheme() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {}

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.style.colorScheme = theme;

    // Update meta theme-color for browser address bar
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#000000' : '#f5f5f7');
    }

    // Update theme toggle buttons if in DOM
    const buttons = document.querySelectorAll('.theme-toggle-btn');
    buttons.forEach(btn => {
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      btn.innerHTML = theme === 'dark' ? '☀️' : '🌙';
    });

    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('theme:changed', { detail: { theme } }));
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || getPreferredTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  }

  // Initial immediate application to prevent flash
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  // Listen for OS system theme changes if user hasn't explicitly set a preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      try {
        if (!localStorage.getItem(STORAGE_KEY)) {
          applyTheme(e.matches ? 'dark' : 'light');
        }
      } catch (err) {}
    });
  }

  window.toggleTheme = toggleTheme;
  window.getPreferredTheme = getPreferredTheme;
})();
