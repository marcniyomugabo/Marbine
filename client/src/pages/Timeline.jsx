import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { timelineAPI, publicAPI } from '../services/api';
import Confetti from '../components/Confetti';
import PageTransition from '../components/PageTransition';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const slideIn = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
};

function TimelineEmpty({ isAdmin, onAdd }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" style={{ background: 'rgba(212,168,83,0.08)', color: '#d4a853' }}>
        <i className="bi-clock-history" />
      </div>
      <h3 className="empty-state-title">No Milestones Yet</h3>
      <p className="empty-state-desc">
        {isAdmin
          ? 'Your journey together is full of special moments. Start adding the milestones that matter most.'
          : 'No timeline events have been added yet. Check back for new milestones.'}
      </p>
      {isAdmin && (
        <button className="btn-primary btn-sm mt-2" onClick={onAdd}>
          <span><i className="bi-plus-lg" /> Add Your First Milestone</span>
        </button>
      )}
    </div>
  );
}

export default function Timeline() {
  const { isAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', event_date: '' });
  const [editing, setEditing] = useState(null);
  const [confetti, setConfetti] = useState(false);

  const load = async () => {
    try {
      const api = isAdmin ? timelineAPI : publicAPI;
      const res = await api.getTimeline();
      setEvents(res.data);
    } catch {}
  };

  useEffect(() => { load(); }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await timelineAPI.update(editing, form);
      } else {
        await timelineAPI.create(form);
        setConfetti(true);
        setTimeout(() => setConfetti(false), 3000);
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
    if (!isAdmin) return;
    setForm({ title: ev.title, description: ev.description || '', event_date: ev.event_date });
    setEditing(ev.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!confirm('Delete this event?')) return;
    await timelineAPI.remove(id);
    load();
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
            <div className="flex items-center justify-center gap-6 mb-4">
              <span className="h-px flex-1 max-w-[160px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.25))' }} />
              <div className="text-center">
                <span className="text-sm font-semibold uppercase tracking-[0.25em] block mb-2" style={{ color: '#ec4899' }}>Our Journey</span>
                <h2 className="text-2xl sm:text-3xl font-bold gradient-text">Timeline</h2>
              </div>
              <span className="h-px flex-1 max-w-[160px]" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.25))' }} />
            </div>
            <p className="text-base mb-8" style={{ color: 'var(--text-tertiary)' }}>
              The milestones that shaped our story
            </p>
          </motion.div>

          {isAdmin && (
            <div className="flex justify-center mb-6">
              <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', description: '', event_date: '' }); }}>
                <span className="flex items-center gap-1.5">
                  <i className="bi-plus-lg text-xs" />
                  {showForm ? 'Cancel' : 'New Event'}
                </span>
              </button>
            </div>
          )}

          {showForm && isAdmin && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="premium-glass rounded-2xl p-5 mb-6 flex flex-col gap-3 overflow-hidden"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                {editing ? 'Edit Event' : 'Add a Milestone'}
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
            <TimelineEmpty isAdmin={isAdmin} onAdd={() => setShowForm(true)} />
          ) : (
            <div className="relative px-2">
              <div
                className="absolute left-[19px] top-4 bottom-4 w-[4px]"
                style={{ background: 'linear-gradient(to bottom, rgba(236,72,153,0.3), rgba(168,85,247,0.2), rgba(236,72,153,0.05))' }}
              />
              <motion.div
                variants={stagger}
                initial="hidden"
                animate="show"
                className="space-y-8"
              >
                {events.map((ev) => (
                  <motion.div
                    key={ev.id}
                    variants={slideIn}
                    className="relative pl-14"
                  >
                    <div className="absolute left-[11px] top-8 w-6 h-6 rounded-full border-[4px] timeline-dot" style={{ borderColor: '#ec4899', background: 'var(--bg-primary)', boxShadow: '0 0 20px rgba(236,72,153,0.4)' }} />
                    <div
                      className="relative overflow-hidden rounded-2xl p-7 sm:p-10 transition-all duration-500 hover:translate-y-[-4px]"
                      style={{
                        background: 'var(--glass-bg)',
                        backdropFilter: 'blur(20px)',
                        WebkitBackdropFilter: 'blur(20px)',
                        border: '1px solid var(--glass-border)',
                        boxShadow: 'var(--glass-shadow)',
                      }}
                    >
                      <div className="absolute top-0 left-1.5 w-2 h-full rounded-r" style={{ background: 'linear-gradient(to bottom, #ec4899, #a855f7)' }} />
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                        <h3 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{ev.title}</h3>
                        <span
                          className="text-sm font-medium px-4 py-1.5 rounded-md whitespace-nowrap self-start"
                          style={{
                            background: 'rgba(212,168,83,0.1)',
                            color: '#d4a853',
                            border: '1px solid rgba(212,168,83,0.12)',
                          }}
                        >
                          <i className="bi-calendar me-1" />{ev.event_date}
                        </span>
                      </div>
                      {ev.description && (
                        <p className="text-base leading-relaxed mt-3" style={{ color: 'var(--text-secondary)' }}>{ev.description}</p>
                      )}
                      {isAdmin && (
                        <div className="flex items-center gap-5 mt-5 pt-5" style={{ borderTop: '1px solid var(--border-color)' }}>
                          <button
                            className="text-sm font-medium transition-colors duration-200 hover:text-white"
                            style={{ color: 'var(--text-tertiary)' }}
                            onClick={() => handleEdit(ev)}
                          >
                            Edit
                          </button>
                          <button
                            className="text-sm font-medium transition-colors duration-200 hover:text-red-400"
                            style={{ color: 'var(--text-tertiary)' }}
                            onClick={() => handleDelete(ev.id)}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
