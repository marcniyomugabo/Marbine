import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const add = Math.random() * 8 + 2;
        const next = Math.min(prev + add, 100);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShow(false);
            setTimeout(() => onFinish?.(), 400);
          }, 400);
        }
        return next;
      });
    }, 120);
    return () => clearInterval(interval);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="loading-screen"
        >
          <div className="flex flex-col items-center gap-8">
            <motion.div
              animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              className="heart-glow"
            >
              <svg
                className="w-16 h-16"
                style={{ color: '#ec4899' }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>

            <div className="flex flex-col items-center gap-2">
              <h1 className="text-3xl font-bold gold-text" style={{ fontSize: '2rem' }}>
                Marbine
              </h1>
              <p
                className="text-sm"
                style={{ color: 'var(--text-secondary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}
              >
                A Love Story
              </p>
            </div>

            <div className="w-48 relative">
              <div
                className="h-[2px] rounded-full overflow-hidden"
                style={{ background: 'var(--border-color)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #ec4899, #a855f7, #d4a853, #ec4899)',
                    backgroundSize: '200% 100%',
                  }}
                  animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  initial={{ width: '0%' }}
                />
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, #ec4899, #a855f7)',
                    transition: 'width 0.12s ease-out',
                  }}
                />
              </div>
              <p
                className="text-xs text-center mt-2"
                style={{ color: 'var(--text-secondary)' }}
              >
                {Math.round(progress)}%
              </p>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs italic"
              style={{ color: 'var(--text-secondary)' }}
            >
              Every great love story begins with a single moment...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
