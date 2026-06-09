import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { memoriesAPI, galleryAPI, messagesAPI, goalsAPI } from '../services/api';
import PageTransition from '../components/PageTransition';
import FloatingHearts from '../components/FloatingHearts';
import DailyLoveMessage from '../components/DailyLoveMessage';
import RomanticMessage from '../components/RomanticMessage';
import AnniversaryCounter from '../components/AnniversaryCounter';
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

const quickActions = [
  { title: 'New Memory', desc: 'Write a memory', path: '/memories', icon: 'bi-journal-plus', color: '#ec4899' },
  { title: 'Upload Photo', desc: 'Share a photo', path: '/gallery', icon: 'bi-upload', color: '#a855f7' },
  { title: 'Love Note', desc: 'Send a message', path: '/messages', icon: 'bi-chat-heart', color: '#f59e0b' },
  { title: 'Add Goal', desc: 'Plan our future', path: '/goals', icon: 'bi-bullseye', color: '#22d3ee' },
];

const milestones = [
  { icon: 'bi-heart-fill', label: 'Our Story', desc: 'Every moment with you is a treasure I hold close to my heart.', color: '#ec4899' },
  { icon: 'bi-camera-fill', label: 'Memories', desc: 'Capturing our laughter, our adventures, and every beautiful in-between.', color: '#a855f7' },
  { icon: 'bi-star-fill', label: 'Dreams', desc: 'Building a future filled with love, growth, and endless possibilities.', color: '#d4a853' },
  { icon: 'bi-infinity', label: 'Forever', desc: 'No matter where life takes us, my heart will always find its way to you.', color: '#22d3ee' },
];

