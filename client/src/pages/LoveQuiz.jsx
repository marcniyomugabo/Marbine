import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizAPI } from '../services/api';
import PageTransition from '../components/PageTransition';
import Confetti from '../components/Confetti';

const moods = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '🥰', label: 'In Love', value: 'in_love' },
  { emoji: '😢', label: 'Sad', value: 'heartbroken' },
  { emoji: '😌', label: 'Grateful', value: 'grateful' },
  { emoji: '🤗', label: 'Missing You', value: 'missing_you' },
  { emoji: '😍', label: 'Adoring', value: 'adoring' },
  { emoji: '💪', label: 'Hopeful', value: 'hopeful' },
  { emoji: '🤩', label: 'Playful', value: 'playful' },
];

const scoreMessages = [
  { range: [0, 3], title: 'Time to learn more! 💕', msg: 'There is always room to grow closer. Try again soon!' },
  { range: [4, 6], title: 'Not bad, love! 💗', msg: 'You know some things, but theres more to discover!' },
  { range: [7, 8], title: 'You really know me! 💖', msg: 'Im impressed! You pay attention to the little things.' },
  { range: [9, 10], title: 'Perfect score! You know me inside out! 💝', msg: 'You are my soulmate. I love you more than words can say!' },
];

function getScoreMessage(score, total) {
  const pct = (score / total) * 10;
  return scoreMessages.find(s => pct >= s.range[0] && pct <= s.range[1]) || scoreMessages[3];
}

