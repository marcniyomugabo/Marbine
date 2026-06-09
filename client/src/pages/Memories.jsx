import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { memoriesAPI, publicAPI, songsAPI } from '../services/api';
import EmojiReactions from '../components/EmojiReactions';
import Confetti from '../components/Confetti';
import Lightbox from '../components/Lightbox';
import PageTransition from '../components/PageTransition';
import FloatingHearts from '../components/FloatingHearts';

const COUNTDOWN_DATE = new Date('2025-04-18T00:00:00');
const COUPLE = { marc: 'Marc', blandine: 'Blandine' };

const timelineEvents = [
  { year: '2024', title: 'First Meeting', desc: 'Marc transferred from BTR Rwamiko TSS to Gitisi TSS. They met in L3 Software Development — just classmates at first.', icon: '👋', color: '#a855f7' },
  { year: '2024', title: 'Building Friendship', desc: 'Day by day, they grew closer. Late study sessions turned into deep conversations. A strong bond began to form.', icon: '🤝', color: '#d4a853' },
  { year: '17 Feb 2025', title: 'Best Friends Forever', desc: 'They officially became best friends. A foundation of trust, laughter, and understanding was set forever.', icon: '💎', color: '#ec4899' },
  { year: '18 Apr 2025', title: 'Love Blossomed', desc: 'A Sunday to remember. What started as friendship bloomed into something beautiful. Their love story officially began.', icon: '💕', color: '#ec4899' },
  { year: 'Future', title: 'Building Dreams Together', desc: 'Graduation, careers, a home, family, and a lifetime of adventures. Their story is just getting started.', icon: '✨', color: '#fbbf24' },
];

const quotes = [
  { text: 'You are my favorite notification.', author: '— Marc' },
  { text: 'Every love story is beautiful, but ours is my favorite.', author: '— Marc' },
  { text: 'When I am with you, every moment becomes a memory.', author: '— Marc' },
  { text: 'You are the reason behind my smile.', author: '— Marc' },
  { text: 'My heart found its home in you.', author: '— Marc' },
  { text: 'Forever isn\'t long enough with you.', author: '— Marc' },
  { text: 'You are my peace, my happiness, and my future.', author: '— Marc' },
];

const funnyMoments = [
  { emoji: '🥟', text: 'Professional sambusa eaters since 2025.' },
  { emoji: '🍪', text: 'CEO and Manager of stealing each other\'s snacks.' },
  { emoji: '📚', text: 'We planned to study but ended up talking all day.' },
  { emoji: '🍽️', text: 'Relationship status: Always hungry together.' },
  { emoji: '💫', text: 'Experts in turning small moments into unforgettable memories.' },
  { emoji: '🤔', text: 'Certified overthinkers but still in love.' },
  { emoji: '😂', text: 'Laughing at our own silly jokes for hours.' },
];

const futureDreams = [
  { emoji: '🏡', title: 'Our Dream Home', desc: 'Building a cozy home filled with love and laughter.' },
  { emoji: '🎓', title: 'Graduate Together', desc: 'Completing our studies side by side, cheering each other on.' },
  { emoji: '💼', title: 'Successful Careers', desc: 'Building the careers we\'ve always dreamed of.' },
  { emoji: '✈️', title: 'Travel the World', desc: 'Exploring beautiful places and creating memories around the globe.' },
  { emoji: '❤️', title: 'Grow Old Together', desc: 'Holding hands through every season of life.' },
  { emoji: '👨‍👩‍👧‍👦', title: 'Happy Family', desc: 'Building a family rooted in love, respect, and joy.' },
  { emoji: '🌍', title: 'Adventures Everywhere', desc: 'Turning every corner of the world into our love story.' },
];

const favoriteSongs = [
  { title: 'Perfect', artist: 'Ed Sheeran' },
  { title: 'Love Story', artist: 'Taylor Swift' },
  { title: 'All of Me', artist: 'John Legend' },
  { title: 'Thinking Out Loud', artist: 'Ed Sheeran' },
  { title: 'A Thousand Years', artist: 'Christina Perri' },
  { title: 'Unchained Melody', artist: 'The Righteous Brothers' },
];

const galleryCaptions = [
  'Every picture tells a story.',
  'Together is our favorite place to be.',
  'One smile from you makes my day.',
  'Love grows stronger every day.',
  'Two souls, one heart.',
  'You and me, always.',
  'Every moment with you is magic.',
  'Our love story in frames.',
];

