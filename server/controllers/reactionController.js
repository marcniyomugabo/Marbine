const db = require('../config/db');

exports.getByMemory = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT emoji, user_id FROM memory_reactions WHERE memory_id = ?',
      [req.params.memoryId]
    );
    const grouped = {};
    rows.forEach((r) => {
      if (!grouped[r.emoji]) grouped[r.emoji] = { count: 0, users: [] };
      grouped[r.emoji].count++;
      grouped[r.emoji].users.push(r.user_id);
    });
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.toggle = async (req, res) => {
  try {
    const { memoryId } = req.params;
    const { emoji } = req.body;
    if (!emoji) return res.status(400).json({ error: 'Emoji is required' });

    const [existing] = await db.query(
      'SELECT id FROM memory_reactions WHERE memory_id = ? AND user_id = ? AND emoji = ?',
      [memoryId, req.user.id, emoji]
    );

    if (existing.length > 0) {
      await db.query('DELETE FROM memory_reactions WHERE id = ?', [existing[0].id]);
      const [[{ count }]] = await db.query(
        'SELECT COUNT(*) AS count FROM memory_reactions WHERE memory_id = ? AND emoji = ?',
        [memoryId, emoji]
      );
      return res.json({ action: 'removed', count });
    }

    await db.query(
      'INSERT INTO memory_reactions (memory_id, user_id, emoji) VALUES (?, ?, ?)',
      [memoryId, req.user.id, emoji]
    );
    const [[{ count }]] = await db.query(
      'SELECT COUNT(*) AS count FROM memory_reactions WHERE memory_id = ? AND emoji = ?',
      [memoryId, emoji]
    );
    res.json({ action: 'added', count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
