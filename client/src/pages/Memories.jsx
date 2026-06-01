import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { memoriesAPI, publicAPI } from '../services/api';
import Confetti from '../components/Confetti';
import Lightbox from '../components/Lightbox';
import PageTransition from '../components/PageTransition';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
};

function EmptyMemories({ isAdmin, onAdd }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon" style={{ background: 'rgba(236,72,153,0.08)', color: '#ec4899' }}>
        <i className="bi-journal-text" />
      </div>
      <h3 className="empty-state-title">No Memories Yet</h3>
      <p className="empty-state-desc">
        {isAdmin
          ? 'Your love story is waiting to be written. Start capturing your first precious moment.'
          : 'No memories have been shared yet. Check back soon for new stories.'}
      </p>
      {isAdmin && (
        <button className="btn-primary btn-sm mt-2" onClick={onAdd}>
          <span><i className="bi-plus-lg" /> Create Your First Memory</span>
        </button>
      )}
    </div>
  );
}

function MemoryCard({ m, isAdmin, onEdit, onLike, onDelete, onImageClick, index }) {
  const imgCount = m.image_url ? 1 : 0;

  return (
    <motion.div variants={fadeUp} layout className="h-full">
      <div className="uniform-card group">
        {m.image_url && (
          <div className="uniform-card-image cursor-pointer" onClick={() => onImageClick(m)}>
            <img src={m.image_url} alt={m.title} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                </svg>
              </div>
            </div>
          </div>
        )}
        <div className="uniform-card-body">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold line-clamp-1" style={{ color: 'var(--text-primary)' }}>{m.title}</h3>
            {m.category && <span className="category-badge flex-shrink-0">{m.category}</span>}
          </div>
          {m.description && (
            <p className="text-xs leading-relaxed line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{m.description}</p>
          )}
          <div className="flex items-center gap-3 mt-1">
            <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
              <i className="bi-calendar me-1" />{m.memory_date}
            </span>
            {m.location && (
              <span className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>
                <i className="bi-geo-alt me-1" />{m.location}
              </span>
            )}
          </div>
          <div className="flex items-center justify-between pt-3 mt-1" style={{ borderTop: '1px solid var(--border-color)' }}>
            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); onLike(m.id); }}
                  className="flex items-center gap-1 text-[11px] font-medium transition-colors duration-200 hover:text-primary"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                  {m.likes || 0}
                </button>
                <button onClick={() => onEdit(m)} className="text-[11px] font-medium transition-colors duration-200 hover:text-white" style={{ color: 'var(--text-tertiary)' }}>Edit</button>
                <button onClick={() => onDelete(m.id)} className="text-[11px] font-medium transition-colors duration-200 hover:text-red-400" style={{ color: 'var(--text-tertiary)' }}>Delete</button>
              </div>
            ) : null}
            <svg className="w-3.5 h-3.5 transition-all duration-300 group-hover:translate-x-0.5" style={{ color: 'var(--text-tertiary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Memories() {
  const { isAdmin } = useAuth();
  const [memories, setMemories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', memory_date: '', location: '', category: '' });
  const [file, setFile] = useState(null);
  const [editing, setEditing] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadMemories = async () => {
    try {
      const api = isAdmin ? memoriesAPI : publicAPI;
      const res = await api.getMemories();
      setMemories(res.data);
    } catch {}
  };

  useEffect(() => { loadMemories(); }, [isAdmin]);

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
        setConfetti(true);
        setTimeout(() => setConfetti(false), 3000);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ title: '', description: '', memory_date: '', location: '', category: '' });
      setFile(null);
      loadMemories();
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving memory');
    }
  };

  const handleEdit = (m) => {
    if (!isAdmin) return;
    setForm({ title: m.title, description: m.description || '', memory_date: m.memory_date, location: m.location || '', category: m.category || '' });
    setEditing(m.id);
    setShowForm(true);
  };

  const handleLike = async (id) => {
    if (!isAdmin) return;
    try {
      await memoriesAPI.like(id);
      setConfetti(true);
      setTimeout(() => setConfetti(false), 3000);
      loadMemories();
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    if (!confirm('Delete this memory?')) return;
    await memoriesAPI.remove(id);
    loadMemories();
  };

  const categories = ['all', ...new Set(memories.map((m) => m.category).filter(Boolean))];
  const filtered = filter === 'all' ? memories : memories.filter((m) => m.category === filter);
  const images = memories.filter((m) => m.image_url).map((m) => ({ id: m.id, url: m.image_url, alt: m.title }));

  return (
    <PageTransition>
      <Confetti active={confetti} />
      <div className="page-container">
        <div className="content-wrapper" style={{ maxWidth: '72rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="text-center sm:text-left"
          >
            <div className="flex items-center gap-3 mb-1 justify-center sm:justify-start">
              <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.2))' }} />
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Our Memories</h2>
              <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.15))' }} />
            </div>
            <p className="text-xs text-center sm:text-left mb-6" style={{ color: 'var(--text-tertiary)' }}>
              Precious moments we've shared together
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200 ${
                    filter === cat ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                  style={
                    filter === cat
                      ? { background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(168,85,247,0.15))' }
                      : { background: 'transparent' }
                  }
                >
                  {cat === 'all' ? 'All Memories' : cat}
                </button>
              ))}
            </div>
            {isAdmin && (
              <button className="btn-primary flex-shrink-0" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', description: '', memory_date: '', location: '', category: '' }); setFile(null); }}>
                <span className="flex items-center gap-1.5">
                  <i className="bi-plus-lg text-xs" />
                  {showForm ? 'Cancel' : 'New Memory'}
                </span>
              </button>
            )}
          </div>

          {showForm && isAdmin && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="premium-glass rounded-2xl p-5 mb-6 flex flex-col gap-3 overflow-hidden"
            >
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                {editing ? 'Edit Memory' : 'Capture a New Memory'}
              </h3>
              <input className="input-field" type="text" placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              <textarea className="input-field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input className="input-field" type="date" value={form.memory_date} onChange={(e) => setForm({ ...form, memory_date: e.target.value })} required />
                <input className="input-field" type="text" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                <input className="input-field" type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--input-bg)', border: '1px dashed var(--border-color)' }}>
                <i className="bi-image text-lg" style={{ color: 'var(--text-tertiary)' }} />
                <input className="text-xs flex-1 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:cursor-pointer file:text-xs file:font-medium" style={{ color: 'var(--text-secondary)' }} type="file" onChange={(e) => setFile(e.target.files[0])} />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" className="btn-ghost" onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
                <button className="btn-primary" type="submit"><span>{editing ? 'Update' : 'Save'} Memory</span></button>
              </div>
            </motion.form>
          )}

          {filtered.length === 0 ? (
            <EmptyMemories isAdmin={isAdmin} onAdd={() => setShowForm(true)} />
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {filtered.map((m) => (
                <MemoryCard
                  key={m.id}
                  m={m}
                  isAdmin={isAdmin}
                  onEdit={handleEdit}
                  onLike={handleLike}
                  onDelete={handleDelete}
                  onImageClick={(mem) => {
                    const idx = images.findIndex((img) => img.id === mem.id);
                    if (idx !== -1) setLightboxIndex(idx);
                  }}
                />
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <Lightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex((i) => (i > 0 ? i - 1 : images.length - 1))}
        onNext={() => setLightboxIndex((i) => (i < images.length - 1 ? i + 1 : 0))}
        onGoTo={(i) => setLightboxIndex(i)}
      />
    </PageTransition>
  );
}
