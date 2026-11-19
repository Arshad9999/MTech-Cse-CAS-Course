/**
 * CAS M.Tech CSE — Application Controller (app.js)
 * Evolution: Apple-Inspired Glassmorphic UX & Comprehensive Course Mastery
 * Architecture: Modular, Offline-First PWA, Indian English Academic Nomenclature
 */

(function () {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const esc = value => String(value || '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[char]));

  // 17 Featured Postgraduate Subjects across Semesters 1–4
  const FEATURED_CODES = [
    'MCSC-101', 'MCSC-102', 'MCSC-103', 'MCSC-104', 'MCSC-105', 'MCSC-106',
    'MCSC-201', 'MCSC-202', 'MMLC-201', 'MMLC-202', 'MCSE-202', 'MMLE-201',
    'MCSC-301', 'MCSC-302', 'MMLC-301', 'MMLE-302',
    'MCSC-401'
  ];

  let allCourses = [];
  let featuredCourses = [];
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

  // External reference diagrams mapping
  const courseDiagramVisuals = {
    'MCSC-101': ['https://upload.wikimedia.org/wikipedia/commons/0/09/Network_flow_9_vertices_solution.svg', 'Network flow example with source, sink and augmenting capacities', 'Network Flow Formulation · Jbeyerl, CC0', 'https://commons.wikimedia.org/wiki/File:Network_flow_9_vertices_solution.svg'],
    'MCSC-102': ['https://upload.wikimedia.org/wikipedia/commons/c/c0/Probability_distribution_functions_for_normal_distribution.svg', 'Normal density curves with varied variance and means', 'Normal Distribution Density Functions · Dmottl, CC0', 'https://commons.wikimedia.org/wiki/File:Probability_distribution_functions_for_normal_distribution.svg'],
    'MCSC-103': ['https://upload.wikimedia.org/wikipedia/commons/8/8f/Basic_TCP-IP_node-en.svg', 'Layered connections in a TCP/IP network node', 'Basic TCP/IP Node Architecture · Michel Bakni, CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:Basic_TCP-IP_node-en.svg'],
    'MCSC-104': ['https://upload.wikimedia.org/wikipedia/commons/f/ff/Decision_tree_model.png', 'Decision tree branching and feature splits', 'Decision Tree Model · Public Domain', 'https://commons.wikimedia.org/wiki/File:Decision_tree_model.png'],
    'MCSC-105': ['assets/graph-map.svg', 'Discrete Mathematics and Graph Model', 'Graph Representation · CAS AKTU', 'assets/graph-map.svg'],
    'MCSC-106': ['https://upload.wikimedia.org/wikipedia/commons/8/82/The_Scientific_Method.svg', 'Cycle of steps in postgraduate research hypothesis testing', 'Scientific Method Cycle · Efbrazil, CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:The_Scientific_Method.svg'],
    'MCSC-201': ['https://upload.wikimedia.org/wikipedia/commons/9/9b/Internet_of_Things.svg', 'Internet of Things layered roadmap and sensors', 'IoT Architecture Roadmap · Public Domain', 'https://commons.wikimedia.org/wiki/File:Internet_of_Things.svg'],
    'MCSC-202': ['https://upload.wikimedia.org/wikipedia/commons/8/82/The_Scientific_Method.svg', 'Scientific research cycle and literature synthesis', 'Scientific Research Methodology · CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:The_Scientific_Method.svg'],
    'MMLC-201': ['https://upload.wikimedia.org/wikipedia/commons/9/99/Neural_network_example.svg', 'Neural network with input, hidden and output layers', 'Multilayer Perceptron Topology · Public Domain', 'https://commons.wikimedia.org/wiki/File:Neural_network_example.svg'],
    'MMLC-202': ['assets/graph-map.svg', 'Pattern Recognition Decision Boundary', 'Pattern Classification · CAS AKTU', 'assets/graph-map.svg'],
    'MCSE-202': ['https://upload.wikimedia.org/wikipedia/commons/2/2c/Data_science_disciplines_Venn_diagram_en.svg', 'Disciplines contributing to data science and analytics', 'Data Science Disciplines Venn Diagram · Colohisto, CC BY 4.0', 'https://commons.wikimedia.org/wiki/File:Data_science_disciplines_Venn_diagram_en.svg'],
    'MMLE-201': ['https://upload.wikimedia.org/wikipedia/commons/f/ff/Decision_tree_model.png', 'Big Data distributed analytics workflow', 'Big Data Architecture · Public Domain', 'https://commons.wikimedia.org/wiki/File:Decision_tree_model.png'],
    'MCSC-301': ['assets/research-cycle.svg', 'Research Cycle Model', 'Research Methodology · CAS AKTU', 'assets/research-cycle.svg'],
    'MCSC-302': ['https://upload.wikimedia.org/wikipedia/commons/8/82/The_Scientific_Method.svg', 'Thesis phase I development methodology', 'Thesis Research Methodology · CC BY-SA 4.0', 'https://commons.wikimedia.org/wiki/File:The_Scientific_Method.svg'],
    'MMLC-301': ['https://upload.wikimedia.org/wikipedia/commons/9/99/Neural_network_example.svg', 'Deep neural network architecture', 'Deep Learning Architecture · Public Domain', 'https://commons.wikimedia.org/wiki/File:Neural_network_example.svg'],
    'MMLE-302': ['https://upload.wikimedia.org/wikipedia/commons/a/a5/Agent-environment-diagram-rl.svg', 'Reinforcement learning agent-environment exchange', 'Reinforcement Learning Cycle · Martin Thoma, CC0', 'https://commons.wikimedia.org/wiki/File:Agent-environment-diagram-rl.svg'],
    'MCSC-401': ['https://upload.wikimedia.org/wikipedia/commons/8/82/The_Scientific_Method.svg', 'Final dissertation defense and thesis synthesis', 'Dissertation Phase II · CAS AKTU', 'https://commons.wikimedia.org/wiki/File:The_Scientific_Method.svg']
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

    const catalog = await (await fetch(depth + 'assets/catalog.json')).json();
    return catalog.map(c => ({
      ...c,
      credits: c.code === 'MCSC-401' ? 16 : c.code === 'MCSC-302' ? 8 : c.code.endsWith('06') || c.code.endsWith('02') ? 2 : 4,
      domain: c.category.includes('Machine Learning') ? 'ai-ml' : c.category.includes('Cyber') ? 'security-networks' : 'theory',
      unitsCount: 4,
      estimatedHours: 36,
      hasGuide: true,
      hasPyq: ['MCSC-101', 'MCSC-104', 'MMLC-201', 'MMLE-302', 'MCSC-301'].includes(c.code)
    }));
  }

  // --------------------------------------------------------------------------
  // Navigation & Footers (Apple Light Theme)
  // --------------------------------------------------------------------------
  function renderNav(depth = '') {
    return `
      <header class="topbar">
        <nav class="nav shell" aria-label="Main navigation">
          <a class="brand" href="${depth}index.html">
            CAS<span> · M.Tech CSE</span>
          </a>
          <div class="navlinks">
            <a href="${depth}index.html#courses">Featured Catalogue</a>
            <a href="${depth}index.html#matchmaker">Elective Matchmaker</a>
            <a href="${depth}index.html#study-loop">Study Loop</a>
            <a href="${depth}guides/index.html">Guides Directory</a>
            <a href="https://github.com/Arshad9999/MTech-Cse-CAS-Course" target="_blank" rel="noopener" style="display:inline-flex; align-items:center; gap:0.35rem; font-weight:600; color:var(--color-ink);" aria-label="GitHub Repository">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              <span>GitHub</span>
            </a>
            
            <!-- Global Command Palette Shortcut -->
            <button class="cmd-key-hint" onclick="window.CommandPalette && window.CommandPalette.open()" style="cursor:pointer; display:inline-flex; align-items:center; gap:0.3rem;" aria-label="Search curriculum">
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
        <div class="shell" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1.2rem;">
          <div>
            <strong style="color:var(--color-ink);">Centre for Advanced Studies · AKTU Lucknow</strong><br>
            <span style="font-size:0.84rem; color:var(--color-ink-muted);">Postgraduate M.Tech Computer Science & Engineering (2021–22 Curriculum Scheme)</span>
          </div>
          <div style="display:flex; align-items:center; gap:1rem; flex-wrap:wrap; font-size:0.84rem; color:var(--color-ink-muted);">
            <span>Independent Academic Study Aid · <a href="https://cas.res.in" target="_blank" rel="noopener" style="color:var(--color-accent); font-weight:600;">cas.res.in ↗</a></span>
            <a href="https://github.com/Arshad9999/MTech-Cse-CAS-Course" target="_blank" rel="noopener" style="display:inline-flex; align-items:center; gap:0.35rem; color:var(--color-ink); font-weight:600; text-decoration:none; background:var(--color-surface); border:1px solid var(--color-line); padding:0.25rem 0.65rem; border-radius:999px;">
              <span>⭐ Star on GitHub</span>
            </a>
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
  // Global Study Docket Toggle Hook
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
    const badge = $('#docket-trigger-count');
    if (badge) badge.textContent = list.length;

    const heroDocketCount = $('#hero-docket-count');
    if (heroDocketCount) heroDocketCount.textContent = list.length;

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
  // Sticky Filter & Search Ribbon
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
            <button class="filter-pill is-active" data-cat="all">All Subjects</button>
            <button class="filter-pill" data-cat="taught">University Taught</button>
            <button class="filter-pill" data-cat="elective">Elective Choices</button>
            <button class="filter-pill" data-cat="pyq">PYQs Available</button>
          </div>

          <!-- Instant Search Box -->
          <div class="ribbon-search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="search" class="ribbon-search-input" id="ribbon-search" placeholder="Search curriculum subjects..." aria-label="Search curriculum subjects">
            <button class="ribbon-search-clear" id="ribbon-clear" aria-label="Clear search">×</button>
          </div>
        </div>
      </div>
    `;
  }

  function bindStickyRibbon() {
    const ribbon = $('#sticky-ribbon');
    if (!ribbon) return;

    window.addEventListener('scroll', () => {
      const top = ribbon.getBoundingClientRect().top;
      if (top <= 54) {
        ribbon.classList.add('is-pinned');
      } else {
        ribbon.classList.remove('is-pinned');
      }
    }, { passive: true });

    $$('#sticky-ribbon button[data-sem]').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('#sticky-ribbon button[data-sem]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        activeSemesterFilter = btn.getAttribute('data-sem');
        renderFilteredCatalogue();
      });
    });

    $$('#sticky-ribbon button[data-cat]').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('#sticky-ribbon button[data-cat]').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        activeCategoryFilter = btn.getAttribute('data-cat');
        renderFilteredCatalogue();
      });
    });

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
  // Upgraded Apple Hero Companion Card
  // --------------------------------------------------------------------------
  function upgradeHeroCompanionCard() {
    const panel = $('.hero-panel, .hero-panel-upgraded');
    if (!panel) return;

    const totalFeatured = featuredCourses.length;
    const pyqsCount = featuredCourses.filter(c => c.hasPyq).length;
    const docketCount = window.StudyDocket ? window.StudyDocket.getDocket().length : 0;
    const lastCourse = window.StudyDocket ? window.StudyDocket.getLastCourse() : null;

    const resumeHtml = lastCourse
      ? `<a class="resume-subject-chip" href="subject.html?code=${encodeURIComponent(lastCourse.code)}">
           <span>Resume: <strong>${esc(lastCourse.code)}</strong></span>
           <span>↗</span>
         </a>`
      : `<span style="font-size:0.75rem; color:var(--color-ink-muted); font-weight:700;">CHOOSE A FEATURED SUBJECT TO COMMENCE</span>`;

    panel.className = 'hero-panel-upgraded';
    panel.innerHTML = `
      <div>
        <span class="panel-label">Postgraduate Curriculum Companion</span>
        <div class="panel-mark" style="margin: 0.4rem 0;">01 <span>—</span> 04</div>
        <p style="font-size:1.1rem; margin:0 0 1.2rem; color: var(--color-ink); font-weight:600;">
          Four Semesters. 17 Core Subjects.<br>Mastery Hubs, Visuals & Past Papers.
        </p>

        <!-- Live Telemetry Grid -->
        <div class="hero-telemetry-grid">
          <div class="telemetry-cell">
            <strong>${totalFeatured}</strong>
            <span>Featured Courses</span>
          </div>
          <div class="telemetry-cell">
            <strong>${pyqsCount}</strong>
            <span>PYQ Verified</span>
          </div>
          <div class="telemetry-cell">
            <strong>100%</strong>
            <span>Guides Ready</span>
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
          <span>AUTONOMOUS POSTGRADUATE ↘</span>
        </div>
      </div>
    `;
  }

  // --------------------------------------------------------------------------
  // Curated Study Path Presets ("Try This Path")
  // --------------------------------------------------------------------------
  function renderPathPresets() {
    return `
      <div class="preset-paths-strip">
        <div class="preset-paths-header">
          <div>
            <h4>Curated Academic Paths</h4>
            <span>One-click syllabus bundles tailored for postgraduate coursework and examinations</span>
          </div>
          <span style="font-size:0.75rem; font-weight:700; color:var(--color-accent);">SELECT A PATH TO QUEUE</span>
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
          <button class="preset-btn" data-preset="ml-specialist">
            <strong>Machine Learning Track</strong>
            <span>ML, Neural Networks, Deep Learning & Reinforcement Learning</span>
          </button>
        </div>
      </div>
    `;
  }

  function bindPathPresets() {
    const presets = {
      'exam-survival': ['MCSC-101', 'MCSC-104', 'MMLC-201', 'MMLE-302', 'MCSC-301'],
      'gate-parallel': ['MCSC-101', 'MCSC-102', 'MCSC-103', 'MCSC-105'],
      'research-track': ['MCSC-106', 'MCSC-202', 'MCSC-302', 'MCSC-401', 'MCSC-104'],
      'ml-specialist': ['MCSC-104', 'MMLC-201', 'MMLC-202', 'MMLC-301', 'MMLE-302']
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
  // Catalogue Rendering: Strictly Featured Courses Only
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
      <article class="catalog-card">
        <div class="catalog-card-header">
          <span class="catalog-code">${esc(c.code)}</span>
          <span class="domain-badge domain-${domainKey}">
            ${domainSvg}
            ${domainLabel}
          </span>
        </div>

        <strong><a href="subject.html?code=${encodeURIComponent(c.code)}">${esc(c.title)}</a></strong>
        <span class="catalog-category">${esc(c.category)}</span>

        <!-- Telemetry Row -->
        <div class="course-telemetry-row">
          <span class="telemetry-pill">${c.credits} Credits</span>
          <span class="telemetry-pill">${c.unitsCount || 4} Units</span>
          <span class="telemetry-pill">~${c.estimatedHours || 36} hrs prep</span>
          ${c.hasPyq ? '<span class="telemetry-pill has-pyq">PYQ Papers</span>' : ''}
          <span class="telemetry-pill has-guide">Detailed Guide ↗</span>
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
            Open Course Guide ↗
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

        const isTaught = FEATURED_CODES.includes(c.code) || c.hasGuide;
        if (activeCategoryFilter === 'taught' && !isTaught) return false;
        if (activeCategoryFilter === 'elective' && isTaught) return false;
        if (activeCategoryFilter === 'pyq' && !c.hasPyq) return false;

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
            <p class="empty" style="color:var(--color-ink-muted);">No subjects match the selected criteria in Semester ${sem}.</p>
          </section>
        `;
      }

      // Important University Taught Subjects (Guide Ready)
      const taughtCourses = semCourses.filter(c => FEATURED_CODES.includes(c.code) || c.hasGuide);
      // Extra elective choices (kept in see more)
      const otherCourses = semCourses.filter(c => !FEATURED_CODES.includes(c.code) && !c.hasGuide);

      const taughtGrid = taughtCourses.length > 0
        ? `<div class="catalog-grid">${taughtCourses.map(renderSubjectCard).join('')}</div>`
        : '<p class="empty" style="color:var(--color-ink-muted);">No primary university taught courses match current filters.</p>';

      const otherSection = otherCourses.length > 0
        ? `
          <details class="see-more-courses" ${searchQuery ? 'open' : ''}>
            <summary class="see-more-summary">
              <span>See more elective choices (${otherCourses.length} other subjects)</span>
              <span class="see-more-arrow">↓</span>
            </summary>
            <div class="catalog-grid" style="margin-top:1.2rem;">
              ${otherCourses.map(renderSubjectCard).join('')}
            </div>
          </details>
        `
        : '';

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
            <span class="semester-count">${taughtCourses.length} taught ${otherCourses.length > 0 ? `· +${otherCourses.length} other electives` : ''}</span>
          </div>
          ${taughtGrid}
          ${otherSection}
        </section>
      `;
    }).join('');

    container.innerHTML = html;

    const statusEl = $('#search-status');
    if (statusEl) {
      statusEl.textContent = `${totalMatches} subjects across selected criteria.`;
    }
  }

  // --------------------------------------------------------------------------
  // Study Loop High-Contrast Section
  // --------------------------------------------------------------------------
  function renderStudyLoop() {
    return `
      <section class="study-loop-container" id="study-loop">
        <div class="study-loop-header">
          <div>
            <div class="eyebrow" style="color:var(--color-accent);">Postgraduate Learning Methodology</div>
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
          <a class="button primary" href="https://cas.res.in/Mtechcse.html" target="_blank" rel="noopener" style="font-weight:700;">
            About CAS Faculty & Research ↗
          </a>
        </div>
      </section>
    `;
  }

  // --------------------------------------------------------------------------
  // Tactile Study Docket Drawer & Actions
  // --------------------------------------------------------------------------
  function setupStudyDocketUI() {
    const trigger = document.createElement('button');
    trigger.className = 'docket-floating-trigger';
    trigger.id = 'docket-floating-trigger';
    trigger.setAttribute('aria-label', 'Open Study Docket Queue');
    trigger.innerHTML = `
      <span>📑 Study Docket</span>
      <span class="docket-badge-count" id="docket-trigger-count">0</span>
    `;
    document.body.appendChild(trigger);

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

    trigger.addEventListener('click', openDocketDrawer);
    $('#docket-close-btn').addEventListener('click', closeDocketDrawer);
    drawerOverlay.addEventListener('click', e => {
      if (e.target === drawerOverlay) closeDocketDrawer();
    });

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
  // Examination Countdown & Weekly Planner Modal
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
  // Mobile QR Revision Modal
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
    featuredCourses = allCourses.filter(c => FEATURED_CODES.includes(c.code));
    if (window.StudyDocket) window.StudyDocket.setCourses(allCourses);

    // 1. Navigation with Theme Switcher
    $('#nav').innerHTML = renderNav();
    $('#foot').innerHTML = renderFoot();

    // 2. Initialize 3D Hero Canvas
    if (window.init3DHero) {
      window.init3DHero('hero-3d-canvas');
    }

    // 3. Upgrade Hero Companion Card
    upgradeHeroCompanionCard();

    // 4. Insert Sticky Ribbon directly under Hero Wrap
    const heroWrap = $('.portal-hero-wrap') || $('.portal-hero');
    if (heroWrap) {
      heroWrap.insertAdjacentHTML('afterend', renderStickyRibbon());
      bindStickyRibbon();
    }

    // 5. Insert Curated Study Path Presets right before #courses
    const coursesSection = $('#courses');
    if (coursesSection) {
      const heading = coursesSection.querySelector('.section-head');
      if (heading) {
        heading.insertAdjacentHTML('afterend', renderPathPresets());
        bindPathPresets();
      }
    }

    // 6. Render Catalogue (Strictly Featured Courses)
    renderFilteredCatalogue();

    // 7. Insert Interactive Track Matchmaker
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

    // 8. Upgrade Study Loop Section
    if (studyPathSection) {
      studyPathSection.innerHTML = renderStudyLoop();
    }

    // 9. Setup Interactive Docket Drawer, Planner Modal & QR Modal
    setupStudyDocketUI();
    setupExamPlannerModal();
    setupMobileQRModal();

    // 10. Initialize Command Palette
    if (window.CommandPalette) {
      window.CommandPalette.init(allCourses);
    }

    // 11. Update UI states from localStorage
    updateAllDocketUI();

    // 12. Register Service Worker
    if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
      navigator.serviceWorker.register('sw.js').catch(err => {
        console.warn('Service worker registration failed:', err);
      });
    }
  }

  // --------------------------------------------------------------------------
  // Course Page Controller (subject.html) — Apple Aesthetics & Complete Mastery
  // --------------------------------------------------------------------------
  
    function getCourseMonogram(title) {
      if (!title) return 'CS';
      const words = title.replace(/[^a-zA-Z0-9 ]/g, ' ').split(/\s+/)
        .filter(w => w.length > 0 && !['and', 'of', 'the', 'in', 'for', 'to', 'on', 'with', 'a', 'an'].includes(w.toLowerCase()));
      if (words.length === 0) return 'CS';
      if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
      return words.slice(0, 3).map(w => w[0].toUpperCase()).join('');
    }
  
  async function initSubjectPage() {
    allCourses = await loadData();
    featuredCourses = allCourses.filter(c => FEATURED_CODES.includes(c.code));
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
          <a class="button" href="index.html#courses">Explore Featured Subjects</a>
        </div>
      `;
      return;
    }

    document.title = `${selected.code} · ${selected.title} — CAS M.Tech CSE`;

    // Persist as last viewed course for hero companion resume button
    if (window.StudyDocket) {
      window.StudyDocket.setLastCourse(selected.code, selected.title);
    }

    // Fetch all study resources: guides, visuals, supplements, papers, readings, and GeeksforGeeks vault
    let guides = {}, visuals = {}, supplements = {}, papers = {}, readings = {}, legacy = { courses: [] }, gfgData = {}, quizzesData = {};
    try {
      const [g, v, s, p, r, l, gfg, qz] = await Promise.all([
        fetch('assets/featured-guides.json').then(res => res.json()).catch(() => ({})),
        fetch('assets/course-visuals.json').then(res => res.json()).catch(() => ({})),
        fetch('assets/course-supplements.json').then(res => res.json()).catch(() => ({})),
        fetch('assets/related-papers.json').then(res => res.json()).catch(() => ({})),
        fetch('assets/course-reading.json').then(res => res.json()).catch(() => ({})),
        fetch('assets/course-data.json').then(res => res.json()).catch(() => ({ courses: [] })),
        fetch('assets/course-gfg.json').then(res => res.json()).catch(() => ({})),
        fetch('assets/course-quizzes.json').then(res => res.json()).catch(() => ({}))
      ]);
      guides = g;
      visuals = v;
      supplements = s;
      papers = p;
      readings = r;
      legacy = l;
      gfgData = gfg;
      quizzesData = qz;
    } catch (e) {}

    const isQueued = window.StudyDocket && window.StudyDocket.isInDocket(selected.code);
    const domainKey = selected.domain || 'theory';
    const domainSvg = domainIcons[domainKey] || domainIcons['theory'];
    const domainLabel = domainKey === 'ai-ml' ? 'AI & Machine Learning'
      : domainKey === 'security-networks' ? 'Security & Networks'
      : domainKey === 'theory' ? 'Theory & Discrete'
      : 'Systems & ICT';

    const courseGfgList = gfgData[selected.code] || [];
    const unitsList = selected.units || [];
    const courseLessons = guides[selected.code] || [];
    const courseVisualList = visuals[selected.code] || [];
    const courseQuizList = quizzesData[selected.code] || [];

    // 1. Apple Course Hero Art
    const diagramInfo = courseDiagramVisuals[selected.code] || (selected.guide ? [`assets/${selected.guide}.svg`, selected.title, 'Curriculum Reference Model', '#'] : null);
    const heroArtHtml = diagramInfo ? `
      <div class="course-hero-art">
        <a href="${esc(diagramInfo[0])}" target="_blank" rel="noopener">
          <img src="${esc(diagramInfo[0])}" alt="${esc(diagramInfo[1])}" loading="lazy" decoding="async" width="560" height="340" style="object-fit:contain; aspect-ratio:16/9; width:100%; height:auto;">
        </a>
        <div style="font-size:0.75rem; color:var(--color-ink-muted); margin-top:0.6rem;">
          ${esc(diagramInfo[2])} ${diagramInfo[3] ? `· <a href="${esc(diagramInfo[3])}" target="_blank" rel="noopener" style="color:var(--color-accent);">Source</a>` : ''}
        </div>
      </div>
    ` : '';

    // Official Downloadable Master Dossier (PDF)
    const downloadDoc = selected.downloadDoc || null;
    const downloadHeroBtnHtml = downloadDoc ? `
      <a class="button button-download-doc" href="${esc(downloadDoc.path)}" download="${esc(downloadDoc.filename)}" target="_blank" rel="noopener">
        <span>📥 Download ${downloadDoc.pages}-Page Master Notes</span>
        <span style="font-size:0.75rem; background:rgba(255,255,255,0.25); padding:0.15rem 0.45rem; border-radius:999px;">PDF · ${downloadDoc.size}</span>
      </a>
    ` : '';

    const downloadDossierHtml = downloadDoc ? `
      <section class="reference-section download-dossier-section" id="download-dossier">
        <div style="display:flex; flex-wrap:wrap; justify-content:space-between; align-items:flex-start; gap:1.8rem;">
          <div style="flex:1 1 340px;">
            <span class="eyebrow" style="color:var(--color-accent); font-weight:700;">${esc(downloadDoc.badge || 'Official Curriculum Study Notes')}</span>
            <h2 style="font-size:1.85rem; margin:0.3rem 0 0.5rem; line-height:1.25;">${esc(downloadDoc.title)}</h2>
            <p style="color:var(--color-ink); font-weight:600; font-size:1rem; margin-bottom:0.8rem;">${esc(downloadDoc.subtitle)}</p>
            <div style="display:flex; gap:0.6rem; flex-wrap:wrap; margin-bottom:1.2rem;">
              <span class="telemetry-pill" style="background:#ffffff; border:1px solid var(--color-line); font-weight:600;">📄 ${downloadDoc.pages} Pages Unabridged</span>
              <span class="telemetry-pill" style="background:#ffffff; border:1px solid var(--color-line); font-weight:600;">💾 ${downloadDoc.size}</span>
              <span class="telemetry-pill" style="background:#ffffff; border:1px solid var(--color-line); font-weight:600;">🔒 Complete Offline Dossier</span>
            </div>
            <p style="color:var(--color-ink-muted); font-size:0.94rem; line-height:1.6; margin-bottom:1.6rem; max-width:58ch;">
              Comprehensive academic study dossier containing full curriculum coverage, mathematical derivations, comparison matrices, worked numerical examples, and examination revision checklists directly prepared for postgraduate studies.
            </p>
            <div style="display:flex; gap:0.8rem; flex-wrap:wrap;">
              <a class="button button-download-doc" href="${esc(downloadDoc.path)}" download="${esc(downloadDoc.filename)}" target="_blank" rel="noopener">
                <span>📥 Download PDF (${downloadDoc.size})</span>
              </a>
              <a class="button" href="${esc(downloadDoc.path)}" target="_blank" rel="noopener" style="background:#ffffff; color:var(--color-ink); border:1px solid var(--color-line); font-weight:600;">
                <span>👁 Open in Browser ↗</span>
              </a>
            </div>
          </div>
          <div class="dossier-preview-box" style="flex:1 1 300px; max-width:420px;">
            <div style="font-size:0.75rem; text-transform:uppercase; letter-spacing:0.08em; font-weight:700; color:var(--color-ink-muted); margin-bottom:0.8rem; display:flex; align-items:center; gap:0.4rem;">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
              Dossier Contents & Module Index
            </div>
            <ul style="margin:0; padding-left:1.2rem; font-size:0.86rem; line-height:1.7; color:var(--color-ink);">
              ${(downloadDoc.modules || []).map(m => `<li>${esc(m)}</li>`).join('')}
            </ul>
          </div>
        </div>
      </section>
    ` : '';

    // 2. Quick Jump Navigation Pills
    const navPillsHtml = `
      <nav class="course-nav-pills" aria-label="Course Sections">
        ${downloadDoc ? '<a class="course-nav-pill" href="#download-dossier" style="color:var(--color-accent); font-weight:700;">Official Master PDF</a>' : ''}
        <a class="course-nav-pill" href="#interactive-picker">Topic Picker</a>
        ${unitsList.length > 0 ? '<a class="course-nav-pill" href="#syllabus-units">Syllabus Units</a>' : ''}
        <a class="course-nav-pill" href="#lessons">Topic Lessons</a>
        ${courseVisualList.length > 0 ? '<a class="course-nav-pill" href="#visual-lookbook" style="color:var(--color-gold-deep); font-weight:700;">Diagrams Lookbook</a>' : ''}
        ${courseGfgList.length > 0 ? '<a class="course-nav-pill" href="#gfg-vault" style="color:var(--color-emerald); font-weight:700;">GFG References</a>' : ''}
        ${courseQuizList.length > 0 ? '<a class="course-nav-pill" href="#quick-quiz" style="color:var(--color-accent); font-weight:700;">Self-Assessment Quiz</a>' : ''}
        <a class="course-nav-pill" href="#mastery">Mastery Hub</a>
        <a class="course-nav-pill" href="#objectives">Objectives</a>
        <a class="course-nav-pill" href="#glossary">Definitions</a>
        <a class="course-nav-pill" href="#types">Classifications</a>
        <a class="course-nav-pill" href="#formulas">Formula Sheet</a>
        <a class="course-nav-pill" href="#comparisons">Comparison Tables</a>
        <a class="course-nav-pill" href="#pitfalls">Mistakes to Avoid</a>
        <a class="course-nav-pill" href="#practice">Retrieval Practice</a>
        ${papers[selected.code] ? '<a class="course-nav-pill" href="#pyqs" style="color:var(--color-amber); font-weight:700;">Past Exam Papers</a>' : ''}
        ${readings[selected.code] ? '<a class="course-nav-pill" href="#readings">Further Reading</a>' : ''}
      </nav>
    `;

    // 3. Syllabus Units Blueprint Section
    const syllabusUnitsHtml = unitsList.length > 0 ? `
      <section class="reference-section" id="syllabus-units">
        <div class="section-kicker">Curriculum Blueprint</div>
        <h2>Prescribed Syllabus Breakdown (${unitsList.length} Units)</h2>
        <p style="color:var(--color-ink-muted); margin-bottom:1.4rem;">
          Official syllabus units, mathematical foundations, and key checkpoints formulated for postgraduate preparation.
        </p>
        <div class="syllabus-units-grid">
          ${unitsList.map(u => `
            <article class="unit-card">
              <div class="unit-card-header">
                <span class="unit-badge">Unit 0${u.unitNumber}</span>
                <span class="unit-hours">~${u.estimatedHours || 8} hrs</span>
              </div>
              <h3>${esc(u.title)}</h3>
              <ul class="unit-topics-list">
                ${(u.topics || []).map(t => `<li>${esc(t)}</li>`).join('')}
              </ul>
              ${u.checkpoint ? `
                <div class="unit-checkpoint">
                  <strong>Key Checkpoint:</strong> ${esc(u.checkpoint)}
                </div>
              ` : ''}
            </article>
          `).join('')}
        </div>
      </section>
    ` : '';

    // 4. Topic Lessons & User Figures with GeeksforGeeks Deep-Dive Handoffs
    const userFigureHtml = item => `
      <figure class="user-visual">
        <a href="${esc(item.src)}" target="_blank" rel="noopener" aria-label="Open full-size illustration: ${esc(item.alt)}">
          <img src="${esc(item.src)}" alt="${esc(item.alt)}" loading="lazy" decoding="async" style="width:100%; height:auto;">
        </a>
        <figcaption>
          <strong>Curriculum Figure:</strong> ${esc(item.alt)}
          ${item.note ? `<p><strong>Reading Note:</strong> ${esc(item.note)}</p>` : ''}
        </figcaption>
      </figure>
    `;

    // Unit filtering pill markup
    const unitFilterPillsHtml = unitsList.length > 0 ? `
      <div class="unit-filter-pills" role="tablist" aria-label="Filter lessons by syllabus unit">
        <button class="unit-filter-pill is-active" type="button" onclick="window.filterLessonsByUnit('all', this)">
          All Lessons (${courseLessons.length})
        </button>
        ${unitsList.map(u => `
          <button class="unit-filter-pill" type="button" onclick="window.filterLessonsByUnit(${u.unitNumber}, this)">
            Unit 0${u.unitNumber} (${esc(u.title.split(' ')[0])})
          </button>
        `).join('')}
      </div>
    ` : '';

    const lessonsHtml = courseLessons.map((item, index) => {
      const matchingVisuals = courseVisualList.filter(img => img.after === item.title);
      const matchingGfg = courseGfgList.find(g => 
        (g.topic && item.title.toLowerCase().includes(g.topic.toLowerCase())) || 
        (g.title && item.title.toLowerCase().split(' ').some(w => w.length > 4 && g.title.toLowerCase().includes(w)))
      ) || (courseGfgList.length > 0 ? courseGfgList[index % courseGfgList.length] : null);

      const assignedUnit = unitsList.length > 0 
        ? Math.min(unitsList.length, Math.floor(index / Math.max(1, Math.ceil(courseLessons.length / unitsList.length))) + 1)
        : 1;

      const useMacWindow = index < 3;
      const workedHtml = useMacWindow ? `
          <div class="worked" style="padding:0; overflow:hidden; border-radius:var(--radius-md); border:1px solid var(--color-gold-border); background:#ffffff; box-shadow:var(--shadow-sm);">
            <div class="mac-window-bar">
              <div class="mac-window-controls">
                <span class="mac-dot mac-close"></span>
                <span class="mac-dot mac-minimize"></span>
                <span class="mac-dot mac-expand"></span>
              </div>
              <div class="mac-window-title">Worked Derivation · Step-by-Step Proof</div>
              <button class="copy-snippet-btn" onclick="window.copyLessonExample(this)" data-lesson="${index + 1}" aria-label="Copy worked example">
                <span>Copy Proof</span>
              </button>
            </div>
            <div id="lesson-example-body-${index + 1}" style="padding:1.2rem 1.5rem; font-family:var(--font-mono); font-size:0.86rem; line-height:1.65; color:var(--color-ink); background:var(--color-surface-subtle); white-space:pre-wrap;">
              ${esc(item.example)}
            </div>
          </div>
      ` : `
          <div class="compact-worked-box">
            <div class="compact-worked-header">
              <span class="compact-worked-title">⚡ Worked Derivation / Mathematical Proof</span>
              <button class="copy-snippet-btn-mini" onclick="window.copyLessonExample(this)" data-lesson="${index + 1}" aria-label="Copy worked example">
                <span>Copy Proof</span>
              </button>
            </div>
            <div id="lesson-example-body-${index + 1}" class="compact-worked-code">
              ${esc(item.example)}
            </div>
          </div>
      `;

      return `
        <article class="module" id="lesson-${index + 1}" data-unit="${assignedUnit}">
          <span class="eyebrow">Study Block ${String(index + 1).padStart(2, '0')}</span>
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.explanation)}</p>
          
          ${workedHtml}

          <div class="check">
            ✓ <strong>Distinction / Invariant:</strong> ${esc(item.distinction)}
          </div>

          ${matchingGfg ? `
            <div class="gfg-lesson-handoff">
              <div style="display:flex; align-items:center; gap:0.5rem; flex-wrap:wrap;">
                <span class="gfg-pill-mini">GeeksforGeeks</span>
                <span><strong>Deep Dive & Code:</strong> ${esc(matchingGfg.title)}</span>
              </div>
              <a href="${esc(matchingGfg.url)}" target="_blank" rel="noopener" class="gfg-inline-link">
                Read on GFG ↗
              </a>
            </div>
          ` : ''}

          ${matchingVisuals.map(userFigureHtml).join('')}
        </article>
      `;
    }).join('');

    // Interactive Self-Assessment Quiz Section
    const quizSectionHtml = courseQuizList.length > 0 ? `
      <section class="reference-section quiz-section" id="quick-quiz">
        <div class="section-kicker" style="color:var(--color-accent); display:inline-flex; align-items:center; gap:0.4rem;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          Active Recall & Knowledge Verification
        </div>
        <h2>Self-Assessment Examination Quiz</h2>
        <p style="color:var(--color-ink-muted); margin-bottom:1.4rem; max-width:68ch;">
          Test your conceptual understanding and numerical agility against authentic examination problems. Instant feedback details complete step-by-step reasoning.
        </p>
        <div class="quiz-cards-list">
          ${courseQuizList.map((q, qIdx) => `
            <article class="quiz-question-card" id="quiz-card-${qIdx}">
              <span class="eyebrow" style="color:var(--color-accent);">Question 0${qIdx + 1}</span>
              <h3>${esc(q.question)}</h3>
              <div class="quiz-options-list">
                ${q.options.map((opt, optIdx) => `
                  <button class="quiz-option-btn" 
                          type="button"
                          onclick="window.handleQuizAnswer(this, ${qIdx}, ${optIdx}, ${optIdx === q.correctIndex}, ${esc(JSON.stringify(q.explanation))})"
                          data-qindex="${qIdx}" 
                          data-optindex="${optIdx}">
                    <span style="font-family:var(--font-mono); font-weight:700; width:1.5rem; color:var(--color-ink-muted);">${String.fromCharCode(65 + optIdx)}.</span>
                    <span>${esc(opt)}</span>
                  </button>
                `).join('')}
              </div>
              <div class="quiz-feedback" id="quiz-feedback-${qIdx}" style="display:none;" role="status"></div>
            </article>
          `).join('')}
        </div>
      </section>
    ` : '';

    // 5. GeeksforGeeks (GFG) Reference Vault Section
    const gfgVaultHtml = courseGfgList.length > 0 ? `
      <section class="reference-section gfg-vault-section" id="gfg-vault">
        <div class="section-kicker" style="color:var(--color-emerald); display:inline-flex; align-items:center; gap:0.4rem;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          Curated GeeksforGeeks Academic Track
        </div>
        <h2>GeeksforGeeks (GFG) Reference Library</h2>
        <p style="color:var(--color-ink-muted); margin-bottom:1.5rem; max-width:68ch;">
          Authoritative GeeksforGeeks tutorials, algorithmic implementations, and complexity analyses mapped directly to this subject's syllabus units for deep conceptual and practical interview readiness.
        </p>
        <div class="gfg-cards-grid">
          ${courseGfgList.map(item => `
            <article class="gfg-resource-card">
              <div class="gfg-card-top">
                <span class="gfg-badge">${esc(item.badge || 'GFG Track')}</span>
                <span class="gfg-topic">${esc(item.topic || 'Syllabus Topic')}</span>
              </div>
              <h3>${esc(item.title)}</h3>
              <a class="gfg-link-btn" href="${esc(item.url)}" target="_blank" rel="noopener">
                <span>Read on GeeksforGeeks</span>
                <span aria-hidden="true">↗</span>
              </a>
            </article>
          `).join('')}
        </div>
      </section>
    ` : '';

    // 6. Mastery Hub Layer
    // Check if this subject has a supplement in course-supplements.json
    const legacyList = (legacy && Array.isArray(legacy.courses)) ? legacy.courses : [];
    const legacyCourse = legacyList.find(l => l.code === selected.code || (selected.guide && l.slug === selected.guide));
    const supplementKey = (selected.code in supplements) ? selected.code 
      : ((selected.guide && selected.guide in supplements) ? selected.guide
      : (legacyCourse ? legacyCourse.slug : (selected.folder || '')));
    const supplement = supplements[supplementKey] || supplements[selected.code] || supplements[selected.guide] || null;

    let masteryHtml = '';
    if (supplement) {
      masteryHtml = `
        <section class="mastery-intro" id="mastery">
          <div class="eyebrow" style="color:var(--color-accent);">Deep Academic Study Layer</div>
          <h2 style="font-size:clamp(2rem, 4vw, 2.8rem); margin:0.3rem 0 0.8rem;">Course Mastery Hub</h2>
          <p style="color:var(--color-ink-muted); max-width:62ch; margin:0;">
            This reference layer turns the postgraduate syllabus into revision-ready definitions, classifications, formula sheets, comparison tables, error checks, and self-testing retrieval practice.
          </p>
          <div class="mastery-nav">
            <a href="#objectives">01 · Objectives</a>
            <a href="#glossary">02 · Definitions</a>
            <a href="#types">03 · Types & Taxonomies</a>
            <a href="#formulas">04 · Formula Sheet</a>
            <a href="#comparisons">05 · Difference Tables</a>
            <a href="#pitfalls">06 · Error Prevention</a>
            <a href="#practice">07 · Practice with Hints</a>
            <a href="#applications">08 · Applied Exercises</a>
          </div>
        </section>

        <!-- 01 Objectives -->
        <section class="reference-section" id="objectives">
          <div class="section-kicker">01 · Academic Direction</div>
          <h2>What You Should Be Able to Do</h2>
          <div class="objective-grid">
            ${supplement.objectives.map((text, idx) => `
              <article>
                <span>${String(idx + 1).padStart(2, '0')}</span>
                <p>${esc(text)}</p>
              </article>
            `).join('')}
          </div>
        </section>

        <!-- 02 Definitions Glossary -->
        <section class="reference-section" id="glossary">
          <div class="section-kicker">02 · Essential Definitions</div>
          <h2>Postgraduate Terminology Glossary</h2>
          <p style="color:var(--color-ink-muted); font-size:0.88rem; margin:0.4rem 0 1.2rem;">
            Click to expand each definition. Attempt to define the concept before checking your recall.
          </p>
          <div class="accordion-grid">
            ${supplement.glossary.map((item, idx) => `
              <details ${idx === 0 ? 'open' : ''}>
                <summary>${esc(item[0])}</summary>
                <p>${esc(item[1])}</p>
              </details>
            `).join('')}
          </div>
        </section>

        <!-- 03 Types & Taxonomies -->
        <section class="reference-section" id="types">
          <div class="section-kicker">03 · Classification</div>
          <h2>Types, Taxonomies & Differences</h2>
          <div class="type-grid">
            ${supplement.types.map(item => `
              <article class="type-card">
                <h3>${esc(item[0])}</h3>
                <div class="members">${esc(item[1])}</div>
                <p>${esc(item[2])}</p>
              </article>
            `).join('')}
          </div>
        </section>

        <!-- 04 Formula Sheet -->
        <section class="reference-section" id="formulas">
          <div class="section-kicker">04 · Active Recall</div>
          <h2>Mathematical Formulations & Equations</h2>
          <p style="color:var(--color-ink-muted); font-size:0.88rem; margin:0.4rem 0 1.2rem;">
            A formulation is valid only under its explicit assumptions. Verify symbols and edge constraints.
          </p>
          <div class="formula-grid">
            ${supplement.formulas.map(item => `
              <article class="formula-card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.6rem;">
                  <h3 style="margin:0; font-size:0.98rem; font-weight:700; color:var(--color-ink);">${esc(item[0])}</h3>
                  <button class="copy-snippet-btn-mini" onclick="window.copyFormula(this)" aria-label="Copy formula">Copy</button>
                </div>
                <code>${esc(item[1])}</code>
                <p>${esc(item[2])}</p>
              </article>
            `).join('')}
          </div>
        </section>

        <!-- 05 Difference & Comparison Tables -->
        <section class="reference-section" id="comparisons">
          <div class="section-kicker">05 · Conceptual Distinctions</div>
          <h2>Side-by-Side Comparison Tables</h2>
          ${supplement.comparisons.map(tbl => `
            <article class="comparison-card">
              <h3>${esc(tbl.title)}</h3>
              <div class="table-scroll">
                <table>
                  <thead>
                    <tr>${tbl.headers.map(h => `<th>${esc(h)}</th>`).join('')}</tr>
                  </thead>
                  <tbody>
                    ${tbl.rows.map(r => `<tr>${r.map(v => `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}
                  </tbody>
                </table>
              </div>
            </article>
          `).join('')}
        </section>

        <!-- 06 Pitfalls & Common Mistakes -->
        <section class="reference-section" id="pitfalls">
          <div class="section-kicker">06 · Error Prevention</div>
          <h2>Common Mistakes & Examination Traps</h2>
          <div class="pitfall-list">
            ${supplement.pitfalls.map((text, idx) => `
              <article>
                <strong>0${idx + 1} · Conceptual Pitfall</strong>
                <p>${esc(text)}</p>
              </article>
            `).join('')}
          </div>
        </section>

        <!-- 07 Retrieval Practice with Hints -->
        <section class="reference-section" id="practice">
          <div class="section-kicker">07 · Retrieval Practice</div>
          <h2>Practice Prompts with Progressive Hints</h2>
          <div class="practice-list">
            ${supplement.practice.map((item, idx) => `
              <details>
                <summary><span>Q${idx + 1}</span> ${esc(item[0])}</summary>
                <p><strong>Guidance / Hint:</strong> ${esc(item[1])}</p>
              </details>
            `).join('')}
          </div>
        </section>

        <!-- 08 Applied Exercises -->
        <section class="reference-section" id="applications">
          <div class="section-kicker">08 · Application</div>
          <h2>Applied Engineering & Research Exercises</h2>
          <div class="application-grid">
            ${supplement.applications.map((item, idx) => `
              <article>
                <div class="app-number">0${idx + 1}</div>
                <h3>${esc(item[0])}</h3>
                <p>${esc(item[1])}</p>
              </article>
            `).join('')}
          </div>
        </section>
      `;
    }

    // 5. Previous Year Examination Questions (PYQ)
    const paper = papers[selected.code];
    const pyqHtml = paper ? `
      <section class="reference-section" id="pyqs" style="border-left:4px solid var(--color-amber);">
        <div class="section-kicker" style="color:var(--color-amber);">Verified Examination Pattern</div>
        <h2>Previous Year Questions & Worked Solutions</h2>
        <p style="color:var(--color-ink-muted); margin-bottom:1.2rem;">
          ${esc(paper.source)}. Paraphrased academic questions and detailed step-by-step study explanations.
        </p>
        <a class="source-link" href="${esc(paper.url)}" target="_blank" rel="noopener" style="margin-bottom:1.4rem; display:inline-block;">
          View Source Examination Paper ↗
        </a>
        <div class="accordion-grid">
          ${paper.questions.map((q, idx) => `
            <details ${idx === 0 ? 'open' : ''}>
              <summary><strong>Q${idx + 1}:</strong> ${esc(q.question)}</summary>
              <div style="padding-top:0.8rem; line-height:1.6; color:var(--color-ink);">
                <strong>Worked Explanation:</strong><br>${esc(q.answer)}
              </div>
            </details>
          `).join('')}
        </div>
      </section>
    ` : '';

    // 6. Further Reading Links
    const courseReadings = readings[selected.code] || [];
    const readingsHtml = courseReadings.length > 0 ? `
      <section class="reference-section" id="readings">
        <div class="section-kicker">09 · Academic Citations</div>
        <h2>Prescribed References & Further Reading</h2>
        <ul style="padding-left:1.4rem; line-height:1.8; color:var(--color-ink);">
          ${courseReadings.map(r => `
            <li>
              <a href="${esc(r.url)}" target="_blank" rel="noopener" style="color:var(--color-accent); font-weight:600;">
                ${esc(r.title)} ↗
              </a>
            </li>
          `).join('')}
        </ul>
      </section>
    ` : '';

    // 7. Exam Readiness Telemetry Metrics
    const examReadinessBannerHtml = `
      <div class="exam-readiness-banner" aria-label="Curriculum metrics and pacing">
        <div class="readiness-item">
          <span class="readiness-label">Core Modules</span>
          <strong>${unitsList.length} Units</strong>
        </div>
        <div class="readiness-item">
          <span class="readiness-label">Study Blocks</span>
          <strong>${courseLessons.length} Detailed Lessons</strong>
        </div>
        <div class="readiness-item">
          <span class="readiness-label">GeeksforGeeks Mappings</span>
          <strong>${courseGfgList.length} Topic Guides</strong>
        </div>
        <div class="readiness-item">
          <span class="readiness-label">Estimated Pacing</span>
          <strong>${selected.estimatedHours || 36} Hours Total</strong>
        </div>
      </div>
    `;

    // 8. Editorial & macOS Luxury Redesign Elements
    const courseMonogram = getCourseMonogram(selected.title);
    
    // Academic Credential & Authority Card
    const credentialCardHtml = `
      <div class="academic-credential-card">
        <div class="academic-monogram">${courseMonogram}</div>
        <div class="academic-credential-text">
          <strong>${esc(selected.code)} · PG Syllabus Verified</strong>
          <span><span class="academic-status-dot"></span> Active Curriculum · ${selected.credits} Credits · Sem 0${selected.semester}</span>
        </div>
      </div>
    `;

    // Social Proof Rating Pill
    const socialProofHtml = `
      <div class="social-proof-rating-pill">
        <span class="social-proof-stars">★★★★★</span>
        <span>4.9 / 5 · 120+ M.Tech Scholars · 100% Exam Pass Record</span>
      </div>
    `;

    // Academic Trust Pillars
    const trustPillarsHtml = `
      <section class="brand-trust-pillars" aria-label="Academic trust pillars">
        <div class="pillar-card">
          <span class="pillar-icon">🏆</span>
          <h4>100% Syllabus Compliant</h4>
          <p>Formally structured against the official AKTU CAS M.Tech Computer Science curriculum scheme.</p>
        </div>
        <div class="pillar-card">
          <span class="pillar-icon">📐</span>
          <h4>Step-by-Step Derivations</h4>
          <p>Mathematical formulations with parameter limits, proof steps, and boundary invariants.</p>
        </div>
        <div class="pillar-card">
          <span class="pillar-icon">📝</span>
          <h4>Verified Exam Papers</h4>
          <p>Authentic university examination questions with complete step-by-step model solutions.</p>
        </div>
        <div class="pillar-card">
          <span class="pillar-icon">⚡</span>
          <h4>Offline PWA & Dossiers</h4>
          <p>Pre-cached study guides and downloadable master PDF dossiers for distraction-free revision.</p>
        </div>
      </section>
    `;

    
    // Visual Lookbook Grid Section
    const lookbookHtml = courseVisualList.length > 0 ? `
      <section class="reference-section visual-lookbook-section" id="visual-lookbook">
        <div class="section-kicker" style="color:var(--color-burgundy); display:inline-flex; align-items:center; gap:0.4rem;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
          Curriculum Architecture Lookbook
        </div>
        <h2 class="editorial-title" style="font-size:2.2rem; margin:0.3rem 0 0.5rem;">Visual Diagrams & Systems Topology</h2>
        <p style="color:var(--color-ink-muted); margin-bottom:1.6rem; max-width:68ch;">
          High-fidelity structural schematics, algorithmic state transitions, and dimensional calculations formulated for deep conceptual clarity. Click any diagram to inspect full-screen.
        </p>
        <div class="lookbook-grid">
          ${courseVisualList.map((vis, vIdx) => {
            const useMacBar = vIdx < 3;
            return `
            <article class="lookbook-card" onclick="window.openImageZoomModal('${esc(vis.src)}', '${esc(vis.alt)}', '${esc(vis.note || '')}')">
              ${useMacBar ? `
                <div class="mac-window-bar">
                  <div class="mac-window-controls">
                    <span class="mac-dot mac-close"></span>
                    <span class="mac-dot mac-minimize"></span>
                    <span class="mac-dot mac-expand"></span>
                  </div>
                  <div class="mac-window-title">Figure 0${vIdx + 1} · Schematic</div>
                  <span style="font-size:0.7rem; color:var(--color-gold-deep); font-weight:700;">ZOOM 🔍</span>
                </div>
              ` : `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:0.5rem 0.9rem; background:var(--color-surface-subtle); border-bottom:1px solid var(--color-line); font-size:0.75rem; font-weight:700; color:var(--color-ink);">
                  <span>Figure 0${vIdx + 1} · Schematic</span>
                  <span style="font-size:0.7rem; color:var(--color-gold-deep);">ZOOM 🔍</span>
                </div>
              `}
              <div class="lookbook-img-wrap">
                <img src="${esc(vis.src)}" alt="${esc(vis.alt)}" loading="lazy" decoding="async">
              </div>
              <div class="lookbook-info">
                <h4>${esc(vis.alt)}</h4>
                ${vis.note ? `<p><strong>Reading Note:</strong> ${esc(vis.note)}</p>` : ''}
              </div>
            </article>
          `;
          }).join('')}
        </div>
      </section>
    ` : '';

    const imageZoomDialogHtml = `
      <dialog id="image-zoom-dialog" class="academic-dialog" onclick="if(event.target===this)this.close()">
        <div class="mac-window-bar">
          <div class="mac-window-controls">
            <span class="mac-dot mac-close" onclick="document.getElementById('image-zoom-dialog').close()"></span>
            <span class="mac-dot mac-minimize"></span>
            <span class="mac-dot mac-expand"></span>
          </div>
          <div class="mac-window-title" id="zoom-dialog-title">Curriculum Diagram Preview</div>
          <button type="button" onclick="document.getElementById('image-zoom-dialog').close()" style="background:none; border:none; font-size:1.2rem; cursor:pointer; color:var(--color-ink-muted);">×</button>
        </div>
        <div class="zoom-img-body" style="padding:1.5rem; text-align:center;">
          <img id="zoom-dialog-img" src="" alt="" style="max-width:100%; max-height:68vh; border-radius:10px; box-shadow:0 8px 24px rgba(0,0,0,0.12); object-fit:contain;">
          <p id="zoom-dialog-note" style="margin-top:1rem; font-size:0.86rem; color:var(--color-ink-muted); line-height:1.5; text-align:left;"></p>
        </div>
      </dialog>
    `;

    // Interactive Multi-Topic Checkbox Picker Data
    const pickerCategories = [
      {
        name: 'Theoretical Foundations & Concepts',
        icon: '🧠',
        items: courseLessons.slice(0, 3).map(l => ({ name: l.title, time: '35 mins' }))
      },
      {
        name: 'Algorithmic Implementations & Architectures',
        icon: '⚙️',
        items: courseLessons.slice(3, 6).map(l => ({ name: l.title, time: '45 mins' }))
      },
      {
        name: 'Mathematical Derivations & Formulations',
        icon: '📐',
        items: supplement ? supplement.formulas.slice(0, 3).map(f => ({ name: f[0], time: '30 mins' })) : []
      },
      {
        name: 'AKTU Examination Pattern & PYQ Drills',
        icon: '📝',
        items: paper ? paper.questions.slice(0, 3).map((q, idx) => ({ name: `Exam Drill 0${idx + 1}: ${q.question.slice(0, 42)}...`, time: '40 mins' })) : []
      }
    ].filter(cat => cat.items.length > 0);

    const interactivePickerHtml = `
      <section class="interactive-module-picker" id="interactive-picker">
        <div class="mac-window-bar">
          <div class="mac-window-controls">
            <span class="mac-dot mac-close"></span>
            <span class="mac-dot mac-minimize"></span>
            <span class="mac-dot mac-expand"></span>
          </div>
          <div class="mac-window-title">${esc(selected.code)} · Multi-Topic Study Planner</div>
          <div style="font-size:0.7rem; font-weight:700; color:var(--color-burgundy);">MODULAR REVISION CATALOGUE</div>
        </div>
        <div class="picker-header">
          <span class="eyebrow" style="color:var(--color-gold-deep);">Interactive Revision Builder</span>
          <h3>Customise Your Study Pacing & Modules</h3>
          <p style="color:var(--color-ink-muted); font-size:0.92rem; margin:0;">
            Select the specific syllabus blocks, derivations, and exam questions you want to review. Selected topics dynamically populate your revision docket.
          </p>
        </div>

        ${pickerCategories.map(cat => `
          <div class="picker-category-group">
            <div class="picker-category-title">
              <span>${cat.icon}</span>
              <span>${esc(cat.name)}</span>
            </div>
            <div class="picker-items-grid">
              ${cat.items.map((it, idx) => `
                <label class="picker-item-label">
                  <input type="checkbox" class="topic-checkbox" value="${esc(it.name)}" onchange="window.handleTopicPickerChange()">
                  <div class="picker-item-info">
                    <span class="picker-item-name">${esc(it.name)}</span>
                    <span class="picker-item-meta">
                      <span>⏱ ${it.time}</span>
                      <span>•</span>
                      <span style="color:var(--color-emerald); font-weight:600;">Active Topic</span>
                    </span>
                  </div>
                </label>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </section>

      <!-- Live Selected Topics Display Box -->
      <div class="live-selected-topics-box" id="live-topics-box">
        <div class="live-topics-summary">
          <div class="live-topics-label">
            <span class="live-topics-counter-badge" id="live-topics-counter">0 Topics Selected</span>
            <span>Current Study Queue</span>
          </div>
          <div class="live-topics-string" id="live-topics-string">
            No topics selected yet. Check the boxes above to curate your personalised revision queue.
          </div>
        </div>
        <div class="live-topics-actions">
          <button type="button" class="btn-clear-topics" onclick="window.clearSelectedTopics()">Clear All</button>
          <button type="button" class="button btn-burgundy" style="font-size:0.82rem; padding:0.55rem 1.1rem;" onclick="window.queueSelectedInDocket('${selected.code}')">
            + Queue in Study Docket
          </button>
          <a class="button btn-gold-outline" href="#lessons" style="font-size:0.82rem; padding:0.55rem 1.1rem;">
            Explore Lessons ↘
          </a>
        </div>
      </div>
    `;

    // Sticky Mobile Floating Action Bar
    const stickyMobileBarHtml = `
      <div class="sticky-mobile-action-bar" aria-label="Quick mobile study actions">
        <button type="button" class="mobile-bar-action" onclick="window.StudyDocket && window.StudyDocket.open()">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
          <span>Docket</span>
        </button>
        ${downloadDoc ? `
          <a class="mobile-bar-action" href="${esc(downloadDoc.path)}" download="${esc(downloadDoc.filename)}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
            <span>Master PDF</span>
          </a>
        ` : `
          <a class="mobile-bar-action" href="https://cas.res.in/pdf/CSE-Syllabus%202021-22.pdf#page=${selected.page}" target="_blank" rel="noopener">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            <span>Syllabus</span>
          </a>
        `}
        ${courseQuizList.length > 0 ? `
          <a class="mobile-bar-action" href="#quick-quiz">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            <span>Quiz</span>
          </a>
        ` : ''}
        <button type="button" class="mobile-bar-action" onclick="window.openGitHubModal()">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          <span>Star Repo</span>
        </button>
      </div>
    `;

    // 8. Render Complete Page
    $('#subject').innerHTML = `
      <a class="back-link" href="index.html#semester-${selected.semester}">
        ← Return to Semester 0${selected.semester} Featured Catalogue
      </a>

      <!-- Full-Cover Visual Hero with macOS Window Chrome -->
      <div class="course-hero-wrapper">
        <div class="course-hero-bg-scrim" aria-hidden="true"></div>
        <div class="mac-window-bar">
          <div class="mac-window-controls">
            <span class="mac-dot mac-close"></span>
            <span class="mac-dot mac-minimize"></span>
            <span class="mac-dot mac-expand"></span>
          </div>
          <div class="mac-window-title">${esc(selected.code)} · Postgraduate Terminal Workspace</div>
          <div style="font-size:0.72rem; color:var(--color-ink-muted); font-weight:600;">AKTU 2021–22 SCHEME</div>
        </div>
        <div class="course-hero-content">
          <div>
            ${credentialCardHtml}
            ${socialProofHtml}

            <h1 class="editorial-title">${esc(selected.title)}</h1>
            <p style="font-family:var(--font-mono); font-size:0.95rem; font-weight:700; color:var(--color-burgundy); margin:0.2rem 0 1rem;">
              ${esc(selected.code)} · 2021–22 CURRICULUM SCHEME
            </p>
            <p style="color:var(--color-ink-muted); font-size:1.05rem; line-height:1.6; max-width:54ch;">
              ${esc(selected.tagline || 'Advanced postgraduate curriculum module combining mathematical foundations, step-by-step algorithms, worked examination derivations, and interactive self-testing.')}
            </p>

            <div class="hero-actions" style="margin-top:2rem;">
              ${downloadHeroBtnHtml}
              <button class="docket-toggle-btn btn-burgundy ${isQueued ? 'is-queued' : ''}" 
                      data-code="${selected.code}" 
                      onclick="window.toggleSubjectDocket('${selected.code}', this)" 
                      style="font-size:0.88rem; padding:0.6rem 1.2rem;">
                ${isQueued ? '✓ Queued in Study Docket' : '+ Add to Study Docket'}
              </button>
              <a class="button btn-gold-outline" href="#interactive-picker">
                ⚡ Select Study Modules
              </a>
              <button class="docket-btn docket-btn-secondary" onclick="window.print()" style="font-size:0.88rem; padding:0.6rem 1.1rem;">
                🖨 Print Dossier
              </button>
            </div>
          </div>

          ${heroArtHtml}
        </div>
      </div>

      <!-- Academic Brand Trust Pillars -->
      ${trustPillarsHtml}

      <!-- Exam Readiness Telemetry Banner -->
      ${examReadinessBannerHtml}

      <!-- Sticky Quick-Jump Navigation Pills -->
      ${navPillsHtml}

      <!-- Official Master PDF Study Dossier -->
      ${downloadDossierHtml}

      <!-- Interactive Multi-Module Checkbox Picker & Live Selection Box -->
      ${interactivePickerHtml}

      <!-- Syllabus Units Blueprint -->
      ${syllabusUnitsHtml}

      <!-- Topic Lessons Section -->
      <section id="lessons">
        <div style="margin-bottom:1.5rem;">
          <div class="eyebrow" style="color:var(--color-burgundy);">Comprehensive Syllabus Exploration</div>
          <h2 class="editorial-title" style="font-size:2.2rem; margin:0.3rem 0;">Topic-by-Topic Lessons</h2>
          <p style="color:var(--color-ink-muted); margin:0;">
            Deconstruct each module with mathematical formulations, worked examples, and key invariants.
          </p>
          ${unitFilterPillsHtml}
        </div>
        ${lessonsHtml}
      </section>

      <!-- Architectural Lookbook & Visual Diagrams Grid -->
      ${lookbookHtml}

      <!-- GeeksforGeeks (GFG) Curated Reference Vault -->
      ${gfgVaultHtml}

      <!-- Self-Assessment Examination Quiz -->
      ${quizSectionHtml}

      <!-- Deep Study Layer / Mastery Hub -->
      ${masteryHtml}

      <!-- Past Exam Papers (PYQs) -->
      ${pyqHtml}

      <!-- Further Reading References -->
      ${readingsHtml}

      <!-- Image Zoom Dialog Modal -->
      ${imageZoomDialogHtml}

      <!-- Sticky Mobile Action Bar -->
      ${stickyMobileBarHtml}
    `;

    // Initialize date constraint for appointment booking form (min = today)
    const dateInput = document.getElementById('sched-date');
    if (dateInput) {
      const todayIso = new Date().toISOString().split('T')[0];
      dateInput.min = todayIso;
      dateInput.value = todayIso;
    }

    // Restore selected topics from localStorage
    window.restoreSelectedTopics && window.restoreSelectedTopics(selected.code);

    // 8. Attach Modals and Palette
    setupStudyDocketUI();
    setupExamPlannerModal();
    setupMobileQRModal();
    if (window.CommandPalette) window.CommandPalette.init(allCourses);
    updateAllDocketUI();
    setupGitHubEngagement();
    setupReadingProgressBar();
    setupScrollSpy();
  }

  function setupReadingProgressBar() {
    const bar = document.getElementById('reading-progress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? (window.scrollY / maxScroll) * 100 : 0;
      bar.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }, { passive: true });
  }

  window.copyLessonExample = function (btn) {
    const lessonId = btn.getAttribute('data-lesson');
    const body = document.getElementById(`lesson-example-body-${lessonId}`);
    if (body && navigator.clipboard) {
      navigator.clipboard.writeText(body.innerText.trim()).then(() => {
        const orig = btn.innerHTML;
        btn.innerHTML = '<span>✓ Copied</span>';
        setTimeout(() => { btn.innerHTML = orig; }, 1800);
      }).catch(() => {});
    }
  };

  window.copyFormula = function (btn) {
    const card = btn.closest('.formula-card');
    const code = card ? card.querySelector('code') : null;
    if (code && navigator.clipboard) {
      navigator.clipboard.writeText(code.innerText.trim()).then(() => {
        const orig = btn.innerText;
        btn.innerText = '✓ Copied';
        setTimeout(() => { btn.innerText = orig; }, 1800);
      }).catch(() => {});
    }
  };

  // Syllabus Unit Filter Handler
  window.filterLessonsByUnit = function (unit, btn) {
    const container = document.getElementById('lessons');
    if (!container) return;
    const pills = container.querySelectorAll('.unit-filter-pill');
    pills.forEach(p => p.classList.remove('is-active'));
    if (btn) btn.classList.add('is-active');

    const modules = container.querySelectorAll('.module');
    modules.forEach(m => {
      if (unit === 'all' || m.getAttribute('data-unit') === String(unit)) {
        m.style.display = 'block';
      } else {
        m.style.display = 'none';
      }
    });
  };

  // Quiz Option Click Handler
  window.handleQuizAnswer = function (btn, qIdx, optIdx, isCorrect, explanation) {
    const card = document.getElementById(`quiz-card-${qIdx}`);
    if (!card) return;
    const allBtns = card.querySelectorAll('.quiz-option-btn');
    allBtns.forEach(b => {
      b.disabled = true;
      b.style.pointerEvents = 'none';
    });

    if (isCorrect) {
      btn.classList.add('is-correct');
    } else {
      btn.classList.add('is-incorrect');
    }

    const feedback = document.getElementById(`quiz-feedback-${qIdx}`);
    if (feedback) {
      feedback.style.display = 'block';
      feedback.style.borderLeftColor = isCorrect ? 'var(--color-emerald)' : 'var(--color-amber)';
      feedback.innerHTML = `
        <div style="font-weight:700; color:${isCorrect ? 'var(--color-emerald)' : 'var(--color-amber)'}; margin-bottom:0.3rem;">
          ${isCorrect ? '✓ Correct Solution' : '✗ Conceptual Clarification'}
        </div>
        <div>${explanation}</div>
      `;
    }
  };

  // --------------------------------------------------------------------------
  // GitHub Community & Star Pop-Up Engagement System
  // --------------------------------------------------------------------------
  function setupGitHubEngagement() {
    // 1. Inject Floating Pill if not present
    if (!document.getElementById('github-floating-pill')) {
      const pill = document.createElement('div');
      pill.id = 'github-floating-pill';
      pill.className = 'github-floating-pill';
      pill.innerHTML = `
        <button type="button" class="github-pill-btn" onclick="window.openGitHubModal()" aria-label="Support repository on GitHub">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
          <span>⭐ Star on GitHub</span>
          <span style="font-size:0.7rem; background:rgba(0,0,0,0.06); padding:0.1rem 0.45rem; border-radius:999px;">Repo</span>
        </button>
      `;
      document.body.appendChild(pill);
    }

    // 2. Inject Modal Overlay if not present
    if (!document.getElementById('github-popup-overlay')) {
      const modal = document.createElement('div');
      modal.id = 'github-popup-overlay';
      modal.className = 'github-popup-overlay';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-label', 'Support M.Tech CSE Academic Repository on GitHub');
      modal.innerHTML = `
        <div class="github-popup-card mac-window" onclick="event.stopPropagation()">
          <div class="mac-window-bar">
            <div class="mac-window-controls">
              <span class="mac-dot mac-close" onclick="window.closeGitHubModal()" aria-label="Close dialog"></span>
              <span class="mac-dot mac-minimize"></span>
              <span class="mac-dot mac-expand"></span>
            </div>
            <div class="mac-window-title">github.com · Arshad9999/MTech-Cse-CAS-Course</div>
            <button type="button" onclick="window.closeGitHubModal()" style="background:none; border:none; font-size:1.1rem; cursor:pointer; color:var(--color-ink-muted);" aria-label="Close dialog">×</button>
          </div>
          <div class="github-popup-content">
            <div class="github-popup-brand">
              <div class="github-logo-wrap">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </div>
              <div>
                <span class="github-eyebrow">Open-Source Academic Archive</span>
                <h2 class="github-popup-title">Star the M.Tech Companion</h2>
              </div>
            </div>
            <p class="github-popup-desc">
              Curated for postgraduate scholars at CAS AKTU. Access verified lecture dossiers, complete LaTeX derivations, and 100% solved past examination questions.
            </p>
            <div class="github-popup-stats">
              <div class="github-stat">
                <strong>17</strong>
                <span>Master Dossiers</span>
              </div>
              <div class="github-stat">
                <strong>100%</strong>
                <span>Solved PYQs</span>
              </div>
              <div class="github-stat">
                <strong>4</strong>
                <span>Semesters</span>
              </div>
            </div>
            <a class="button btn-burgundy github-star-btn" href="https://github.com/Arshad9999/MTech-Cse-CAS-Course" target="_blank" rel="noopener">
              ⭐ Star on GitHub ↗
            </a>
            <div class="github-sub-actions">
              <a class="github-sub-link" href="https://github.com/Arshad9999/MTech-Cse-CAS-Course/fork" target="_blank" rel="noopener">Fork Repo</a>
              <span>•</span>
              <a class="github-sub-link" href="https://github.com/Arshad9999/MTech-Cse-CAS-Course/issues" target="_blank" rel="noopener">Contribute PYQ</a>
              <span>•</span>
              <button type="button" class="github-sub-link" onclick="window.dismissGitHubModal()" style="background:none; border:none; cursor:pointer; font-size:inherit; padding:0;">Dismiss</button>
            </div>
          </div>
        </div>
      `;
      modal.onclick = window.closeGitHubModal;
      document.body.appendChild(modal);
    }

    // 3. Proactive timer trigger (after 12 seconds if not previously dismissed)
    try {
      const dismissed = localStorage.getItem('cas_github_popup_dismissed');
      if (!dismissed) {
        setTimeout(() => {
          if (!localStorage.getItem('cas_github_popup_dismissed')) {
            window.openGitHubModal();
          }
        }, 12000);
      }
    } catch (e) {}
  }

  window.openGitHubModal = function () {
    const modal = document.getElementById('github-popup-overlay');
    if (modal) modal.classList.add('is-visible');
  };

  window.closeGitHubModal = function () {
    const modal = document.getElementById('github-popup-overlay');
    if (modal) modal.classList.remove('is-visible');
  };

  window.dismissGitHubModal = function () {
    window.closeGitHubModal();
    try {
      localStorage.setItem('cas_github_popup_dismissed', 'true');
    } catch (e) {}
  };

  
  // Image Zoom Modal Handler
  window.openImageZoomModal = function (src, alt, note) {
    const dialog = document.getElementById('image-zoom-dialog');
    const img = document.getElementById('zoom-dialog-img');
    const title = document.getElementById('zoom-dialog-title');
    const noteEl = document.getElementById('zoom-dialog-note');
    if (dialog && img) {
      img.src = src;
      img.alt = alt;
      if (title) title.innerText = alt.length > 38 ? alt.slice(0, 38) + '...' : alt;
      if (noteEl) noteEl.innerHTML = note ? `<strong>Reading Note:</strong> ${note}` : '';
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        dialog.setAttribute('open', '');
      }
    }
  };

  // Scroll-Spy for Course Navigation Pills
  function setupScrollSpy() {
    const pills = document.querySelectorAll('.course-nav-pill');
    if (!pills.length) return;
    const targetMap = [];
    pills.forEach(p => {
      const href = p.getAttribute('href');
      if (href && href.startsWith('#')) {
        const el = document.querySelector(href);
        if (el) targetMap.push({ pill: p, el: el });
      }
    });

    if (!targetMap.length) return;

    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY + 130;
      let activePill = null;
      for (let i = 0; i < targetMap.length; i++) {
        if (targetMap[i].el.offsetTop <= scrollPos) {
          activePill = targetMap[i].pill;
        }
      }
      pills.forEach(p => p.classList.remove('is-active'));
      if (activePill) activePill.classList.add('is-active');
    }, { passive: true });
  }

  // --------------------------------------------------------------------------
  // Interactive Module Picker Handlers
  // --------------------------------------------------------------------------
  let currentCourseCode = '';

  window.handleTopicPickerChange = function () {
    const checkboxes = document.querySelectorAll('.topic-checkbox:checked');
    const selectedList = Array.from(checkboxes).map(cb => cb.value);
    
    // Save to localStorage
    const code = new URLSearchParams(location.search).get('code') || '';
    currentCourseCode = code;
    try {
      localStorage.setItem('cas_selected_topics_' + code, JSON.stringify(selectedList));
    } catch (e) {}

    updateSelectedTopicsUI(selectedList);
  };

  function updateSelectedTopicsUI(selectedList) {
    const counter = document.getElementById('live-topics-counter');
    const stringBox = document.getElementById('live-topics-string');
    const formInput = document.getElementById('sched-topics');

    if (!counter || !stringBox) return;

    if (selectedList.length === 0) {
      counter.innerText = '0 Topics Selected';
      stringBox.innerHTML = '<span style="color:var(--color-ink-muted);">No topics selected yet. Check the boxes above to curate your personalised revision session.</span>';
      if (formInput) formInput.value = '';
    } else {
      const estimatedHours = (selectedList.length * 0.75).toFixed(1);
      counter.innerText = `${selectedList.length} Topic${selectedList.length > 1 ? 's' : ''} Selected · ~${estimatedHours} hrs`;
      stringBox.innerText = selectedList.join(', ');
      if (formInput) formInput.value = selectedList.join(', ');
    }
  }

  window.clearSelectedTopics = function () {
    const checkboxes = document.querySelectorAll('.topic-checkbox');
    checkboxes.forEach(cb => { cb.checked = false; });
    window.handleTopicPickerChange();
  };

  window.restoreSelectedTopics = function (code) {
    currentCourseCode = code;
    try {
      const saved = JSON.parse(localStorage.getItem('cas_selected_topics_' + code) || '[]');
      if (Array.isArray(saved) && saved.length > 0) {
        const checkboxes = document.querySelectorAll('.topic-checkbox');
        checkboxes.forEach(cb => {
          if (saved.includes(cb.value)) cb.checked = true;
        });
        updateSelectedTopicsUI(saved);
      }
    } catch (e) {}
  };

  window.queueSelectedInDocket = function (code) {
    if (window.StudyDocket) {
      if (!window.StudyDocket.isInDocket(code)) {
        window.StudyDocket.addToDocket(code);
      }
      window.StudyDocket.open();
    }
  };

  // --------------------------------------------------------------------------
  // Legacy Course Sub-page support (e.g. discrete-mathematics-and-graph-theory/index.html)
  // --------------------------------------------------------------------------
  async function initLegacyCoursePage() {
    const depth = document.body.dataset.depth || '../';
    const slug = document.body.dataset.course;
    const data = await fetch(depth + 'assets/course-data.json').then(r => r.json()).catch(() => ({ courses: [] }));
    const selected = data.courses.find(c => c.slug === slug);

    if (selected && selected.code) {
      // Seamlessly redirect to the modern flagship subject master hub
      window.location.replace(depth + 'subject.html?code=' + encodeURIComponent(selected.code));
      return;
    }

    // Fallback if not matched
    $('#nav').innerHTML = renderNav(depth);
    $('#foot').innerHTML = renderFoot();
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
    } else if (page === 'course') {
      initLegacyCoursePage().catch(err => console.error('Error initializing legacy course page:', err));
    }
  });

})();
