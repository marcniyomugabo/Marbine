import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { goalsAPI, publicAPI } from '../services/api';
import Confetti from '../components/Confetti';
import PageTransition from '../components/PageTransition';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
};

const statusConfig = {
  'Pending': { color: '#6b7280', bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.15)', dot: '#6b7280' },
  'In Progress': { color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.15)', dot: '#f59e0b' },
  'Completed': { color: '#22c55e', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.15)', dot: '#22c55e' },
};

function GoalsEmpty({ user, onAdd }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" style={{ background: 'rgba(34,211,238,0.08)', color: '#22d3ee' }}>
        <i className="bi-bullseye" />
      </div>
      <h3 className="empty-state-title">No Goals Yet</h3>
      <p className="empty-state-desc">
        {user
          ? 'Dream big together. Start setting goals for your future adventures.'
          : 'No goals have been set yet. Check back for future plans.'}
      </p>
      {user && (
        <button className="btn-primary btn-sm mt-2" onClick={onAdd}>
          <span><i className="bi-plus-lg" /> Set Your First Goal</span>
        </button>
      )}
    </div>
  );
}

export default function Goals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', target_date: '' });
  const [editing, setEditing] = useState(null);
  const [confetti, setConfetti] = useState(false);

  const load = async () => {
    try {
      const api = user ? goalsAPI : publicAPI;
      const res = await api.getGoals();
      setGoals(res.data);
    } catch {}
  };

  useEffect(() => { load(); }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await goalsAPI.update(editing, form);
      } else {
        await goalsAPI.create(form);
        setConfetti(true);
        setTimeout(() => setConfetti(false), 3000);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ title: '', description: '', target_date: '' });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving goal');
    }
  };

  const handleEdit = (g) => {
    setForm({ title: g.title, description: g.description || '', target_date: g.target_date || '' });
    setEditing(g.id);
    setShowForm(true);
  };

  const handleStatusChange = async (g, status) => {
    if (status === 'Completed') {
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000);
    }
    await goalsAPI.update(g.id, { status });
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this goal?')) return;
    await goalsAPI.remove(id);
    load();
  };

  const grouped = {
    'In Progress': goals.filter(g => g.status === 'In Progress'),
    'Pending': goals.filter(g => g.status === 'Pending'),
    'Completed': goals.filter(g => g.status === 'Completed'),
  };

  return (
    <PageTransition>
      <div className="page-container">
        <Confetti active={confetti} />
        <div className="content-wrapper-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="text-center"
          >
            <div className="flex items-center gap-3 mb-1 justify-center">
              <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.2))' }} />
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Our Goals</h2>
              <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.15))' }} />
            </div>
            <p className="text-xs mb-6" style={{ color: 'var(--text-tertiary)' }}>
              Dreams we're building together
            </p>
          </motion.div>

          {user && (
            <div className="flex justify-center mb-6">
              <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', description: '', target_date: '' }); }}>
                <span className="flex items-center gap-1.5">
                  <i className="bi-plus-lg text-xs" />
                  {showForm ? 'Cancel' : 'New Goal'}
                </span>
              </button>
            </div>
          )}

          {showForm && user && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="premium-glass rounded-2xl p-5 mb-6 flex flex-col gap-3 overflow-hidden"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                {editing ? 'Edit Goal' : 'Set a New Goal'}
              </h3>
              <input className="input-field" type="text" placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <textarea className="input-field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              <input className="input-field" type="date" value={form.target_date} onChange={(e) => setForm({ ...form, target_date: e.target.value })} />
              <div className="flex gap-2 justify-end">
                <button type="button" className="btn-ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
                <button className="btn-primary" type="submit"><span>{editing ? 'Update' : 'Save'} Goal</span></button>
              </div>
            </motion.form>
          )}

          {goals.length === 0 ? (
            <GoalsEmpty user={user} onAdd={() => setShowForm(true)} />
          ) : (
            <>
              {Object.entries(grouped).map(([status, items]) =>
                items.length > 0 ? (
                  <div key={status} className="mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full" style={{ background: statusConfig[status]?.dot }} />
                      <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                        {status}
                        <span className="ml-1.5 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>({items.length})</span>
                      </h3>
                      <span className="h-px flex-1" style={{ background: `linear-gradient(270deg, transparent, ${statusConfig[status]?.color}15)` }} />
                    </div>
                    <motion.div
                      variants={stagger}
                      initial="hidden"
                      animate="show"
                      className="flex flex-col gap-2"
                    >
                      {items.map((g) => (
                        <motion.div
                          key={g.id}
                          variants={fadeUp}
                          className="rounded-2xl p-4 transition-all duration-300 hover:translate-y-[-1px]"
                          style={{
                            background: 'var(--glass-bg)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '1px solid var(--glass-border)',
                            boxShadow: 'var(--glass-shadow)',
                          }}
                        >
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{g.title}</h3>
                            <span
                              className="status-badge flex-shrink-0"
                              style={{
                                background: statusConfig[g.status]?.bg,
                                color: statusConfig[g.status]?.color,
                                border: `1px solid ${statusConfig[g.status]?.border}`,
                              }}
                            >
                              {g.status}
                            </span>
                          </div>
                          {g.description && (
                            <p className="text-xs leading-relaxed mt-1" style={{ color: 'var(--text-secondary)' }}>{g.description}</p>
                          )}
                          {g.target_date && (
                            <p className="text-[11px] mt-2" style={{ color: 'var(--text-tertiary)' }}>
                              <i className="bi-calendar me-1" />Target: {g.target_date}
                            </p>
                          )}
                          {user && (
                            <div className="flex items-center gap-2 mt-3 pt-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                              <select
                                value={g.status}
                                onChange={(e) => handleStatusChange(g, e.target.value)}
                                className="bg-transparent text-[11px] px-2 py-1 rounded-lg cursor-pointer outline-none transition-colors duration-200"
                                style={{ color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
                              >
                                <option value="Pending">Pending</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Completed">Completed</option>
                              </select>
                              <button
                                className="text-[11px] font-medium transition-colors duration-200 hover:text-white"
                                style={{ color: 'var(--text-tertiary)' }}
                                onClick={() => handleEdit(g)}
                              >
                                Edit
                              </button>
                              <button
                                className="text-[11px] font-medium transition-colors duration-200 hover:text-red-400"
                                style={{ color: 'var(--text-tertiary)' }}
                                onClick={() => handleDelete(g.id)}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>
                  </div>
                ) : null
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
