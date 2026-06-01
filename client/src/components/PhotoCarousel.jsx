import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { carouselImages } from '../utils/images';

export default function PhotoCarousel({ interval = 4000 }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((i) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % carouselImages.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + carouselImages.length) % carouselImages.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, interval);
    return () => clearInterval(timer);
  }, [interval, next]);

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 300 : -300, opacity: 0, scale: 0.95 }),
    center: { x: 0, opacity: 1, scale: 1 },
    exit: (dir) => ({ x: dir > 0 ? -300 : 300, opacity: 0, scale: 0.95 }),
  };

  if (!carouselImages.length) return null;

  return (
    <motion.div
      className="relative w-full overflow-hidden rounded-3xl"
      style={{ aspectRatio: '21/9', maxHeight: '900px' }}
      animate={{ boxShadow: ['0 0 20px rgba(236,72,153,0.08)', '0 0 40px rgba(236,72,153,0.18)', '0 0 20px rgba(236,72,153,0.08)'] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
    >
      <AnimatePresence initial={false} custom={direction}>
        <motion.img
          key={current}
          src={carouselImages[current].url}
          alt={carouselImages[current].alt}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'spring', stiffness: 180, damping: 25 }}
          className="absolute inset-0 w-full h-full object-cover rounded-2xl"
          style={{ willChange: 'transform, opacity' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

      <button
        onClick={prev}
        className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 backdrop-blur-sm bg-black/20 z-10"
        aria-label="Previous"
      >
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        onClick={next}
        className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-all duration-200 backdrop-blur-sm bg-black/20 z-10"
        aria-label="Next"
      >
        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
        {carouselImages.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? 'bg-white w-4 h-1.5' : 'bg-white/30 hover:bg-white/50 w-1.5 h-1.5'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      <div className="absolute top-3 right-3 z-10">
        <span className="text-xs text-white/60 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
          {current + 1} / {carouselImages.length}
        </span>
      </div>
    </motion.div>
  );
}
