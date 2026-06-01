import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { timelineAPI } from '../../services/api';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
};

export default function AdminTimeline() {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', event_date: '' });
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      const res = await timelineAPI.getAll();
      setEvents(res.data);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await timelineAPI.update(editing, form);
      } else {
        await timelineAPI.create(form);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ title: '', description: '', event_date: '' });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving event');
    }
  };

  const handleEdit = (ev) => {
    setForm({ title: ev.title, description: ev.description || '', event_date: ev.event_date });
    setEditing(ev.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this event?')) return;
    await timelineAPI.remove(id);
    load();
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <span className="h-px w-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(212,168,83,0.2))' }} />
          <h1 className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Timeline Manager</h1>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', description: '', event_date: '' }); }}>
          <span className="flex items-center gap-1.5">
            <i className="bi-plus-lg text-xs" />
            {showForm ? 'Cancel' : 'New Event'}
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
            {editing ? 'Edit Event' : 'New Event'}
          </h3>
          <input className="input-field" type="text" placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="input-field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          <input className="input-field" type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} required />
          <div className="flex gap-2 justify-end">
            <button type="button" className="btn-ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
            <button className="btn-primary" type="submit"><span>{editing ? 'Update' : 'Save'} Event</span></button>
          </div>
        </motion.form>
      )}

      {events.length === 0 ? (
        <p className="text-center mt-16 text-sm" style={{ color: 'var(--text-secondary)' }}>No events yet.</p>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {events.map((ev, i) => (
            <motion.div
              key={ev.id}
              variants={fadeUp}
              className="rounded-2xl p-3 flex flex-col sm:flex-row items-start gap-3 transition-all duration-200 hover:translate-y-[-1px]"
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <div className="hidden sm:block w-1.5 h-full min-h-[48px] rounded-full flex-shrink-0 mt-1" style={{ background: 'linear-gradient(to bottom, #ec4899, #a855f7)' }} />
              <div className="flex-1 min-w-0 w-full">
                <div className="flex items-start sm:items-center justify-between gap-2 flex-col sm:flex-row">
                  <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{ev.title}</h3>
                  <span className="text-[11px] whitespace-nowrap" style={{ color: 'var(--text-tertiary)' }}>{ev.event_date}</span>
                </div>
                {ev.description && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{ev.description}</p>
                )}
                <div className="flex gap-1.5 mt-2 sm:hidden">
                  <button className="btn-ghost text-xs" onClick={() => handleEdit(ev)}>Edit</button>
                  <button className="btn-danger text-xs" onClick={() => handleDelete(ev.id)}>Delete</button>
                </div>
              </div>
              <div className="hidden sm:flex gap-1.5 flex-shrink-0">
                <button className="btn-ghost text-xs" onClick={() => handleEdit(ev)}>Edit</button>
                <button className="btn-danger text-xs" onClick={() => handleDelete(ev.id)}>Delete</button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
