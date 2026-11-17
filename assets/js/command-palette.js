/**
 * CAS M.Tech CSE — Command Palette (command-palette.js)
 * Evolution: Tier 5 / Surpassing Round 100 — High-Craft Academic Polish
 *
 * Keyboard shortcuts:
 *   - Ctrl + K / Cmd + K: Open Command Palette
 *   - / (forward slash): Open Command Palette (when not in input)
 *   - Esc: Close
 *   - Arrow Up / Arrow Down: Navigate items
 *   - Enter: Select / Jump
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.CommandPalette = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let allCourses = [];
  let overlayEl = null;
  let inputEl = null;
  let resultsContainerEl = null;
  let selectedIndex = 0;
  let currentResults = [];

  function init(courses) {
    allCourses = courses || [];
    createDOM();
    bindGlobalKeys();
  }

  function createDOM() {
    overlayEl = document.createElement('div');
    overlayEl.className = 'cmd-palette-overlay';
    overlayEl.id = 'command-palette-modal';
    overlayEl.setAttribute('role', 'dialog');
    overlayEl.setAttribute('aria-modal', 'true');
    overlayEl.setAttribute('aria-label', 'Command Palette for curriculum search');

    overlayEl.innerHTML = `
      <div class="cmd-palette-card">
        <div class="cmd-palette-search">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="search" class="cmd-palette-input" id="cmd-input" placeholder="Type a subject title, code, unit topic or curriculum action..." autocomplete="off" spellcheck="false">
          <span class="cmd-key-hint">ESC</span>
        </div>
        <div class="cmd-palette-results" id="cmd-results" role="listbox"></div>
        <div class="cmd-palette-footer">
          <span>Navigate with <kbd class="cmd-key-hint">↑</kbd> <kbd class="cmd-key-hint">↓</kbd></span>
          <span>Select with <kbd class="cmd-key-hint">↵ ENTER</kbd></span>
        </div>
      </div>
    `;

    document.body.appendChild(overlayEl);

    inputEl = overlayEl.querySelector('#cmd-input');
    resultsContainerEl = overlayEl.querySelector('#cmd-results');

    overlayEl.addEventListener('click', e => {
      if (e.target === overlayEl) close();
    });

    inputEl.addEventListener('input', e => {
      search(e.target.value.trim().toLowerCase());
    });

    inputEl.addEventListener('keydown', handleKeyNavigation);
  }

  function bindGlobalKeys() {
    window.addEventListener('keydown', e => {
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggle();
      } else if (e.key === '/' && !isInput) {
        e.preventDefault();
        open();
      } else if (e.key === 'Escape' && isOpen()) {
        e.preventDefault();
        close();
      }
    });
  }

  function isOpen() {
    return overlayEl && overlayEl.classList.contains('is-open');
  }

  function open() {
    if (!overlayEl) return;
    overlayEl.classList.add('is-open');
    inputEl.value = '';
    search('');
    setTimeout(() => inputEl.focus(), 50);
  }

  function close() {
    if (!overlayEl) return;
    overlayEl.classList.remove('is-open');
  }

  function toggle() {
    if (isOpen()) close();
    else open();
  }

  function search(query) {
    selectedIndex = 0;
    currentResults = [];

    // Static actions
    const staticActions = [
      {
        type: 'action',
        title: 'View Official AKTU CAS Syllabus (2021–22 PDF)',
        subtitle: 'https://cas.res.in/pdf/CSE-Syllabus%202021-22.pdf',
        badge: 'External PDF',
        url: 'https://cas.res.in/pdf/CSE-Syllabus%202021-22.pdf',
        external: true
      },
      {
        type: 'action',
        title: 'Open Tactile Study Docket & Timetable',
        subtitle: 'View queued subjects, unit checklists and download .ics',
        badge: 'Docket Drawer',
        action: () => {
          close();
          if (window.openDocketDrawer) window.openDocketDrawer();
        }
      },
      {
        type: 'action',
        title: 'Open Examination Countdown & Weekly Planner',
        subtitle: 'Calculate target pacing and preparation hours',
        badge: 'Study Planner',
        action: () => {
          close();
          if (window.openExamPlannerModal) window.openExamPlannerModal();
        }
      },
      {
        type: 'action',
        title: 'Launch Elective & Specialisation Matchmaker',
        subtitle: '2-Axis interactive visual explorer',
        badge: 'Visualiser',
        url: '#matchmaker'
      }
    ];

    let actionMatches = staticActions.filter(a => `${a.title} ${a.subtitle}`.toLowerCase().includes(query));

    // Course matches
    let courseMatches = allCourses.filter(c => {
      const matchText = `${c.code} ${c.title} ${c.category} ${c.tagline || ''} ${(c.units || []).map(u => u.title + ' ' + (u.topics || []).join(' ')).join(' ')}`.toLowerCase();
      return matchText.includes(query);
    }).map(c => ({
      type: 'course',
      code: c.code,
      title: c.title,
      subtitle: `Sem 0${c.semester} · ${c.category} · ${c.credits} Credits`,
      badge: c.hasGuide ? 'Guide Ready' : c.hasPyq ? 'PYQ Available' : 'Syllabus',
      url: `subject.html?code=${encodeURIComponent(c.code)}`
    }));

    currentResults = [...actionMatches, ...courseMatches];
    renderResults();
  }

  function renderResults() {
    if (currentResults.length === 0) {
      resultsContainerEl.innerHTML = `
        <div style="padding:2rem; text-align:center; color:var(--color-ink-muted); font-size:0.9rem;">
          No matching subjects or curriculum actions found.
        </div>
      `;
      return;
    }

    let html = '';
    let currentGroup = '';

    currentResults.forEach((item, index) => {
      const groupName = item.type === 'action' ? 'Curriculum Shortcuts' : 'Postgraduate Subjects';
      if (groupName !== currentGroup) {
        currentGroup = groupName;
        html += `<div class="cmd-result-group">${currentGroup}</div>`;
      }

      const isSelected = index === selectedIndex;
      html += `
        <div class="cmd-result-item ${isSelected ? 'is-selected' : ''}" data-index="${index}" role="option" aria-selected="${isSelected}">
          <div style="flex:1; overflow:hidden;">
            ${item.code ? `<span class="cmd-result-code">${item.code} — </span>` : ''}
            <span class="cmd-result-title">${item.title}</span>
            <div style="font-size:0.75rem; color:var(--color-ink-muted); margin-top:0.15rem; text-overflow:ellipsis; overflow:hidden; white-space:nowrap;">
              ${item.subtitle}
            </div>
          </div>
          <span class="cmd-result-badge">${item.badge}</span>
        </div>
      `;
    });

    resultsContainerEl.innerHTML = html;

    // Attach click listeners
    const items = resultsContainerEl.querySelectorAll('.cmd-result-item');
    items.forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.getAttribute('data-index'), 10);
        executeItem(currentResults[idx]);
      });
    });

    // Scroll selected into view if needed
    const selectedEl = resultsContainerEl.querySelector('.cmd-result-item.is-selected');
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: 'nearest' });
    }
  }

  function handleKeyNavigation(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = (selectedIndex + 1) % currentResults.length;
      renderResults();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = (selectedIndex - 1 + currentResults.length) % currentResults.length;
      renderResults();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (currentResults[selectedIndex]) {
        executeItem(currentResults[selectedIndex]);
      }
    }
  }

  function executeItem(item) {
    if (!item) return;
    close();
    if (item.action) {
      item.action();
    } else if (item.url) {
      if (item.external) {
        window.open(item.url, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = item.url;
      }
    }
  }

  return {
    init,
    open,
    close,
    toggle
  };
});
