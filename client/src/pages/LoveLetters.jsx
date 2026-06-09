import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loveLettersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import FloatingHearts from '../components/FloatingHearts';
import Confetti from '../components/Confetti';

export default function LoveLetters() {
  const { user } = useAuth();
  const [letters, setLetters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', content: '', unlock_date: '', password: '', password_hint: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openingId, setOpeningId] = useState(null);
  const [passwordModal, setPasswordModal] = useState(null);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [unlockedContent, setUnlockedContent] = useState(null);
  const [confettiActive, setConfettiActive] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);

  useEffect(() => {
    loveLettersAPI.getAll().then(r => setLetters(r.data)).catch(() => {});
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required');
      return;
    }
    try {
      await loveLettersAPI.create(form);
      setSuccess('Your love letter has been sealed! 💌');
      setForm({ title: '', content: '', unlock_date: '', password: '', password_hint: '' });
      setShowForm(false);
      setShowPasswordField(false);
      setError('');
      const res = await loveLettersAPI.getAll();
      setLetters(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create letter');
    }
  };

  const handleOpen = async (id) => {
    setOpeningId(id);
    setTimeout(async () => {
      try {
        await loveLettersAPI.markOpened(id);
        const res = await loveLettersAPI.getAll();
        setLetters(res.data);
      } catch {}
      setOpeningId(null);
    }, 1500);
  };

  const handlePasswordUnlock = async (id) => {
    if (!passwordInput) return;
    try {
      const res = await loveLettersAPI.unlockByPassword(id, passwordInput);
      setUnlockedContent(res.data.content);
      setConfettiActive(true);
      setTimeout(() => setConfettiActive(false), 3000);
      setPasswordError('');
      setPasswordModal(null);
      setPasswordInput('');
      const lettersRes = await loveLettersAPI.getAll();
      setLetters(lettersRes.data);
    } catch (err) {
      setPasswordError(err.response?.data?.error || 'Wrong password');
    }
  };

  const handleDelete = async (id) => {
    try {
      await loveLettersAPI.remove(id);
      const res = await loveLettersAPI.getAll();
      setLetters(res.data);
    } catch {}
  };

  return (
    <PageTransition>
      <Confetti active={confettiActive} duration={3000} />
      <FloatingHearts count={6} speed={0.35} />
      <div className="page-container">
        <div className="content-wrapper">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.2))' }} />
            <h1 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Love Letters</h1>
            <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.15))' }} />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
              style={{ background: 'rgba(236,72,153,0.08)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.12)' }}
            >
              💌 Time Capsule Letters
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Letters for the Future</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Write a letter to be opened on a special day</p>
          </motion.div>

          {error && <p className="text-xs mb-4 text-center px-3 py-2 rounded-lg" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.12)' }}>{error}</p>}
          {success && <p className="text-xs mb-4 text-center px-3 py-2 rounded-lg" style={{ color: '#22c55e', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.12)' }}>{success}</p>}

          {unlockedContent && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto mb-6 p-4 rounded-xl text-center"
              style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.12)' }}
            >
              <p className="text-xs font-medium" style={{ color: '#22c55e' }}>
                💖 Letter unlocked! Content revealed below.
              </p>
            </motion.div>
          )}

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
                  <i className="bi-envelope-heart text-lg" style={{ color: '#ec4899' }} />
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Write a New Letter</h3>
                </div>
                <input className="input-field" type="text" placeholder="Letter title..." value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })} required
                />
                <textarea className="input-field min-h-[160px] resize-y" placeholder="Write your message..." value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })} required
                />
                <div>
                  <label className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Unlock date (leave empty for immediate)</label>
                  <input className="input-field mt-1" type="date" value={form.unlock_date}
                    onChange={(e) => setForm({ ...form, unlock_date: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={showPasswordField}
                      onChange={() => setShowPasswordField(!showPasswordField)}
                      className="w-3.5 h-3.5 rounded"
                      style={{ accentColor: '#ec4899' }}
                    />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Protect with password</span>
                  </label>
                </div>
                {showPasswordField && (
                  <div className="flex flex-col gap-2 pl-5">
                    <input className="input-field" type="text" placeholder="Password..." value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <input className="input-field" type="text" placeholder="Hint for the password (optional)" value={form.password_hint}
                      onChange={(e) => setForm({ ...form, password_hint: e.target.value })}
                    />
                  </div>
                )}
                <div className="flex gap-2 justify-end mt-1">
                  <button type="button" onClick={() => setShowForm(false)} className="btn-ghost btn-sm">Cancel</button>
                  <button type="submit" className="btn-primary btn-sm"><span>💌 Seal Letter</span></button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {!showForm && (
            <div className="text-center mb-8">
              <button onClick={() => { setShowForm(true); setError(''); setSuccess(''); }} className="btn-primary">
                <span><i className="bi-envelope-plus me-1" /> Write a Love Letter</span>
              </button>
            </div>
          )}

          {letters.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><i className="bi-envelope-open" /></div>
              <p className="empty-state-title">No love letters yet</p>
              <p className="empty-state-desc">Write your first time-capsule letter. It will be a beautiful surprise!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {letters.map((letter) => {
                const isLocked = !letter.can_view;
                const hasPassword = letter.has_password;
                const unlockDate = letter.unlock_date;
                const daysUntil = unlockDate ? Math.ceil((new Date(unlockDate) - new Date()) / 86400000) : 0;
                const isOpening = openingId === letter.id;

                return (
                  <motion.div key={letter.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    className="rounded-2xl overflow-hidden transition-all duration-300"
                    style={{
                      background: isLocked ? 'var(--card-bg)' : 'linear-gradient(135deg, rgba(236,72,153,0.06), rgba(168,85,247,0.04))',
                      border: `1px solid ${isLocked ? 'var(--card-border)' : 'rgba(236,72,153,0.12)'}`,
                      boxShadow: isLocked ? 'var(--card-shadow)' : '0 8px 32px rgba(236,72,153,0.08)',
                    }}
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">
                            {isLocked ? '🔒' : hasPassword && !letter.is_opened ? '🔐' : '💌'}
                          </span>
                          <div>
                            <h3 className="text-sm font-bold" style={{ color: isLocked ? 'var(--text-tertiary)' : 'var(--text-primary)' }}>
                              {isLocked ? 'Secret Letter' : letter.title}
                            </h3>
                            <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>From {letter.sender_name}</p>
                          </div>
                        </div>
                        {(user?.id === letter.sender_id || user?.role === 'admin') && (
                          <button onClick={() => handleDelete(letter.id)}
                            className="text-xs px-2 py-1 rounded-lg transition-colors"
                            style={{ color: 'var(--text-tertiary)' }}
                            onMouseOver={e => e.target.style.color = '#ef4444'}
                            onMouseOut={e => e.target.style.color = ''}
                          ><i className="bi-trash" /></button>
                        )}
                      </div>

                      {isLocked && hasPassword ? (
                        <div className="text-center py-4">
                          <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                            🔐 Protected with a password
                          </p>
                          {letter.password_hint && (
                            <p className="text-[10px] mb-3 italic" style={{ color: 'var(--text-tertiary)' }}>
                              Hint: {letter.password_hint}
                            </p>
                          )}
                          <button onClick={() => setPasswordModal(letter.id)}
                            className="w-full py-2 rounded-xl text-xs font-medium transition-all duration-300"
                            style={{
                              background: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(168,85,247,0.08))',
                              color: '#ec4899',
                            }}
                          >
                            🔑 Unlock with Password
                          </button>
                        </div>
                      ) : isLocked ? (
                        <div className="text-center py-4">
                          <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                            Unlocks in <strong style={{ color: '#d4a853' }}>{daysUntil} days</strong>
                          </p>
                          {unlockDate && (
                            <p className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                              {new Date(unlockDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                          )}
                          <div className="mt-3 w-full rounded-full h-1.5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <div className="h-full rounded-full" style={{
                              width: `${Math.max(0, Math.min(100, 100 - (daysUntil / 365) * 100))}%`,
                              background: 'linear-gradient(90deg, #ec4899, #d4a853)',
                            }} />
                          </div>
                        </div>
                      ) : (
                        <div>
                          {!letter.is_opened ? (
                            <div>
                              <p className="text-xs leading-relaxed mb-3 line-clamp-3" style={{ color: 'var(--text-secondary)' }}>
                                {letter.content}
                              </p>
                              <button onClick={() => handleOpen(letter.id)} disabled={isOpening}
                                className="w-full py-2 rounded-xl text-xs font-medium transition-all duration-300"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(168,85,247,0.08))',
                                  color: '#ec4899',
                                }}
                              >
                                {isOpening ? '✨ Opening...' : '💌 Open Letter'}
                              </button>
                            </div>
                          ) : (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                              <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>
                                {letter.content}
                              </p>
                              <p className="text-[10px] mt-3 text-center" style={{ color: '#ec4899' }}>
                                💖 Opened with love
                              </p>
                            </motion.div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Password Modal */}
          <AnimatePresence>
            {passwordModal && (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 z-50" onClick={() => { setPasswordModal(null); setPasswordInput(''); setPasswordError(''); }}
                />
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  className="fixed inset-x-4 top-1/2 -translate-y-1/2 max-w-sm mx-auto z-50 rounded-2xl p-6"
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    boxShadow: 'var(--card-shadow)',
                  }}
                >
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>🔐 Enter Password</h3>
                  {letters.find(l => l.id === passwordModal)?.password_hint && (
                    <p className="text-[10px] mb-3 italic" style={{ color: 'var(--text-tertiary)' }}>
                      Hint: {letters.find(l => l.id === passwordModal)?.password_hint}
                    </p>
                  )}
                  <input className="input-field mb-3" type="password" placeholder="Password..."
                    value={passwordInput} onChange={(e) => setPasswordInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handlePasswordUnlock(passwordModal); }}
                    autoFocus
                  />
                  {passwordError && (
                    <p className="text-xs mb-2" style={{ color: '#ef4444' }}>{passwordError}</p>
                  )}
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => { setPasswordModal(null); setPasswordInput(''); setPasswordError(''); }} className="btn-ghost btn-sm">Cancel</button>
                    <button onClick={() => handlePasswordUnlock(passwordModal)} className="btn-primary btn-sm">
                      <span>🔓 Unlock</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
