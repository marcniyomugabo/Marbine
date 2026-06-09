const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM memories ORDER BY memory_date DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, memory_date, location, category } = req.body;
    if (!title || !memory_date) {
      return res.status(400).json({ error: 'Title and date are required' });
    }
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const [result] = await db.query(
      'INSERT INTO memories (user_id, title, description, image_url, memory_date, location, category) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, title, description, imageUrl, memory_date, location, category]
    );
    res.status(201).json({ id: result.insertId, message: 'Memory created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id FROM memories WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Memory not found' });
    if (req.user.role !== 'admin' && rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only edit your own memories' });
    }
    const { title, description, memory_date, location, category } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
    let query = 'UPDATE memories SET title = COALESCE(?, title), description = COALESCE(?, description), memory_date = COALESCE(?, memory_date), location = COALESCE(?, location), category = COALESCE(?, category)';
    const params = [title, description, memory_date, location, category];
    if (imageUrl) {
      query += ', image_url = ?';
      params.push(imageUrl);
    }
    query += ' WHERE id = ?';
    params.push(req.params.id);
    await db.query(query, params);
    res.json({ message: 'Memory updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.like = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT likes FROM memories WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Memory not found' });
    const currentLikes = rows[0].likes || 0;
    await db.query('UPDATE memories SET likes = ? WHERE id = ?', [currentLikes + 1, req.params.id]);
    res.json({ likes: currentLikes + 1, message: 'Memory liked' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id FROM memories WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Memory not found' });
    if (req.user.role !== 'admin' && rows[0].user_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own memories' });
    }
    await db.query('DELETE FROM memories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Memory deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
