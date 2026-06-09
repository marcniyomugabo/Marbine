import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const socials = [
  { icon: 'bi-facebook', href: 'https://facebook.com/marbine_18', label: 'Facebook' },
  { icon: 'bi-instagram', href: 'https://instagram.com/Marbine_18', label: 'Instagram' },
  { icon: 'bi-youtube', href: 'https://youtube.com/@MarbineTv', label: 'YouTube' },
  { icon: 'bi-twitter-x', href: 'https://twitter.com/marbine18', label: 'Twitter' },
  { icon: 'bi-envelope-fill', href: 'mailto:marbine18@gmail.com', label: 'Email' },
  { icon: 'bi-tiktok', href: 'https://tiktok.com/@marbine18', label: 'TikTok' },
];

const footerLinks = [
  { to: '/', label: 'Home' },
  { to: '/memories', label: 'Memories' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/reasons', label: 'Reasons' },
  { to: '/mood-tracker', label: 'Mood' },
  { to: '/contact', label: 'Contact' },
];

const contactItems = [
  { icon: 'bi-envelope', text: 'marbine18@gmail.com', href: 'mailto:marbine18@gmail.com' },
  { icon: 'bi-facebook', text: '@marbine_18', href: 'https://facebook.com/marbine_18' },
  { icon: 'bi-instagram', text: '@Marbine_18', href: 'https://instagram.com/Marbine_18' },
  { icon: 'bi-tiktok', text: '@marbine18', href: 'https://tiktok.com/@marbine18' },
];

const stagger = 0.06;

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="section-spacing"
      style={{
        background: 'var(--card-bg)',
        borderTop: '1px solid var(--card-border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 text-lg font-semibold hover:opacity-80 transition-all duration-300">
              <i className="bi-heart-fill text-lg" style={{ color: '#ec4899' }} />
              <span className="gold-text font-bold">Marbine</span>
            </Link>
            <p className="text-sm mt-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              A digital sanctuary for our love story — every moment, every memory, every heartbeat captured forever.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: stagger }}
          >
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#d4a853' }}>
              Navigate
            </h4>
            <div className="space-y-2.5">
              {footerLinks.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="block text-sm transition-all duration-200 hover:translate-x-1"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseOver={(e) => { e.target.style.color = '#d1d5db'; }}
                  onMouseOut={(e) => { e.target.style.color = 'var(--text-secondary)'; }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: stagger * 2 }}
          >
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#d4a853' }}>
              Follow Us
            </h4>
            <div className="flex flex-wrap gap-2.5 mb-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-xl text-base transition-all duration-200 hover:translate-y-[-2px]"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(236,72,153,0.08)'; e.currentTarget.style.color = '#ec4899'; }}
                  onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  title={s.label}
                >
                  <i className={s.icon} />
                </a>
              ))}
            </div>
            <div className="space-y-2">
              {contactItems.map((item) => (
                <a
                  key={item.text}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm transition-all duration-200 hover:translate-x-1"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseOver={(e) => { e.currentTarget.style.color = '#d1d5db'; }}
                  onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; }}
                >
                  <i className={`${item.icon} text-sm`} />
                  {item.text}
                </a>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: stagger * 3 }}
          >
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#d4a853' }}>
              Our Story
            </h4>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Every love story is beautiful, but ours is my favorite. This space holds the chapters we've written together — 
              the laughter, the adventures, the quiet moments, and the dreams we're still building.
            </p>
            <p className="text-sm mt-4 italic" style={{ color: 'var(--text-tertiary)' }}>
              "In all the world, there is no heart for me like yours."
            </p>
          </motion.div>
        </div>

        <div
          className="mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: '1px solid var(--border-color)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            &copy; {year} Marbine Memories. Forever and always.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Made with <i className="bi-heart-fill text-xs" style={{ color: '#ec4899' }} /> by{' '}
            <span className="gold-text font-semibold">Marbine_18</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
