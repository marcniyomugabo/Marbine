const db = require('../config/db');

exports.getByUser = async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM mood_entries WHERE user_id = ? ORDER BY entry_date DESC',
      [req.user.id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getByDateRange = async (req, res) => {
  try {
    const { start, end } = req.query;
    let query = 'SELECT * FROM mood_entries WHERE user_id = ?';
    const params = [req.user.id];
    if (start && end) {
      query += ' AND entry_date BETWEEN ? AND ?';
      params.push(start, end);
    }
    query += ' ORDER BY entry_date ASC';
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createOrUpdate = async (req, res) => {
  try {
    const { mood, note, entry_date } = req.body;
    if (!mood || !entry_date) return res.status(400).json({ error: 'Mood and date are required' });
    const [existing] = await db.query(
      'SELECT id FROM mood_entries WHERE user_id = ? AND entry_date = ?',
      [req.user.id, entry_date]
    );
    if (existing.length > 0) {
      await db.query(
        'UPDATE mood_entries SET mood = ?, note = ? WHERE id = ?',
        [mood, note || null, existing[0].id]
      );
      return res.json({ id: existing[0].id, message: 'Mood updated' });
    }
    const [result] = await db.query(
      'INSERT INTO mood_entries (user_id, mood, note, entry_date) VALUES (?, ?, ?, ?)',
      [req.user.id, mood, note || null, entry_date]
    );
    res.status(201).json({ id: result.insertId, message: 'Mood saved' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM mood_entries WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Entry removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
