import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import FloatingParticles from '../components/FloatingParticles';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await login(form);
      navigate(result.user?.isAdmin ? '/admin' : '/home');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'var(--bg-primary)' }}>
      <FloatingParticles count={8} speed={0.4} />
      <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="w-full max-w-sm relative z-10"
      >
        <div
          className="content-card"
        >
          <div className="text-center mb-8">
            <motion.div
              animate={{ scale: [1, 1.12, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="mb-4"
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto" style={{ background: 'rgba(236,72,153,0.1)' }}>
                <svg className="w-7 h-7" style={{ color: '#ec4899' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
            </motion.div>
            <h1 className="text-xl font-bold gradient-text">Marbine Memories</h1>
            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Welcome back, love</p>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs mb-4 text-center px-3 py-2 rounded-lg"
              style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.12)' }}
            >
              {error}
            </motion.p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input className="input-field" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <div className="relative">
              <input className="input-field w-full pr-10" type={showPassword ? 'text' : 'password'} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
              <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--text-tertiary)' }} onClick={() => setShowPassword(!showPassword)}>
                <i className={showPassword ? 'bi-eye-slash' : 'bi-eye'} />
              </button>
            </div>
            <motion.button type="submit" className="btn-primary w-full py-2.5 mt-1" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <span className="flex items-center justify-center gap-2">
                <i className="bi-heart-fill text-xs" />
                Login
              </span>
            </motion.button>
          </form>

          <p className="text-center text-xs mt-5" style={{ color: 'var(--text-tertiary)' }}>
            <span style={{ color: '#ec4899' }}>Admin access only</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
