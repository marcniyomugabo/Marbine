import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';

export default function MusicToggle() {
  const [playing, setPlaying] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const audioCtxRef = useRef(null);
  const gainNodeRef = useRef(null);
  const oscillatorsRef = useRef([]);

  const stopMusic = useCallback(() => {
    oscillatorsRef.current.forEach((osc) => {
      try { osc.stop(); } catch {}
    });
    oscillatorsRef.current = [];
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close();
    }
    audioCtxRef.current = null;
    setPlaying(false);
  }, []);

  const startMusic = useCallback(() => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.value = 0.04;
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      const notes = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0, 493.88, 523.25];
      const oscillators = [];

      const playChord = (freqs, startTime) => {
        freqs.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;

          gain.gain.setValueAtTime(0, startTime);
          gain.gain.linearRampToValueAtTime(1, startTime + 0.3);
          gain.gain.setValueAtTime(1, startTime + 1.5);
          gain.gain.linearRampToValueAtTime(0, startTime + 2);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start(startTime);
          osc.stop(startTime + 2.5);
          oscillators.push(osc);
        });
      };

      const playProgression = () => {
        if (!audioCtxRef.current) return;
        const now = audioCtxRef.current.currentTime;

        const chord1 = [notes[0], notes[2], notes[4]];
        const chord2 = [notes[3], notes[5], notes[7]];
        const chord3 = [notes[1], notes[3], notes[5]];
        const chord4 = [notes[0], notes[3], notes[6]];

        const progression = [chord1, chord2, chord3, chord4];
        progression.forEach((chord, i) => {
          playChord(chord, now + i * 2.5);
        });

        const nextStart = now + progression.length * 2.5;
        setTimeout(() => {
          playProgression();
        }, progression.length * 2.5 * 1000);
      };

      playProgression();
      oscillatorsRef.current = oscillators;
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }, []);

  const toggle = () => {
    if (playing) {
      stopMusic();
    } else {
      startMusic();
      setShowNote(true);
      setTimeout(() => setShowNote(false), 2500);
    }
  };

  return (
    <div className="relative flex items-center">
      <motion.button
        onClick={toggle}
        className={`music-toggle ${playing ? 'playing' : ''}`}
        whileTap={{ scale: 0.9 }}
        title={playing ? 'Stop music' : 'Play romantic music'}
      >
        {playing ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 0l-10.5 3m10.5-3v11.25M9 12.75l10.5-3M9 15.75V9" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 0l-10.5 3m10.5-3v11.25M9 12.75V9m0 6.75h6m-6 0a3 3 0 01-3 3m3-3a3 3 0 013 3m-3-6.75V9" />
          </svg>
        )}
      </motion.button>

      {showNote && (
        <motion.div
          initial={{ opacity: 0, y: 10, x: -10 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs px-2 py-1 rounded-lg premium-glass"
          style={{ color: 'var(--text-secondary)' }}
        >
          A gentle melody begins...
        </motion.div>
      )}
    </div>
  );
}
