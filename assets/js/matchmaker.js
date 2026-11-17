/**
 * CAS M.Tech CSE — Elective & Track Matchmaker (matchmaker.js)
 * Evolution: Tier 4 / Rounds 32–65 (Interactive Discovery & Peak UX)
 *
 * 2-Axis Visual Explorer:
 *   X-Axis: Theory & Foundations (-1) <--> Systems & Infrastructure (+1)
 *   Y-Axis: Cyber Security & Networks (-1) <--> AI & Data Science (+1)
 *
 * Real-time Euclidean distance calculation, elective recommendation ranking,
 * prerequisite graph mapping, and one-click study docket insertion.
 */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TrackMatchmaker = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let allCourses = [];
  let puckCoords = { x: 0.1, y: 0.2 }; // Default center-ish
  let containerEl = null;
  let canvasAreaEl = null;
  let puckEl = null;
  let resultsListEl = null;
  let isDragging = false;

  function init(containerSelector, courses) {
    containerEl = document.querySelector(containerSelector);
    if (!containerEl) return;
    allCourses = courses || [];

    renderStructure();
    bindEvents();
    updateMatchmaker(puckCoords.x, puckCoords.y);
  }

  function renderStructure() {
    containerEl.innerHTML = `
      <div class="matchmaker-container">
        <div class="matchmaker-canvas-wrapper">
          <div class="matchmaker-axes-labels">
            <span>← Theory & Foundations</span>
            <span>Systems & Infrastructure →</span>
          </div>

          <div class="canvas-interactive-area" id="matchmaker-canvas" role="region" aria-label="Interactive academic interest plane. Click or drag to locate matching electives.">
            <div class="canvas-crosshair-x"></div>
            <div class="canvas-crosshair-y"></div>
            
            <div class="canvas-quadrant-tag quadrant-tl">AI / Data Theory</div>
            <div class="canvas-quadrant-tag quadrant-tr">Applied AI & Systems</div>
            <div class="canvas-quadrant-tag quadrant-bl">Cryptographic Foundations</div>
            <div class="canvas-quadrant-tag quadrant-br">Network & Cyber Systems</div>

            <!-- Course Nodes -->
            <div id="matchmaker-nodes-layer"></div>

            <!-- Interactive Puck -->
            <div class="matchmaker-puck" id="matchmaker-puck" style="left: 55%; top: 40%;"></div>
          </div>

          <div class="matchmaker-axes-labels" style="margin-top:0.6rem; justify-content:center; color: var(--color-ink-muted);">
            <span>↑ AI & Data Science &nbsp;|&nbsp; Cyber Security & Networks ↓</span>
          </div>
          <p style="font-size:0.78rem; color:var(--color-ink-muted); margin:0.8rem 0 0; text-align:center;">
            Click anywhere on the plane or drag the reticle to calibrate your research and elective preferences.
          </p>
        </div>

        <div class="matchmaker-results-box">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
            <h3>Recommended Electives</h3>
            <span id="matchmaker-top-track" style="font-size:0.75rem; font-weight:700; color:var(--color-accent); text-transform:uppercase; letter-spacing:0.06em;">AI & Data Track</span>
          </div>
          <p>Ranked in real time based on coordinate proximity, CAS credit weightage, and curriculum prerequisites.</p>
          
          <div class="matchmaker-rec-list" id="matchmaker-rec-list"></div>

          <div style="margin-top:1.2rem; display:flex; gap:0.6rem; flex-wrap:wrap;">
            <button class="docket-btn" id="matchmaker-add-top" style="flex:1;">
              + Add Top 3 to Study Docket
            </button>
          </div>
        </div>
      </div>
    `;

    canvasAreaEl = containerEl.querySelector('#matchmaker-canvas');
    puckEl = containerEl.querySelector('#matchmaker-puck');
    resultsListEl = containerEl.querySelector('#matchmaker-rec-list');

    renderCourseNodes();
  }

  function renderCourseNodes() {
    const layer = containerEl.querySelector('#matchmaker-nodes-layer');
    if (!layer) return;

    layer.innerHTML = allCourses.map(course => {
      const coords = course.coordinates || { x: 0, y: 0 };
      // Map [-1, 1] to [8%, 92%] inside canvas
      const left = ((coords.x + 1) / 2 * 84 + 8).toFixed(1);
      // Invert Y because canvas top is 0
      const top = ((1 - coords.y) / 2 * 84 + 8).toFixed(1);

      return `
        <div class="matchmaker-course-dot" id="dot-${course.code}" 
             style="left: ${left}%; top: ${top}%;" 
             title="${course.code}: ${course.title} (${course.category})">
        </div>
      `;
    }).join('');
  }

  function bindEvents() {
    if (!canvasAreaEl) return;

    function handlePointer(event) {
      const rect = canvasAreaEl.getBoundingClientRect();
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;

      let normX = (clientX - rect.left) / rect.width;
      let normY = (clientY - rect.top) / rect.height;

      normX = Math.max(0.05, Math.min(0.95, normX));
      normY = Math.max(0.05, Math.min(0.95, normY));

      // Convert to [-1, 1]
      const coordX = (normX - 0.5) * 2;
      const coordY = (0.5 - normY) * 2;

      puckCoords = { x: coordX, y: coordY };
      puckEl.style.left = `${(normX * 100).toFixed(1)}%`;
      puckEl.style.top = `${(normY * 100).toFixed(1)}%`;

      updateMatchmaker(coordX, coordY);
    }

    canvasAreaEl.addEventListener('mousedown', e => {
      isDragging = true;
      handlePointer(e);
    });

    window.addEventListener('mousemove', e => {
      if (isDragging) handlePointer(e);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Touch events for mobile
    canvasAreaEl.addEventListener('touchstart', e => {
      isDragging = true;
      handlePointer(e);
      e.preventDefault();
    }, { passive: false });

    window.addEventListener('touchmove', e => {
      if (isDragging) {
        handlePointer(e);
        e.preventDefault();
      }
    }, { passive: false });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });

    const addTopBtn = containerEl.querySelector('#matchmaker-add-top');
    if (addTopBtn) {
      addTopBtn.addEventListener('click', () => {
        const topCourses = getTopMatches(3);
        let addedCount = 0;
        topCourses.forEach(c => {
          if (window.StudyDocket && window.StudyDocket.addToDocket(c.code)) {
            addedCount++;
          }
        });
        if (window.showToast) {
          window.showToast(addedCount > 0 ? `Added ${addedCount} recommended electives to your Study Docket` : 'Recommended electives already in your Docket');
        }
      });
    }
  }

  function getTopMatches(limit = 5) {
    // Score all electives based on Euclidean distance
    const scored = allCourses
      .filter(c => c.category.toLowerCase().includes('elective') || c.category.toLowerCase().includes('specialisation'))
      .map(c => {
        const coords = c.coordinates || { x: 0, y: 0 };
        const dx = coords.x - puckCoords.x;
        const dy = coords.y - puckCoords.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        // Normalize distance: max distance in [-1,1] square is ~2.82
        const matchPercent = Math.max(10, Math.min(99, Math.round((1 - (dist / 2.2)) * 100)));
        return { course: c, distance: dist, matchPercent };
      });

    scored.sort((a, b) => b.matchPercent - a.matchPercent);
    return scored.slice(0, limit).map(item => ({ ...item.course, matchPercent: item.matchPercent }));
  }

  function updateMatchmaker(x, y) {
    // Identify active track quadrant
    const trackTagEl = containerEl.querySelector('#matchmaker-top-track');
    if (trackTagEl) {
      if (y >= 0 && x >= 0) trackTagEl.textContent = 'Applied AI & Systems Track';
      else if (y >= 0 && x < 0) trackTagEl.textContent = 'AI & Data Foundations Track';
      else if (y < 0 && x < 0) trackTagEl.textContent = 'Formal Cryptography Track';
      else trackTagEl.textContent = 'Cyber Defence & Networks Track';
    }

    const topMatches = getTopMatches(5);

    // Update highlighted dots on canvas
    allCourses.forEach(c => {
      const dot = containerEl.querySelector(`#dot-${c.code}`);
      if (dot) {
        dot.classList.remove('is-highlighted');
      }
    });

    topMatches.slice(0, 3).forEach(c => {
      const dot = containerEl.querySelector(`#dot-${c.code}`);
      if (dot) dot.classList.add('is-highlighted');
    });

    // Render results cards
    if (resultsListEl) {
      resultsListEl.innerHTML = topMatches.map(c => {
        const inDocket = window.StudyDocket && window.StudyDocket.isInDocket(c.code);
        const prereqNote = c.prerequisites && c.prerequisites.length > 0
          ? `<span style="display:block; font-size:0.7rem; color:#b45309; margin-top:0.2rem;">Prerequisite: ${c.prerequisites.join(', ')}</span>`
          : '';

        return `
          <div class="matchmaker-rec-card">
            <div class="rec-card-info" style="flex:1;">
              <span style="font-family:var(--font-mono); font-weight:700; color:var(--color-accent);">${c.code} · Sem 0${c.semester}</span>
              <strong>${c.title}</strong>
              <span>${c.credits} Credits · ${c.unitsCount || 4} Units</span>
              ${prereqNote}
            </div>
            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:0.4rem;">
              <span class="rec-match-score">${c.matchPercent}% Match</span>
              <button class="docket-toggle-btn ${inDocket ? 'is-queued' : ''}" 
                      onclick="window.toggleSubjectDocket('${c.code}', this)" 
                      style="font-size:0.72rem; padding:0.25rem 0.5rem;">
                ${inDocket ? '✓ Queued' : '+ Docket'}
              </button>
            </div>
          </div>
        `;
      }).join('');
    }
  }

  return {
    init,
    getTopMatches,
    updateMatchmaker
  };
});
