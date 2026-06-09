import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { analyticsAPI } from '../services/api';
import PageTransition from '../components/PageTransition';
import FloatingHearts from '../components/FloatingHearts';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
};

export default function LoveAnalytics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.getLoveStats()
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-white/30 border-t-white animate-spin" />
    </div>
  );

  const bigStats = [
    { label: 'Days Together', value: stats?.daysTogether || 0, icon: 'bi-calendar-heart', color: '#ec4899', suffix: '' },
    { label: 'Memories', value: stats?.totalMemories || 0, icon: 'bi-journal-text', color: '#a855f7', suffix: '' },
    { label: 'Photos', value: stats?.totalPhotos || 0, icon: 'bi-images', color: '#d4a853', suffix: '' },
    { label: 'Messages', value: stats?.totalMessages || 0, icon: 'bi-chat-heart', color: '#f59e0b', suffix: '' },
    { label: 'Goals', value: stats?.totalGoals || 0, icon: 'bi-bullseye', color: '#22c55e', suffix: '' },
    { label: 'Total Likes', value: stats?.totalLikes || 0, icon: 'bi-hand-thumbs-up', color: '#3b82f6', suffix: '' },
  ];

  const smallStats = [
    { label: 'Songs in Playlist', value: stats?.totalSongs || 0, icon: 'bi-music-note', color: '#22d3ee' },
    { label: 'Love Letters', value: stats?.totalLetters || 0, icon: 'bi-envelope-heart', color: '#ec4899' },
    { label: 'Wishlist Items', value: stats?.totalWishlist || 0, icon: 'bi-gift', color: '#d4a853' },
    { label: 'Reactions Given', value: stats?.totalReactions || 0, icon: 'bi-emoji-heart-eyes', color: '#f472b6' },
  ];

  const maxMonthly = Math.max(...(stats?.monthlyActivity?.map(m => m.count) || [1]), 1);

  return (
    <PageTransition>
      <FloatingHearts count={6} speed={0.35} />
      <div className="page-container">
        <div className="content-wrapper">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.2))' }} />
            <h1 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Love Analytics</h1>
            <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.15))' }} />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
              style={{ background: 'rgba(168,85,247,0.08)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.12)' }}
            >📊 Our Love Story by the Numbers</span>
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Love Stats</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Every number tells a part of our story</p>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {bigStats.map(s => (
              <motion.div key={s.label} variants={fadeUp}
                className="rounded-2xl p-4 text-center transition-all duration-300 hover:translate-y-[-2px]"
                style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2 text-sm"
                  style={{ background: `${s.color}15`, color: s.color }}
                ><i className={s.icon} /></div>
                <p className="text-xl sm:text-2xl font-bold" style={{ color: s.color }}>{s.value.toLocaleString()}{s.suffix}</p>
                <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="lg:col-span-2 rounded-2xl p-5"
              style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <i className="bi-bar-chart text-xs" style={{ color: 'var(--text-tertiary)' }} />
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Monthly Memories</h3>
                <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.1))' }} />
              </div>
              {(!stats?.monthlyActivity || stats.monthlyActivity.length === 0) ? (
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>No data yet.</p>
              ) : (
                <div className="flex items-end gap-2 h-32">
                  {stats.monthlyActivity.slice().reverse().map((m) => (
                    <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(m.count / maxMonthly) * 100}%` }}
                        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                        className="w-full rounded-t-lg transition-all duration-300 hover:opacity-80 cursor-pointer"
                        style={{ background: 'linear-gradient(180deg, #ec4899, #a855f7)', minHeight: m.count > 0 ? '4px' : '0' }}
                      />
                      <span className="text-[8px] font-medium" style={{ color: 'var(--text-tertiary)' }}>{m.month.split('-')[1]}</span>
                      <span className="text-[8px] font-bold" style={{ color: 'var(--text-secondary)' }}>{m.count}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="rounded-2xl p-5"
              style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <i className="bi-trophy text-xs" style={{ color: 'var(--text-tertiary)' }} />
                <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Highlights</h3>
                <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.1))' }} />
              </div>
              <div className="space-y-3">
                {stats?.mostLiked && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase" style={{ color: '#ec4899' }}>Most Liked Memory</p>
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{stats.mostLiked.title}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{stats.mostLiked.likes} ❤️</p>
                  </div>
                )}
                {stats?.topCategory && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase" style={{ color: '#a855f7' }}>Top Category</p>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{stats.topCategory.category}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{stats.topCategory.cnt} memories</p>
                  </div>
                )}
                {stats?.longestMessage > 0 && (
                  <div>
                    <p className="text-[10px] font-semibold uppercase" style={{ color: '#f59e0b' }}>Longest Love Note</p>
                    <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>{stats.longestMessage} characters</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {smallStats.map(s => (
              <motion.div key={s.label} variants={fadeUp}
                className="rounded-2xl p-4 text-center"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', boxShadow: 'var(--card-shadow)' }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
                  style={{ background: `${s.color}12`, color: s.color }}
                ><i className={s.icon} /></div>
                <p className="text-base font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center">
            <div className="inline-flex items-center gap-2 px-5 py-3 rounded-full"
              style={{ background: 'rgba(236,72,153,0.06)', border: '1px solid rgba(236,72,153,0.1)' }}
            >
              <i className="bi-heart-fill" style={{ color: '#ec4899' }} />
              <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                {stats?.daysTogether || 0} days of love and counting...
              </span>
              <i className="bi-heart-fill" style={{ color: '#ec4899' }} />
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
