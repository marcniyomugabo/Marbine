import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AnniversaryCounter from '../components/AnniversaryCounter';
import PhotoCarousel from '../components/PhotoCarousel';
import FloatingParticles from '../components/FloatingParticles';
import FloatingHearts from '../components/FloatingHearts';
import PageTransition from '../components/PageTransition';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const guestFeatures = [
  { title: 'Memories', desc: 'Our precious moments', path: '/memories', icon: 'bi-journal-text', color: '#ec4899', tag: 'Latest' },
  { title: 'Gallery', desc: 'Photos of our story', path: '/gallery', icon: 'bi-images', color: '#a855f7', tag: 'Popular' },
  { title: 'Timeline', desc: 'Milestones together', path: '/timeline', icon: 'bi-clock-history', color: '#d4a853', tag: 'New' },
];

const userFeatures = [
  { title: 'Memories', desc: 'Our precious moments', path: '/memories', icon: 'bi-journal-text', color: '#ec4899', tag: 'Add' },
  { title: 'Gallery', desc: 'Photos of our story', path: '/gallery', icon: 'bi-images', color: '#a855f7', tag: 'Upload' },
  { title: 'Timeline', desc: 'Milestones together', path: '/timeline', icon: 'bi-clock-history', color: '#d4a853', tag: 'View' },
  { title: 'Love Notes', desc: 'Send messages', path: '/messages', icon: 'bi-chat-heart', color: '#f59e0b', tag: 'Chat' },
  { title: 'Goals', desc: 'Our future plans', path: '/goals', icon: 'bi-bullseye', color: '#22d3ee', tag: 'Plans' },
  { title: 'Profile', desc: 'Your account', path: '/profile', icon: 'bi-person-circle', color: '#9ca3af', tag: 'Account' },
];

const adminFeatures = [
  { title: 'Memories', desc: 'Capture every moment', path: '/memories', icon: 'bi-journal-text', color: '#ec4899', tag: 'Manage' },
  { title: 'Gallery', desc: 'Photos of our story', path: '/gallery', icon: 'bi-images', color: '#a855f7', tag: 'Upload' },
  { title: 'Timeline', desc: 'Milestones together', path: '/timeline', icon: 'bi-clock-history', color: '#d4a853', tag: 'Track' },
  { title: 'Love Notes', desc: 'Private messages', path: '/messages', icon: 'bi-chat-heart', color: '#f59e0b', tag: 'Inbox' },
  { title: 'Goals', desc: 'Our future plans', path: '/goals', icon: 'bi-bullseye', color: '#22d3ee', tag: 'Plans' },
  { title: 'Profile', desc: 'Your account', path: '/profile', icon: 'bi-person-circle', color: '#9ca3af', tag: 'Account' },
];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
};

