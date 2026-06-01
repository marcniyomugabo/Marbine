import { useEffect, useRef } from 'react';

const COLORS = ['#ec4899', '#f472b6', '#fbcfe8', '#a855f7', '#c084fc', '#f59e0b', '#fbbf24', '#d4a853'];

export default function FloatingHearts({ count = 15, speed = 1 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const hearts = [];

    for (let i = 0; i < count; i++) {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      el.setAttribute('viewBox', '0 0 24 24');
      el.style.position = 'absolute';
      el.style.width = `${Math.random() * 20 + 10}px`;
      el.style.height = el.style.width;
      el.style.fill = COLORS[Math.floor(Math.random() * COLORS.length)];
      el.style.opacity = `${Math.random() * 0.4 + 0.1}`;
      el.style.pointerEvents = 'none';
      el.style.willChange = 'transform, opacity';
      el.style.left = `${Math.random() * 100}%`;
      el.style.bottom = '-5%';
      el.style.zIndex = '0';
      el.innerHTML = `<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>`;

      const dur = (Math.random() * 10 + 10) / speed;
      const delay = Math.random() * 15;

      el.animate(
        [
          { transform: 'translateY(0) rotate(0deg) scale(1)', opacity: parseFloat(el.style.opacity) },
          { transform: `translateY(-110vh) rotate(${Math.random() * 360 - 180}deg) scale(${Math.random() * 0.5 + 0.5})`, opacity: 0 },
        ],
        { duration: dur * 1000, delay: delay * 1000, iterations: Infinity, easing: 'linear' }
      );

      hearts.push(el);
      container.appendChild(el);
    }

    return () => {
      hearts.forEach((h) => h.remove());
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
