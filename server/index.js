const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const memoryRoutes = require('./routes/memories');
const galleryRoutes = require('./routes/gallery');
const messageRoutes = require('./routes/messages');
const timelineRoutes = require('./routes/timeline');
const goalRoutes = require('./routes/goals');
const contactRoutes = require('./routes/contact');
const userRoutes = require('./routes/users');
const analyticsRoutes = require('./routes/analytics');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/memories', memoryRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/contact', contactRoutes);

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

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Marbine Memories API running on port ${PORT}`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is in use. Kill the process or use a different port.`);
    process.exit(1);
  }
});

process.on('SIGTERM', () => server.close(() => process.exit(0)));
process.on('SIGINT', () => server.close(() => process.exit(0)));
