import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: 'bi-speedometer2' },
  { to: '/admin/memories', label: 'Memories', icon: 'bi-journal-text' },
  { to: '/admin/gallery', label: 'Gallery', icon: 'bi-images' },
  { to: '/admin/timeline', label: 'Timeline', icon: 'bi-clock-history' },
  { to: '/admin/feedback', label: 'Feedback', icon: 'bi-chat-dots' },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="admin-layout">
      {/* Mobile menu toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-[110] w-9 h-9 rounded-xl flex items-center justify-center md:hidden"
        style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}
      >
        <i className={`${sidebarOpen ? 'bi-x-lg' : 'bi-list'} text-base`} style={{ color: 'var(--text-secondary)' }} />
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[90] md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}
        style={{
          background: 'var(--card-bg)',
          borderRight: '1px solid var(--card-border)',
        }}
      >
        <div className="p-4 sm:p-5">
          <Link to="/" className="flex items-center gap-2 mb-6">
            <i className="bi-heart-fill text-lg" style={{ color: '#ec4899' }} />
            <span className="gold-text font-bold text-sm">Marbine Admin</span>
          </Link>

          <nav className="flex flex-col gap-1">
            {adminNav.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive ? 'text-white' : 'text-gray-500 hover:text-gray-200'
                  }`}
                  style={
                    isActive
                      ? { background: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(168,85,247,0.08))' }
                      : {}
                  }
                >
                  <i className={`${item.icon} text-base`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 sm:p-5" style={{ borderTop: '1px solid var(--border-color)' }}>
          <div className="flex items-center gap-2 mb-3 px-1">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: 'rgba(236,72,153,0.1)', color: '#ec4899' }}
            >
              {user?.fullname?.charAt(0) || 'A'}
            </div>
            <span className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>
              {user?.fullname || 'Admin'}
            </span>
          </div>
          <Link to="/" className="flex items-center gap-2 px-1 py-1.5 rounded-lg text-xs transition-colors duration-200 hover:text-white" style={{ color: 'var(--text-tertiary)' }}>
            <i className="bi-house text-xs" />
            View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-1 py-1.5 rounded-lg text-xs transition-colors duration-200 hover:text-red-400 mt-1"
            style={{ color: 'var(--text-tertiary)' }}
          >
            <i className="bi-box-arrow-right text-xs" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
