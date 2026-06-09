import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { goalsAPI } from '../../services/api';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
};

export default function AdminGoals() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', status: 'Pending', target_date: '' });
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      const res = await goalsAPI.getAll();
      setGoals(res.data);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await goalsAPI.update(editing, form);
      } else {
        await goalsAPI.create(form);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ title: '', description: '', status: 'Pending', target_date: '' });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving goal');
    }
  };

  const handleEdit = (g) => {
    setForm({ title: g.title, description: g.description || '', status: g.status, target_date: g.target_date ? g.target_date.split('T')[0] : '' });
    setEditing(g.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this goal?')) return;
    await goalsAPI.remove(id);
    load();
  };

  const statusColors = {
    'Pending': { bg: 'rgba(251,191,36,0.1)', text: '#fbbf24', border: 'rgba(251,191,36,0.15)' },
    'In Progress': { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6', border: 'rgba(59,130,246,0.15)' },
    'Completed': { bg: 'rgba(34,197,94,0.1)', text: '#22c55e', border: 'rgba(34,197,94,0.15)' },
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <span className="h-px w-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.2))' }} />
          <h1 className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Goals Manager</h1>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', description: '', status: 'Pending', target_date: '' }); }}>
          <span className="flex items-center gap-1.5">
            <i className="bi-plus-lg text-xs" />
            {showForm ? 'Cancel' : 'New Goal'}
          </span>
        </button>
      </motion.div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleSubmit}
          className="premium-glass rounded-2xl p-5 flex flex-col gap-3 mb-6 overflow-hidden"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
            {editing ? 'Edit Goal' : 'New Goal'}
          </h3>
          <input className="input-field" type="text" placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="input-field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <input className="input-field" type="date" value={form.target_date} onChange={(e) => setForm({ ...form, target_date: e.target.value })} />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" className="btn-ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
            <button className="btn-primary" type="submit"><span>{editing ? 'Update' : 'Save'} Goal</span></button>
          </div>
        </motion.form>
      )}

      {goals.length === 0 ? (
        <p className="text-center mt-16 text-sm" style={{ color: 'var(--text-secondary)' }}>No goals yet.</p>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {goals.map((g) => {
            const sc = statusColors[g.status] || statusColors['Pending'];
            return (
              <motion.div
                key={g.id}
                variants={fadeUp}
                className="rounded-2xl p-3 flex flex-col sm:flex-row items-start gap-3 transition-all duration-200 hover:translate-y-[-1px]"
                style={{
                  background: 'var(--glass-bg)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid var(--glass-border)',
                }}
              >
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-start sm:items-center justify-between gap-2 flex-col sm:flex-row">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{g.title}</h3>
                      <span className="text-[10px] px-1.5 py-0.5 rounded-md font-medium" style={{ background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                        {g.status}
                      </span>
                    </div>
                    {g.target_date && (
                      <span className="text-[11px] whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>
                        <i className="bi-calendar me-1" />{g.target_date.split('T')[0]}
                      </span>
                    )}
                  </div>
                  {g.description && (
                    <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{g.description}</p>
                  )}
                  <div className="flex gap-1.5 mt-2 sm:hidden">
                    <button className="btn-ghost text-xs" onClick={() => handleEdit(g)}>Edit</button>
                    <button className="btn-danger text-xs" onClick={() => handleDelete(g.id)}>Delete</button>
                  </div>
                </div>
                <div className="hidden sm:flex gap-1.5 flex-shrink-0">
                  <button className="btn-ghost text-xs" onClick={() => handleEdit(g)}>Edit</button>
                  <button className="btn-danger text-xs" onClick={() => handleDelete(g.id)}>Delete</button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}