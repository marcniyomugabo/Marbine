import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import Confetti from '../components/Confetti';

const loveMessages = [
  'Every moment with you feels like a beautiful dream I never want to wake up from.',
  'You are the reason my world is filled with color, light, and endless love.',
  'In your eyes, I found my home. In your heart, I found my peace.',
  'Loving you is the most natural thing I have ever done, like breathing, like living.',
  'You are my greatest adventure, my safest harbor, my forever.',
  'I never knew what love was until you showed me with every word, every touch, every glance.',
  'You are the poetry my heart has been writing since the day we met.',
  'Some people search a lifetime for what we have. I found it in you.',
];

const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export default function Secret() {
  const [showContent, setShowContent] = useState(false);
  const [message, setMessage] = useState('');
  const [confettiActive, setConfettiActive] = useState(false);
  const [code, setCode] = useState([]);
  const [codeInput, setCodeInput] = useState('');

  const activateSecret = useCallback(() => {
    setShowContent(true);
    setConfettiActive(true);
    setMessage(loveMessages[Math.floor(Math.random() * loveMessages.length)]);
    setTimeout(() => setConfettiActive(false), 4000);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      setCode(prev => {
        const next = [...prev, e.key].slice(-konamiCode.length);
        if (next.join(',') === konamiCode.join(',')) {
          activateSecret();
          return [];
        }
        return next;
      });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activateSecret]);

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    if (codeInput.toLowerCase() === 'marbrine') {
      activateSecret();
    }
    setCodeInput('');
  };

  return (
    <PageTransition>
      <Confetti active={confettiActive} duration={4000} />
      <div className="page-container min-h-screen flex items-center justify-center">
        <div className="content-wrapper-narrow text-center">
          {!showContent ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl mb-4"
              >💖</motion.div>
              <h1 className="text-xl font-bold" style={{ color: 'var(--text-tertiary)' }}>
                Type the Konami Code...
              </h1>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                ↑↑↓↓←→←→BA
              </p>
              <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>or</div>
              <form onSubmit={handleCodeSubmit} className="max-w-xs mx-auto">
                <input className="input-field text-center" type="text" placeholder="Enter secret code..."
                  value={codeInput} onChange={(e) => setCodeInput(e.target.value)}
                />
              </form>
              <div className="flex items-center gap-2 justify-center mt-4">
                {code.map((_, i) => (
                  <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="w-2 h-2 rounded-full" style={{ background: '#ec4899' }}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 150, damping: 20 }}
              className="relative"
            >
              <div className="absolute inset-0 opacity-30" style={{
                background: 'radial-gradient(circle at center, rgba(236,72,153,0.3), transparent 60%)',
              }} />

              <div className="relative space-y-6">
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}
                  className="text-7xl mb-4"
                >💖</motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="rounded-2xl p-8 max-w-lg mx-auto"
                  style={{
                    background: 'linear-gradient(135deg, rgba(236,72,153,0.08), rgba(168,85,247,0.04))',
                    border: '1px solid rgba(236,72,153,0.12)',
                    boxShadow: '0 0 40px rgba(236,72,153,0.1)',
                  }}
                >
                  <motion.p
                    key={message}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-lg sm:text-xl leading-relaxed gradient-text font-bold"
                  >
                    "{message}"
                  </motion.p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="flex flex-wrap gap-3 justify-center"
                >
                  {['💖', '✨', '🌹', '💫', '🥰', '💕'].map((emoji, i) => (
                    <motion.span key={i} animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2 + i * 0.3, repeat: Infinity }}
                      className="text-2xl"
                    >{emoji}</motion.span>
                  ))}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    You found the secret page. 💕 This is our little hidden corner of the universe.
                  </p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
