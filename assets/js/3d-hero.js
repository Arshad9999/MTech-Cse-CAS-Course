/**
 * CAS M.Tech CSE — Apple Light Mode 3D Hero Visual (3d-hero.js)
 * Clean, high-contrast mathematical lattice rendered on Retina canvas.
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

    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let rotX = 0.2;
    let rotY = 0.3;
    let autoRot = 0.0025;
    let isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const numNodes = 42;
    const nodes = [];
    const phi = (1 + Math.sqrt(5)) / 2;

    for (let i = 0; i < numNodes; i++) {
      const y = 1 - (i / (numNodes - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = phi * i * 2 * Math.PI;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const scale = 110 + (i % 3) * 25;
      nodes.push({
        x: x * scale,
        y: y * scale,
        z: z * scale,
        baseSize: (i % 4 === 0) ? 4.2 : 2.6,
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

    window.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      mouse.targetX = (e.clientX - cx) / (rect.width / 2);
      mouse.targetY = (e.clientY - cy) / (rect.height / 2);
    }, { passive: true });

    function render() {
      ctx.clearRect(0, 0, width, height);

      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      if (!isReducedMotion) {
        rotY += autoRot + mouse.x * 0.008;
        rotX += mouse.y * 0.006;
      }

      const cx = width / 2;
      const cy = height / 2;
      const fov = 340;

      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);

      const projected = [];

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        let x1 = n.x * cosY - n.z * sinY;
        let z1 = n.z * cosY + n.x * sinY;

        let y1 = n.y * cosX - z1 * sinX;
        let z2 = z1 * cosX + n.y * sinX;

        const depth = fov / (fov + z2 + 200);
        const px = cx + x1 * depth;
        const py = cy + y1 * depth;
        const alpha = Math.max(0.18, Math.min(0.9, (z2 + 160) / 320));

        projected.push({
          x: px,
          y: py,
          z: z2,
          size: n.baseSize * depth,
          alpha: alpha,
          colorIndex: n.colorIndex
        });
      }

      // Draw clean connecting edges
      ctx.lineWidth = 0.75;
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i];
          const p2 = projected[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 64) {
            const edgeAlpha = (1 - dist / 64) * Math.min(p1.alpha, p2.alpha) * 0.28;
            ctx.strokeStyle = `rgba(0, 113, 227, ${edgeAlpha})`;

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      projected.sort((a, b) => a.z - b.z);

      // Render crisp light mode nodes
      for (let i = 0; i < projected.length; i++) {
        const p = projected[i];
        ctx.fillStyle = (p.colorIndex === 0)
          ? `rgba(0, 113, 227, ${p.alpha * 0.95})`
          : `rgba(45, 55, 72, ${p.alpha * 0.85})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      requestAnimationFrame(render);
    }

    render();
  }

  window.init3DHero = init3DHero;
})();
