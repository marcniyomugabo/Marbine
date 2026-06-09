import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { wishlistAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';

const occasions = ['', 'Birthday', 'Anniversary', 'Christmas', 'Valentine', 'Just Because', 'Other'];

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
};

export default function Wishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', url: '', price: '', occasion: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    wishlistAPI.getAll().then(r => setItems(r.data)).catch(() => {});
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Title is required'); return; }
    try {
      await wishlistAPI.create({ ...form, price: form.price ? parseFloat(form.price) : null });
      setSuccess('Item added to wishlist!');
      setForm({ title: '', description: '', url: '', price: '', occasion: '' });
      setShowForm(false);
      setError('');
      const res = await wishlistAPI.getAll();
      setItems(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add item');
    }
  };

  const handleToggle = async (id) => {
    try {
      await wishlistAPI.markPurchased(id);
      const res = await wishlistAPI.getAll();
      setItems(res.data);
    } catch {}
  };

  const handleDelete = async (id) => {
    try {
      await wishlistAPI.remove(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch {}
  };

  const purchased = items.filter(i => i.is_purchased);
  const available = items.filter(i => !i.is_purchased);

  return (
    <PageTransition>
      <div className="page-container">
        <div className="content-wrapper">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.2))' }} />
            <h1 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Wishlist</h1>
            <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.15))' }} />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
              style={{ background: 'rgba(212,168,83,0.08)', color: '#d4a853', border: '1px solid rgba(212,168,83,0.12)' }}
            >🎁 Our Wishlist</span>
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Dream Gifts &amp; Ideas</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>What our hearts desire</p>
          </motion.div>

          {error && <p className="text-xs mb-4 text-center px-3 py-2 rounded-lg" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.12)' }}>{error}</p>}
          {success && <p className="text-xs mb-4 text-center px-3 py-2 rounded-lg" style={{ color: '#22c55e', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.12)' }}>{success}</p>}

          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ opacity: 0, y: -16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -16, scale: 0.97 }}
                onSubmit={handleCreate}
                className="content-card max-w-xl mx-auto mb-8 flex flex-col gap-3"
              >
                <div className="flex items-center gap-2 mb-1">
                  <i className="bi-gift text-lg" style={{ color: '#d4a853' }} />
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Add Wishlist Item</h3>
                </div>
                <input className="input-field" type="text" placeholder="What do you want?" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })} required
                />
                <textarea className="input-field min-h-[80px] resize-y" placeholder="Description (optional)" value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-3">
                  <input className="input-field" type="url" placeholder="Link URL (optional)" value={form.url}
                    onChange={e => setForm({ ...form, url: e.target.value })}
                  />
                  <input className="input-field" type="number" step="0.01" placeholder="Price (optional)" value={form.price}
                    onChange={e => setForm({ ...form, price: e.target.value })}
                  />
                </div>
                <select className="input-field" value={form.occasion} onChange={e => setForm({ ...form, occasion: e.target.value })}>
                  {occasions.map(o => <option key={o} value={o}>{o || 'Occasion (optional)'}</option>)}
                </select>
                <div className="flex gap-2 justify-end mt-1">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-ghost btn-sm">Cancel</button>
                  <button type="submit" className="btn-primary btn-sm"><span>🎁 Add Item</span></button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {!showForm && (
            <div className="text-center mb-8">
              <button onClick={() => { setShowForm(true); setError(''); setSuccess(''); }} className="btn-primary">
                <span><i className="bi-gift me-1" /> Add Wishlist Item</span>
              </button>
            </div>
          )}

          {items.length === 0 && !showForm ? (
            <div className="empty-state">
              <div className="empty-state-icon"><i className="bi-gift" /></div>
              <p className="empty-state-title">No wishlist items yet</p>
              <p className="empty-state-desc">Add things you'd love to receive or give. Make gift-giving magical!</p>
            </div>
          ) : (
            <>
              {available.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }} />
                    Available ({available.length})
                  </h3>
                  <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {available.map(item => (
                      <motion.div key={item.id} variants={fadeUp}
                        className="rounded-2xl p-5 transition-all duration-300 hover:translate-y-[-2px]"
                        style={{ background: 'var(--glass-bg)', backdropFilter: 'blur(20px)', border: '1px solid var(--glass-border)', boxShadow: 'var(--glass-shadow)' }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{item.title}</h3>
                            {item.occasion && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,168,83,0.1)', color: '#d4a853' }}>{item.occasion}</span>}
                          </div>
                          <button onClick={() => handleDelete(item.id)}
                            className="text-xs px-1.5 py-1 rounded-lg ml-2 flex-shrink-0 transition-colors"
                            style={{ color: 'var(--text-tertiary)' }}
                            onMouseOver={e => e.target.style.color = '#ef4444'}
                            onMouseOut={e => e.target.style.color = ''}
                          ><i className="bi-trash" /></button>
                        </div>
                        {item.description && <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>{item.description}</p>}
                        <div className="flex items-center justify-between mt-auto pt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                          <div className="flex items-center gap-2">
                            {item.price && <span className="text-xs font-semibold" style={{ color: '#22c55e' }}>${parseFloat(item.price).toFixed(2)}</span>}
                            {item.url && <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs" style={{ color: '#3b82f6' }}>🔗</a>}
                            <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>by {item.added_by_name}</span>
                          </div>
                          <button onClick={() => handleToggle(item.id)}
                            className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all duration-200"
                            style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}
                            whileHover={{ scale: 1.05 }}
                          >Mark Purchased</button>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              )}

              {purchased.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: '#8a8a9a' }} />
                    Already Purchased ({purchased.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {purchased.map(item => (
                      <div key={item.id}
                        className="rounded-2xl p-5 opacity-60"
                        style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}><s>{item.title}</s></h3>
                            {item.occasion && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(212,168,83,0.1)', color: '#d4a853' }}>{item.occasion}</span>}
                          </div>
                          <button onClick={() => handleDelete(item.id)} className="text-xs px-1.5 py-1 rounded-lg" style={{ color: 'var(--text-tertiary)' }}><i className="bi-trash" /></button>
                        </div>
                        <div className="flex items-center justify-between mt-2 pt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                          <span className="text-xs" style={{ color: '#22c55e' }}>✅ Purchased {item.purchased_by_name ? `by ${item.purchased_by_name}` : ''}</span>
                          <button onClick={() => handleToggle(item.id)} className="text-xs px-2 py-1 rounded-lg" style={{ color: 'var(--text-tertiary)' }}>Undo</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
