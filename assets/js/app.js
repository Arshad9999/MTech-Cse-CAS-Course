/**
 * CAS M.Tech CSE — Application Controller (app.js)
 * Evolution: Round 65 (Peak UX) + High-Craft Academic Engineering
 * Architecture: Modular, Offline-First PWA, Indian English Nomenclature
 */

(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value || '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  let allCourses = [];
  let activeSemesterFilter = 'all';
  let activeCategoryFilter = 'all';
  let searchQuery = '';

  // --------------------------------------------------------------------------
  // SVG Domain Icons
  // --------------------------------------------------------------------------
  const domainIcons = {
    'theory': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><line x1="8.5" y1="7.5" x2="15.5" y2="7.5"/><line x1="7.5" y1="8.5" x2="10.5" y2="15.5"/><line x1="16.5" y1="8.5" x2="13.5" y2="15.5"/></svg>`,
    'ai-ml': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a4 4 0 0 1 4 4v1a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"/><circle cx="6" cy="16" r="3"/><circle cx="18" cy="16" r="3"/><circle cx="12" cy="20" r="2"/><line x1="6" y1="13" x2="10" y2="7"/><line x1="18" y1="13" x2="14" y2="7"/></svg>`,
    'security-networks': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="11" r="2"/></svg>`,
    'systems-ict': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>`
  };

  // --------------------------------------------------------------------------
  // Data Fetching
  // --------------------------------------------------------------------------
  async function loadData() {
    const depth = document.body.dataset.depth || '';
    try {
      const res = await fetch(depth + 'data/courses.json');
      if (res.ok) return await res.json();
    } catch (e) {}

    // Fallback to assets/catalog.json + course-data.json
    const catalog = await (await fetch(depth + 'assets/catalog.json')).json();
    return catalog.map(c => ({
      ...c,
      credits: c.code === 'MCSC-401' ? 16 : c.code === 'MCSC-302' ? 8 : c.code.endsWith('06') || c.code.endsWith('02') ? 2 : 4,
      domain: c.category.includes('Machine Learning') ? 'ai-ml' : c.category.includes('Cyber') ? 'security-networks' : 'theory',
      unitsCount: 4,
      estimatedHours: 36,
      hasGuide: !!c.guide,
      hasPyq: ['MCSC-101', 'MCSC-104', 'MMLC-201', 'MMLE-302', 'MCSC-301'].includes(c.code)
    }));
  }

  // --------------------------------------------------------------------------
  // Navigation & Footers
  // --------------------------------------------------------------------------
  function renderNav(depth = '') {
    return `
      <header class="topbar">
        <nav class="nav shell" aria-label="Main navigation">
          <a class="brand" href="${depth}index.html">CAS<span> / M.Tech CSE</span></a>
          <div class="navlinks">
            <a href="${depth}index.html#courses">Catalogue</a>
            <a href="${depth}index.html#matchmaker">Elective Matchmaker</a>
            <a href="${depth}index.html#study-loop">Study Loop</a>
            <a href="${depth}guides/index.html">Guides Directory</a>
            <button class="cmd-key-hint" onclick="window.CommandPalette && window.CommandPalette.open()" style="cursor:pointer; display:inline-flex; align-items:center; gap:0.3rem;">
              <span>Search</span> <kbd style="font-size:0.68rem; font-family:var(--font-mono);">⌘K</kbd>
            </button>
          </div>
        </nav>
      </header>
    `;
  }

  function renderFoot() {
    return `
      <footer class="footer">
        <div class="shell" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <strong>Centre for Advanced Studies · AKTU</strong><br>
            <span style="font-size:0.84rem;">Postgraduate Programme in Computer Science & Engineering (2021–22 Curriculum Scheme)</span>
          </div>
          <div style="font-size:0.84rem; color:var(--color-ink-muted);">
            Independent Academic Study Aid · Verify official requirements via <a href="https://cas.res.in" target="_blank" rel="noopener">cas.res.in ↗</a>
          </div>
        </div>
      </footer>
    `;
  }

  // --------------------------------------------------------------------------
  // Toast Notifications
  // --------------------------------------------------------------------------
  function showToast(message) {
    let toast = $('#cas-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'cas-toast';
      toast.className = 'cas-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-active');
    setTimeout(() => toast.classList.remove('is-active'), 3200);
  }
  window.showToast = showToast;

  // --------------------------------------------------------------------------
  // Global Subject Docket Toggle Hook
  // --------------------------------------------------------------------------
  window.toggleSubjectDocket = function (code, btn) {
    if (!window.StudyDocket) return;
    const added = window.StudyDocket.toggleDocket(code);
    if (btn) {
      if (added) {
        btn.classList.add('is-queued');
        btn.innerHTML = '✓ Queued';
      } else {
        btn.classList.remove('is-queued');
        btn.innerHTML = '+ Docket';
      }
    }
    updateAllDocketUI();
    showToast(added ? `Added ${code} to your Study Docket` : `Removed ${code} from your Study Docket`);
  };

  function updateAllDocketUI() {
    const list = window.StudyDocket ? window.StudyDocket.getDocket() : [];
    // Update floating trigger badge
    const badge = $('#docket-trigger-count');
    if (badge) badge.textContent = list.length;

    // Update hero card telemetry if present
    const heroDocketCount = $('#hero-docket-count');
    if (heroDocketCount) heroDocketCount.textContent = list.length;

    // Update subject card toggle buttons
    $$('.docket-toggle-btn').forEach(btn => {
      const code = btn.getAttribute('data-code');
      if (code) {
        const isQueued = list.includes(code);
        btn.classList.toggle('is-queued', isQueued);
        btn.innerHTML = isQueued ? '✓ Queued' : '+ Docket';
      }
    });

    renderDocketDrawerContents();
  }

  // --------------------------------------------------------------------------
  // Phase 1: Sticky Filter & Search Ribbon
  // --------------------------------------------------------------------------
  function renderStickyRibbon() {
    const semCounts = { all: allCourses.length, 1: 0, 2: 0, 3: 0, 4: 0 };
    allCourses.forEach(c => {
      if (semCounts[c.semester] !== undefined) semCounts[c.semester]++;
    });

    return `
      <div class="sticky-ribbon-container" id="sticky-ribbon">
        <div class="shell sticky-ribbon">
          <!-- Semester Quick Jump Pills -->
          <div class="filter-group-pills" role="tablist" aria-label="Semester selection">
            <button class="filter-pill is-active" data-sem="all" role="tab">All Semesters <span class="filter-pill-counter">${semCounts.all}</span></button>
            <button class="filter-pill" data-sem="1" role="tab">Sem 01 <span class="filter-pill-counter">${semCounts[1]}</span></button>
            <button class="filter-pill" data-sem="2" role="tab">Sem 02 <span class="filter-pill-counter">${semCounts[2]}</span></button>
            <button class="filter-pill" data-sem="3" role="tab">Sem 03 <span class="filter-pill-counter">${semCounts[3]}</span></button>
            <button class="filter-pill" data-sem="4" role="tab">Sem 04 <span class="filter-pill-counter">${semCounts[4]}</span></button>
          </div>

          <!-- Status / Category Filter Pills -->
          <div class="filter-group-pills" role="radiogroup" aria-label="Course category filters">
            <button class="filter-pill is-active" data-cat="all">All Types</button>
            <button class="filter-pill" data-cat="core">Core Only</button>
            <button class="filter-pill" data-cat="elective">Electives</button>
            <button class="filter-pill" data-cat="guide">Guide Ready</button>
            <button class="filter-pill" data-cat="pyq">PYQs Available</button>
          </div>

          <!-- Instant Search Box -->
          <div class="ribbon-search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="search" class="ribbon-search-input" id="ribbon-search" placeholder="Filter subjects or topics..." aria-label="Search programme subjects">
            <button class="ribbon-search-clear" id="ribbon-clear" aria-label="Clear search">×</button>
          </div>
        </div>
      </div>
    `;
  }

  function bindStickyRibbon() {
    const ribbon = $('#sticky-ribbon');
    if (!ribbon) return;

    // Scroll listener for sticky elevation
    window.addEventListener('scroll', () => {
      const top = ribbon.getBoundingClientRect().top;
      if (top <= 67) {
        ribbon.classList.add('is-pinned');
      } else {
        ribbon.classList.remove('is-pinned');
      }
    }, { passive: true });

    // Semester pills
    $$('#sticky-ribbon button[data-sem]').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('#sticky-ribbon button[data-sem]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        activeSemesterFilter = btn.getAttribute('data-sem');
        renderFilteredCatalogue();
      });
    });

    // Category pills
    $$('#sticky-ribbon button[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('#sticky-ribbon button[data-cat]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        activeCategoryFilter = btn.getAttribute('data-cat');
        renderFilteredCatalogue();
      });
    });

    // Search input
    const input = $('#ribbon-search');
    const clearBtn = $('#ribbon-clear');
    if (input) {
      input.addEventListener('input', e => {
        searchQuery = e.target.value.trim().toLowerCase();
        if (clearBtn) clearBtn.classList.toggle('is-visible', searchQuery.length > 0);
        renderFilteredCatalogue();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (input) input.value = '';
        searchQuery = '';
        clearBtn.classList.remove('is-visible');
        renderFilteredCatalogue();
      });
    }
  }

  // --------------------------------------------------------------------------
  // Phase 1: Upgraded Hero Companion Card
  // --------------------------------------------------------------------------
  function upgradeHeroCompanionCard() {
    const panel = $('.hero-panel');
    if (!panel) return;

    const totalSubjects = allCourses.length;
    const guidesReady = allCourses.filter(c => c.hasGuide).length;
    const pyqsCount = allCourses.filter(c => c.hasPyq).length;
    const docketCount = window.StudyDocket ? window.StudyDocket.getDocket().length : 0;
    const lastCourse = window.StudyDocket ? window.StudyDocket.getLastCourse() : null;

    const resumeHtml = lastCourse
      ? `<a class="resume-subject-chip" href="subject.html?code=${encodeURIComponent(lastCourse.code)}">
           <span>Resume: <strong>${esc(lastCourse.code)}</strong></span>
           <span>↗</span>
         </a>`
      : `<span style="font-size:0.75rem; color:#476e54; font-weight:700;">CHOOSE A SUBJECT TO COMMENCE</span>`;

    panel.className = 'hero-panel-upgraded';
    panel.innerHTML = `
      <div>
        <span class="panel-label">ACADEMIC STUDY COMPANION · CAS</span>
        <div class="panel-mark" style="margin: 0.4rem 0;">01 <span>—</span> 04</div>
        <p style="font-size:1.15rem; margin:0 0 1rem; color: #173e23; font-weight:600;">
          Four Semesters. 42 Subjects.<br>One Unified Learning Architecture.
        </p>

        <!-- Live Telemetry -->
        <div class="hero-telemetry-grid">
          <div class="telemetry-cell">
            <strong>${totalSubjects}</strong>
            <span>Total Subjects</span>
          </div>
          <div class="telemetry-cell">
            <strong>${guidesReady}</strong>
            <span>Guides Ready</span>
          </div>
          <div class="telemetry-cell">
            <strong>${pyqsCount}</strong>
            <span>PYQ Verified</span>
          </div>
          <div class="telemetry-cell">
            <strong id="hero-docket-count">${docketCount}</strong>
            <span>In Study Docket</span>
          </div>
        </div>
      </div>

      <div>
        ${resumeHtml}
        <div class="panel-bottom" style="margin-top:1.2rem;">
          <span>CAS AKTU 2021–22 SCHEME</span>
          <span>AUTONOMOUS CURRICULUM ↘</span>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // Phase 3: Curated Study Path Presets ("Try This Path")
  // --------------------------------------------------------------------------
  function renderPathPresets() {
    return `
      <div class="preset-paths-strip">
        <div class="preset-paths-header">
          <div>
            <h4>Curated Academic Paths</h4>
            <span>One-click syllabus bundles tailored for typical postgraduate workflows</span>
          </div>
          <span style="font-size:0.78rem; font-weight:700; color:var(--color-accent);">SELECT A PRESET TO POPULATE DOCKET</span>
        </div>
        <div class="preset-buttons-row">
          <button class="preset-btn" data-preset="exam-survival">
            <strong>7-Day Exam Survival</strong>
            <span>High-weightage core subjects with verified PYQs</span>
          </button>
          <button class="preset-btn" data-preset="gate-parallel">
            <strong>GATE + M.Tech Parallel</strong>
            <span>Algorithms, Discrete Maths, Networks & Probability</span>
          </button>
          <button class="preset-btn" data-preset="research-track">
            <strong>Research & Dissertation</strong>
            <span>Independent Study I & II, ML, Thesis I & II</span>
          </button>
          <button class="preset-btn" data-preset="cyber-specialist">
            <strong>Cyber Security Track</strong>
            <span>Crypto, InfoSec, Ethical Hacking & Forensics</span>
          </button>
        </div>
      </div>
    `;
  }

  function bindPathPresets() {
    const presets = {
      'exam-survival': ['MCSC-101', 'MCSC-104', 'MMLC-201', 'MMLE-302', 'MCSC-301'],
      'gate-parallel': ['MCSC-101', 'MCSC-102', 'MCSC-103', 'MCSC-105', 'MCSE-201'],
      'research-track': ['MCSC-106', 'MCSC-202', 'MCSC-302', 'MCSC-401', 'MCSC-104'],
      'cyber-specialist': ['MCySC-201', 'MCySC-202', 'MCySE-204', 'MCySC-301', 'MCySE-301']
    };

    $$('.preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-preset');
        const codes = presets[key] || [];
        let added = 0;
        codes.forEach(c => {
          if (window.StudyDocket && window.StudyDocket.addToDocket(c)) added++;
        });
        updateAllDocketUI();
        showToast(`Loaded "${btn.querySelector('strong').textContent}" into Study Docket`);
      });
    });
  }

  // --------------------------------------------------------------------------
  // Catalogue Rendering with Rich Telemetry
  // --------------------------------------------------------------------------
  function renderSubjectCard(c) {
    const isQueued = window.StudyDocket && window.StudyDocket.isInDocket(c.code);
    const domainKey = c.domain || 'theory';
    const domainSvg = domainIcons[domainKey] || domainIcons['theory'];
    const domainLabel = domainKey === 'ai-ml' ? 'AI & Machine Learning'
      : domainKey === 'security-networks' ? 'Security & Networks'
      : domainKey === 'theory' ? 'Theory & Discrete'
      : 'Systems & ICT';

    return `
      <article class="catalog-card" style="border-top: 3px solid ${domainKey === 'ai-ml' ? '#0284c7' : domainKey === 'security-networks' ? '#b91c1c' : domainKey === 'theory' ? '#6d28d9' : '#047857'};">
        <div class="catalog-card-header">
          <span class="catalog-code">${esc(c.code)}</span>
          <span class="domain-badge domain-${domainKey}">
            ${domainSvg}
            ${domainLabel}
          </span>
        </div>

        <strong><a href="subject.html?code=${encodeURIComponent(c.code)}" style="text-decoration:none; color:inherit;">${esc(c.title)}</a></strong>
        <span class="catalog-category">${esc(c.category)}</span>

        <!-- Telemetry Row -->
        <div class="course-telemetry-row">
          <span class="telemetry-pill">${c.credits} Credits</span>
          <span class="telemetry-pill">${c.unitsCount || 4} Units</span>
          <span class="telemetry-pill">~${c.estimatedHours || 36} hrs prep</span>
          ${c.hasPyq ? '<span class="telemetry-pill has-pyq">PYQ Papers</span>' : ''}
          ${c.hasGuide ? '<span class="telemetry-pill has-guide">Guide Ready</span>' : ''}
        </div>

        <!-- Action Bar -->
        <div class="card-action-bar">
          <button class="docket-toggle-btn ${isQueued ? 'is-queued' : ''}" 
                  data-code="${c.code}" 
                  onclick="window.toggleSubjectDocket('${c.code}', this)"
                  aria-label="Toggle ${c.code} in study docket">
            ${isQueued ? '✓ Queued' : '+ Add to Docket'}
          </button>
          <a class="card-view-link" href="subject.html?code=${encodeURIComponent(c.code)}">
            View Syllabus ↗
          </a>
        </div>
      </article>
    `;
  }

  function renderFilteredCatalogue() {
    const container = $('#semesters');
    if (!container) return;

    const descriptions = [
      'Foundations, mathematical models and research methodology',
      'Advanced architectures, core specialisations and laboratory practice',
      'Specialised electives, comprehensive seminar and dissertation phase I',
      'Final dissertation phase II, thesis defence and publication output'
    ];

    let totalMatches = 0;
    const targetSemesters = activeSemesterFilter === 'all' ? [1, 2, 3, 4] : [parseInt(activeSemesterFilter, 10)];

    const html = targetSemesters.map(sem => {
      const semCourses = allCourses.filter(c => {
        if (c.semester !== sem) return false;

        // Category filter
        if (activeCategoryFilter === 'core' && !c.category.toLowerCase().includes('core')) return false;
        if (activeCategoryFilter === 'elective' && !c.category.toLowerCase().includes('elective')) return false;
        if (activeCategoryFilter === 'guide' && !c.hasGuide) return false;
        if (activeCategoryFilter === 'pyq' && !c.hasPyq) return false;

        // Search query
        if (searchQuery) {
          const matchTarget = `${c.code} ${c.title} ${c.category} ${(c.units || []).map(u => u.title).join(' ')}`.toLowerCase();
          if (!matchTarget.includes(searchQuery)) return false;
        }

        return true;
      });

      totalMatches += semCourses.length;

      if (semCourses.length === 0) {
        return `
          <section class="semester" id="semester-${sem}">
            <div class="semester-heading">
              <div>
                <span class="semester-number">0${sem}</span>
                <div>
                  <div class="eyebrow">Semester ${sem}</div>
                  <h3>${descriptions[sem - 1]}</h3>
                </div>
              </div>
              <span class="semester-count">0 subjects match criteria</span>
            </div>
            <p class="empty">No matching subjects found in Semester ${sem} with current filters.</p>
          </section>
        `;
      }

      return `
        <section class="semester" id="semester-${sem}">
          <div class="semester-heading">
            <div>
              <span class="semester-number">0${sem}</span>
              <div>
                <div class="eyebrow">Semester ${sem}</div>
                <h3>${descriptions[sem - 1]}</h3>
              </div>
            </div>
            <span class="semester-count">${semCourses.length} ${semCourses.length === 1 ? 'subject' : 'subjects'}</span>
          </div>
          <div class="catalog-grid">
            ${semCourses.map(renderSubjectCard).join('')}
          </div>
        </section>
      `;
    }).join('');

    container.innerHTML = html;

    const statusEl = $('#search-status');
    if (statusEl) {
      statusEl.textContent = `${totalMatches} matching subjects across selected criteria.`;
    }
  }

  // --------------------------------------------------------------------------
  // Phase 1: High-Contrast Study Loop Section
  // --------------------------------------------------------------------------
  function renderStudyLoop() {
    return `
      <section class="study-loop-container" id="study-loop">
        <div class="study-loop-header">
          <div>
            <div class="eyebrow" style="color:var(--color-loop-accent);">Postgraduate Learning Methodology</div>
            <h2>Understand. Apply. Recall.</h2>
          </div>
          <p>
            An evidence-based study loop tailored for postgraduate engineering examinations and research problem formulations.
          </p>
        </div>

        <div class="study-loop-cards">
          <div class="study-loop-step">
            <span class="study-loop-step-num">01</span>
            <h3>Understand with Syllabus</h3>
            <p>
              Deconstruct every syllabus unit into exact mathematical definitions, architectural invariants, and theoretical bounds. Avoid shallow memorisation.
            </p>
          </div>

          <div class="study-loop-step">
            <span class="study-loop-step-num">02</span>
            <h3>Apply with Worked Examples</h3>
            <p>
              Work through step-by-step algorithms, protocol packet exchanges, and numerical formulations. Test your derivations against edge cases.
            </p>
          </div>

          <div class="study-loop-step">
            <span class="study-loop-step-num">03</span>
            <h3>Recall with Past Papers</h3>
            <p>
              Test active recall using verified previous year question papers (PYQs). Benchmark yourself against end-semester evaluation patterns.
            </p>
          </div>
        </div>

        <div class="study-loop-footer">
          <p class="notice">
            Independent postgraduate study portal conforming to the Centre for Advanced Studies, AKTU 2021–22 curriculum scheme.
          </p>
          <a class="button" href="https://cas.res.in/Mtechcse.html" target="_blank" rel="noopener" style="background:var(--color-loop-accent); color:var(--color-loop-bg); font-weight:800;">
            About CAS Faculty & Research ↗
          </a>
        </div>
      </section>
    `;
  }

  // --------------------------------------------------------------------------
  // Phase 2: Tactile Study Docket Drawer & Actions
  // --------------------------------------------------------------------------
  function setupStudyDocketUI() {
    // 1. Floating Trigger Button
    const trigger = document.createElement('button');
    trigger.className = 'docket-floating-trigger';
    trigger.id = 'docket-floating-trigger';
    trigger.setAttribute('aria-label', 'Open Study Docket Queue');
    trigger.innerHTML = `
      <span>📑 Study Docket</span>
      <span class="docket-badge-count" id="docket-trigger-count">0</span>
    `;
    document.body.appendChild(trigger);

    // 2. Drawer Overlay & Panel
    const drawerOverlay = document.createElement('div');
    drawerOverlay.className = 'docket-drawer-overlay';
    drawerOverlay.id = 'docket-drawer-overlay';
    drawerOverlay.innerHTML = `
      <div class="docket-drawer" role="dialog" aria-modal="true" aria-label="Study Docket and Revision Timetable">
        <div class="docket-receipt-head">
          <div class="docket-receipt-meta">
            <span class="docket-receipt-brand">CAS · M.TECH CSE DOCKET</span>
            <button class="docket-close-btn" id="docket-close-btn" aria-label="Close Docket">×</button>
          </div>
          <h2 class="docket-title">Revision Timetable</h2>
          <div class="docket-stats-bar">
            <span>Enrolled: <strong id="docket-total-courses">0 Subjects</strong></span>
            <span>Credits: <strong id="docket-total-credits">0 Credits</strong></span>
          </div>
        </div>

        <div class="docket-scroll-area" id="docket-items-scroll"></div>

        <div class="docket-receipt-footer">
          <div class="docket-action-buttons">
            <button class="docket-btn" id="docket-download-ics">
              📅 Download .ics Timetable
            </button>
            <button class="docket-btn docket-btn-secondary" id="docket-open-planner">
              ⏱ Exam Pacing Planner
            </button>
          </div>
          <div class="docket-action-buttons">
            <button class="docket-btn docket-btn-secondary" id="docket-show-qr">
              📱 Mobile QR Handoff
            </button>
            <button class="docket-btn docket-btn-secondary" id="docket-print-sheet">
              🖨 Print / Export PDF
            </button>
          </div>
          <button class="docket-item-remove" id="docket-clear-btn" style="margin:0 auto; padding:0.4rem 1rem;">
            Clear All Subjects
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(drawerOverlay);

    // Bind triggers
    trigger.addEventListener('click', openDocketDrawer);
    $('#docket-close-btn').addEventListener('click', closeDocketDrawer);
    drawerOverlay.addEventListener('click', e => {
      if (e.target === drawerOverlay) closeDocketDrawer();
    });

    // Action button bindings
    $('#docket-download-ics').addEventListener('click', () => {
      if (window.StudyDocket) window.StudyDocket.downloadStudyTimetable(allCourses);
    });

    $('#docket-open-planner').addEventListener('click', () => {
      closeDocketDrawer();
      openExamPlannerModal();
    });

    $('#docket-show-qr').addEventListener('click', () => {
      openMobileQRModal();
    });

    $('#docket-print-sheet').addEventListener('click', () => {
      window.print();
    });

    $('#docket-clear-btn').addEventListener('click', () => {
      if (confirm('Clear all subjects from your Study Docket?')) {
        if (window.StudyDocket) window.StudyDocket.clearDocket();
        updateAllDocketUI();
        showToast('Study Docket cleared');
      }
    });

    window.openDocketDrawer = openDocketDrawer;
    window.closeDocketDrawer = closeDocketDrawer;
  }

  function openDocketDrawer() {
    const overlay = $('#docket-drawer-overlay');
    if (overlay) {
      renderDocketDrawerContents();
      overlay.classList.add('is-open');
    }
  }

  function closeDocketDrawer() {
    const overlay = $('#docket-drawer-overlay');
    if (overlay) overlay.classList.remove('is-open');
  }

  function renderDocketDrawerContents() {
    const listCodes = window.StudyDocket ? window.StudyDocket.getDocket() : [];
    const queuedCourses = allCourses.filter(c => listCodes.includes(c.code));
    const scrollArea = $('#docket-items-scroll');
    const coursesCountEl = $('#docket-total-courses');
    const creditsCountEl = $('#docket-total-credits');

    let totalCredits = 0;
    queuedCourses.forEach(c => totalCredits += (c.credits || 0));

    if (coursesCountEl) coursesCountEl.textContent = `${queuedCourses.length} Subjects`;
    if (creditsCountEl) creditsCountEl.textContent = `${totalCredits} Credits`;

    if (!scrollArea) return;

    if (queuedCourses.length === 0) {
      scrollArea.innerHTML = `
        <div class="docket-empty-state">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="1.5">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="12" y1="18" x2="12" y2="12"></line>
            <line x1="9" y1="15" x2="15" y2="15"></line>
          </svg>
          <strong style="display:block; font-size:1.1rem; color:var(--color-ink);">Your Study Docket is Empty</strong>
          <p>
            Click <strong>+ Add to Docket</strong> on any subject card to curate your personalized semester study and revision timetable.
          </p>
        </div>
      `;
      return;
    }

    scrollArea.innerHTML = queuedCourses.map(c => {
      const units = c.units || [
        { unitNumber: 1, title: 'Unit 1: Foundations' },
        { unitNumber: 2, title: 'Unit 2: Architectures' },
        { unitNumber: 3, title: 'Unit 3: Algorithms' },
        { unitNumber: 4, title: 'Unit 4: Applications' }
      ];

      return `
        <div class="docket-item-card">
          <div class="docket-item-head">
            <span class="docket-item-code">${esc(c.code)} · Sem 0${c.semester}</span>
            <button class="docket-item-remove" onclick="window.toggleSubjectDocket('${c.code}')">Remove</button>
          </div>
          <div class="docket-item-title">${esc(c.title)}</div>
          <div style="font-size:0.75rem; color:var(--color-ink-muted);">
            ${c.credits} Credits · ~${c.estimatedHours || 36} hrs prep
          </div>

          <!-- Unit Checkboxes -->
          <div class="docket-unit-checklist">
            ${units.map(u => {
              const isChecked = window.StudyDocket ? window.StudyDocket.isUnitChecked(c.code, u.unitNumber) : false;
              return `
                <label class="docket-unit-label ${isChecked ? 'is-checked' : ''}">
                  <input type="checkbox" class="docket-unit-checkbox" 
                         ${isChecked ? 'checked' : ''} 
                         onchange="handleUnitCheck('${c.code}', ${u.unitNumber}, this)">
                  <span>Unit ${u.unitNumber}: ${esc(u.title)}</span>
                </label>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  window.handleUnitCheck = function (code, unitNum, checkbox) {
    if (window.StudyDocket) {
      const checked = window.StudyDocket.toggleUnit(code, unitNum);
      checkbox.parentElement.classList.toggle('is-checked', checked);
    }
  };

  // --------------------------------------------------------------------------
  // Phase 2: Examination Countdown & Weekly Planner Modal
  // --------------------------------------------------------------------------
  function setupExamPlannerModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'exam-planner-modal';
    modal.innerHTML = `
      <div class="modal-card" role="dialog" aria-modal="true" aria-label="End-Semester Examination Countdown and Planner">
        <div class="modal-header">
          <div>
            <div class="eyebrow">Academic Pacing Engine</div>
            <h2>End-Semester Examination Planner</h2>
          </div>
          <button class="docket-close-btn" id="planner-close-btn" aria-label="Close planner">×</button>
        </div>

        <div class="planner-controls-grid">
          <div class="planner-field">
            <label for="planner-exam-date">Target Examination Date</label>
            <input type="date" class="planner-input" id="planner-exam-date">
          </div>
          <div class="planner-field">
            <label for="planner-daily-hours">Daily Dedicated Study Hours</label>
            <input type="number" class="planner-input" id="planner-daily-hours" value="2.5" min="1" max="10" step="0.5">
          </div>
        </div>

        <div class="planner-results-banner">
          <div class="planner-metrics">
            <div class="planner-metric">
              <strong id="metric-days">--</strong>
              <span>Days Remaining</span>
            </div>
            <div class="planner-metric">
              <strong id="metric-total-hours">--</strong>
              <span>Total Available Hours</span>
            </div>
            <div class="planner-metric">
              <strong id="metric-pace">--</strong>
              <span>Units / Week Pace</span>
            </div>
          </div>
        </div>

        <h3 style="font-size:1.15rem; margin:1.2rem 0 0.5rem; color:var(--color-accent);">Unit-Wise Pacing Breakdown</h3>
        <p style="font-size:0.84rem; color:var(--color-ink-muted); margin:0 0 1rem;">
          Calculated for all subjects currently enrolled in your Study Docket.
        </p>

        <table class="pacing-schedule-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Units</th>
              <th>Est. Hours</th>
              <th>Target Hours/Sub</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="planner-table-body"></tbody>
        </table>
      </div>
    `;
    document.body.appendChild(modal);

    // Default target date: 45 days from now (or next upcoming AKTU exam session)
    const defDate = new Date();
    defDate.setDate(defDate.getDate() + 45);
    const dateInput = $('#planner-exam-date');
    if (dateInput) {
      dateInput.value = defDate.toISOString().split('T')[0];
    }

    $('#planner-close-btn').addEventListener('click', closeExamPlannerModal);
    modal.addEventListener('click', e => {
      if (e.target === modal) closeExamPlannerModal();
    });

    $('#planner-exam-date').addEventListener('change', updateExamPlannerCalculations);
    $('#planner-daily-hours').addEventListener('input', updateExamPlannerCalculations);

    window.openExamPlannerModal = openExamPlannerModal;
    window.closeExamPlannerModal = closeExamPlannerModal;
  }

  function openExamPlannerModal() {
    const modal = $('#exam-planner-modal');
    if (modal) {
      modal.classList.add('is-open');
      updateExamPlannerCalculations();
    }
  }

  function closeExamPlannerModal() {
    const modal = $('#exam-planner-modal');
    if (modal) modal.classList.remove('is-open');
  }

  function updateExamPlannerCalculations() {
    const dateInput = $('#planner-exam-date');
    const hoursInput = $('#planner-daily-hours');
    if (!dateInput || !hoursInput || !window.StudyDocket) return;

    const targetDateStr = dateInput.value;
    const dailyHours = parseFloat(hoursInput.value) || 2;

    const listCodes = window.StudyDocket.getDocket();
    const queuedCourses = allCourses.filter(c => listCodes.includes(c.code));

    const pacing = window.StudyDocket.calculateExamPacing(targetDateStr, dailyHours, queuedCourses);

    $('#metric-days').textContent = pacing.daysRemaining;
    $('#metric-total-hours').textContent = `${pacing.totalAvailableHours} hrs`;
    $('#metric-pace').textContent = `${pacing.paceUnitsPerWeek} Units/wk`;

    const tableBody = $('#planner-table-body');
    if (tableBody) {
      if (queuedCourses.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:var(--color-ink-muted);">Add subjects to your Study Docket to calculate pacing.</td></tr>`;
        return;
      }

      tableBody.innerHTML = queuedCourses.map(c => `
        <tr>
          <td><strong>${c.code}</strong> — ${esc(c.title)}</td>
          <td>${c.unitsCount || 4} Units</td>
          <td>~${c.estimatedHours || 36} hrs</td>
          <td>${pacing.hoursPerSubject} hrs</td>
          <td><span style="font-weight:700; color:${pacing.feasible ? 'var(--color-emerald)' : '#b45309'};">${pacing.feasible ? '✓ On Track' : '⚡ Intensive'}</span></td>
        </tr>
      `).join('');
    }
  }

  // --------------------------------------------------------------------------
  // Phase 2: Mobile QR Revision Handoff Modal
  // --------------------------------------------------------------------------
  function setupMobileQRModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.id = 'mobile-qr-modal';
    modal.innerHTML = `
      <div class="modal-card" style="width:min(440px, 94vw);" role="dialog" aria-modal="true" aria-label="Mobile Revision QR Code">
        <div class="modal-header">
          <div>
            <div class="eyebrow">Instant Mobile Handoff</div>
            <h2>Scan Revision Sheet</h2>
          </div>
          <button class="docket-close-btn" id="qr-close-btn" aria-label="Close QR">×</button>
        </div>
        <div class="qr-modal-body">
          <div class="qr-code-display" id="qr-svg-target"></div>
          <p class="qr-instructions">
            Scan this QR code with your mobile camera to immediately open your curated study docket and syllabus guides on your phone or tablet.
          </p>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    $('#qr-close-btn').addEventListener('click', closeMobileQRModal);
    modal.addEventListener('click', e => {
      if (e.target === modal) closeMobileQRModal();
    });

    window.openMobileQRModal = openMobileQRModal;
    window.closeMobileQRModal = closeMobileQRModal;
  }

  function openMobileQRModal() {
    const modal = $('#mobile-qr-modal');
    const target = $('#qr-svg-target');
    if (!modal || !target || !window.StudyDocket) return;

    // Generate QR using current window location or curated URL
    const url = window.location.href;
    target.innerHTML = window.StudyDocket.generateQRCodeSVG(url, 220);
    modal.classList.add('is-open');
  }

  function closeMobileQRModal() {
    const modal = $('#mobile-qr-modal');
    if (modal) modal.classList.remove('is-open');
  }

  // --------------------------------------------------------------------------
  // Home Page Main Entry Point
  // --------------------------------------------------------------------------
  async function initHomePage() {
    allCourses = await loadData();
    if (window.StudyDocket) window.StudyDocket.setCourses(allCourses);

    // 1. Navigation & Sticky Ribbon
    $('#nav').innerHTML = renderNav();
    $('#foot').innerHTML = renderFoot();

    // 2. Insert Sticky Ribbon directly under Hero
    const heroSection = $('.portal-hero');
    if (heroSection) {
      heroSection.insertAdjacentHTML('afterend', renderStickyRibbon());
      bindStickyRibbon();
    }

    // 3. Upgrade Hero Companion Card
    upgradeHeroCompanionCard();

    // 4. Insert Curated Study Path Presets right before #courses
    const coursesSection = $('#courses');
    if (coursesSection) {
      const heading = coursesSection.querySelector('.section-head');
      if (heading) {
        heading.insertAdjacentHTML('afterend', renderPathPresets());
        bindPathPresets();
      }
    }

    // 5. Render Catalogue
    renderFilteredCatalogue();

    // 6. Insert Interactive Track Matchmaker right before #study-path
    const studyPathSection = $('#study-path');
    if (studyPathSection) {
      const matchmakerHtml = `
        <section class="section shell matchmaker-section" id="matchmaker">
          <div class="section-head">
            <div>
              <div class="eyebrow">Academic Direction & Electives</div>
              <h2>Interactive Track Matchmaker</h2>
            </div>
            <p>
              Navigate the 2-axis curriculum plane to align your research interests with specialised CAS electives across all semesters.
            </p>
          </div>
          <div id="matchmaker-root"></div>
        </section>
      `;
      studyPathSection.insertAdjacentHTML('beforebegin', matchmakerHtml);

      if (window.TrackMatchmaker) {
        window.TrackMatchmaker.init('#matchmaker-root', allCourses);
      }
    }

    // 7. Upgrade Study Loop Section
    if (studyPathSection) {
      studyPathSection.innerHTML = renderStudyLoop();
    }

    // 8. Setup Interactive Docket Drawer, Planner Modal & QR Modal
    setupStudyDocketUI();
    setupExamPlannerModal();
    setupMobileQRModal();

    // 9. Initialize Command Palette
    if (window.CommandPalette) {
      window.CommandPalette.init(allCourses);
    }

    // 10. Update UI states from localStorage
    updateAllDocketUI();

    // 11. Register Service Worker for Offline Campus Use
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
      navigator.serviceWorker.register('sw.js').catch(err => {
        console.warn('Service worker registration failed:', err);
      });
    }
  }

  // --------------------------------------------------------------------------
  // Subject Page Controller (subject.html)
  // --------------------------------------------------------------------------
  async function initSubjectPage() {
    allCourses = await loadData();
    if (window.StudyDocket) window.StudyDocket.setCourses(allCourses);

    $('#nav').innerHTML = renderNav();
    $('#foot').innerHTML = renderFoot();

    const code = new URLSearchParams(location.search).get('code');
    const selected = allCourses.find(c => c.code === code);

    if (!selected) {
      $('#subject').innerHTML = `
        <div style="padding:4rem 0;">
          <h1>Subject not found</h1>
          <p>The requested course code was not located in the 2021–22 curriculum catalogue.</p>
          <a class="button" href="index.html#courses">Explore subjects</a>
        </div>
      `;
      return;
    }

    document.title = `${selected.code} · ${selected.title} — CAS M.Tech CSE`;

    // Persist as last viewed course for hero companion resume button
    if (window.StudyDocket) {
      window.StudyDocket.setLastCourse(selected.code, selected.title);
    }

    // Load additional study assets
    let guides = {}, papers = {}, topics = {};
    try {
      const [g, p, t] = await Promise.all([
        fetch('assets/featured-guides.json').then(r => r.json()).catch(() => ({})),
        fetch('assets/related-papers.json').then(r => r.json()).catch(() => ({})),
        fetch('assets/subject-topics.json').then(r => r.json()).catch(() => ({}))
      ]);
      guides = g;
      papers = p;
      topics = t;
    } catch (e) {}

    const isQueued = window.StudyDocket && window.StudyDocket.isInDocket(selected.code);
    const domainKey = selected.domain || 'theory';
    const domainSvg = domainIcons[domainKey] || domainIcons['theory'];

    const notes = guides[code] || [];
    const paper = papers[code];
    const rawTopics = topics[code] || [];

    // Render structured units
    const unitsHtml = (selected.units || []).map(u => `
      <article class="module">
        <span class="eyebrow">Unit 0${u.unitNumber}</span>
        <h3 style="margin:0.3rem 0 0.6rem;">${esc(u.title)}</h3>
        <p style="color:var(--color-ink-muted); margin-bottom:0.6rem;">${esc(u.checkpoint)}</p>
        <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
          ${(u.topics || []).map(t => `<span class="telemetry-pill">${esc(t)}</span>`).join('')}
        </div>
      </article>
    `).join('');

    // Previous year examination questions
    const pyqHtml = paper ? `
      <section class="subject-box papers" style="margin-top:1.5rem;">
        <span class="eyebrow" style="color:var(--color-gold);">Verified Examination Preparation</span>
        <h2>Questions from Related AKTU M.Tech Examination</h2>
        <p>${esc(paper.source)}. Paraphrased study explanations for end-semester preparation.</p>
        <a class="source-link" href="${esc(paper.url)}" target="_blank" rel="noopener">View Source Examination Paper ↗</a>
        <div class="question-list" style="margin-top:1rem;">
          ${paper.questions.map(q => `
            <details>
              <summary>${esc(q.question)}</summary>
              <p style="padding-top:0.6rem;">${esc(q.answer)}</p>
            </details>
          `).join('')}
        </div>
      </section>
    ` : '';

    $('#subject').innerHTML = `
      <a class="back-link" href="index.html#semester-${selected.semester}">← Back to Semester ${selected.semester}</a>
      
      <div class="subject-intro" style="padding-bottom:1.5rem;">
        <div style="display:flex; align-items:center; gap:0.6rem; margin-bottom:0.6rem;">
          <span class="domain-badge domain-${domainKey}">
            ${domainSvg}
            ${selected.category}
          </span>
          <span class="telemetry-pill">${selected.credits} Credits</span>
          <span class="telemetry-pill">~${selected.estimatedHours || 36} hrs</span>
        </div>
        <h1>${esc(selected.title)}</h1>
        <p class="subject-code" style="margin-top:0.5rem;">${esc(selected.code)} <span>·</span> Centre for Advanced Studies, AKTU 2021–22 Scheme</p>
        
        <div style="display:flex; gap:0.8rem; margin-top:1.2rem; align-items:center; flex-wrap:wrap;">
          <button class="docket-toggle-btn ${isQueued ? 'is-queued' : ''}" 
                  data-code="${selected.code}" 
                  onclick="window.toggleSubjectDocket('${selected.code}', this)" 
                  style="font-size:0.85rem; padding:0.55rem 1rem;">
            ${isQueued ? '✓ Queued in Study Docket' : '+ Add to Study Docket'}
          </button>
          <a class="button" href="https://cas.res.in/pdf/CSE-Syllabus%202021-22.pdf#page=${selected.page}" target="_blank" rel="noopener" style="font-size:0.85rem; padding:0.55rem 1rem;">
            Open Syllabus Page ${selected.page} ↗
          </a>
          <button class="docket-btn docket-btn-secondary" onclick="window.openMobileQRModal && window.openMobileQRModal()" style="font-size:0.85rem; padding:0.55rem 1rem;">
            📱 Mobile QR
          </button>
        </div>
      </div>

      <div class="subject-grid">
        <div class="subject-box">
          <span class="eyebrow">Academic Objectives</span>
          <h2>Course Overview</h2>
          <p>${esc(selected.tagline || 'Postgraduate rigorous study block with algorithmic analysis and proofs.')}</p>
        </div>
        <div class="subject-box source-box">
          <span class="eyebrow">Curriculum Scheme</span>
          <h2>AKTU CAS Scheme Details</h2>
          <p>Semester 0${selected.semester} · Page ${selected.page} in the university syllabus document.</p>
        </div>
      </div>

      <div style="margin-top:2.5rem;">
        <span class="eyebrow">Syllabus Breakdown</span>
        <h2 style="font-size:2rem; margin:0.3rem 0 1.2rem;">Unit-by-Unit Study Plan</h2>
        ${unitsHtml}
      </div>

      ${pyqHtml}
    `;

    setupStudyDocketUI();
    setupExamPlannerModal();
    setupMobileQRModal();
    if (window.CommandPalette) window.CommandPalette.init(allCourses);
    updateAllDocketUI();
  }

  // --------------------------------------------------------------------------
  // Initialization Router
  // --------------------------------------------------------------------------
  window.addEventListener('DOMContentLoaded', () => {
    const page = document.body.dataset.page;
    if (page === 'home') {
      initHomePage().catch(err => console.error('Error initializing home page:', err));
    } else if (page === 'subject') {
      initSubjectPage().catch(err => console.error('Error initializing subject page:', err));
    }
  });

})();
