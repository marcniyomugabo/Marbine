import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { getAnniversary } from '../services/api';

function AnimatedValue({ value, label, delay, pad: doPad }) {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const start = prevValue.current;
    const diff = value - start;
    if (diff === 0) {
      setDisplay(value);
      return;
    }
    const duration = 400;
    const steps = 20;
    const stepTime = duration / steps;
    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + diff * eased));
      if (step >= steps) {
        clearInterval(interval);
        setDisplay(value);
        prevValue.current = value;
      }
    }, stepTime);
    return () => clearInterval(interval);
  }, [value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="counter-card group"
    >
      <div className="counter-value">{doPad ? String(display).padStart(2, '0') : display}</div>
      <div className="counter-label">{label}</div>
    </motion.div>
  );
}

export default function AnniversaryCounter() {
  const [data, setData] = useState(null);
  const [live, setLive] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const startRef = useRef(null);

  useEffect(() => {
    getAnniversary()
      .then((res) => {
        startRef.current = new Date(res.data.startDate);
        setData(res.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!startRef.current) return;
    const tick = () => {
      const diff = Date.now() - startRef.current.getTime();
      const totalSeconds = Math.floor(diff / 1000);
      const d = Math.floor(totalSeconds / 86400);
      const h = Math.floor((totalSeconds % 86400) / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = totalSeconds % 60;
      setLive({ days: d, hours: h, minutes: m, seconds: s });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [data]);

  if (!data) return null;

  const cards = [
    { label: 'Days', value: live.days, delay: 0 },
    { label: 'Hours', value: live.hours, delay: 0.05, pad: true },
    { label: 'Minutes', value: live.minutes, delay: 0.1, pad: true },
    { label: 'Seconds', value: live.seconds, delay: 0.15, pad: true },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center justify-center gap-6 mb-8">
        <span className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.25))' }} />
        <div className="text-center flex-shrink-0">
          <span className="text-sm font-semibold uppercase tracking-[0.25em] block mb-2" style={{ color: '#ec4899' }}>Together Since</span>
          <h2 className="text-xl sm:text-2xl font-bold gold-text">18 Apr 2025</h2>
        </div>
        <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.25))' }} />
      </div>
      <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
        {cards.map((card, i) => (
          <AnimatedValue key={i} value={card.value} label={card.label} delay={card.delay} pad={card.pad} />
        ))}
      </div>
    </motion.div>
  );
}
