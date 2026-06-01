import { useState } from 'react';
import { motion } from 'framer-motion';
import { contactAPI } from '../services/api';
import PageTransition from '../components/PageTransition';

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', email: '', location: '', comment: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name.trim()) return setError('Name is required');
    if (!form.email.trim()) return setError('Email is required');
    if (!form.comment.trim()) return setError('Message is required');
    setSending(true);
    try {
      await contactAPI.submit(form);
      setSubmitted(true);
      setForm({ name: '', phone: '', email: '', location: '', comment: '' });
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setSending(false);
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
            className="text-center"
          >
            <div className="flex items-center gap-3 mb-1 justify-center">
              <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.2))' }} />
              <h2 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Contact Us</h2>
              <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.15))' }} />
            </div>
            <p className="text-xs mb-6" style={{ color: 'var(--text-tertiary)' }}>
              We'd love to hear from you
            </p>
          </motion.div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="content-card text-center"
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(236,72,153,0.1)' }}>
                <svg className="w-8 h-8" style={{ color: '#ec4899' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Thank You!</h3>
              <p className="text-sm mb-6 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Your message has been sent. We'll get back to you soon.
              </p>
              <button className="btn-primary" onClick={() => setSubmitted(false)}>
                <span>Send Another</span>
              </button>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="content-card flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className="input-field" type="text" name="name" placeholder="Your Name *" value={form.name} onChange={handleChange} required />
                <input className="input-field" type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input className="input-field" type="email" name="email" placeholder="Email Address *" value={form.email} onChange={handleChange} required />
                <input className="input-field" type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} />
              </div>
              <textarea className="input-field" name="comment" placeholder="Your Message *" value={form.comment} onChange={handleChange} rows={5} required />

              {error && (
                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs px-3 py-2 rounded-lg" style={{ color: '#ef4444', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.12)' }}>
                  {error}
                </motion.p>
              )}

              <button className="btn-primary self-start" type="submit" disabled={sending}>
                <span className="flex items-center gap-2">
                  {sending ? (
                    <>
                      <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="bi-send text-xs" />
                      Send Message
                    </>
                  )}
                </span>
              </button>
            </motion.form>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
