const db = require('../config/db');

const RELATIONSHIP = {
  name1: 'Marc',
  name2: 'Blandine',
  anniversary: '2025-04-18',
};

const recentCache = new Map();
const usageCache = new Map();

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

async function getTemplates(type, mood, specialDay, timeOfDay) {
  let conditions = ['type = ?'];
  let params = [type];

  if (mood) {
    conditions.push('(mood = ? OR mood IS NULL)');
    params.push(mood);
  } else if (type !== 'song') {
    conditions.push('mood IS NULL');
  }

  if (specialDay && type === 'full_message') {
    conditions.push('special_day = ?');
    params.push(specialDay);
  } else if (type !== 'full_message') {
    conditions.push('(special_day IS NULL OR special_day = ?)');
    params.push('');
  }

  if (timeOfDay && (type === 'greeting')) {
    conditions.push('(time_of_day = ? OR time_of_day IS NULL)');
    params.push(timeOfDay);
  }

  const [rows] = await db.query(
    `SELECT * FROM romantic_templates WHERE ${conditions.join(' AND ')} ORDER BY usage_count ASC, RAND() LIMIT 20`,
    params
  );
  return rows;
}

function pickBest(templates, usedIds) {
  const available = templates.filter(t => !usedIds.has(t.id));
  if (available.length === 0) {
    const t = shuffle(templates)[0];
    return t;
  }
  const sorted = shuffle(available).sort((a, b) => a.usage_count - b.usage_count);
  return sorted[0];
}

async function generateMessage(mood, specialDay, context) {
  const timeOfDay = getTimeOfDay();
  const cacheKey = `${new Date().toISOString().split('T')[0]}_${mood || 'default'}_${specialDay || 'none'}`;

  // Check cache
  if (recentCache.has(cacheKey)) {
    return recentCache.get(cacheKey);
  }

  const usedIds = new Set(context?.usedTemplateIds || []);

  // For special days, use full message
  if (specialDay) {
    const messages = await getTemplates('full_message', null, specialDay);
    const msg = pickBest(messages, usedIds);
    if (msg) {
      await db.query('UPDATE romantic_templates SET usage_count = usage_count + 1 WHERE id = ?', [msg.id]);

      // Get a matching song
      const songs = await getTemplates('song', mood || 'in_love');
      const song = shuffle(songs)[0];

      const result = {
        message: msg.content,
        song: song?.content || 'Perfect - Ed Sheeran',
        generated_at: new Date().toISOString(),
        day: new Date().toISOString().split('T')[0],
        mood: mood || null,
        special_day: specialDay,
      };

      await logHistory(null, result, [msg.id, song?.id].filter(Boolean).join(','));
      recentCache.set(cacheKey, result);
      setTimeout(() => recentCache.delete(cacheKey), 6 * 60 * 60 * 1000);
      return result;
    }
  }

  // Compose from parts
  const greetings = await getTemplates('greeting', null, null, timeOfDay);
  const bodies = await getTemplates('body', mood);
  const closings = await getTemplates('closing');
  const songs = await getTemplates('song', mood || 'in_love');

  const greeting = pickBest(greetings, usedIds);
  const body = pickBest(bodies, usedIds);
  const closing = pickBest(closings, usedIds);
  const song = shuffle(songs)[0];

  // Increment usage counts
  const usedTemplateIds = [greeting?.id, body?.id, closing?.id, song?.id].filter(Boolean);
  for (const tid of usedTemplateIds) {
    await db.query('UPDATE romantic_templates SET usage_count = usage_count + 1 WHERE id = ?', [tid]);
  }

  const result = {
    message: `${greeting?.content || 'My love,'} ${body?.content || 'You mean the world to me.'} ${closing?.content || 'Forever yours, Marc 💖'}`,
    song: song?.content || 'Perfect - Ed Sheeran',
    generated_at: new Date().toISOString(),
    day: new Date().toISOString().split('T')[0],
    mood: mood || null,
    special_day: specialDay || null,
  };

  await logHistory(null, result, usedTemplateIds.join(','));
  recentCache.set(cacheKey, result);
  setTimeout(() => recentCache.delete(cacheKey), 6 * 60 * 60 * 1000);
  return result;
}

async function logHistory(userId, result, templateIds) {
  try {
    await db.query(
      'INSERT INTO romantic_history (user_id, message, song, mood, special_day, template_ids) VALUES (?, ?, ?, ?, ?, ?)',
      [userId, result.message, result.song, result.mood, result.special_day, templateIds]
    );
  } catch {}
}

exports.getDailyMessage = async (req, res) => {
  try {
    const { mood, special_day } = req.query;

    // Get recently used template IDs to avoid repetition
    const [recent] = await db.query(
      'SELECT template_ids FROM romantic_history ORDER BY created_at DESC LIMIT 10'
    );
    const usedTemplateIds = new Set();
    for (const r of recent) {
      if (r.template_ids) {
        r.template_ids.split(',').forEach(id => {
          if (id) usedTemplateIds.add(Number(id));
        });
      }
    }

    const context = { usedTemplateIds };
    const result = await generateMessage(mood, special_day, context);
    res.json(result);
  } catch (err) {
    // Fallback
    const [rows] = await db.query('SELECT * FROM love_messages ORDER BY RAND() LIMIT 1');
    res.json({
      message: rows[0]?.message || 'You are loved beyond measure. 💖',
      song: 'Perfect - Ed Sheeran',
      generated_at: new Date().toISOString(),
      day: new Date().toISOString().split('T')[0],
    });
  }
};

exports.checkSpecialDay = async (req, res) => {
  try {
    const today = new Date();
    const dayOfMonth = today.getDate();
    const month = today.getMonth() + 1;
    const dateStr = today.toISOString().split('T')[0];
    const [annyYear, annyMonth, annyDay] = RELATIONSHIP.anniversary.split('-').map(Number);

    let specialDay = null;
    let label = null;

    if (dayOfMonth === 18) {
      specialDay = 'day18';
      label = 'Our Special 18th 💕';
    }

    if (dayOfMonth === annyDay && month === annyMonth) {
      const yearsTogether = today.getFullYear() - annyYear;
      specialDay = 'anniversary';
      label = `${yearsTogether} Year${yearsTogether > 1 ? 's' : ''} Anniversary 💖`;
    }

    res.json({ is_special: specialDay !== null, type: specialDay, label, date: dateStr });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