function FeatureCard({ f }) {
  return (
    <motion.div variants={fadeUp} className="h-full">
      <Link to={f.path} className="block no-underline group h-full">
        <div
          className="romantic-card relative h-full overflow-hidden rounded-2xl transition-all duration-500"
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            boxShadow: 'var(--card-shadow)',
          }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: `linear-gradient(135deg, ${f.color}08, ${f.color}04, transparent)` }}
          />
          <div
            className="absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${f.color}15, transparent 60%)`,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '1px',
            }}
          />
          <div className="relative p-8 sm:p-10 flex flex-col h-full">
            <div className="flex items-start justify-between mb-5">
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                style={{
                  background: `${f.color}12`,
                  color: f.color,
                  boxShadow: `0 0 30px ${f.color}10`,
                }}
              >
                <i className={f.icon} />
              </div>
              {f.tag && (
                <span
                  className="text-sm font-semibold uppercase tracking-widest px-4 py-1.5 rounded-md"
                  style={{
                    background: `${f.color}10`,
                    color: f.color,
                    border: `1px solid ${f.color}15`,
                  }}
                >
                  {f.tag}
                </span>
              )}
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 transition-colors duration-200" style={{ color: 'var(--text-primary)' }}>
              {f.title}
            </h3>
            <p className="text-lg leading-relaxed mb-5 flex-1" style={{ color: 'var(--text-secondary)' }}>
              {f.desc}
            </p>
            <div
              className="flex items-center gap-2 text-lg font-medium transition-all duration-300 group-hover:gap-4"
              style={{ color: f.color }}
            >
              <span>Explore</span>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const features = !user ? guestFeatures : isAdmin ? adminFeatures : userFeatures;

  useEffect(() => {
    const handler = (e) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight });
    };
    window.addEventListener('mousemove', handler, { passive: true });
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  return (
    <PageTransition>
      {user && isAdmin ? <FloatingParticles count={12} speed={0.5} /> : <FloatingHearts count={10} speed={0.4} />}

      <section className="hero-section">
        <div
          className="absolute inset-0 transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(236,72,153,0.10), transparent 60%),
                        radial-gradient(ellipse at ${(1 - mousePos.x) * 100}% ${(1 - mousePos.y) * 100}%, rgba(168,85,247,0.08), transparent 60%)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-44">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 22 }}
            className="text-center max-w-3xl mx-auto"
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
              {user ? `Welcome back, ${user.fullname?.split(' ')[0] || 'Love'}` : 'A love story written in the stars'}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-5"
            >
              <span className="gradient-text">Marbine</span>
              <br />
              <span style={{ color: 'var(--text-primary)' }}>Memories</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl leading-relaxed mb-8 max-w-xl mx-auto px-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              Every moment with you is a treasure. This is our digital garden of memories, milestones, and dreams we're building together.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-3 px-4"
            >
              <Link to="/memories">
                <motion.button
                  className="btn-primary px-6 py-3 text-base"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <span>
                    Explore Our Story
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </span>
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button
                  className="px-6 py-3 rounded-xl text-base font-medium transition-all duration-300"
                  style={{
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-color)',
                    background: 'transparent',
                  }}
                  whileHover={{ scale: 1.04, borderColor: 'rgba(236,72,153,0.2)' }}
                  whileTap={{ scale: 0.96 }}
                >
                  <span className="flex items-center gap-2">
                    <i className="bi-send text-sm" />
                    Get in Touch
                  </span>
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-2 mt-10 px-4"
          >
            {['React', 'Love', 'Memories', 'Forever', 'Marbine'].map((tag) => (
              <span
                key={tag}
                className="tag-romantic text-sm px-4 py-2 rounded-full font-medium"
                style={{
                  color: 'var(--text-secondary)',
                  background: 'var(--card-bg)',
                  border: '1px solid var(--card-border)',
                  boxShadow: 'var(--card-shadow)',
                }}
              >
                #{tag}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="w-full px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        >
          <div className="flex items-center justify-center gap-6 mb-8">
            <span className="h-px flex-1 max-w-[160px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.25))' }} />
            <div className="text-center">
              <span className="text-sm font-semibold uppercase tracking-[0.25em] block mb-2" style={{ color: '#ec4899' }}>Featured Moments</span>
              <h2 className="text-2xl sm:text-3xl font-bold gradient-text">Our Most Precious Memories</h2>
            </div>
            <span className="h-px flex-1 max-w-[160px]" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.25))' }} />
          </div>
          <div className="max-w-[1600px] mx-auto">
            <PhotoCarousel interval={4500} />
          </div>
        </motion.div>
      </section>

      <section className="w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ type: 'spring', stiffness: 180, damping: 22 }}
        >
          <div className="flex items-center justify-center gap-6 mb-10">
            <span className="h-px flex-1 max-w-[160px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.25))' }} />
            <div className="text-center">
              <span className="text-sm font-semibold uppercase tracking-[0.25em] block mb-2" style={{ color: '#a855f7' }}>{isAdmin ? 'Explore' : 'Our Story'}</span>
              <h2 className="text-2xl sm:text-3xl font-bold gradient-text">{isAdmin ? 'Explore Our World' : 'Journey Together'}</h2>
            </div>
            <span className="h-px flex-1 max-w-[160px]" style={{ background: 'linear-gradient(270deg, transparent, rgba(168,85,247,0.25))' }} />
          </div>

          <div className="mb-12">
            <AnniversaryCounter />
          </div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            className="max-w-[1600px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((f) => (
              <FeatureCard key={f.title} f={f} />
            ))}
          </motion.div>
        </motion.div>
      </section>
    </PageTransition>
  );
}
