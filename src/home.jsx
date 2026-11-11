import React from 'react';
import { createRoot } from 'react-dom/client';
import { animate, stagger } from 'framer-motion';
import { GradientUnderlineLink } from './components/GradientUnderlineLink';

const sourceLink = document.querySelector('#syllabus-link');
if (sourceLink) {
  createRoot(sourceLink).render(<GradientUnderlineLink href="https://cas.res.in/pdf/CSE-Syllabus%202021-22.pdf">View the 2021–22 syllabus ↗</GradientUnderlineLink>);
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  animate('.portal-hero > div, .hero-panel', { opacity: [0.65, 1], y: [12, 0] }, { duration: 0.5, delay: stagger(0.1), ease: 'easeOut' });
}
