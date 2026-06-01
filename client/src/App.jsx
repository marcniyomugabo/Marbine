import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Memories from './pages/Memories';
import Gallery from './pages/Gallery';
import Messages from './pages/Messages';
import Timeline from './pages/Timeline';
import Contact from './pages/Contact';
import Goals from './pages/Goals';
import Profile from './pages/Profile';
import Register from './pages/Register';
import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminGallery from './pages/admin/AdminGallery';
import AdminMemories from './pages/admin/AdminMemories';
import AdminTimeline from './pages/admin/AdminTimeline';
import AdminFeedback from './pages/admin/AdminFeedback';

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="flex flex-col items-center gap-4">
        <svg className="w-10 h-10" style={{ color: '#ec4899' }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <div className="text-primary text-base animate-pulse" style={{ animation: 'heartbeat 1.8s ease-in-out infinite' }}>Loading</div>
      </div>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (!isAdmin) return <Navigate to="/" />;
  return children;
}

function AuthRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
      <div className="flex flex-col items-center gap-4">
        <svg className="w-10 h-10" style={{ color: '#ec4899' }} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <div className="text-primary text-base animate-pulse" style={{ animation: 'heartbeat 1.8s ease-in-out infinite' }}>Loading</div>
      </div>
    </div>
  );
  return user ? <Navigate to="/" /> : children;
}

function AppLayout() {
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  const isAdminRoute = location.pathname.startsWith('/admin');
  const showNavFooter = !location.pathname.match(/^\/login$/) && !isAdminRoute;

  return (
    <>
      {showNavFooter && <Navbar />}
      <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
        {isAdminRoute ? (
          <Routes location={location} key={location.pathname}>
            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="gallery" element={<AdminGallery />} />
              <Route path="memories" element={<AdminMemories />} />
              <Route path="timeline" element={<AdminTimeline />} />
              <Route path="feedback" element={<AdminFeedback />} />
            </Route>
          </Routes>
        ) : (
          <div className="pt-16">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/login" element={<AuthRoute><Login /></AuthRoute>} />
                <Route path="/register" element={<AuthRoute><Register /></AuthRoute>} />
                <Route path="/" element={<Dashboard />} />
                <Route path="/memories" element={<Memories />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/goals" element={!user || !isAdmin ? <Navigate to="/" /> : <Goals />} />
                <Route path="/messages" element={!user || !isAdmin ? <Navigate to="/login" /> : <Messages />} />
                <Route path="/profile" element={<AdminRoute><Profile /></AdminRoute>} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </AnimatePresence>
          </div>
        )}
      </div>
      {showNavFooter && <Footer />}
    </>
  );
}

function App() {
  const [loadingDone, setLoadingDone] = useState(false);

  return (
    <BrowserRouter>
      <AuthProvider>
        {!loadingDone && <LoadingScreen onFinish={() => setLoadingDone(true)} />}
        <AppLayout />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
