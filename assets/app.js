const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

async function loadJson(file) {
  const depth = document.body.dataset.depth || '';
  const response = await fetch(depth + 'assets/' + file);
  if (!response.ok) throw new Error(`${file} unavailable`);
  return response.json();
}

function nav(depth = '') {
  return `<header class="topbar"><nav class="nav shell" aria-label="Main navigation"><a class="brand" href="${depth}index.html">MTech<span> / CSE</span></a><div class="navlinks"><a href="${depth}index.html#courses">Courses</a><a href="${depth}index.html#study-path">Study path</a><a href="${depth}README.md">Repository guide</a></div></nav></header>`;
}

function foot() {
  return `<footer class="footer"><div class="shell">M.Tech CSE study companion · Based on the 2021–22 CAS syllabus · Verify current requirements with your department.</div></footer>`;
}

function credit(course) {
  return typeof course.credits === 'number' ? `${course.credits} credits` : 'Credit not stated';
}

function courseCard(course) {
  return `<article class="card course-card" style="--accent:${course.accent};--soft:${course.accent}14"><div class="code">${course.code} · ${credit(course)}</div><h3>${esc(course.title)}</h3><p>${esc(course.tagline)}</p><div class="chips"><span class="chip">${course.modules.length} study blocks</span><span class="chip">Mastery hub</span><span class="chip">Worked examples</span></div><a class="button" href="${course.slug}/index.html">Open course →</a></article>`;
}

const featured = [
  ['MCSC-101', 'MCSC-102', 'MCSC-103', 'MCSC-104', 'MCSC-105', 'MCSC-106'],
  ['MCSC-201', 'MCSC-202', 'MMLC-201', 'MMLC-202', 'MCSE-202', 'MMLE-201'],
  ['MCSC-301', 'MCSC-302', 'MMLC-301', 'MMLE-302'],
  ['MCSC-401']
];

async function home() {
  const catalog = await loadJson('catalog.json');
  $('#nav').innerHTML = nav();
  $('#foot').innerHTML = foot();
  const descriptions = ['Foundations and independent study', 'Core subjects and specialisation choices', 'Advanced study and dissertation I', 'Dissertation II'];
  const card = (course, isFeatured) => `<a class="catalog-card ${isFeatured ? 'featured-card' : ''}" href="subject.html?code=${encodeURIComponent(course.code)}"><span class="catalog-code">${esc(course.code)}</span><strong>${esc(course.title)}</strong><span class="catalog-category">${esc(course.category)}</span><span class="catalog-arrow" aria-hidden="true">↗</span><span class="catalog-status">${isFeatured ? 'Featured course' : course.guide ? 'Study guide available' : 'Syllabus reference'}</span></a>`;
  const render = query => {
    let count = 0;
    $('#semesters').innerHTML = [1, 2, 3, 4].map(semester => {
      const matches = catalog.filter(course => course.semester === semester && `${course.title} ${course.code} ${course.category}`.toLowerCase().includes(query));
      const primary = featured[semester - 1].map(code => matches.find(course => course.code === code)).filter(Boolean);
      const others = matches.filter(course => !featured[semester - 1].includes(course.code));
      count += matches.length;
      return `<section class="semester" id="semester-${semester}"><div class="semester-heading"><div><span class="semester-number">0${semester}</span><div><div class="eyebrow">Semester ${semester}</div><h3>${descriptions[semester - 1]}</h3></div></div><span class="semester-count">${matches.length} ${matches.length === 1 ? 'subject' : 'subjects'}</span></div>${primary.length ? `<p class="feature-label">Featured courses</p><div class="catalog-grid">${primary.map(course => card(course, true)).join('')}</div>` : ''}${others.length ? `<details class="other-courses" ${query ? 'open' : ''}><summary>Other subjects <span>${others.length}</span></summary><div class="catalog-grid">${others.map(course => card(course, false)).join('')}</div></details>` : ''}${matches.length ? '' : '<p class="empty">No matching subjects in this semester.</p>'}</section>`;
    }).join('');
    $('#search-status').textContent = query ? `${count} matching ${count === 1 ? 'subject' : 'subjects'}` : '';
  };
  render('');
  $('#q').addEventListener('input', event => render(event.target.value.trim().toLowerCase()));
}

function examSection(paper) {
  if (!paper) return `<section class="subject-box papers"><span class="eyebrow">Exam preparation</span><h2>Previous-year questions</h2><p>A verified matching or related AKTU M.Tech paper has not yet been added for this subject.</p></section>`;
  return `<section class="subject-box papers"><span class="eyebrow">Exam preparation</span><h2>Questions from a related AKTU M.Tech paper</h2><p>Questions are paraphrased and answers are study explanations. ${esc(paper.source)}. Check your own scheme and examination requirements.</p><a href="${esc(paper.url)}">View the source paper ↗</a><div class="question-list">${paper.questions.map(item => `<details><summary>${esc(item.question)}</summary><p>${esc(item.answer)}</p></details>`).join('')}</div></section>`;
}

