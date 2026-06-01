import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import MusicToggle from './MusicToggle';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/memories', label: 'Memories' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/contact', label: 'Contact' },
];

const adminExtra = { to: '/admin', label: 'Admin' };

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  const links = user && isAdmin ? [...navLinks, adminExtra] : navLinks;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: scrolled ? 'var(--navbar-bg)' : 'linear-gradient(180deg, rgba(10,14,26,0.9) 0%, transparent 100%)',
          transition: 'background 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          borderBottom: scrolled ? '1px solid var(--border-color)' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 sm:h-22">
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <motion.div className="relative" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <div
                  className="absolute inset-0 rounded-full blur-md transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle, rgba(236,72,153,0.3), transparent)',
                    opacity: 0.6,
                  }}
                />
                <i className="bi-heart-fill text-2xl sm:text-3xl relative" style={{ color: '#ec4899' }} />
              </motion.div>
              <span className="font-bold text-xl sm:text-2xl tracking-tight gold-text">Marbine</span>
            </Link>

            <div className="hidden md:flex items-center justify-center flex-1 px-6 lg:px-12">
              <div className="flex items-center gap-0.5">
                {links.map((link) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <Link key={link.to} to={link.to} className="relative">
                      <motion.div
                        className={`flex items-center gap-1.5 px-4 lg:px-5 py-2.5 rounded-xl text-base font-medium transition-all duration-300 ${
                          isActive ? 'text-white' : 'text-gray-500 hover:text-gray-200'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <span>{link.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="navGlow"
                            className="absolute inset-0 rounded-xl -z-10"
                            style={{
                              background: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(168,85,247,0.08))',
                              boxShadow: '0 0 20px rgba(236,72,153,0.06)',
                            }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-1.5">
              <MusicToggle />
              <motion.button
                onClick={toggleTheme}
                className="theme-toggle"
                whileTap={{ scale: 0.9 }}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <i className={`${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill'} text-lg`} />
              </motion.button>
              {user && isAdmin ? (
                <motion.button
                  onClick={handleLogout}
                  className="relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-1.5"
                  style={{ color: 'var(--text-secondary)' }}
                  whileHover={{ scale: 1.03, color: '#ef4444' }}
                  whileTap={{ scale: 0.97 }}
                >
                  <i className="bi-box-arrow-right text-base" />
                  <span className="hidden lg:inline">Logout</span>
                </motion.button>
              ) : !user ? (
                <Link to="/login">
                  <motion.button
                    className="relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300"
                    style={{
                      background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(168,85,247,0.1))',
                      color: '#f1f0f5',
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="flex items-center gap-1.5">
                      <i className="bi-heart text-base" />
                      Sign In
                    </span>
                  </motion.button>
                </Link>
              ) : null}
            </div>

            <div className="flex md:hidden items-center gap-1.5">
              <MusicToggle />
              <motion.button
                onClick={toggleTheme}
                className="theme-toggle"
                whileTap={{ scale: 0.9 }}
                title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <i className={`${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-stars-fill'} text-base`} />
              </motion.button>
              <motion.button
                onClick={() => setOpen(!open)}
                className="relative w-9 h-9 flex items-center justify-center rounded-xl transition-all duration-300"
                style={{ color: 'var(--text-secondary)' }}
                whileTap={{ scale: 0.9 }}
              >
                <i className={`${open ? 'bi-x-lg' : 'bi-list'} text-lg`} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="fixed top-[4.5rem] left-3 right-3 z-40 md:hidden overflow-hidden rounded-2xl"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                boxShadow: 'var(--card-shadow)',
              }}
            >
              <div className="py-2 px-2 max-h-[70vh] overflow-y-auto">
                {links.map((link, i) => {
                  const isActive = location.pathname === link.to;
                  return (
                    <motion.div
                      key={link.to}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                    >
                      <Link
                        to={link.to}
                        onClick={() => setOpen(false)}
                        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl text-base font-medium transition-all duration-200 ${
                          isActive ? 'text-white' : 'text-gray-500 hover:text-gray-200'
                        }`}
                        style={
                          isActive
                            ? { background: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(168,85,247,0.08))' }
                            : {}
                        }
                      >
                        {link.label}
                        {isActive && (
                          <motion.div
                            layoutId="mobileActive"
                            className="ml-auto w-1.5 h-1.5 rounded-full"
                            style={{ background: '#ec4899', boxShadow: '0 0 6px rgba(236,72,153,0.4)' }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="mt-2 pt-2 space-y-1"
                  style={{ borderTop: '1px solid var(--border-color)' }}
                >
                  {user && isAdmin ? (
                    <button
                      onClick={() => { handleLogout(); setOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-red-400 transition-all duration-200"
                    >
                      <i className="bi-box-arrow-right text-lg" />
                      Logout
                    </button>
                  ) : !user ? (
                    <Link to="/login" onClick={() => setOpen(false)}>
                      <div className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-white transition-all duration-200">
                        <i className="bi-heart text-lg" />
                        Sign In
                      </div>
                    </Link>
                  ) : null}
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-30 md:hidden"
              onClick={() => setOpen(false)}
            />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
