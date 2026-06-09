import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usersAPI } from '../../services/api';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } },
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fullname: '', email: '', password: '', role: 'user' });

  const load = async () => {
    try {
      const res = await usersAPI.getAll();
      setUsers(res.data);
    } catch {}
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await usersAPI.create(form);
      setShowForm(false);
      setForm({ fullname: '', email: '', password: '', role: 'user' });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Error creating user');
    }
  };

  const handleRoleToggle = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change ${user.fullname}'s role to ${newRole}?`)) return;
    try {
      await usersAPI.updateRole(user.id, { role: newRole });
      load();
    } catch {}
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Delete user ${name}? This cannot be undone.`)) return;
    try {
      await usersAPI.remove(id);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Error deleting user');
    }
  };

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-3">
          <span className="h-px w-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.2))' }} />
          <h1 className="text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Users</h1>
        </div>
        <button className="btn-primary" onClick={() => { setShowForm(!showForm); }}>
          <span className="flex items-center gap-1.5">
            <i className="bi-plus-lg text-xs" />
            {showForm ? 'Cancel' : 'Add User'}
          </span>
        </button>
      </motion.div>

      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          onSubmit={handleCreate}
          className="premium-glass rounded-2xl p-5 flex flex-col gap-3 mb-6 overflow-hidden"
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>New User</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="input-field" type="text" placeholder="Full Name *" value={form.fullname} onChange={(e) => setForm({ ...form, fullname: e.target.value })} required />
            <input className="input-field" type="email" placeholder="Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input className="input-field" type="password" placeholder="Password *" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <select
              className="input-field"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button type="button" className="btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
            <button className="btn-primary" type="submit"><span>Create User</span></button>
          </div>
        </motion.form>
      )}

      {users.length === 0 ? (
        <p className="text-center mt-16 text-sm" style={{ color: 'var(--text-secondary)' }}>No users yet.</p>
      ) : (
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {users.map((u) => (
            <motion.div
              key={u.id}
              variants={fadeUp}
              className="rounded-2xl p-3 flex items-center gap-3 transition-all duration-200 hover:translate-y-[-1px]"
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid var(--glass-border)',
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: u.role === 'admin' ? 'rgba(236,72,153,0.1)' : 'rgba(34,211,238,0.1)', color: u.role === 'admin' ? '#ec4899' : '#22d3ee' }}
              >
                {u.fullname?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{u.fullname}</span>
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded-md font-medium flex-shrink-0"
                    style={{
                      background: u.role === 'admin' ? 'rgba(236,72,153,0.1)' : 'rgba(34,211,238,0.08)',
                      color: u.role === 'admin' ? '#ec4899' : '#22d3ee',
                      border: `1px solid ${u.role === 'admin' ? 'rgba(236,72,153,0.15)' : 'rgba(34,211,238,0.12)'}`
                    }}
                  >
                    {u.role}
                  </span>
                </div>
                <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>{u.email}</p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <button
                  className="btn-ghost text-xs"
                  onClick={() => handleRoleToggle(u)}
                >
                  Make {u.role === 'admin' ? 'User' : 'Admin'}
                </button>
                <button
                  className="btn-danger text-xs"
                  onClick={() => handleDelete(u.id, u.fullname)}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}