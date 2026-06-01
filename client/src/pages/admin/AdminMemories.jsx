import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { memoriesAPI } from '../../services/api';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
};

export default function AdminMemories() {
  const [memories, setMemories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', memory_date: '', location: '', category: '' });
  const [file, setFile] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      const res = await memoriesAPI.getAll();
      setMemories(res.data);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);
    try {
      if (editing) {
        await memoriesAPI.update(editing, fd);
      } else {
        await memoriesAPI.create(fd);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ title: '', description: '', memory_date: '', location: '', category: '' });
      setFile(null);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving memory');
    }
  };

  const handleEdit = (m) => {
    setForm({ title: m.title, description: m.description || '', memory_date: m.memory_date, location: m.location || '', category: m.category || '' });
    setEditing(m.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this memory?')) return;
    await memoriesAPI.remove(id);
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
          <span className="h-px w-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.2))' }} />
          <h1 className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Memories Manager</h1>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', description: '', memory_date: '', location: '', category: '' }); setFile(null); }}>
          <span className="flex items-center gap-1.5">
            <i className="bi-plus-lg text-xs" />
            {showForm ? 'Cancel' : 'New Memory'}
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
            {editing ? 'Edit Memory' : 'New Memory'}
          </h3>
          <input className="input-field" type="text" placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="input-field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input className="input-field" type="date" value={form.memory_date} onChange={(e) => setForm({ ...form, memory_date: e.target.value })} required />
            <input className="input-field" type="text" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <input className="input-field" type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--input-bg)', border: '1px dashed var(--border-color)' }}>
            <i className="bi-image text-base" style={{ color: 'var(--text-tertiary)' }} />
            <input className="text-xs flex-1 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:cursor-pointer file:text-xs file:font-medium" style={{ color: 'var(--text-secondary)' }} type="file" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" className="btn-ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
            <button className="btn-primary" type="submit"><span>{editing ? 'Update' : 'Save'} Memory</span></button>
          </div>
        </motion.form>
      )}

      {memories.length === 0 ? (
        <p className="text-center mt-16 text-sm" style={{ color: 'var(--text-secondary)' }}>No memories yet.</p>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {memories.map((m, i) => (
            <motion.div
              key={m.id}
              variants={fadeUp}
              className="rounded-2xl p-3 flex flex-col sm:flex-row items-start gap-3 transition-all duration-200 hover:translate-y-[-1px]"
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--glass-border)',
              }}
            >
              {m.image_url && (
                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={m.image_url} alt="" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{m.title}</h3>
                <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{m.description}</p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{m.memory_date}</span>
                  {m.location && <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>· {m.location}</span>}
                  {m.category && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(236,72,153,0.1)', color: '#ec4899' }}>
                      {m.category}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1.5 flex-shrink-0 self-end sm:self-start">
                <button className="btn-ghost text-xs" onClick={() => handleEdit(m)}>Edit</button>
                <button className="btn-danger text-xs" onClick={() => handleDelete(m.id)}>Delete</button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
