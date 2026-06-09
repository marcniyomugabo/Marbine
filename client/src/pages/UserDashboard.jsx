import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { memoriesAPI, galleryAPI, messagesAPI } from '../services/api';
import PageTransition from '../components/PageTransition';
import FloatingHearts from '../components/FloatingHearts';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
};

const userLinks = [
  { title: 'My Memories', desc: 'View and manage your memories', path: '/memories', icon: 'bi-journal-text', color: '#ec4899' },
  { title: 'Gallery', desc: 'Browse and upload photos', path: '/gallery', icon: 'bi-images', color: '#a855f7' },
  { title: 'Timeline', desc: 'Our journey milestones', path: '/timeline', icon: 'bi-clock-history', color: '#d4a853' },
  { title: 'Love Notes', desc: 'Send and receive messages', path: '/messages', icon: 'bi-chat-heart', color: '#f59e0b' },
  { title: 'Goals', desc: 'Our future plans', path: '/goals', icon: 'bi-bullseye', color: '#22d3ee' },
  { title: 'Profile', desc: 'Manage your account', path: '/profile', icon: 'bi-person-circle', color: '#9ca3af' },
];

function StatCard({ label, value, icon, color }) {
  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl p-4"
      style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--glass-shadow)',
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm" style={{ background: `${color}15`, color }}>
          <i className={icon} />
        </div>
        <div>
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{value}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ memories: 0, gallery: 0, messages: 0 });

  useEffect(() => {
    Promise.all([
      memoriesAPI.getAll().then(r => r.data),
      galleryAPI.getAll().then(r => r.data),
      messagesAPI.getAll().then(r => r.data),
    ]).then(([memories, gallery, messages]) => {
      setStats({
        memories: memories.length,
        gallery: gallery.length,
        messages: messages.length,
      });
    }).catch(() => {});
  }, []);

  return (
    <PageTransition>
      <FloatingHearts count={8} speed={0.4} />
      <section className="hero-section">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            className="text-center max-w-3xl mx-auto mb-10"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 22 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-5"
              style={{
                background: 'rgba(236,72,153,0.08)',
                color: '#ec4899',
                border: '1px solid rgba(236,72,153,0.12)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#ec4899', boxShadow: '0 0 6px rgba(236,72,153,0.5)' }} />
              Welcome back, {user?.fullname?.split(' ')[0] || 'Love'}
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.08] tracking-tight mb-4">
              <span className="gradient-text">Your Dashboard</span>
            </h1>
            <p className="text-base sm:text-lg leading-relaxed mb-4 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Here's your personal space in Marbine. Manage your memories, upload photos, and stay connected.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10"
          >
            <StatCard label="Memories" value={stats.memories} icon="bi-journal-text" color="#ec4899" />
            <StatCard label="Gallery" value={stats.gallery} icon="bi-images" color="#a855f7" />
            <StatCard label="Messages" value={stats.messages} icon="bi-chat-heart" color="#f59e0b" />
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {userLinks.map((link) => (
              <motion.div key={link.title} variants={fadeUp} className="h-full">
                <Link to={link.path} className="block no-underline group h-full">
                  <div
                    className="relative h-full overflow-hidden rounded-2xl transition-all duration-500 p-8 sm:p-10 flex flex-col"
                    style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                      boxShadow: 'var(--card-shadow)',
                    }}
                  >
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(135deg, ${link.color}08, ${link.color}04, transparent)` }}
                    />
                    <div className="relative">
                      <div
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl mb-5 transition-all duration-300 group-hover:scale-110"
                        style={{ background: `${link.color}12`, color: link.color, boxShadow: `0 0 30px ${link.color}10` }}
                      >
                        <i className={link.icon} />
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        {link.title}
                      </h3>
                      <p className="text-sm leading-relaxed flex-1" style={{ color: 'var(--text-secondary)' }}>
                        {link.desc}
                      </p>
                      <div
                        className="flex items-center gap-2 mt-5 text-sm font-medium transition-all duration-300 group-hover:gap-4"
                        style={{ color: link.color }}
                      >
                        <span>Explore</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
}
