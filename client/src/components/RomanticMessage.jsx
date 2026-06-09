import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { romanticAPI } from '../services/api';

const moods = [
  { emoji: '😍', value: 'in_love', label: 'In Love' },
  { emoji: '🥰', value: 'loved', label: 'Loved' },
  { emoji: '😊', value: 'happy', label: 'Happy' },
  { emoji: '😌', value: 'peaceful', label: 'Peaceful' },
  { emoji: '🤗', value: 'grateful', label: 'Grateful' },
  { emoji: '😢', value: 'sad', label: 'Sad' },
  { emoji: '😤', value: 'frustrated', label: 'Frustrated' },
  { emoji: '🥱', value: 'tired', label: 'Tired' },
];

export default function RomanticMessage() {
  const [dailyMessage, setDailyMessage] = useState(null);
  const [specialDay, setSpecialDay] = useState(null);
  const [selectedMood, setSelectedMood] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchMessage = useCallback(async (mood, special) => {
    setLoading(true);
    setError(false);
    try {
      const res = await romanticAPI.getDailyMessage(mood, special);
      setDailyMessage(res.data);
    } catch {
      setError(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    romanticAPI.checkSpecialDay().then(r => {
      if (r.data.is_special) {
        setSpecialDay(r.data);
        fetchMessage('', r.data.type);
      } else {
        fetchMessage('', '');
      }
    }).catch(() => fetchMessage('', ''));
  }, [fetchMessage]);

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    fetchMessage(mood, specialDay?.type || '');
  };

  const refreshMessage = () => {
    fetchMessage(selectedMood, specialDay?.type || '');
  };

  if (error && !dailyMessage) return null;
  if (!dailyMessage && loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="spinner-ripple"><div /><div /></div>
      </div>
    );
  }
  if (!dailyMessage) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl mb-8"
      style={{
        background: specialDay
          ? 'linear-gradient(135deg, rgba(236,72,153,0.1), rgba(212,168,83,0.08))'
          : 'linear-gradient(135deg, rgba(236,72,153,0.06), rgba(168,85,247,0.04))',
        border: specialDay
          ? '1px solid rgba(212,168,83,0.2)'
          : '1px solid rgba(236,72,153,0.12)',
        boxShadow: specialDay
          ? '0 8px 32px rgba(212,168,83,0.1)'
          : '0 8px 32px rgba(236,72,153,0.06)',
      }}
    >
      {/* Glow */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
        backgroundSize: '40px 40px',
      }} />

      <div className="relative p-5 sm:p-6">
        {/* Special Day Badge */}
        {specialDay && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider mb-3"
            style={{
              background: 'linear-gradient(135deg, rgba(212,168,83,0.15), rgba(236,72,153,0.1))',
              color: '#d4a853',
              border: '1px solid rgba(212,168,83,0.2)',
              boxShadow: '0 0 20px rgba(212,168,83,0.1)',
            }}
          >
            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              ✨
            </motion.span>
            {specialDay.label}
            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }}>
              ✨
            </motion.span>
          </motion.div>
        )}

        {/* Message */}
        <AnimatePresence mode="wait">
          <motion.div
            key={dailyMessage.message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          >
            <div className="flex items-start gap-3 mb-3">
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-xl mt-0.5 flex-shrink-0"
              >
                {specialDay ? '💖' : '💌'}
              </motion.span>
              <p className="text-sm sm:text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                {dailyMessage.message}
              </p>
            </div>

            {/* Song Suggestion */}
            {dailyMessage.song && (
              <div className="flex items-center gap-2 mt-2 mb-3 ml-9">
                <span className="text-[10px]">🎵</span>
                <span className="text-[11px] font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {dailyMessage.song}
                </span>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(dailyMessage.song)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] px-2 py-0.5 rounded-full transition-all duration-200 hover:scale-105"
                  style={{ color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}
                  title="Search on YouTube"
                >
                  <i className="bi-youtube" /> Play
                </a>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2 mt-4 ml-9">
          {/* Mood Selector */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {moods.map((m) => (
              <motion.button
                key={m.value}
                onClick={() => handleMoodSelect(m.value)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] transition-all duration-200"
                style={{
                  background: selectedMood === m.value ? 'rgba(236,72,153,0.1)' : 'transparent',
                  border: `1px solid ${selectedMood === m.value ? 'rgba(236,72,153,0.2)' : 'var(--glass-border)'}`,
                  color: selectedMood === m.value ? '#ec4899' : 'var(--text-tertiary)',
                }}
                title={m.label}
              >
                <span>{m.emoji}</span>
              </motion.button>
            ))}
          </div>

          {/* Refresh */}
          <motion.button
            onClick={refreshMessage}
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all duration-200"
            style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              color: 'var(--text-secondary)',
            }}
          >
            <i className={`bi-arrow-repeat ${loading ? 'animate-spin' : ''}`} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
