import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { analyticsAPI } from '../../services/api';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyticsAPI.getStats()
      .then(r => setStats(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '400px' }}>
        <div className="spinner-border text-light" role="status" style={{ width: '3rem', height: '3rem' }}>
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const cards = [
    { label: 'Memories', value: stats?.memories || 0, icon: 'bi-journal-text', color: '#ec4899' },
    { label: 'Gallery', value: stats?.gallery || 0, icon: 'bi-images', color: '#a855f7' },
    { label: 'Timeline', value: stats?.timeline || 0, icon: 'bi-clock-history', color: '#d4a853' },
    { label: 'Goals', value: stats?.goals || 0, icon: 'bi-bullseye', color: '#22c55e' },
    { label: 'Feedback', value: stats?.feedback || 0, icon: 'bi-chat-dots', color: '#3b82f6' },
    { label: 'Users', value: stats?.users || 0, icon: 'bi-people', color: '#f97316' },
  ];

  return (
    <div className="container-fluid px-0">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="d-flex align-items-center gap-3 mb-4"
      >
        <span className="h-px" style={{ width: '1.5rem', background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.2))' }} />
        <h2 className="fw-semibold text-uppercase mb-0" style={{ color: 'var(--text-secondary)', fontSize: '1rem', letterSpacing: '0.15em' }}>
          <i className="bi-speedometer2 me-2" style={{ color: '#ec4899' }} />
          Admin Dashboard
        </h2>
        <span className="h-px flex-grow-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.15))' }} />
      </motion.div>

      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="row g-3 mb-4"
      >
        {cards.map((card) => (
          <motion.div
            key={card.label}
            variants={fadeUp}
            className="col-6 col-md-4 col-lg-2"
          >
            <div
              className="card border-0 rounded-4 h-100 p-3 transition-all"
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--glass-shadow)',
              }}
            >
              <div className="card-body d-flex align-items-center gap-3 p-0">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    background: `${card.color}15`,
                    color: card.color,
                    fontSize: '1.6rem',
                  }}
                >
                  <i className={card.icon} />
                </div>
                <div>
                  <p className="fw-bold mb-0" style={{ color: 'var(--text-primary)', fontSize: '2rem', lineHeight: 1.2 }}>{card.value}</p>
                  <p className="mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{card.label}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="card border-0 rounded-4 h-100 p-4"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow)',
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi-people fs-5" style={{ color: 'var(--text-tertiary)' }} />
              <h5 className="fw-semibold text-uppercase mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', letterSpacing: '0.1em' }}>Recent Users</h5>
              <span className="h-px flex-grow-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.1))' }} />
            </div>
            {(!stats?.recentUsers || stats.recentUsers.length === 0) ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }} className="mb-0">No users yet.</p>
            ) : (
              <div className="d-flex flex-column gap-1">
                {stats.recentUsers.map((u) => (
                  <div key={u.id} className="d-flex align-items-center gap-3 py-2 px-2 rounded-3"
                    style={{ borderBottom: '1px solid var(--border-color)' }}
                  >
                    <div className="d-flex align-items-center justify-content-center rounded-2 fw-bold flex-shrink-0"
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        background: u.role === 'admin' ? 'rgba(236,72,153,0.1)' : 'rgba(249,115,22,0.1)',
                        color: u.role === 'admin' ? '#ec4899' : '#f97316',
                        fontSize: '0.9rem',
                      }}
                    >
                      {u.fullname?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <p className="fw-medium text-truncate mb-0" style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{u.fullname}</p>
                      <p className="text-truncate mb-0" style={{ color: 'var(--text-tertiary)', fontSize: '0.8rem' }}>{u.email}</p>
                    </div>
                    <span className="badge rounded-pill" style={{
                      background: u.role === 'admin' ? 'rgba(236,72,153,0.1)' : 'rgba(249,115,22,0.08)',
                      color: u.role === 'admin' ? '#ec4899' : '#f97316',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      border: `1px solid ${u.role === 'admin' ? 'rgba(236,72,153,0.15)' : 'rgba(249,115,22,0.12)'}`,
                    }}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <div className="col-12 col-lg-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="card border-0 rounded-4 h-100 p-4"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow)',
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-3">
              <i className="bi-chat-dots fs-5" style={{ color: 'var(--text-tertiary)' }} />
              <h5 className="fw-semibold text-uppercase mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', letterSpacing: '0.1em' }}>Recent Feedback</h5>
              <span className="h-px flex-grow-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.1))' }} />
            </div>
            {(!stats?.recentFeedback || stats.recentFeedback.length === 0) ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }} className="mb-0">No feedback yet.</p>
            ) : (
              <div className="d-flex flex-column gap-1">
                {stats.recentFeedback.map((fb) => (
                  <div key={fb.id} className="d-flex align-items-start gap-3 py-2 px-2 rounded-3"
                    style={{ borderBottom: '1px solid var(--border-color)' }}
                  >
                    <div className="d-flex align-items-center justify-content-center rounded-2 flex-shrink-0 mt-1"
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        background: 'rgba(59,130,246,0.1)',
                        color: '#3b82f6',
                        fontSize: '1.1rem',
                      }}
                    >
                      <i className="bi-person" />
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <p className="fw-medium text-truncate mb-0" style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{fb.name}</p>
                      <p className="text-truncate mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{fb.comment}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, type: 'spring', stiffness: 180, damping: 22 }}
        className="card border-0 rounded-4 p-5"
        style={{
          background: 'linear-gradient(135deg, rgba(236,72,153,0.06), rgba(212,168,83,0.04), rgba(168,85,247,0.06))',
          border: '1px solid rgba(236,72,153,0.08)',
        }}
      >
        <div className="d-flex align-items-center gap-3 mb-4">
          <span className="h-px" style={{ width: '1.5rem', background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.25))' }} />
          <i className="bi-heart-fill fs-4" style={{ color: '#ec4899' }} />
          <h4 className="fw-semibold text-uppercase mb-0" style={{ color: '#d4a853', fontSize: '1rem', letterSpacing: '0.15em' }}>About Marc &amp; Blandine</h4>
          <i className="bi-heart-fill fs-4" style={{ color: '#ec4899' }} />
          <span className="h-px flex-grow-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(212,168,83,0.25))' }} />
        </div>

        <div className="row g-3">
          {[
            { icon: 'bi-heart-fill', title: 'Our Love', desc: 'A bond that grows stronger with every passing day, built on trust, respect, and endless affection.' },
            { icon: 'bi-camera-fill', title: 'Our Memories', desc: 'Every laugh, every adventure, every quiet moment — captured and treasured forever in our digital garden.' },
            { icon: 'bi-star-fill', title: 'Our Dreams', desc: 'Building a future together, one goal at a time. The best is yet to come.' },
            { icon: 'bi-infinity', title: 'Our Forever', desc: 'No distance, no challenge, no time can diminish what we share. This is just the beginning.' },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="col-12 col-sm-6 col-lg-3"
            >
              <div className="card border-0 rounded-3 h-100 p-4 text-center transition-all"
                style={{
                  background: 'rgba(10,14,26,0.3)',
                  border: '1px solid rgba(236,72,153,0.06)',
                }}
              >
                <div
                  className="d-flex align-items-center justify-content-center rounded-3 mx-auto mb-3"
                  style={{
                    width: '3.5rem',
                    height: '3.5rem',
                    background: 'rgba(236,72,153,0.1)',
                    color: '#ec4899',
                    fontSize: '1.5rem',
                  }}
                >
                  <i className={item.icon} />
                </div>
                <h5 className="fw-bold mb-2" style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>{item.title}</h5>
                <p className="mb-0" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-4"
        >
          <div
            className="d-inline-flex align-items-center gap-2 px-4 py-2 rounded-pill"
            style={{
              background: 'rgba(212,168,83,0.06)',
              border: '1px solid rgba(212,168,83,0.1)',
            }}
          >
            <span className="fw-medium" style={{ color: '#d4a853', fontSize: '0.95rem' }}>
              <i className="bi-quote me-2" />
              Two hearts, one journey, infinite love
              <i className="bi-quote ms-2" />
            </span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
