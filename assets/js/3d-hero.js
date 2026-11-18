/**
 * CAS M.Tech CSE — Apple-Style Interactive 3D Hero Visual (3d-hero.js)
 * High-performance, Retina-optimised 3D mathematical knowledge lattice.
 * Renders connected multi-layer 3D nodal geometry responding to pointer coordinates.
 */

(function () {
  'use strict';

  function init3DHero(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = window.devicePixelRatio || 1;

    // Pointer coordinates with smooth spring inertia
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let rotX = 0.2;
    let rotY = 0.3;
    let autoRot = 0.003;
    let animFrame = null;
    let isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Generate 3D nodes on an icosahedron-like / spherical knowledge mesh
    const numNodes = 42; // Corresponds to the 42 subjects in the curriculum!
    const nodes = [];
    const phi = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < numNodes; i++) {
      // Golden spiral distribution on sphere
      const y = 1 - (i / (numNodes - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i * 2 * Math.PI;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      // Add multi-layered concentric depth
      const scale = 110 + (i % 3) * 25;
      nodes.push({
        x: x * scale,
        y: y * scale,
        z: z * scale,
        baseSize: (i % 4 === 0) ? 4.5 : 2.8,
        colorIndex: i % 4
      });
    }

    function resize() {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    }

    window.addEventListener('resize', resize, { passive: true });
    resize();

    // Mouse movement listener
    window.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      mouse.targetX = (e.clientX - cx) / (rect.width / 2);
      mouse.targetY = (e.clientY - cy) / (rect.height / 2);
    }, { passive: true });

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Smooth camera interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      if (!isReducedMotion) {
        rotY += autoRot + mouse.x * 0.01;
        rotX += mouse.y * 0.008;
      }

      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      const cx = width / 2;
      const cy = height / 2;
      const fov = 340;

      // Pre-calculate rotation matrices
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

      // Projected node coordinates
      const projected = [];

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // Rotate Y
        let x1 = n.x * cosY - n.z * sinY;
        let z1 = n.z * cosY + n.x * sinY;

        // Rotate X
        let y1 = n.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + n.y * sinX;

        // Depth perspective
        const depth = fov / (fov + z2 + 200);
        const px = cx + x1 * depth;
        const py = cy + y1 * depth;
        const alpha = Math.max(0.12, Math.min(0.9, (z2 + 160) / 320));

        projected.push({
          x: px,
          y: py,
          z: z2,
          size: n.baseSize * depth * (isDark ? 1.1 : 1.0),
          alpha: alpha,
          colorIndex: n.colorIndex
        });
      }

      // Draw connecting edges between nearby nodes
      ctx.lineWidth = isDark ? 0.75 : 0.6;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 64) {
            const edgeAlpha = (1 - dist / 64) * Math.min(p1.alpha, p2.alpha) * (isDark ? 0.35 : 0.22);
            ctx.strokeStyle = isDark
              ? `rgba(64, 169, 255, ${edgeAlpha})`
              : `rgba(0, 113, 227, ${edgeAlpha})`;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // Sort nodes for correct depth rendering
      projected.sort((a, b) => a.z - b.z);

      // Render nodes with specular Apple glow
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];

        // Glow gradient
        if (isDark) {
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 3);
          glow.addColorStop(0, `rgba(64, 169, 255, ${p.alpha * 0.8})`);
          glow.addColorStop(1, 'rgba(64, 169, 255, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
          ctx.fill();
        }

        // Core dot
        ctx.fillStyle = isDark
          ? `rgba(245, 245, 247, ${p.alpha})`
          : (p.colorIndex === 0 ? `rgba(0, 113, 227, ${p.alpha})` : `rgba(29, 29, 31, ${p.alpha})`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrame = requestAnimationFrame(render);
    }

    render();

    // Re-render when theme changes
    window.addEventListener('theme:changed', () => {
      // Re-render smoothly with new theme values
    });
  }

  window.init3DHero = init3DHero;
})();
