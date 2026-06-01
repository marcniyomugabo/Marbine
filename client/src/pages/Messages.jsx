import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { messagesAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
};

export default function Messages() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ receiver_id: '', subject: '', message: '' });

  const load = async () => {
    const res = await messagesAPI.getAll();
    setMessages(res.data);
  };

  const loadUsers = async () => {
    try {
      const res = await authAPI.getUsers();
      setUsers(res.data);
    } catch {}
  };

  useEffect(() => { load(); loadUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await messagesAPI.create(form);
      setShowForm(false);
      setForm({ receiver_id: '', subject: '', message: '' });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Error sending message');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this message?')) return;
    await messagesAPI.remove(id);
    load();
  };

  return (
    <PageTransition>
      <div className="page-container">
        <div className="content-wrapper-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="text-center"
          >
            <div className="flex items-center gap-3 mb-1 justify-center">
              <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.2))' }} />
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Love Notes</h2>
              <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.15))' }} />
            </div>
            <p className="text-xs mb-6" style={{ color: 'var(--text-tertiary)' }}>
              Words from the heart
            </p>
          </motion.div>

          <div className="flex justify-center mb-6">
            <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
              <span className="flex items-center gap-1.5">
                <i className="bi-plus-lg text-xs" />
                {showForm ? 'Cancel' : 'New Note'}
              </span>
            </button>
          </div>

          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="premium-glass rounded-2xl p-5 mb-6 flex flex-col gap-3 overflow-hidden"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Send a Love Note</h3>
              <select
                className="input-field"
                value={form.receiver_id}
                onChange={(e) => setForm({ ...form, receiver_id: e.target.value })}
                required
              >
                <option value="">Select recipient...</option>
                {users.filter(u => u.id !== user?.id).map((u) => (
                  <option key={u.id} value={u.id}>{u.fullname}</option>
                ))}
              </select>
              <input className="input-field" type="text" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              <textarea className="input-field" placeholder="Your message..." value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} required />
              <div className="flex gap-2 justify-end">
                <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
                <button className="btn-primary" type="submit"><span>Send</span></button>
              </div>
            </motion.form>
          )}

          {messages.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ background: 'rgba(245,158,11,0.08)', color: '#f59e0b' }}>
                <i className="bi-chat-heart" />
              </div>
              <h3 className="empty-state-title">No Love Notes Yet</h3>
              <p className="empty-state-desc">Send your first love note to someone special.</p>
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="flex flex-col gap-3"
            >
              {messages.map((m) => (
                <motion.div
                  key={m.id}
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
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md whitespace-nowrap"
                      style={{
                        background: m.sender_id === user?.id ? 'rgba(236,72,153,0.1)' : 'rgba(59,130,246,0.1)',
                        color: m.sender_id === user?.id ? '#ec4899' : '#3b82f6',
                        border: `1px solid ${m.sender_id === user?.id ? 'rgba(236,72,153,0.12)' : 'rgba(59,130,246,0.12)'}`,
                      }}
                    >
                      {m.sender_id === user?.id ? 'You' : m.sender_name}
                    </span>
                    <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                      {new Date(m.sent_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{m.subject || 'No Subject'}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{m.message}</p>
                  <button
                    className="mt-2 text-[11px] font-medium transition-colors duration-200 hover:text-red-400"
                    style={{ color: 'var(--text-tertiary)' }}
                    onClick={() => handleDelete(m.id)}
                  >
                    Delete
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
