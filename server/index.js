const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

// Ensure uploads directory exists (Render ephemeral filesystem)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const authRoutes = require('./routes/auth');
const memoryRoutes = require('./routes/memories');
const galleryRoutes = require('./routes/gallery');
const messageRoutes = require('./routes/messages');
const timelineRoutes = require('./routes/timeline');
const goalRoutes = require('./routes/goals');
const contactRoutes = require('./routes/contact');
const userRoutes = require('./routes/users');
const analyticsRoutes = require('./routes/analytics');
const reactionRoutes = require('./routes/reactions');
const loveLetterRoutes = require('./routes/loveLetters');
const wishlistRoutes = require('./routes/wishlist');
const songRoutes = require('./routes/songs');
const reasonsRoutes = require('./routes/reasons');
const moodRoutes = require('./routes/moods');
const dailyMessagesRoutes = require('./routes/dailyMessages');
const romanticRoutes = require('./routes/romantic');
const quizRoutes = require('./routes/quiz');

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: corsOrigin === '*' ? '*' : corsOrigin.split(',').map(s => s.trim()),
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/reactions', reactionRoutes);
app.use('/api/love-letters', loveLetterRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/reasons', reasonsRoutes);
app.use('/api/moods', moodRoutes);
app.use('/api/daily-messages', dailyMessagesRoutes);
app.use('/api/romantic', romanticRoutes);
app.use('/api/quiz', quizRoutes);

app.get('/api/anniversary', (req, res) => {
  const startDate = new Date('2025-04-18');
  const now = new Date();
  const diff = now - startDate;
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const startISO = startDate.toISOString();
  res.json({ startDate: startISO, days, hours, minutes, seconds, months, years });
});

// Serve the root landing page with FRONTEND_URL injected for login redirect
app.get('/', (req, res) => {
  const frontendUrl = process.env.FRONTEND_URL || '';
  const html = require('fs').readFileSync(path.join(__dirname, '..', 'index.html'), 'utf-8');
  const injected = html.replace(
    '</head>',
    frontendUrl
      ? `<script>window.__FRONTEND_URL__=${JSON.stringify(frontendUrl)}</script></head>`
      : '</head>'
  );
  res.send(injected);
});

// Serve the client built files (React app) - must be after API routes
const clientDist = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDist));

// SPA fallback: any non-API GET that wasn't matched goes to React
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(path.join(clientDist, 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// 404 handler for unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'API endpoint not found' });
});

let server;

function startServer(port) {
  server = app.listen(port)
    .on('listening', () => {
      console.log(`Marbine Memories API running on port ${port}`);
      console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'N/A (served by Express)'}`);
    })
    .on('error', (err) => {
      if (err.code === 'EADDRINUSE' && process.env.NODE_ENV !== 'production') {
        console.log(`Port ${port} is in use, trying port ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error('Server error:', err);
        process.exit(1);
      }
    });
}

const PORT = parseInt(process.env.PORT) || 5000;
startServer(PORT);

process.on('SIGTERM', () => { if (server) server.close(() => process.exit(0)); });
process.on('SIGINT', () => { if (server) server.close(() => process.exit(0)); });