const rightQuotes = [
  { text: 'True love isn\'t about perfection — it\'s about finding someone who makes you a better person.' },
  { text: 'Respect is the foundation of every great love.' },
  { text: 'Trust is knowing that even when we\'re apart, our hearts stay together.' },
  { text: 'Loyalty means standing together through every storm.' },
  { text: 'The best friendships become the greatest love stories.' },
  { text: 'Communication turns silence into understanding and distance into closeness.' },
  { text: 'Building a future together is the most beautiful dream we can share.' },
  { text: 'Support means being each other\'s strength when the world feels heavy.' },
  { text: 'Never giving up on each other means choosing love every single day.' },
];

function AnimatedCounter({ target, label, suffix = '', icon }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true;
        const steps = 60;
        const increment = target / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            setCount(target);
            clearInterval(timer);
          } else {
            setCount(Math.floor(current));
          }
        }, 25);
      }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="flex flex-col items-center justify-center p-5 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
      <span className="text-2xl mb-2">{icon}</span>
      <span className="text-3xl font-bold" style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        {count}{suffix}
      </span>
      <span className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  );
}

function TimelineSection() {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="text-center mb-14">
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-wider mb-4"
            style={{ background: 'rgba(236,72,153,0.1)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.15)' }}
          >
            Our Journey
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            How Our <span style={{ background: 'linear-gradient(135deg, #ec4899, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Love Story</span> Began
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-sm max-w-lg mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            From classmates to best friends, from best friends to soulmates — every step brought us closer.
          </motion.p>
        </div>

        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 md:-translate-x-px" style={{ background: 'linear-gradient(to bottom, #a855f7, #ec4899, #fbbf24, #ec4899, #a855f7)' }} />

          {timelineEvents.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 100, damping: 20, delay: i * 0.15 }}
              className={`relative flex items-start gap-5 mb-12 md:mb-16 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              style={{ paddingLeft: '3rem', paddingRight: '0' }}
            >
              <div
                className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-7 h-7 rounded-full flex items-center justify-center text-xs z-10"
                style={{
                  background: `linear-gradient(135deg, ${event.color}, ${event.color}88)`,
                  boxShadow: `0 0 20px ${event.color}44`,
                  border: '2px solid rgba(255,255,255,0.1)',
                }}
              >
                <span className="text-white" style={{ fontSize: '10px', lineHeight: 1 }}>{event.icon}</span>
              </div>

              <div className="flex-1 md:w-1/2" style={{ paddingLeft: '0', paddingRight: i % 2 === 0 ? '0' : '0' }}>
                <motion.div
                  whileHover={{ y: -4 }}
                  className="p-5 rounded-2xl relative overflow-hidden group"
                  style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--border-color)',
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  <div
                    className="absolute top-0 left-4 right-4 h-0.5 rounded-full opacity-60 transition-all duration-500 group-hover:opacity-100 group-hover:left-2 group-hover:right-2 group-hover:h-1"
                    style={{ background: `linear-gradient(90deg, ${event.color}, transparent)` }}
                  />
                  <span className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: event.color }}>{event.year}</span>
                  <h3 className="text-base font-bold mt-1 mb-1.5" style={{ fontFamily: "'Playfair Display', serif" }}>{event.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{event.desc}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function QuotesSection() {
  const [currentQuote, setCurrentQuote] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(236,72,153,0.04), transparent 60%)' }} />
      <div className="w-full px-6 md:px-10 lg:px-16 text-center relative">
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-wider mb-4"
          style={{ background: 'rgba(236,72,153,0.1)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.15)' }}
        >
          Love Notes
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-10"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Words From <span style={{ background: 'linear-gradient(135deg, #ec4899, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>The Heart</span>
        </motion.h2>

        <div className="relative h-32 md:h-24 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuote}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              className="absolute"
            >
              <p className="text-lg md:text-2xl font-medium italic leading-relaxed max-w-lg mx-auto" style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text-primary)' }}>
                &ldquo;{quotes[currentQuote].text}&rdquo;
              </p>
              <p className="text-xs mt-3" style={{ color: 'var(--text-tertiary)' }}>{quotes[currentQuote].author}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-1.5 mt-6">
          {quotes.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentQuote(i)}
              className="w-1.5 h-1.5 rounded-full transition-all duration-300"
              style={{
                background: i === currentQuote ? '#ec4899' : 'var(--border-color)',
                width: i === currentQuote ? '20px' : '6px',
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function FunnyMomentsSection() {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-wider mb-4"
            style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.15)' }}
          >
            Laughter & Love
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our <span style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Funny</span> Moments
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs" style={{ color: 'var(--text-tertiary)' }}
          >
            Because love is also about laughing together
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {funnyMoments.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.02, y: -2 }}
              className="flex items-center gap-3 p-4 rounded-xl transition-all duration-300"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span className="text-xl flex-shrink-0">{item.emoji}</span>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FutureDreamsSection() {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.03), transparent 60%)' }} />
      <div className="w-full px-6 md:px-10 lg:px-16 relative">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-wider mb-4"
            style={{ background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.15)' }}
          >
            Dreams & Forever
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our <span style={{ background: 'linear-gradient(135deg, #fbbf24, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Future</span> Dreams
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs" style={{ color: 'var(--text-tertiary)' }}
          >
            A lifetime of dreams we'll build together
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {futureDreams.map((dream, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, type: 'spring', stiffness: 150, damping: 20 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-5 rounded-2xl text-center group relative overflow-hidden"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                backdropFilter: 'blur(16px)',
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(180deg, transparent, rgba(236,72,153,0.03))' }} />
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mx-auto mb-3 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3"
                style={{ background: 'rgba(236,72,153,0.08)' }}
              >
                {dream.emoji}
              </div>
              <h3 className="text-sm font-bold mb-1.5">{dream.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{dream.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MusicSection() {
  const { user, isAdmin } = useAuth();
  const [songs, setSongs] = useState([]);
  const [showSongForm, setShowSongForm] = useState(false);
  const [songForm, setSongForm] = useState({ title: '', artist: '', embed_url: '' });

  useEffect(() => {
    songsAPI.getAll().then(r => setSongs(r.data)).catch(() => {});
  }, []);

  const handleAddSong = async (e) => {
    e.preventDefault();
    if (!songForm.title.trim() || !songForm.artist.trim()) return;
    try {
      await songsAPI.create(songForm);
      setSongForm({ title: '', artist: '', embed_url: '' });
      setShowSongForm(false);
      const res = await songsAPI.getAll();
      setSongs(res.data);
    } catch {}
  };

  const handleRemoveSong = async (id) => {
    try {
      await songsAPI.remove(id);
      setSongs(prev => prev.filter(s => s.id !== id));
    } catch {}
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  return (
    <section className="py-16 md:py-24 relative">
      <div className="w-full px-6 md:px-10 lg:px-16 text-center">
        <motion.span
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-wider mb-4"
          style={{ background: 'rgba(236,72,153,0.1)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.15)' }}
        >
          Our Melody
        </motion.span>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold mb-2"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Our Favorite <span style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Love Songs</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xs mb-6" style={{ color: 'var(--text-tertiary)' }}
        >
          Every song reminds us of a special moment
        </motion.p>

        {user && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mb-6">
            <button onClick={() => setShowSongForm(!showSongForm)}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(168,85,247,0.1))', color: '#ec4899', border: '1px solid rgba(236,72,153,0.1)' }}
            >
              {showSongForm ? '− Cancel' : '+ Add Song'}
            </button>
            {showSongForm && (
              <form onSubmit={handleAddSong} className="max-w-md mx-auto mt-4 flex flex-col gap-2 p-4 rounded-2xl"
                style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
              >
                <input className="input-field text-xs" type="text" placeholder="Song title *" value={songForm.title}
                  onChange={e => setSongForm({ ...songForm, title: e.target.value })} required
                />
                <input className="input-field text-xs" type="text" placeholder="Artist *" value={songForm.artist}
                  onChange={e => setSongForm({ ...songForm, artist: e.target.value })} required
                />
                <input className="input-field text-xs" type="url" placeholder="YouTube URL (optional)" value={songForm.embed_url}
                  onChange={e => setSongForm({ ...songForm, embed_url: e.target.value })}
                />
                <button type="submit" className="btn-primary btn-sm self-end"><span>Add Song</span></button>
              </form>
            )}
          </motion.div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {songs.length === 0 && favoriteSongs.map((song, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(236,72,153,0.1)' }}>
                <svg className="w-4 h-4" style={{ color: '#ec4899' }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{song.title}</p>
                <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{song.artist}</p>
              </div>
            </motion.div>
          ))}
          {songs.map((song, i) => {
            const ytId = getYouTubeId(song.embed_url);
            return (
              <motion.div
                key={song.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.02 }}
                className="flex items-center gap-3 p-3.5 rounded-xl transition-all duration-300"
                style={{
                  background: 'var(--card-bg)',
                  border: '1px solid var(--border-color)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(236,72,153,0.1)' }}>
                  <svg className="w-4 h-4" style={{ color: '#ec4899' }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{song.title}</p>
                  <p className="text-[11px]" style={{ color: 'var(--text-tertiary)' }}>{song.artist}</p>
                </div>
                {ytId ? (
                  <a href={`https://www.youtube.com/watch?v=${ytId}`} target="_blank" rel="noopener noreferrer"
                    className="ml-auto text-xs px-2 py-1.5 rounded-lg transition-colors"
                    style={{ background: 'rgba(236,72,153,0.08)', color: '#ec4899' }}
                    title="Play on YouTube"
                  >▶</a>
                ) : null}
                {(isAdmin || song.added_by === user?.id) && (
                  <button onClick={() => handleRemoveSong(song.id)}
                    className="text-[10px] px-1.5 py-1 rounded transition-colors"
                    style={{ color: 'var(--text-tertiary)' }}
                    onMouseOver={e => e.target.style.color = '#ef4444'}
                    onMouseOut={e => e.target.style.color = ''}
                  ><i className="bi-x" /></button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function StatisticsSection() {
  const startDate = new Date('2025-04-18');
  const daysTogether = Math.floor((new Date() - startDate) / (1000 * 60 * 60 * 24));

  const stats = [
    { target: daysTogether, label: 'Days Together', icon: '📅', suffix: '' },
    { target: 50, label: 'Memories Created', icon: '📖', suffix: '+' },
    { target: 999, label: 'Laughs Shared', icon: '😂', suffix: '+' },
    { target: 183, label: 'Songs Listened To', icon: '🎵', suffix: '+' },
    { target: 27, label: 'Dreams Planned', icon: '⭐', suffix: '' },
  ];

  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.03), transparent 60%)' }} />
      <div className="w-full px-6 md:px-10 lg:px-16 relative">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-wider mb-4"
            style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.15)' }}
          >
            Our Numbers
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Love <span style={{ background: 'linear-gradient(135deg, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>in Numbers</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs" style={{ color: 'var(--text-tertiary)' }}
          >
            Every number tells a story of our journey
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {stats.map((stat, i) => (
            <AnimatedCounter key={i} target={stat.target} label={stat.label} icon={stat.icon} suffix={stat.suffix} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SpecialMessage() {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(236,72,153,0.06), transparent 60%)' }} />
      <div className="w-full px-6 md:px-10 lg:px-16 relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="p-8 md:p-10 rounded-3xl text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(236,72,153,0.06), rgba(168,85,247,0.04))',
            border: '1px solid rgba(236,72,153,0.1)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 60px rgba(236,72,153,0.06)',
          }}
        >
          <div
            className="absolute -top-10 -left-10 w-32 h-32 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #ec4899, transparent)' }}
          />
          <div
            className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #a855f7, transparent)' }}
          />

          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(236,72,153,0.1)' }}
          >
            <svg className="w-7 h-7" style={{ color: '#ec4899' }} fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </motion.div>

          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-wider mb-5"
            style={{ background: 'rgba(236,72,153,0.1)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.15)' }}
          >
            A Letter From Marc
          </motion.span>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm md:text-base leading-relaxed max-w-lg mx-auto"
            style={{ color: 'var(--text-secondary)', fontFamily: "'Playfair Display', serif", lineHeight: 1.9 }}
          >
            &ldquo;Blandine, thank you for being my best friend, my partner, my happiness, and my inspiration. Every moment with you is a gift. No matter what happens, I will always cherish our memories and continue building a beautiful future with you. I love you today, tomorrow, and always.&rdquo;
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6"
          >
            <span className="text-sm font-medium" style={{ color: '#ec4899' }}>— Marc ❤️</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function ValuesSection() {
  return (
    <section className="py-16 md:py-24 relative">
      <div className="w-full px-6 md:px-10 lg:px-16">
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-block px-4 py-1 rounded-full text-xs font-semibold tracking-wider mb-4"
            style={{ background: 'rgba(236,72,153,0.1)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.15)' }}
          >
            What We Believe
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Our <span style={{ background: 'linear-gradient(135deg, #ec4899, #fbbf24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Values</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xs" style={{ color: 'var(--text-tertiary)' }}
          >
            The foundation of our love
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {rightQuotes.map((q, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -3 }}
              className="p-4 rounded-xl transition-all duration-300"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--border-color)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <span className="text-[11px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{q.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Memories() {
  const { isAdmin, user } = useAuth();
  const [memories, setMemories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', memory_date: '', location: '', category: '' });
  const [file, setFile] = useState(null);
  const [editing, setEditing] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [filter, setFilter] = useState('all');

  const loadMemories = async () => {
    try {
      const api = isAdmin ? memoriesAPI : publicAPI;
      const res = await api.getMemories();
      setMemories(res.data);
    } catch {}
  };

  useEffect(() => { loadMemories(); }, [isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v));
    if (file) fd.append('image', file);
    try {
      if (editing) {
        await memoriesAPI.update(editing, fd);
      } else {
        await memoriesAPI.create(fd);
        setConfetti(true);
        setTimeout(() => setConfetti(false), 3000);
      }
      setShowForm(false);
      setEditing(null);
      setForm({ title: '', description: '', memory_date: '', location: '', category: '' });
      setFile(null);
      loadMemories();
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving memory');
    }
  };

  const handleEdit = (m) => {
    if (!user) return;
    if (!isAdmin && m.user_id !== user.id) return;
    setForm({ title: m.title, description: m.description || '', memory_date: m.memory_date, location: m.location || '', category: m.category || '' });
    setEditing(m.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, userId) => {
    if (!user) return;
    if (!isAdmin && userId !== user.id) return;
    if (!confirm('Delete this memory?')) return;
    await memoriesAPI.remove(id);
    loadMemories();
  };

  const categories = ['all', ...new Set(memories.map((m) => m.category).filter(Boolean))];
  const filtered = filter === 'all' ? memories : memories.filter((m) => m.category === filter);
  const images = memories.filter((m) => m.image_url).map((m) => ({ id: m.id, url: m.image_url, alt: m.title }));

  const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
  const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 25 } } };

  return (
    <PageTransition>
      <FloatingHearts count={12} speed={0.6} />
      <Confetti active={confetti} />

      {/* Hero */}
      <section className="relative min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden pt-20 pb-10">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(236,72,153,0.08), transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(168,85,247,0.04), transparent 40%)' }} />
        <div className="text-center px-4 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 150, damping: 20 }}>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold tracking-widest mb-5"
              style={{ background: 'rgba(236,72,153,0.1)', color: '#ec4899', border: '1px solid rgba(236,72,153,0.15)' }}
            >
              Marc & Blandine
            </motion.span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", lineHeight: 1.15 }}>
              Our{' '}
              <span style={{ background: 'linear-gradient(135deg, #ec4899, #fbbf24, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundSize: '200% 200%', animation: 'goldShimmer 3s ease-in-out infinite' }}>
                Love Story
              </span>
            </h1>
            <p className="text-sm md:text-base max-w-md mx-auto mb-6" style={{ color: 'var(--text-secondary)', fontFamily: "'Great Vibes', cursive", fontSize: '1.3rem' }}>
              From classmates to soulmates
            </p>
            <div className="flex items-center justify-center gap-3 text-xs" style={{ color: 'var(--text-tertiary)' }}>
              <span>💕 Best Friends since 17 Feb 2025</span>
              <span className="w-1 h-1 rounded-full" style={{ background: 'var(--text-tertiary)' }} />
              <span>❤️ Together since 18 Apr 2025</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <TimelineSection />

      {/* Values */}
      <ValuesSection />

      {/* Memory Gallery - CRUD for all authenticated users */}
      {user && (
        <section className="py-8 px-6 md:px-10 lg:px-16">
          <div className="w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
                <i className="bi-camera me-2" />Memory Gallery
              </h3>
              <button
                className="px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-300"
                style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(168,85,247,0.1))', color: '#ec4899', border: '1px solid rgba(236,72,153,0.1)' }}
                onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ title: '', description: '', memory_date: '', location: '', category: '' }); setFile(null); }}
              >
                {showForm ? '− Cancel' : '+ Add Memory'}
              </button>
            </div>

            <AnimatePresence>
              {showForm && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSubmit}
                  className="p-5 rounded-2xl mb-6 overflow-hidden"
                  style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)', backdropFilter: 'blur(16px)' }}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                    <input className="px-3 py-2 rounded-xl text-xs" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} type="text" placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                    <input className="px-3 py-2 rounded-xl text-xs" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} type="date" value={form.memory_date} onChange={(e) => setForm({ ...form, memory_date: e.target.value })} required />
                    <input className="px-3 py-2 rounded-xl text-xs" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} type="text" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
                    <input className="px-3 py-2 rounded-xl text-xs" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} type="text" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
                  </div>
                  <textarea className="w-full px-3 py-2 rounded-xl text-xs mb-3" style={{ background: 'var(--input-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} />
                  <div className="flex items-center gap-3 mb-3 p-3 rounded-xl" style={{ background: 'var(--input-bg)', border: '1px dashed var(--border-color)' }}>
                    <i className="bi-image" style={{ color: 'var(--text-tertiary)' }} />
                    <input className="text-xs flex-1 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary/10 file:text-primary file:cursor-pointer file:text-xs file:font-medium" style={{ color: 'var(--text-secondary)' }} type="file" onChange={(e) => setFile(e.target.files[0])} />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button type="button" className="px-4 py-2 rounded-xl text-xs font-medium transition-all" style={{ background: 'rgba(255,255,255,0.03)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }} onClick={() => { setShowForm(false); setEditing(null); }}>Cancel</button>
                    <button type="submit" className="px-4 py-2 rounded-xl text-xs font-semibold transition-all" style={{ background: 'linear-gradient(135deg, #ec4899, #a855f7)', color: '#fff' }}>{editing ? 'Update' : 'Save'} Memory</button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Filter + Grid */}
            {memories.length > 0 && (
              <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all duration-200"
                    style={filter === cat ? { background: 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(168,85,247,0.15))', color: '#fff' } : { color: 'var(--text-tertiary)' }}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>
            )}

            <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filtered.map((m) => (
                <motion.div key={m.id} variants={fadeUp} layout className="group relative rounded-2xl overflow-hidden" style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}>
                  {m.image_url && (
                    <div className="relative aspect-[4/3] overflow-hidden cursor-pointer" onClick={() => { const idx = images.findIndex((img) => img.id === m.id); if (idx !== -1) setLightboxIndex(idx); }}>
                      <img src={m.image_url} alt={m.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm" style={{ background: 'rgba(255,255,255,0.15)' }}>
                          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-sm font-bold line-clamp-1">{m.title}</h3>
                      {m.category && <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(236,72,153,0.08)', color: '#ec4899' }}>{m.category}</span>}
                    </div>
                    {m.description && <p className="text-xs leading-relaxed line-clamp-2 mb-2" style={{ color: 'var(--text-secondary)' }}>{m.description}</p>}
                    <div className="flex items-center gap-3 text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                      {m.memory_date && <span><i className="bi-calendar me-1" />{m.memory_date}</span>}
                      {m.location && <span><i className="bi-geo-alt me-1" />{m.location}</span>}
                    </div>
                    <EmojiReactions memoryId={m.id} />
                    {(isAdmin || m.user_id === user?.id) && (
                      <div className="flex items-center gap-2 pt-3 mt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
                        <button onClick={() => handleEdit(m)} className="text-[10px] font-medium transition-colors hover:text-white" style={{ color: 'var(--text-tertiary)' }}>Edit</button>
                        <button onClick={() => handleDelete(m.id, m.user_id)} className="text-[10px] font-medium transition-colors hover:text-red-400" style={{ color: 'var(--text-tertiary)' }}>Delete</button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Quotes */}
      <QuotesSection />

      {/* Funny Moments */}
      <FunnyMomentsSection />

      {/* Future Dreams */}
      <FutureDreamsSection />

      {/* Music */}
      <MusicSection />

      {/* Statistics */}
      <StatisticsSection />

      {/* Special Message */}
      <SpecialMessage />

      <Lightbox images={images} index={lightboxIndex} onClose={() => setLightboxIndex(null)}
        onPrev={() => setLightboxIndex((i) => (i > 0 ? i - 1 : images.length - 1))}
        onNext={() => setLightboxIndex((i) => (i < images.length - 1 ? i + 1 : 0))}
        onGoTo={(i) => setLightboxIndex(i)}
      />
    </PageTransition>
  );
}
