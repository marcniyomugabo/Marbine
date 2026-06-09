import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import Confetti from '../components/Confetti';

const hearts = ['💖', '💕', '❤️', '💗', '💓', '💘', '💝', '✨', '🌟', '💫'];

function useShowerParticles(count) {
  return useMemo(() => {
    const w = typeof window !== 'undefined' ? window.innerWidth : 800;
    const h = typeof window !== 'undefined' ? window.innerHeight : 600;
    return Array.from({ length: count }, () => ({
      x: Math.random() * w,
      scale: Math.random() * 0.8 + 0.4,
      rotate: Math.random() * 720 - 360,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      emoji: hearts[Math.floor(Math.random() * hearts.length)],
    }));
  }, [count]);
}

export default function Surprise() {
  const [unlocked, setUnlocked] = useState(false);
  const [confettiActive, setConfettiActive] = useState(false);
  const [showerActive, setShowerActive] = useState(false);
  const particles = useShowerParticles(30);

  const handleUnlock = () => {
    setConfettiActive(true);
    setTimeout(() => {
      setUnlocked(true);
      setConfettiActive(false);
      setShowerActive(true);
      setTimeout(() => setShowerActive(false), 5000);
    }, 2000);
  };

  return (
    <PageTransition>
      <Confetti active={confettiActive} duration={2500} />
      <div className="page-container min-h-screen flex items-center justify-center">
        <div className="content-wrapper-narrow text-center">
          <AnimatePresence mode="wait">
            {!unlocked ? (
              <motion.div key="locked" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                className="space-y-6"
              >
                <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}
                  className="text-7xl mb-4"
                >🎁</motion.div>
                <h1 className="text-2xl sm:text-3xl font-bold gradient-text">You Have a Surprise!</h1>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Something special is waiting for you. Click below to unlock it.
                </p>
                <motion.button onClick={handleUnlock} className="btn-primary text-lg px-8 py-3"
                  whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}
                >
                  <span><i className="bi-gift-fill me-2" /> Unlock Surprise</span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div key="unlocked" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 150, damping: 15 }}
                className="space-y-6"
              >
                <div className="relative">
                  {showerActive && (
                    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                      {particles.map((p, i) => (
                        <motion.div key={i}
                          initial={{ x: p.x, y: -50, opacity: 1, scale: p.scale, rotate: 0 }}
                          animate={{ y: window.innerHeight + 50, opacity: 0, rotate: p.rotate }}
                          transition={{ duration: p.duration, delay: p.delay, ease: 'linear' }}
                          className="text-3xl absolute"
                        >
                          {p.emoji}
                        </motion.div>
                      ))}
                    </div>
                  )}

                  <motion.div animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-7xl mb-4"
                  >💖</motion.div>
                </div>

                <h1 className="text-3xl sm:text-4xl font-bold gradient-text">
                  Surprise! 🎉
                </h1>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="content-card max-w-lg mx-auto"
                >
                  <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    You are the most incredible person in my life. Every day with you is a gift, 
                    and I wanted to create this little surprise just to see you smile. 
                    Thank you for being you — wonderful, beautiful, and absolutely irreplaceable. 💕
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="flex flex-wrap gap-2 justify-center"
                >
                  {hearts.slice(0, 8).map((h, i) => (
                    <motion.span key={i}
                      animate={{ y: [0, -12, 0], rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2 + i * 0.2, repeat: Infinity, delay: i * 0.15 }}
                      className="text-2xl inline-block"
                    >
                      {h}
                    </motion.span>
                  ))}
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
                  <p className="text-sm" style={{ color: '#d4a853' }}>
                    Always and forever, my love 💖
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </PageTransition>
  );
}
