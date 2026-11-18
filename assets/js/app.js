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
  // Navigation & Footers (Apple Style with Theme Switcher)
  // --------------------------------------------------------------------------
  function renderNav(depth = '') {
    const currentTheme = (typeof window.getPreferredTheme === 'function') ? window.getPreferredTheme() : 'light';
    const toggleIcon = currentTheme === 'dark' ? '☀️' : '🌙';

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
            
            <!-- Global Command Palette Shortcut -->
            <button class="cmd-key-hint" onclick="window.CommandPalette && window.CommandPalette.open()" style="cursor:pointer; display:inline-flex; align-items:center; gap:0.3rem;" aria-label="Search curriculum">
              <span>Search</span> <kbd style="font-size:0.68rem; font-family:var(--font-mono);">⌘K</kbd>
            </button>

            <!-- Dark / Light Theme Toggle Button -->
            <button class="theme-toggle-btn" onclick="window.toggleTheme && window.toggleTheme()" aria-label="Toggle theme">
              ${toggleIcon}
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
          <div style="font-size:0.84rem; color:var(--color-ink-muted);">
            Independent Academic Study Aid · Verify official requirements via <a href="https://cas.res.in" target="_blank" rel="noopener" style="color:var(--color-accent); font-weight:600;">cas.res.in ↗</a>
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
    const semCounts = { all: featuredCourses.length, 1: 0, 2: 0, 3: 0, 4: 0 };
    featuredCourses.forEach(c => {
      if (semCounts[c.semester] !== undefined) semCounts[c.semester]++;
    });

    return `
      <div class="sticky-ribbon-container" id="sticky-ribbon">
        <div class="shell sticky-ribbon">
          <!-- Semester Quick Jump Pills -->
          <div class="filter-group-pills" role="tablist" aria-label="Semester selection">
            <button class="filter-pill is-active" data-sem="all" role="tab">All Featured <span class="filter-pill-counter">${semCounts.all}</span></button>
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
            <button class="filter-pill" data-cat="pyq">PYQs Available</button>
          </div>

          <!-- Instant Search Box -->
          <div class="ribbon-search-box">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input type="search" class="ribbon-search-input" id="ribbon-search" placeholder="Search featured subjects..." aria-label="Search featured subjects">
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
        <span class="panel-label">FEATURED CURRICULUM COMPANION · CAS</span>
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
      // ONLY show featured courses
      const semCourses = featuredCourses.filter(c => {
        if (c.semester !== sem) return false;

        if (activeCategoryFilter === 'core' && !c.category.toLowerCase().includes('core')) return false;
        if (activeCategoryFilter === 'elective' && !c.category.toLowerCase().includes('elective')) return false;
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
            <p class="empty" style="color:var(--color-ink-muted);">No featured subjects match the selected criteria in Semester ${sem}.</p>
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
            <span class="semester-count">${semCourses.length} ${semCourses.length === 1 ? 'featured subject' : 'featured subjects'}</span>
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
      statusEl.textContent = `${totalMatches} featured subjects across selected criteria.`;
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

    // Fetch all study resources: guides, visuals, supplements, papers, readings
    let guides = {}, visuals = {}, supplements = {}, papers = {}, readings = {}, legacy = { courses: [] };
    try {
      const [g, v, s, p, r, l] = await Promise.all([
        fetch('assets/featured-guides.json').then(res => res.json()).catch(() => ({})),
        fetch('assets/course-visuals.json').then(res => res.json()).catch(() => ({})),
        fetch('assets/course-supplements.json').then(res => res.json()).catch(() => ({})),
        fetch('assets/related-papers.json').then(res => res.json()).catch(() => ({})),
        fetch('assets/course-reading.json').then(res => res.json()).catch(() => ({})),
        fetch('assets/course-data.json').then(res => res.json()).catch(() => ({ courses: [] }))
      ]);
      guides = g;
      visuals = v;
      supplements = s;
      papers = p;
      readings = r;
      legacy = l;
    } catch (e) {}

    const isQueued = window.StudyDocket && window.StudyDocket.isInDocket(selected.code);
    const domainKey = selected.domain || 'theory';
    const domainSvg = domainIcons[domainKey] || domainIcons['theory'];
    const domainLabel = domainKey === 'ai-ml' ? 'AI & Machine Learning'
      : domainKey === 'security-networks' ? 'Security & Networks'
      : domainKey === 'theory' ? 'Theory & Discrete'
      : 'Systems & ICT';

    // 1. Apple Course Hero Art
    const diagramInfo = courseDiagramVisuals[selected.code] || (selected.guide ? [`assets/${selected.guide}.svg`, selected.title, 'CAS AKTU', '#'] : null);
    const heroArtHtml = diagramInfo ? `
      <div class="course-hero-art">
        <a href="${esc(diagramInfo[0])}" target="_blank" rel="noopener">
          <img src="${esc(diagramInfo[0])}" alt="${esc(diagramInfo[1])}">
        </a>
        <div style="font-size:0.75rem; color:var(--color-ink-muted); margin-top:0.6rem;">
          ${esc(diagramInfo[2])} ${diagramInfo[3] ? `· <a href="${esc(diagramInfo[3])}" target="_blank" rel="noopener" style="color:var(--color-accent);">Source</a>` : ''}
        </div>
      </div>
    ` : '';

    // 2. Quick Jump Navigation Pills
    const navPillsHtml = `
      <nav class="course-nav-pills" aria-label="Course Sections">
        <a class="course-nav-pill" href="#lessons">Topic Lessons</a>
        <a class="course-nav-pill" href="#mastery">Mastery Hub</a>
        <a class="course-nav-pill" href="#objectives">Objectives</a>
        <a class="course-nav-pill" href="#glossary">Definitions</a>
        <a class="course-nav-pill" href="#types">Classifications</a>
        <a class="course-nav-pill" href="#formulas">Formula Sheet</a>
        <a class="course-nav-pill" href="#comparisons">Comparison Tables</a>
        <a class="course-nav-pill" href="#pitfalls">Mistakes to Avoid</a>
        <a class="course-nav-pill" href="#practice">Retrieval Practice</a>
        ${papers[selected.code] ? '<a class="course-nav-pill" href="#pyqs">Past Exam Papers</a>' : ''}
        ${readings[selected.code] ? '<a class="course-nav-pill" href="#readings">Further Reading</a>' : ''}
      </nav>
    `;

    // 3. Topic Lessons & User Figures
    const courseLessons = guides[selected.code] || [];
    const courseVisualList = visuals[selected.code] || [];

    const userFigureHtml = item => `
      <figure class="user-visual">
        <a href="${esc(item.src)}" target="_blank" rel="noopener" aria-label="Open full-size illustration: ${esc(item.alt)}">
          <img src="${esc(item.src)}" alt="${esc(item.alt)}" loading="lazy">
        </a>
        <figcaption>
          <strong>Curriculum Figure:</strong> ${esc(item.alt)}
          ${item.note ? `<p><strong>Reading Note:</strong> ${esc(item.note)}</p>` : ''}
        </figcaption>
      </figure>
    `;

    const lessonsHtml = courseLessons.map((item, index) => {
      const matchingVisuals = courseVisualList.filter(img => img.after === item.title);
      return `
        <article class="module" id="lesson-${index + 1}">
          <span class="eyebrow">Study Block ${String(index + 1).padStart(2, '0')}</span>
          <h3>${esc(item.title)}</h3>
          <p>${esc(item.explanation)}</p>
          
          <div class="worked">
            <strong>Step-by-Step Worked Example</strong><br>
            ${esc(item.example)}
          </div>

          <div class="check">
            ✓ <strong>Distinction / Invariant:</strong> ${esc(item.distinction)}
          </div>

          ${matchingVisuals.map(userFigureHtml).join('')}
        </article>
      `;
    }).join('');

    // 4. Mastery Hub Layer
    // Check if this subject has a supplement in course-supplements.json
    const legacyCourse = legacy.courses.find(l => l.code === selected.code || l.slug === selected.guide);
    const supplementKey = legacyCourse ? legacyCourse.slug : (selected.guide || '');
    const supplement = supplements[supplementKey] || null;

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
                <h3>${esc(item[0])}</h3>
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

    // 7. Render Complete Page
    $('#subject').innerHTML = `
      <a class="back-link" href="index.html#semester-${selected.semester}">
        ← Return to Semester 0${selected.semester} Featured Catalogue
      </a>

      <!-- Apple Glass Course Hero -->
      <section class="course-hero-glass">
        <div>
          <div class="course-hero-meta">
            <span class="domain-badge domain-${domainKey}">
              ${domainSvg}
              ${domainLabel}
            </span>
            <span class="telemetry-pill">${selected.credits} Credits</span>
            <span class="telemetry-pill">Sem 0${selected.semester}</span>
            <span class="telemetry-pill">~${selected.estimatedHours || 36} hrs prep</span>
            ${selected.hasPyq ? '<span class="telemetry-pill has-pyq">PYQ Papers Available</span>' : ''}
          </div>

          <h1>${esc(selected.title)}</h1>
          <p style="font-family:var(--font-mono); font-size:0.95rem; font-weight:700; color:var(--color-accent); margin:0.2rem 0 1rem;">
            ${esc(selected.code)} · CAS AKTU 2021–22 SCHEME
          </p>
          <p style="color:var(--color-ink-muted); font-size:1.05rem; line-height:1.5; max-width:54ch;">
            ${esc(selected.tagline || 'Postgraduate study block combining algorithmic rigor, formal proofs, and examination preparation.')}
          </p>

          <div class="hero-actions" style="margin-top:2rem;">
            <button class="docket-toggle-btn ${isQueued ? 'is-queued' : ''}" 
                    data-code="${selected.code}" 
                    onclick="window.toggleSubjectDocket('${selected.code}', this)" 
                    style="font-size:0.88rem; padding:0.6rem 1.2rem;">
              ${isQueued ? '✓ Queued in Study Docket' : '+ Add to Study Docket'}
            </button>
            <a class="button" href="https://cas.res.in/pdf/CSE-Syllabus%202021-22.pdf#page=${selected.page}" target="_blank" rel="noopener">
              View Syllabus PDF (Page ${selected.page}) ↗
            </a>
            <button class="docket-btn docket-btn-secondary" onclick="window.openMobileQRModal && window.openMobileQRModal()" style="font-size:0.88rem; padding:0.6rem 1.1rem;">
              📱 Mobile QR
            </button>
            <button class="docket-btn docket-btn-secondary" onclick="window.print()" style="font-size:0.88rem; padding:0.6rem 1.1rem;">
              🖨 Print Dossier
            </button>
          </div>
        </div>

        ${heroArtHtml}
      </section>

      <!-- Sticky Quick-Jump Navigation Pills -->
      ${navPillsHtml}

      <!-- Topic Lessons Section -->
      <section id="lessons">
        <div style="margin-bottom:1.5rem;">
          <div class="eyebrow">Comprehensive Syllabus Exploration</div>
          <h2 style="font-size:2.2rem; margin:0.3rem 0;">Topic-by-Topic Lessons</h2>
          <p style="color:var(--color-ink-muted); margin:0;">
            Deconstruct each module with mathematical formulations, worked examples, and key invariants.
          </p>
        </div>
        ${lessonsHtml}
      </section>

      <!-- Deep Study Layer / Mastery Hub -->
      ${masteryHtml}

      <!-- Past Exam Papers (PYQs) -->
      ${pyqHtml}

      <!-- Further Reading References -->
      ${readingsHtml}
    `;

    // 8. Attach Modals and Palette
    setupStudyDocketUI();
    setupExamPlannerModal();
    setupMobileQRModal();
    if (window.CommandPalette) window.CommandPalette.init(allCourses);
    updateAllDocketUI();
  }

  // --------------------------------------------------------------------------
  // Legacy Course Sub-page support (e.g. discrete-mathematics-and-graph-theory/index.html)
  // --------------------------------------------------------------------------
  async function initLegacyCoursePage() {
    const depth = document.body.dataset.depth || '../';
    const slug = document.body.dataset.course;
    const [data, supplements] = await Promise.all([
      fetch(depth + 'assets/course-data.json').then(r => r.json()),
      fetch(depth + 'assets/course-supplements.json').then(r => r.json())
    ]);

    const selected = data.courses.find(c => c.slug === slug);
    const supplement = supplements[slug];
    if (!selected || !supplement) throw new Error('Course guide not found');

    $('#nav').innerHTML = renderNav(depth);
    $('#foot').innerHTML = renderFoot();
    document.title = `${selected.code} · ${selected.title}`;

    if (window.CommandPalette) {
      const catalog = await (await fetch(depth + 'data/courses.json')).json();
      window.CommandPalette.init(catalog);
    }
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
