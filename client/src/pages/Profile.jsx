import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import PageTransition from '../components/PageTransition';

export default function Profile() {
  const { user } = useAuth();
  const [profileForm, setProfileForm] = useState({ fullname: user?.fullname || '', email: user?.email || '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' });
  const [profileMsg, setProfileMsg] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');
  const [error, setError] = useState('');

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      await authAPI.updateProfile(profileForm);
      setProfileMsg('Profile updated successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed');
      setProfileMsg('');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      await authAPI.changePassword(passwordForm);
      setPasswordMsg('Password changed successfully');
      setPasswordForm({ currentPassword: '', newPassword: '' });
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Password change failed');
      setPasswordMsg('');
    }
  };

  return (
    <PageTransition>
      <div className="page-container">
        <div className="content-wrapper-narrow">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.2))' }} />
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Profile</h2>
              <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.15))' }} />
            </div>
          </motion.div>

          {error && (
            <p className="text-xs mb-4 text-center px-3 py-2 rounded-lg" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.12)' }}>
              {error}
            </p>
          )}

          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleProfileUpdate}
            className="content-card flex flex-col gap-3 mb-4"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(236,72,153,0.1)' }}>
                <i className="bi-person text-lg" style={{ color: '#ec4899' }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Edit Profile</h3>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Update your personal details</p>
              </div>
            </div>
            {profileMsg && <p className="text-xs text-center px-3 py-1.5 rounded-lg" style={{ color: '#22c55e', background: 'rgba(34,197,94,0.08)' }}>{profileMsg}</p>}
            <input className="input-field" type="text" placeholder="Full Name" value={profileForm.fullname} onChange={(e) => setProfileForm({ ...profileForm, fullname: e.target.value })} required />
            <input className="input-field" type="email" placeholder="Email" value={profileForm.email} onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} required />
            <button className="btn-primary self-end btn-sm" type="submit"><span>Save Changes</span></button>
          </motion.form>

          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            onSubmit={handlePasswordChange}
            className="content-card flex flex-col gap-3"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(168,85,247,0.1)' }}>
                <i className="bi-lock text-lg" style={{ color: '#a855f7' }} />
              </div>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Change Password</h3>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>Update your password</p>
              </div>
            </div>
            {passwordMsg && <p className="text-xs text-center px-3 py-1.5 rounded-lg" style={{ color: '#22c55e', background: 'rgba(34,197,94,0.08)' }}>{passwordMsg}</p>}
            <input className="input-field" type="password" placeholder="Current Password" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required />
            <input className="input-field" type="password" placeholder="New Password" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
            <button className="btn-primary self-end btn-sm" type="submit"><span>Change Password</span></button>
          </motion.form>
        </div>
      </div>
    </PageTransition>
  );
}
