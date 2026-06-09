import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reasonsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import FloatingHearts from '../components/FloatingHearts';

const categoryColors = {
  default: '#ec4899',
  Eyes: '#a855f7',
  Personality: '#f59e0b',
  Laughter: '#22d3ee',
  Thoughtfulness: '#d4a853',
  Touch: '#f472b6',
  Support: '#22c55e',
  Comfort: '#fb923c',
  Heart: '#ef4444',
};

export default function Reasons() {
  const { user } = useAuth();
  const [reasons, setReasons] = useState([]);
  const [currentReason, setCurrentReason] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ reason: '', category: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [reasonsCount, setReasonsCount] = useState(0);

  const getNewReason = useCallback(async () => {
    setLoading(true);
    try {
      const res = await reasonsAPI.getRandom();
      setCurrentReason(res.data);
    } catch {
      setCurrentReason({ reason: 'You are amazing in every way! 💖', category: null });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    reasonsAPI.getAll().then(r => {
      setReasons(r.data);
      setReasonsCount(r.data.length);
    }).catch(() => {});
    getNewReason();
  }, [getNewReason]);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.reason.trim()) return setError('Please write a reason');
    try {
      await reasonsAPI.create(form);
      setSuccess('New reason added! 💕');
      setForm({ reason: '', category: '' });
      setShowForm(false);
      setError('');
      const res = await reasonsAPI.getAll();
      setReasons(res.data);
      setReasonsCount(res.data.length);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add reason');
    }
  };

  return (
    <PageTransition>
      <FloatingHearts count={8} speed={0.3} />
      <div className="page-container">
        <div className="content-wrapper">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.2))' }} />
            <h1 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Why I Love You</h1>
            <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.15))' }} />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
              style={{ background: 'rgba(236,72,153,0.08)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.12)' }}
            >
              💖 Reasons Generator
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Endless Reasons to Love You</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Click the button to get a random reason why you are loved</p>
          </motion.div>

          <motion.div className="max-w-xl mx-auto mb-8">
            <motion.div
              key={currentReason?.id || 'default'}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="rounded-2xl p-8 text-center relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(236,72,153,0.06), rgba(168,85,247,0.04))',
                border: '1px solid rgba(236,72,153,0.12)',
                boxShadow: '0 8px 32px rgba(236,72,153,0.08)',
              }}
            >
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
                backgroundSize: '40px 40px',
              }} />
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl mb-4"
                >💖</motion.div>
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="spinner-ripple"><div /><div /></div>
                  </div>
                ) : (
                  <>
                    <p className="text-xl sm:text-2xl font-bold leading-relaxed mb-4 gradient-text">
                      "{currentReason?.reason}"
                    </p>
                    {currentReason?.category && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: `${categoryColors[currentReason.category] || '#ec4899'}15`,
                          color: categoryColors[currentReason.category] || '#ec4899',
                          border: `1px solid ${categoryColors[currentReason.category] || '#ec4899'}20`,
                        }}
                      >
                        {currentReason.category}
                      </span>
                    )}
                  </>
                )}
              </div>
            </motion.div>
            <div className="flex gap-3 justify-center mt-4">
              <motion.button onClick={getNewReason} className="btn-primary"
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                disabled={loading}
              >
                <span><i className="bi-heart-fill me-1" /> Show Me Love</span>
              </motion.button>
              <motion.button onClick={() => { setShowForm(!showForm); setError(''); setSuccess(''); }}
                className="btn-secondary" whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              >
                <span><i className="bi-plus-lg me-1" /> Add Reason</span>
              </motion.button>
            </div>
          </motion.div>

          {error && <p className="text-xs mb-4 text-center px-3 py-2 rounded-lg" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.12)' }}>{error}</p>}
          {success && <p className="text-xs mb-4 text-center px-3 py-2 rounded-lg" style={{ color: '#22c55e', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.12)' }}>{success}</p>}

          <AnimatePresence>
            {showForm && (
              <motion.form initial={{ opacity: 0, y: -16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.97 }}
                onSubmit={handleAdd}
                className="content-card max-w-xl mx-auto mb-8 flex flex-col gap-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <i className="bi-heart text-lg" style={{ color: '#ec4899' }} />
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Add a New Reason</h3>
                </div>
                <textarea className="input-field min-h-[100px] resize-y" placeholder="I love you because..." value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })} required
                />
                <select className="input-field" value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="">No category</option>
                  <option value="Eyes">Eyes</option>
                  <option value="Personality">Personality</option>
                  <option value="Laughter">Laughter</option>
                  <option value="Thoughtfulness">Thoughtfulness</option>
                  <option value="Touch">Touch</option>
                  <option value="Support">Support</option>
                  <option value="Comfort">Comfort</option>
                  <option value="Heart">Heart</option>
                </select>
                <div className="flex gap-2 justify-end mt-1">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-ghost btn-sm">Cancel</button>
                  <button type="submit" className="btn-primary btn-sm"><span>💕 Add Reason</span></button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs"
              style={{ background: 'rgba(212,168,83,0.08)', color: '#d4a853', border: '1px solid rgba(212,168,83,0.12)' }}
            >
              <i className="bi-heart-fill" />
              <span>{reasonsCount} reasons and counting</span>
              <i className="bi-heart-fill" />
            </div>
          </motion.div>

          {reasons.length > 0 && (
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <span className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.2))' }} />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>All Reasons</span>
                <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.15))' }} />
              </div>
              <div className="space-y-2">
                {reasons.map((r) => (
                  <motion.div key={r.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-3 p-4 rounded-xl transition-all duration-200"
                    style={{
                      background: 'var(--glass-bg)',
                      border: '1px solid var(--glass-border)',
                    }}
                  >
                    <span className="text-sm mt-0.5">💖</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm" style={{ color: 'var(--text-primary)' }}>{r.reason}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {r.category && (
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded"
                            style={{
                              background: `${categoryColors[r.category] || '#ec4899'}15`,
                              color: categoryColors[r.category] || '#ec4899',
                            }}
                          >{r.category}</span>
                        )}
                        <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>by {r.added_by_name}</span>
                      </div>
                    </div>
                    {(user?.role === 'admin') && (
                      <button onClick={async () => { await reasonsAPI.remove(r.id); setReasons(reasons.filter(x => x.id !== r.id)); setReasonsCount(c => c - 1); }}
                        className="text-xs px-2 py-1 rounded-lg transition-colors"
                        style={{ color: 'var(--text-tertiary)' }}
                        onMouseOver={e => e.target.style.color = '#ef4444'}
                        onMouseOut={e => e.target.style.color = ''}
                      ><i className="bi-trash" /></button>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