async function subject() {
  const [catalog, topics, guides, papers, legacy, supplements] = await Promise.all([loadJson('catalog.json'), loadJson('subject-topics.json'), loadJson('featured-guides.json'), loadJson('related-papers.json'), loadJson('course-data.json'), loadJson('course-supplements.json')]);
  const code = new URLSearchParams(location.search).get('code');
  const selected = catalog.find(item => item.code === code);
  $('#nav').innerHTML = nav();
  $('#foot').innerHTML = foot();
  if (!selected) {
    $('#subject').innerHTML = '<h1>Subject not found</h1><p>Choose a subject from the programme directory.</p><a class="button" href="index.html#courses">Explore subjects</a>';
    return;
  }
  document.title = `${selected.title} · M.Tech CSE`;
  const isFeatured = featured[selected.semester - 1].includes(code);
  const guide = selected.guide ? `<div class="subject-box"><span class="eyebrow">Available now</span><h2>Original study guide</h2><p>The existing complete study page, visual maps and PDF remain available.</p><a class="button" href="${esc(selected.guide)}/index.html">Open original guide ↗</a><p class="small-note">The earlier guide may show different course labels or credits. Follow the 2021–22 scheme shown here.</p></div>` : `<div class="subject-box"><span class="eyebrow">${isFeatured ? 'Featured course' : 'In preparation'}</span><h2>Study guide</h2><p>${isFeatured ? 'Explore the topic-by-topic notes below, then use the syllabus and prescribed sources to deepen your study.' : 'A detailed guide is not yet available for this subject. Begin with the original syllabus and your instructor’s materials.'}</p></div>`;
  const notes = guides[code] || [];
  const lessons = notes.map((item,index) => `<article class="module feature-lesson"><span class="eyebrow">Study block ${String(index + 1).padStart(2,'0')}</span><h3>${esc(item.title)}</h3><p>${esc(item.explanation)}</p><div class="worked"><strong>Example</strong><br>${esc(item.example)}</div><p><strong>Distinction / checkpoint:</strong> ${esc(item.distinction)}</p></article>`).join('');
  const prior = selected.guide && isFeatured ? legacy.courses.find(item => item.slug === selected.guide) : null;
  const previousLessons = prior ? prior.modules.map((module, index) => lesson(module, index, (supplements[prior.slug].visuals || []).map(item => ({...item, src: item.src.replace(/^\.\.\//, '')})))).join('') + mastery(supplements[prior.slug]) : '';
  const visuals = {
    'MMLE-302': ['https://upload.wikimedia.org/wikipedia/commons/a/a5/Agent-environment-diagram-rl.svg', 'Diagram of an agent exchanging actions, states and rewards with its environment', 'Agent–environment interaction · Martin Thoma, CC0', 'https://commons.wikimedia.org/wiki/File:Agent-environment-diagram-rl.svg'],
    'MCSC-201': ['https://upload.wikimedia.org/wikipedia/commons/9/9b/Internet_of_Things.svg', 'Historical roadmap showing examples of connected things', 'Internet of Things roadmap (2008) · SRI Consulting Business Intelligence / National Intelligence Council, public domain', 'https://commons.wikimedia.org/wiki/File:Internet_of_Things.svg'],
    'MMLC-201': ['https://upload.wikimedia.org/wikipedia/commons/9/99/Neural_network_example.svg', 'A neural network with input, hidden and output nodes', 'Simple neural network · Wiso, public domain', 'https://commons.wikimedia.org/wiki/File:Neural_network_example.svg'],
    'MMLC-301': ['https://upload.wikimedia.org/wikipedia/commons/9/99/Neural_network_example.svg', 'A neural network with input, hidden and output nodes', 'Simple neural network · Wiso, public domain', 'https://commons.wikimedia.org/wiki/File:Neural_network_example.svg']
  };
  const figure = visuals[code];
  const visual = figure ? `<figure class="external-visual"><img src="${esc(figure[0])}" alt="${esc(figure[1])}" loading="lazy"><figcaption>${esc(figure[2])} · <a href="${esc(figure[3])}">Source and licence</a></figcaption></figure>` : '';

  const practiceItems = prior ? prior.modules.slice(0, 3).map(item => ({ title: item.title, answer: `${item.definition} Example: ${item.example}` })) : notes.slice(0, 3).map(item => ({ title: item.title, answer: `${item.explanation} Example: ${item.example} ${item.distinction}` }));
  const practice = isFeatured ? `<section class="subject-box papers"><span class="eyebrow">Retrieval practice</span><h2>Practice questions with answers</h2><p>These are original study questions, not previous-year examination questions.</p><div class="question-list">${practiceItems.map(item => `<details><summary>Explain ${esc(item.title)} with an example.</summary><p>${esc(item.answer)}</p></details>`).join('')}</div></section>` : '';
  const body = isFeatured ? `<section class="featured-notes"><span class="eyebrow">Featured course · study guide</span><h2>Learn topic by topic</h2><p>Start with definitions, examples and distinctions. These notes support study alongside the official syllabus and instructor materials.</p>${visual}${lessons}${previousLessons}</section>` : `<section class="subject-box topic-overview"><span class="eyebrow">Topic overview</span><h2>Start with the concepts</h2><p>These short explanations are a starting point. Consult the syllabus for the complete course and use the detailed guide where available.</p><div class="topic-overview-grid">${(topics[selected.code] || []).map(([title, explanation]) => `<article><h3>${esc(title)}</h3><p>${esc(explanation)}</p></article>`).join('')}</div></section>`;
  $('#subject').innerHTML = `<a class="back-link" href="index.html#semester-${selected.semester}">← Back to semester ${selected.semester}</a><div class="subject-intro"><div class="eyebrow">Semester ${selected.semester} / ${esc(selected.category)}${isFeatured ? ' / Featured' : ''}</div><h1>${esc(selected.title)}</h1><p class="subject-code">${esc(selected.code)} <span>·</span> 2021–22 scheme</p></div><div class="subject-grid">${guide}<div class="subject-box source-box"><span class="eyebrow">Official source</span><h2>Start with the syllabus</h2><p>Check the course description and programme structure in the university’s published PDF.</p><a class="source-link" href="https://cas.res.in/pdf/CSE-Syllabus%202021-22.pdf#page=${selected.page}">Open syllabus near page ${selected.page} ↗</a></div></div>${body}${practice}${examSection(papers[code])}`;
}

function comparisonTable(table) {
  return `<article class="comparison-card"><h3>${esc(table.title)}</h3><div class="table-scroll"><table><thead><tr>${table.headers.map(header => `<th>${esc(header)}</th>`).join('')}</tr></thead><tbody>${table.rows.map(row => `<tr>${row.map(value => `<td>${esc(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></article>`;
}

function mastery(supplement) {
  return `<section class="mastery-intro" id="mastery"><div class="eyebrow">Deep study layer</div><h2>Course mastery hub</h2><p>This reference layer turns the syllabus map into revision-ready definitions, classifications, equations, comparisons, error checks, and practice. Use it after the study blocks above.</p><div class="mastery-nav"><a href="#objectives">Objectives</a><a href="#glossary">Definitions</a><a href="#types">Types</a><a href="#formulas">Formula sheet</a><a href="#comparisons">Differences</a><a href="#pitfalls">Mistakes</a><a href="#practice">Practice</a><a href="#applications">Applied work</a></div></section>
  <section class="reference-section" id="objectives"><div class="section-kicker">01 · Direction</div><h2>What you should be able to do</h2><div class="objective-grid">${supplement.objectives.map((text,index) => `<article><span>${String(index + 1).padStart(2,'0')}</span><p>${esc(text)}</p></article>`).join('')}</div></section>
  <section class="reference-section" id="glossary"><div class="section-kicker">02 · Definitions</div><h2>Essential terminology</h2><p class="section-note">Open each term, recall the definition first, then compare your answer.</p><div class="accordion-grid">${supplement.glossary.map((item,index) => `<details ${index === 0 ? 'open' : ''}><summary>${esc(item[0])}</summary><p>${esc(item[1])}</p></details>`).join('')}</div></section>
  <section class="reference-section" id="types"><div class="section-kicker">03 · Classification</div><h2>Types and how they differ</h2><div class="type-grid">${supplement.types.map(item => `<article class="type-card"><h3>${esc(item[0])}</h3><p class="members">${esc(item[1])}</p><p>${esc(item[2])}</p></article>`).join('')}</div></section>
  <section class="reference-section" id="formulas"><div class="section-kicker">04 · Recall</div><h2>Formula and relationship sheet</h2><p class="section-note">A formula is only valid under its assumptions. Learn its purpose and interpretation with the symbols.</p><div class="formula-grid">${supplement.formulas.map(item => `<article class="formula-card"><h3>${esc(item[0])}</h3><code>${esc(item[1])}</code><p>${esc(item[2])}</p></article>`).join('')}</div></section>
  <section class="reference-section" id="comparisons"><div class="section-kicker">05 · Distinctions</div><h2>Difference tables</h2>${supplement.comparisons.map(comparisonTable).join('')}</section>
  <section class="reference-section" id="pitfalls"><div class="section-kicker">06 · Error prevention</div><h2>Common mistakes to avoid</h2><div class="pitfall-list">${supplement.pitfalls.map((text,index) => `<article><strong>${String(index + 1).padStart(2,'0')}</strong><p>${esc(text)}</p></article>`).join('')}</div></section>
  <section class="reference-section" id="practice"><div class="section-kicker">07 · Retrieval practice</div><h2>Questions with progressive hints</h2><p class="section-note">Attempt each question before revealing its hint. Write the complete answer, assumptions, and interpretation.</p><div class="practice-list">${supplement.practice.map((item,index) => `<details><summary><span>Q${index + 1}</span>${esc(item[0])}</summary><p><strong>Hint:</strong> ${esc(item[1])}</p></details>`).join('')}</div></section>
  <section class="reference-section" id="applications"><div class="section-kicker">08 · Application</div><h2>Applied exercises</h2><div class="application-grid">${supplement.applications.map((item,index) => `<article><div class="app-number">0${index + 1}</div><h3>${esc(item[0])}</h3><p>${esc(item[1])}</p></article>`).join('')}</div><div class="completion-note"><strong>Independent study checkpoint</strong><p>Work through the study blocks, reproduce the formula sheet, answer the practice prompts without hints, and finish at least one applied exercise before moving to assessment-focused revision. Use this portal alongside instructor materials and prescribed readings.</p></div></section>`;
}

function lessonVisual(visual) {
  if (!visual) return '';
  return `<figure class="lesson-visual"><img src="${esc(visual.src)}" alt="${esc(visual.alt)}" loading="lazy" decoding="async"><figcaption><strong>${esc(visual.title)}</strong><span>${esc(visual.caption)}</span></figcaption></figure>`;
}

function lesson(module, index, visuals) {
  const visual = visuals.find(item => item.afterModule === index + 1);
  return `<section class="module" id="m${index + 1}"><div class="eyebrow">Study block ${String(index + 1).padStart(2,'0')}</div><h2>${esc(module.title)}</h2><div class="topic-list">${module.topics.map(topic => `<span>${esc(topic)}</span>`).join('')}</div><p>${esc(module.definition)}</p><div class="equation" role="math">${esc(module.equation)}</div><div class="worked"><strong>Worked example</strong><br>${esc(module.example)}</div><p class="check">✓ Must understand: ${esc(module.checkpoint)}</p>${lessonVisual(visual)}</section>`;
}

async function course() {
  const [data, supplements] = await Promise.all([loadJson('course-data.json'), loadJson('course-supplements.json')]);
  const slug = document.body.dataset.course;
  const selected = data.courses.find(course => course.slug === slug);
  const supplement = supplements[slug];
  if (!selected || !supplement) throw new Error('Unknown course');
  document.documentElement.style.setProperty('--accent', selected.accent);
  document.documentElement.style.setProperty('--soft', selected.accent + '14');
  document.title = `${selected.code} · ${selected.title}`;
  $('#nav').innerHTML = nav('../');
  $('#courseHero').innerHTML = `<div><p class="notice">This existing guide uses earlier course labels. Check the <a href="../index.html#courses">2021–22 programme directory</a> for the syllabus code and semester.</p><div class="eyebrow">${selected.code} · ${credit(selected)}</div><h1>${esc(selected.title)}</h1><p class="lede">${esc(selected.tagline)}</p><div class="downloads"><a href="#m1">Start learning</a><a href="#mastery">Mastery hub</a><a href="${selected.code}-${selected.slug}.pdf">PDF handbook</a><a href="../index.html#courses">All courses</a></div></div><div class="hero-art"><img src="../assets/${selected.diagram}" alt="Concept diagram for ${esc(selected.title)}"></div>`;
  $('#toc').innerHTML = '<strong>Course lessons</strong>' + selected.modules.map((module,index) => `<a href="#m${index + 1}">${index + 1}. ${esc(module.title)}</a>`).join('') + '<strong class="toc-group">Mastery hub</strong><a href="#glossary">Definitions</a><a href="#types">Types</a><a href="#formulas">Formula sheet</a><a href="#comparisons">Difference tables</a><a href="#practice">Practice</a><a href="#applications">Applied work</a>';
  $('#modules').innerHTML = selected.modules.map((module, index) => lesson(module, index, supplement.visuals || [])).join('') + mastery(supplement);
  $('#foot').innerHTML = foot();
  if (location.hash) setTimeout(() => document.querySelector(location.hash)?.scrollIntoView(), 80);
}

window.addEventListener('DOMContentLoaded', () => {
  (document.body.dataset.page === 'home' ? home() : document.body.dataset.page === 'subject' ? subject() : course()).catch(error => {
    document.body.innerHTML = `<main class="shell"><h1>Unable to load the course</h1><p>${esc(error.message)}</p></main>`;
  });
});
