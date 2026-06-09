import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { galleryAPI, publicAPI } from '../services/api';
import { imageList } from '../utils/images';
import Lightbox from '../components/Lightbox';
import PageTransition from '../components/PageTransition';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 25 } },
};

export default function Gallery() {
  const { isAdmin, user } = useAuth();
  const [serverItems, setServerItems] = useState([]);
  const [file, setFile] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [tab, setTab] = useState('all');
  const [uploading, setUploading] = useState(false);

  const allImages = [
    ...imageList.map(img => ({ ...img, local: true, originalId: undefined })),
    ...serverItems.map((s) => ({
      id: `server-${s.id}`,
      originalId: s.id,
      url: s.file_url,
      alt: s.file_name || `Upload ${s.id}`,
      local: false,
      user_id: s.user_id,
    })),
  ];

  const load = async () => {
    try {
      const api = isAdmin ? galleryAPI : publicAPI;
      const res = await api.getGallery();
      setServerItems(res.data);
    } catch {}
  };

  useEffect(() => { load(); }, [isAdmin]);

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
    if (!confirm('Delete this media?')) return;
    try {
      await galleryAPI.remove(id);
      load();
    } catch {}
  };

  const images = tab === 'local' ? imageList : allImages;

  return (
    <PageTransition>
      <div className="page-container">
        <div className="content-wrapper" style={{ maxWidth: '80rem' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="text-center sm:text-left"
          >
            <div className="flex items-center gap-3 mb-1 justify-center sm:justify-start">
              <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.2))' }} />
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Gallery</h2>
              <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.15))' }} />
            </div>
            <p className="text-xs text-center sm:text-left mb-6" style={{ color: 'var(--text-tertiary)' }}>
              Snapshots of our journey
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div className="flex gap-1.5">
              {['all', 'local'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                    tab === t ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                  }`}
                  style={
                    tab === t
                      ? { background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(168,85,247,0.15))' }
                      : { background: 'transparent' }
                  }
                >
                  {t === 'all' ? `All (${allImages.length})` : `Local (${imageList.length})`}
                </button>
              ))}
            </div>
          </div>

          {user && (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleUpload}
              className="premium-glass rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
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
              <button type="submit" className="btn-primary flex-shrink-0 btn-sm" disabled={!file || uploading}>
                <span>{uploading ? 'Uploading...' : 'Upload'}</span>
              </button>
            </motion.form>
          )}

          {images.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ background: 'rgba(168,85,247,0.08)', color: '#a855f7' }}>
                <i className="bi-images" />
              </div>
              <h3 className="empty-state-title">No Photos Yet</h3>
              <p className="empty-state-desc">The gallery is empty. Start adding beautiful moments to your collection.</p>
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
            >
              {images.map((img, i) => (
                <motion.div
                  key={img.id}
                  variants={fadeUp}
                  className="group relative overflow-hidden rounded-2xl cursor-pointer"
                  style={{
                    background: 'var(--glass-bg)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'var(--glass-shadow)',
                  }}
                  onClick={() => setLightboxIndex(i)}
                  layout
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.alt || ''}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  {!img.local && typeof img.originalId === 'number' && (isAdmin || img.user_id === user?.id) && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-2 rounded-2xl">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(img.originalId); }}
                        className="w-full py-1.5 rounded-lg text-xs font-medium text-red-400 transition-all duration-200"
                        style={{ background: 'rgba(0,0,0,0.5)' }}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                    <div className="w-7 h-7 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                      </svg>
                    </div>
                  </div>
                </motion.div>
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
