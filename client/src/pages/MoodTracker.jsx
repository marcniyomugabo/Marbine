import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { moodAPI } from '../services/api';
import PageTransition from '../components/PageTransition';
import FloatingHearts from '../components/FloatingHearts';

const moods = [
  { emoji: '😍', label: 'In Love', value: 'in_love', color: '#ec4899' },
  { emoji: '🥰', label: 'Loved', value: 'loved', color: '#f472b6' },
  { emoji: '😊', label: 'Happy', value: 'happy', color: '#f59e0b' },
  { emoji: '😌', label: 'Peaceful', value: 'peaceful', color: '#22d3ee' },
  { emoji: '🤗', label: 'Grateful', value: 'grateful', color: '#d4a853' },
  { emoji: '😢', label: 'Sad', value: 'sad', color: '#818cf8' },
  { emoji: '😤', label: 'Frustrated', value: 'frustrated', color: '#ef4444' },
  { emoji: '🥱', label: 'Tired', value: 'tired', color: '#6b7280' },
];

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getWeekStart = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset * 7);
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split('T')[0];
};

const getWeekEnd = (offset) => {
  const d = new Date();
  d.setDate(d.getDate() + offset * 7);
  d.setDate(d.getDate() + (6 - d.getDay()));
  return d.toISOString().split('T')[0];
};

const getWeekDates = (offset) => {
  const dates = [];
  const start = new Date(getWeekStart(offset));
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
};

export default function MoodTracker() {
  const [entries, setEntries] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMood, setSelectedMood] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);

  const loadEntries = useCallback(async () => {
    try {
      const start = getWeekStart(weekOffset);
      const end = getWeekEnd(weekOffset);
      const res = await moodAPI.getByDateRange(start, end);
      setEntries(res.data);
    } catch {}
  }, [weekOffset]);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const getEntryForDate = (date) => entries.find(e => e.entry_date === date);

  const handleSave = async () => {
    if (!selectedMood) return;
    try {
      await moodAPI.createOrUpdate({ mood: selectedMood, note, entry_date: selectedDate });
      setMessage('Mood saved! 💖');
      loadEntries();
      setTimeout(() => setMessage(''), 2000);
    } catch {
      setMessage('Failed to save mood');
    }
  };

  const weekDates = getWeekDates(weekOffset);

  return (
    <PageTransition>
      <FloatingHearts count={6} speed={0.3} />
      <div className="page-container">
        <div className="content-wrapper">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="h-px w-8" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.2))' }} />
            <h1 className="text-xs font-semibold uppercase tracking-[0.15em]" style={{ color: 'var(--text-secondary)' }}>Mood Tracker</h1>
            <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.15))' }} />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
              style={{ background: 'rgba(236,72,153,0.08)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.12)' }}
            >
              📊 How Are You Feeling?
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text mb-2">Mood Tracker</h2>
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Track your emotions and share how you feel each day</p>
          </motion.div>

          {message && (
            <p className="text-xs mb-4 text-center px-3 py-2 rounded-lg" style={{
              color: message.includes('Failed') ? '#ef4444' : '#22c55e',
              background: message.includes('Failed') ? 'rgba(239,68,68,0.08)' : 'rgba(34,197,94,0.08)',
              border: `1px solid ${message.includes('Failed') ? 'rgba(239,68,68,0.12)' : 'rgba(34,197,94,0.12)'}`,
            }}>{message}</p>
          )}

          <div className="content-card max-w-xl mx-auto mb-6">
            <label className="text-xs font-semibold mb-3 block" style={{ color: 'var(--text-secondary)' }}>
              How are you feeling today?
            </label>
            <div className="flex flex-wrap gap-2 justify-center mb-4">
              {moods.map((m) => (
                <motion.button key={m.value} onClick={() => setSelectedMood(m.value)}
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all duration-200"
                  style={{
                    background: selectedMood === m.value ? `${m.color}20` : 'var(--glass-bg)',
                    border: `1px solid ${selectedMood === m.value ? `${m.color}40` : 'var(--glass-border)'}`,
                    boxShadow: selectedMood === m.value ? `0 0 16px ${m.color}20` : 'none',
                  }}
                >
                  <span className="text-2xl">{m.emoji}</span>
                  <span className="text-[10px] font-medium" style={{ color: selectedMood === m.value ? m.color : 'var(--text-tertiary)' }}>{m.label}</span>
                </motion.button>
              ))}
            </div>
            <textarea className="input-field min-h-[80px] resize-y" placeholder="Add a note about your day..."
              value={note} onChange={(e) => setNote(e.target.value)}
            />
            <div className="flex gap-2 justify-end mt-3">
              <input type="date" className="input-field w-auto text-xs" value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <button onClick={handleSave} disabled={!selectedMood} className="btn-primary btn-sm">
                <span><i className="bi-check-lg me-1" /> Save Mood</span>
              </button>
            </div>
          </div>

          <div className="content-card max-w-xl mx-auto mb-8">
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => setWeekOffset(weekOffset - 1)} className="btn-ghost btn-sm">
                <i className="bi-chevron-left" />
              </button>
              <span className="text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
                This Week
              </span>
              <button onClick={() => setWeekOffset(weekOffset + 1)} className="btn-ghost btn-sm"
                disabled={weekOffset >= 0}
              >
                <i className="bi-chevron-right" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-2">
              {weekDates.map((date, i) => {
                const entry = getEntryForDate(date);
                const moodData = entry ? moods.find(m => m.value === entry.mood) : null;
                const isToday = date === new Date().toISOString().split('T')[0];
                return (
                  <motion.div key={date} onClick={() => { setSelectedDate(date); if (moodData) { setSelectedMood(moodData.value); setNote(entry.note || ''); }}}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl cursor-pointer transition-all duration-200"
                    style={{
                      background: isToday ? 'rgba(236,72,153,0.08)' : 'var(--glass-bg)',
                      border: `1px solid ${isToday ? 'rgba(236,72,153,0.15)' : 'var(--glass-border)'}`,
                    }}
                  >
                    <span className="text-[10px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
                      {dayNames[i]}
                    </span>
                    <span className={`text-xs font-bold ${isToday ? 'text-primary' : ''}`}
                      style={{ color: isToday ? '#ec4899' : 'var(--text-primary)' }}
                    >
                      {new Date(date).getDate()}
                    </span>
                    {moodData ? (
                      <span className="text-lg" title={moodData.label}>{moodData.emoji}</span>
                    ) : (
                      <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>—</span>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>

          {entries.length > 0 && (
            <div className="max-w-xl mx-auto">
              <div className="flex items-center gap-4 mb-4">
                <span className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(236,72,153,0.2))' }} />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ color: 'var(--text-secondary)' }}>Recent Entries</span>
                <span className="h-px flex-1" style={{ background: 'linear-gradient(270deg, transparent, rgba(236,72,153,0.15))' }} />
              </div>
              <div className="space-y-2">
                {entries.slice(0, 10).map((e) => {
                  const moodData = moods.find(m => m.value === e.mood);
                  return (
                    <motion.div key={e.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 p-3 rounded-xl"
                      style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
                    >
                      <span className="text-xl">{moodData?.emoji || '❓'}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold" style={{ color: moodData?.color || 'var(--text-primary)' }}>
                            {moodData?.label || e.mood}
                          </span>
                          <span className="text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                            {new Date(e.entry_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                        {e.note && <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{e.note}</p>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
