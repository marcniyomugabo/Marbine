import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { galleryAPI } from '../../services/api';
import { imageList } from '../../utils/images';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.03 } },
};

const fadeUp = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 25 } },
};

export default function AdminGallery() {
  const [serverItems, setServerItems] = useState([]);
  const [file, setFile] = useState(null);
  const [tab, setTab] = useState('all');
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    try {
      const res = await galleryAPI.getAll();
      setServerItems(res.data);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      await galleryAPI.upload(fd);
      setFile(null);
      load();
    } catch {}
    setUploading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this item?')) return;
    try {
      await galleryAPI.remove(id);
      load();
    } catch {}
  };

  const allItems = [
    ...imageList.map((img, i) => ({ id: `local-${i}`, url: img.url, alt: img.alt || '', local: true })),
    ...serverItems.map(s => ({ id: s.id, url: s.file_url, alt: s.file_name || '', local: false, file_type: s.file_type })),
  ];

  const items = tab === 'local' ? allItems.filter(i => i.local) : tab === 'server' ? allItems.filter(i => !i.local) : allItems;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <span className="h-px w-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.2))' }} />
          <h1 className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Gallery Manager</h1>
        </div>
        <div className="flex gap-1.5">
          {['all', 'local', 'server'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-200 ${
                tab === t ? 'text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
              style={tab === t ? { background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(168,85,247,0.15))' } : {}}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleUpload}
        className="premium-glass rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6"
      >
        <div className="flex-1 flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: 'var(--input-bg)', border: '1px dashed var(--border-color)' }}>
          <i className="bi-upload text-base" style={{ color: 'var(--text-tertiary)' }} />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="flex-1 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:cursor-pointer file:text-xs file:font-medium"
            style={{ color: 'var(--text-secondary)' }}
          />
        </div>
        <button type="submit" className="btn-primary flex-shrink-0" disabled={!file || uploading}>
          <span>{uploading ? 'Uploading...' : 'Upload'}</span>
        </button>
      </motion.form>

      {items.length === 0 ? (
        <p className="text-center mt-16 text-sm" style={{ color: 'var(--text-secondary)' }}>No items.</p>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
        >
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl"
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <div className="aspect-square overflow-hidden">
                {item.file_type?.startsWith('video') ? (
                  <video src={item.url} controls className="w-full h-full object-cover" />
                ) : (
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => { e.target.src = 'https://placehold.co/400x400/1a1a2e/8a8a9a?text=Error'; }}
                  />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl flex items-end p-2">
                {!item.local && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-full py-1.5 rounded-lg text-xs font-medium text-red-400 transition-all duration-200"
                    style={{ background: 'rgba(0,0,0,0.5)' }}
                  >
                    Delete
                  </button>
                )}
              </div>
              {item.local && (
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-medium" style={{ background: 'rgba(168,85,247,0.15)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.15)' }}>
                  Local
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
