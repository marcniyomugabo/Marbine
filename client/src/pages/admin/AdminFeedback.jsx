import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { contactAPI } from '../../services/api';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
};

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);

  const load = async () => {
    try {
      const res = await contactAPI.getAll();
      setFeedbacks(res.data);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this feedback?')) return;
    try {
      await contactAPI.remove(id);
      load();
    } catch {}
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 mb-6"
      >
        <span className="h-px w-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.2))' }} />
        <h1 className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Feedback</h1>
        <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(59,130,246,0.15))' }} />
      </motion.div>

      {feedbacks.length === 0 ? (
        <p className="text-center mt-16 text-sm" style={{ color: 'var(--text-secondary)' }}>No feedback yet.</p>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {feedbacks.map((fb, i) => (
            <motion.div
              key={fb.id}
              variants={fadeUp}
              className="rounded-2xl p-4 transition-all duration-200 hover:translate-y-[-1px]"
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between gap-3 mb-3">
                <div className="w-full">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs flex-shrink-0" style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}>
                      <i className="bi-person" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{fb.name}</h3>
                      <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                        <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                          <i className="bi-envelope me-1" />{fb.email}
                        </span>
                        {fb.phone && (
                          <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                            <i className="bi-telephone me-1" />{fb.phone}
                          </span>
                        )}
                        {fb.location && (
                          <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                            <i className="bi-geo-alt me-1" />{fb.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-start">
                  <span className="text-[11px] whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>
                    {new Date(fb.created_at).toLocaleDateString()}
                  </span>
                  <a
                    href={`mailto:${fb.email}?subject=Re: Marbine Feedback&body=Hi ${fb.name},`}
                    className="btn-ghost text-xs no-underline"
                  >
                    Reply
                  </a>
                  <button className="btn-danger text-xs" onClick={() => handleDelete(fb.id)}>Delete</button>
                </div>
              </div>
              <div
                className="rounded-xl p-3 text-sm leading-relaxed"
                style={{ background: 'rgba(236,72,153,0.03)', border: '1px solid rgba(236,72,153,0.06)' }}
              >
                {fb.comment}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
