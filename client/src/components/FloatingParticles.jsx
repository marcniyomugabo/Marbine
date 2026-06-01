import { useEffect, useRef } from 'react';

const COLORS = ['#ec4899', '#f472b6', '#fbcfe8', '#a855f7', '#c084fc', '#f59e0b', '#fbbf24', '#d4a853'];

const SHAPES = {
  heart: `<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>`,
  star: `<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>`,
  sparkle: `<path d="M12 0l1.5 4.5L18 6l-4.5 1.5L12 12l-1.5-4.5L6 6l4.5-1.5L12 0zM6 16l1.5-1.5L9 16l-1.5 1.5L6 16zm10-2l1-1 1 1-1 1-1-1zm-8 6l1.5-1.5L11 20l-1.5 1.5L8 20z"/>`,
  circle: `<circle cx="12" cy="12" r="6"/>`,
};

const SHAPE_KEYS = Object.keys(SHAPES);

function getShape() {
  const key = SHAPE_KEYS[Math.floor(Math.random() * SHAPE_KEYS.length)];
  return SHAPES[key];
}

export default function FloatingParticles({ count = 20, speed = 1 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const particles = [];

    for (let i = 0; i < count; i++) {
      const ns = 'http://www.w3.org/2000/svg';
      const el = document.createElementNS(ns, 'svg');
      el.setAttribute('viewBox', '0 0 24 24');
      el.style.position = 'absolute';
      const size = Math.random() * 16 + 8;
      el.style.width = `${size}px`;
      el.style.height = el.style.width;
      el.style.fill = COLORS[Math.floor(Math.random() * COLORS.length)];
      el.style.opacity = `${Math.random() * 0.3 + 0.05}`;
      el.style.pointerEvents = 'none';
      el.style.willChange = 'transform, opacity';
      el.style.left = `${Math.random() * 100}%`;
      el.style.bottom = '-5%';
      el.style.zIndex = '0';
      el.innerHTML = getShape();

      const dur = (Math.random() * 12 + 12) / speed;
      const delay = Math.random() * 20;

      el.animate(
        [
          { transform: 'translateY(0) rotate(0deg) scale(1)', opacity: parseFloat(el.style.opacity) },
          { transform: `translateY(-110vh) rotate(${Math.random() * 720 - 360}deg) scale(${Math.random() * 0.5 + 0.3})`, opacity: 0 },
        ],
        { duration: dur * 1000, delay: delay * 1000, iterations: Infinity, easing: 'linear' }
      );

      particles.push(el);
      container.appendChild(el);
    }

    return () => {
      particles.forEach((p) => p.remove());
    };
  }, [count, speed]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
    />
  );
}
