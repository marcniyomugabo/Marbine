import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { memoriesAPI, galleryAPI, timelineAPI, goalsAPI } from '../../services/api';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState({ memories: 0, gallery: 0, timeline: 0, goals: 0 });
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    Promise.all([
      memoriesAPI.getAll().then(r => r.data),
      galleryAPI.getAll().then(r => r.data),
      timelineAPI.getAll().then(r => r.data),
      goalsAPI.getAll().then(r => r.data),
    ]).then(([memories, gallery, timeline, goals]) => {
      setStats({
        memories: memories.length,
        gallery: gallery.length,
        timeline: timeline.length,
        goals: goals.length,
      });
      const combined = [
        ...memories.slice(0, 3).map(m => ({ type: 'memory', label: m.title, date: m.memory_date })),
        ...timeline.slice(0, 3).map(t => ({ type: 'timeline', label: t.title, date: t.event_date })),
      ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
      setRecent(combined);
    }).catch(() => {});
  }, []);

  const cards = [
    { label: 'Memories', value: stats.memories, icon: 'bi-journal-text', color: '#ec4899' },
    { label: 'Gallery', value: stats.gallery, icon: 'bi-images', color: '#a855f7' },
    { label: 'Timeline', value: stats.timeline, icon: 'bi-clock-history', color: '#d4a853' },
    { label: 'Goals', value: stats.goals, icon: 'bi-bullseye', color: '#22d3ee' },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <span className="h-px w-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.2))' }} />
        <h1 className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Admin Dashboard</h1>
        <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.15))' }} />
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8"
      >
        {cards.map((card) => (
          <motion.div
            key={card.label}
            variants={fadeUp}
            className="rounded-2xl p-4 transition-all duration-300 hover:translate-y-[-2px]"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm"
                style={{ background: `${card.color}15`, color: card.color }}
              >
                <i className={card.icon} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{card.value}</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{card.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl p-5"
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)',
          boxShadow: 'var(--glass-shadow)',
        }}
      >
        <div className="flex items-center gap-2 mb-4">
          <i className="bi-clock-history text-xs" style={{ color: 'var(--text-tertiary)' }} />
          <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Recent Activity</h2>
          <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.1))' }} />
        </div>
        {recent.length === 0 ? (
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No activity yet.</p>
        ) : (
          <div className="space-y-1">
            {recent.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 py-2.5 px-2 rounded-xl transition-colors duration-200 hover:bg-white/[0.02]"
                style={{ borderBottom: i < recent.length - 1 ? '1px solid var(--border-color)' : 'none' }}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs"
                  style={{
                    background: item.type === 'memory' ? 'rgba(236,72,153,0.1)' : 'rgba(212,168,83,0.1)',
                    color: item.type === 'memory' ? '#ec4899' : '#d4a853',
                  }}
                >
                  <i className={item.type === 'memory' ? 'bi-journal-text' : 'bi-clock-history'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.label}</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{item.type}</p>
                </div>
                <span className="text-[11px] whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>{item.date}</span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