export default function UserHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ memories: 0, gallery: 0, messages: 0, goals: 0 });

  useEffect(() => {
    Promise.all([
      memoriesAPI.getAll().then(r => r.data),
      galleryAPI.getAll().then(r => r.data),
      messagesAPI.getAll().then(r => r.data),
      goalsAPI.getAll().then(r => r.data),
    ]).then(([memories, gallery, messages, goals]) => {
      setStats({
        memories: memories.length,
        gallery: gallery.length,
        messages: messages.length,
        goals: goals.length,
      });
    }).catch(() => {});
  }, []);

  const firstName = user?.fullname?.split(' ')[0] || 'Love';
  const partnerName = user?.fullname?.split(' ').slice(1).join(' ') || '';

  return (
    <PageTransition>
      <FloatingHearts count={10} speed={0.35} />
      <DailyLoveMessage />

      {/* Romantic AI Message */}
      <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24">
        <RomanticMessage />
      </section>

      {/* Together Since Counter */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          className="max-w-4xl mx-auto"
        >
          <AnniversaryCounter />
        </motion.div>
      </section>

      {/* Hero Welcome */}
      <section className="hero-section min-h-[60vh]">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }} />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 22 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
              style={{
                background: 'rgba(236,72,153,0.08)',
                color: '#ec4899',
                border: '1px solid rgba(236,72,153,0.12)',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#ec4899', boxShadow: '0 0 6px rgba(236,72,153,0.5)' }} />
              Welcome back, {firstName}
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight mb-4">
              <span className="gradient-text">Our Love Story</span>
            </h1>
            <p className="text-base sm:text-lg leading-relaxed mb-6 max-w-xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Every day with you is a page in our ever-growing story. Here's where our memories live.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-3"
            >
              <Link to="/memories">
                <motion.button className="btn-primary px-5 py-2.5 text-sm" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                  <span>
                    <i className="bi-journal-text me-1" />
                    Our Memories
                  </span>
                </motion.button>
              </Link>
              <Link to="/gallery">
                <motion.button
                  className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
                  style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-color)', background: 'transparent' }}
                  whileHover={{ scale: 1.04, borderColor: 'rgba(236,72,153,0.2)' }}
                  whileTap={{ scale: 0.96 }}
                >
                  <span className="flex items-center gap-2">
                    <i className="bi-images" />
                    View Gallery
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto mb-16"
          >
            {[
              { label: 'Memories', value: stats.memories, icon: 'bi-journal-text', color: '#ec4899' },
              { label: 'Photos', value: stats.gallery, icon: 'bi-images', color: '#a855f7' },
              { label: 'Love Notes', value: stats.messages, icon: 'bi-chat-heart', color: '#f59e0b' },
              { label: 'Goals', value: stats.goals, icon: 'bi-bullseye', color: '#22d3ee' },
            ].map((s) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                className="rounded-2xl p-4 text-center"
                style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--glass-shadow)',
                }}
              >
                <p className="text-2xl sm:text-3xl font-bold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="h-px flex-1 max-w-[100px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.2))' }} />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>Quick Actions</span>
              <span className="h-px flex-1 max-w-[100px]" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.2))' }} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {quickActions.map((action) => (
                <Link key={action.title} to={action.path} className="no-underline">
                  <motion.div
                    whileHover={{ scale: 1.04, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    className="rounded-2xl p-4 sm:p-5 text-center cursor-pointer transition-all duration-300"
                    style={{
                      background: 'var(--card-bg)',
                      border: '1px solid var(--card-border)',
                      boxShadow: 'var(--card-shadow)',
                    }}
                  >
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mx-auto mb-3 text-lg sm:text-xl"
                      style={{ background: `${action.color}15`, color: action.color }}
                    >
                      <i className={action.icon} />
                    </div>
                    <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{action.title}</h3>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-tertiary)' }}>{action.desc}</p>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Us - Romantic Section */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16" style={{
        background: 'radial-gradient(ellipse at center, rgba(236,72,153,0.04), transparent 70%)',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className="h-px flex-1 max-w-[120px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.3))' }} />
            <div className="text-center">
              <span className="text-xs font-semibold uppercase tracking-[0.25em] block mb-2" style={{ color: '#d4a853' }}>About Us</span>
              <h2 className="text-2xl sm:text-3xl font-bold gradient-text">Marc &amp; Blandine</h2>
            </div>
            <span className="h-px flex-1 max-w-[120px]" style={{ background: 'linear-gradient(270deg, transparent, rgba(212,168,83,0.3))' }} />
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <motion.p variants={fadeUp} className="text-base sm:text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              This is our digital love story — a place where we capture every laugh, every adventure, 
              and every quiet moment in between. From the day we met to the future we're building, 
              every memory here is a reminder that our love is the greatest story ever told.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {milestones.map((m) => (
              <motion.div
                key={m.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="rounded-2xl p-6 text-center transition-all duration-300 hover:translate-y-[-4px]"
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  boxShadow: 'var(--card-shadow)',
                }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
                  style={{ background: `${m.color}15`, color: m.color }}
                >
                  <i className={m.icon} />
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{m.label}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{m.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 200, damping: 25 }}
            className="mt-10 text-center"
          >
            <div
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full"
              style={{
                background: 'rgba(212,168,83,0.08)',
                border: '1px solid rgba(212,168,83,0.12)',
              }}
            >
              <i className="bi-heart-fill" style={{ color: '#ec4899' }} />
              <span className="text-sm font-medium" style={{ color: '#d4a853' }}>
                Together forever, starting now
              </span>
              <i className="bi-heart-fill" style={{ color: '#ec4899' }} />
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Quick Links */}
      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
          className="max-w-5xl mx-auto"
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="h-px flex-1 max-w-[120px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.25))' }} />
            <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>Explore More</span>
            <span className="h-px flex-1 max-w-[120px]" style={{ background: 'linear-gradient(270deg, transparent, rgba(168,85,247,0.25))' }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Our Timeline', desc: 'Relive our journey together, one milestone at a time.', path: '/timeline', icon: 'bi-clock-history', color: '#d4a853' },
              { title: 'Love Notes', desc: 'Send and receive messages filled with love.', path: '/messages', icon: 'bi-chat-heart-fill', color: '#f59e0b' },
              { title: 'Future Plans', desc: 'Our goals, dreams, and everything we want to achieve.', path: '/goals', icon: 'bi-bullseye', color: '#22c55e' },
            ].map((item) => (
              <Link key={item.title} to={item.path} className="no-underline group">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="rounded-2xl p-6 transition-all duration-300"
                  style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'var(--glass-shadow)',
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${item.color}15`, color: item.color }}
                    >
                      <i className={item.icon} />
                    </div>
                    <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      </section>
    </PageTransition>
  );
}