export default function LoveQuiz() {
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    quizAPI.getQuestions().then(r => {
      setQuestions(r.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSelect = (index) => {
    if (selected !== null) return;
    setSelected(index);
  };

  const nextQuestion = () => {
    setAnswers([...answers, { question_id: questions[current].id, selected_index: selected }]);
    setSelected(null);
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    }
  };

  const submitQuiz = async () => {
    const allAnswers = [...answers, { question_id: questions[current].id, selected_index: selected }];
    setAnswers(allAnswers);
    try {
      const res = await quizAPI.submit(allAnswers);
      setResult(res.data);
      if (res.data.score >= 7) setShowConfetti(true);
    } catch {
      const score = allAnswers.filter(a => {
        const q = questions.find(q => q.id === a.question_id);
        return q && a.selected_index === q.correct_index;
      }).length;
      setResult({ score, total: allAnswers.length, total_questions: questions.length });
    }
  };

  const restart = () => {
    setCurrent(0);
    setAnswers([]);
    setSelected(null);
    setResult(null);
    setShowConfetti(false);
    quizAPI.getQuestions().then(r => setQuestions(r.data));
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 mx-auto mb-4" style={{ borderColor: 'rgba(236,72,153,0.2)' }}>
              <div className="w-full h-full rounded-full border-4 border-transparent border-t-[#ec4899] animate-spin" />
            </div>
            <p style={{ color: 'var(--text-tertiary)' }}>Loading questions...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (questions.length === 0) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center">
          <p style={{ color: 'var(--text-tertiary)' }}>No questions available yet.</p>
        </div>
      </PageTransition>
    );
  }

  if (result) {
    const msg = getScoreMessage(result.score, result.total);
    return (
      <PageTransition>
        <Confetti active={showConfetti} />
        <div className="page-container">
          <div className="content-wrapper-narrow text-center py-12">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl"
                style={{
                  background: result.score >= 7
                    ? 'linear-gradient(135deg, rgba(236,72,153,0.2), rgba(212,168,83,0.2))'
                    : 'rgba(236,72,153,0.1)',
                  border: '2px solid rgba(236,72,153,0.2)',
                }}
              >
                {result.score >= 7 ? '💝' : '💗'}
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold mb-2 gradient-text">{msg.title}</h2>
              <p className="text-base mb-6" style={{ color: 'var(--text-secondary)' }}>{msg.msg}</p>

              <div className="flex items-center justify-center gap-2 mb-8">
                <span className="text-5xl font-bold" style={{ color: '#ec4899' }}>{result.score}</span>
                <span className="text-2xl" style={{ color: 'var(--text-tertiary)' }}>/</span>
                <span className="text-3xl" style={{ color: 'var(--text-secondary)' }}>{result.total}</span>
              </div>

              <div className="w-full max-w-xs mx-auto mb-8">
                <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(236,72,153,0.1)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(result.score / result.total) * 100}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #ec4899, #d4a853)',
                      boxShadow: '0 0 12px rgba(236,72,153,0.4)',
                    }}
                  />
                </div>
              </div>

              {result.history && result.history.length > 1 && (
                <div className="mb-8 p-4 rounded-2xl" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>
                  <h3 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-secondary)' }}>Previous Attempts</h3>
                  <div className="flex flex-wrap justify-center gap-2">
                    {result.history.slice(1).map((h, i) => (
                      <div key={i} className="px-3 py-1.5 rounded-lg text-sm" style={{ background: 'rgba(236,72,153,0.08)', color: 'var(--text-secondary)' }}>
                        {h.score}/{h.total} <span className="text-xs opacity-60">{new Date(h.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <motion.button
                className="btn-primary px-8 py-3 text-base"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={restart}
              >
                <span><i className="bi-arrow-repeat me-2" />Play Again</span>
              </motion.button>
            </motion.div>
          </div>
        </div>
      </PageTransition>
    );
  }

  const q = questions[current];
  const isLast = current === questions.length - 1;

  return (
    <PageTransition>
      <div className="page-container">
        <div className="content-wrapper-narrow py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <span className="text-xs font-semibold uppercase tracking-[0.25em] block mb-2" style={{ color: '#ec4899' }}>
              Love Quiz
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text">How Well Do You Know Me?</h2>
            <p className="text-sm mt-2" style={{ color: 'var(--text-tertiary)' }}>
              Question {current + 1} of {questions.length}
            </p>
          </motion.div>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto mb-8">
            <div className="flex items-center gap-2">
              {questions.map((_, i) => (
                <div key={i} className="flex-1 h-1.5 rounded-full" style={{
                  background: i <= current ? '#ec4899' : 'rgba(236,72,153,0.1)',
                  boxShadow: i <= current ? '0 0 6px rgba(236,72,153,0.3)' : 'none',
                  transition: 'all 0.3s ease',
                }} />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            >
              <div className="rounded-2xl p-6 sm:p-8 mb-6" style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px)',
                border: '1px solid var(--glass-border)',
                boxShadow: 'var(--glass-shadow)',
              }}>
                <div className="flex items-start gap-3 mb-6">
                  <span className="text-lg" style={{ color: '#ec4899' }}>💌</span>
                  <h3 className="text-lg sm:text-xl font-bold leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    {q.question}
                  </h3>
                </div>

                <div className="space-y-3">
                  {JSON.parse(q.options).map((opt, i) => (
                    <motion.button
                      key={i}
                      onClick={() => handleSelect(i)}
                      className="w-full text-left p-4 rounded-xl text-base font-medium transition-all duration-200"
                      style={{
                        background: selected === i
                          ? 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(168,85,247,0.1))'
                          : 'var(--card-bg)',
                        border: selected === i
                          ? '1px solid rgba(236,72,153,0.3)'
                          : '1px solid var(--card-border)',
                        color: selected === i ? '#fff' : 'var(--text-primary)',
                        boxShadow: selected === i ? '0 0 20px rgba(236,72,153,0.1)' : 'none',
                      }}
                      whileHover={selected === null ? { scale: 1.02, borderColor: 'rgba(236,72,153,0.2)' } : {}}
                      whileTap={selected === null ? { scale: 0.98 } : {}}
                      disabled={selected !== null}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                          style={{
                            background: selected === i ? 'rgba(236,72,153,0.2)' : 'rgba(236,72,153,0.06)',
                            color: selected === i ? '#ec4899' : 'var(--text-tertiary)',
                          }}
                        >
                          {String.fromCharCode(65 + i)}
                        </div>
                        <span>{opt}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <motion.button
              className={`px-8 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${selected === null ? 'opacity-40 cursor-not-allowed' : ''}`}
              style={{
                background: selected !== null
                  ? 'linear-gradient(135deg, #ec4899, #d4a853)'
                  : 'rgba(236,72,153,0.1)',
                color: selected !== null ? '#fff' : 'var(--text-tertiary)',
              }}
              whileHover={selected !== null ? { scale: 1.04 } : {}}
              whileTap={selected !== null ? { scale: 0.96 } : {}}
              onClick={isLast ? submitQuiz : nextQuestion}
              disabled={selected === null}
            >
              <span className="flex items-center gap-2">
                {isLast ? 'See Results' : 'Next Question'}
                <i className={`bi bi-arrow-${isLast ? 'heart' : 'right'}`} />
              </span>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
