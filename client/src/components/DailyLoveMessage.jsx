import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { dailyMessagesAPI } from '../services/api';

export default function DailyLoveMessage() {
  const [message, setMessage] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem('dailyMessageSeen');
    const today = new Date().toDateString();
    if (seen === today) return;
    dailyMessagesAPI.getRandom().then(r => {
      setMessage(r.data);
      setShow(true);
    }).catch(() => {});
  }, []);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('dailyMessageSeen', new Date().toDateString());
    setTimeout(() => setDismissed(true), 300);
  };

  if (dismissed || !message) return null;

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
            onClick={handleDismiss}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="fixed inset-4 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md w-full z-50 m-auto flex items-center justify-center"
          >
            <div className="rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden w-full"
              style={{
                background: 'linear-gradient(135deg, rgba(15,10,30,0.98), rgba(25,15,40,0.98))',
                border: '1px solid rgba(236,72,153,0.15)',
                boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 40px rgba(236,72,153,0.08)',
              }}
            >
              {/* Glow */}
              <div className="absolute inset-0 opacity-20" style={{
                background: 'radial-gradient(circle at center, rgba(236,72,153,0.2), transparent 60%)',
              }} />

              <div className="relative">
                <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl mb-4"
                >💌</motion.div>

                <span className="inline-block text-xs font-semibold uppercase tracking-[0.15em] mb-3"
                  style={{ color: '#d4a853' }}
                >
                  Daily Love Message
                </span>

                <p className="text-base sm:text-lg leading-relaxed font-medium mb-6 gradient-text">
                  "{message.message}"
                </p>

                <button onClick={handleDismiss} className="btn-primary btn-sm">
                  <span><i className="bi-heart-fill me-1" /> Thank You 💕</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
