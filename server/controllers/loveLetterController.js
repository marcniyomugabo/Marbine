const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT ll.*, u.fullname AS sender_name
       FROM love_letters ll
       JOIN users u ON ll.sender_id = u.id
       ORDER BY ll.created_at DESC`
    );
    const now = new Date().toISOString().split('T')[0];
    const mapped = rows.map((r) => {
      const timeUnlocked = r.unlock_date === null || r.unlock_date <= now;
      const hasPassword = r.password !== null;
      const isOwner = req.user.id === r.sender_id;
      const isAdmin = req.user.role === 'admin';
      const canView = timeUnlocked && (isOwner || isAdmin || !hasPassword);
      return {
        ...r,
        has_password: hasPassword,
        password_hint: r.password_hint,
        can_view: canView || isOwner || isAdmin,
        password: undefined,
      };
    });
    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, content, unlock_date, password, password_hint } = req.body;
    if (!title || !content) return res.status(400).json({ error: 'Title and content are required' });
    const [result] = await db.query(
      'INSERT INTO love_letters (sender_id, title, content, unlock_date, password, password_hint) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, title, content, unlock_date || null, password || null, password_hint || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Love letter created' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markOpened = async (req, res) => {
  try {
    await db.query('UPDATE love_letters SET is_opened = TRUE WHERE id = ?', [req.params.id]);
    const [rows] = await db.query('SELECT * FROM love_letters WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Letter not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.unlockByPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ error: 'Password is required' });
    const [rows] = await db.query('SELECT * FROM love_letters WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Letter not found' });
    if (rows[0].password !== password) return res.status(403).json({ error: 'Incorrect password' });
    const [result] = await db.query(
      'UPDATE love_letters SET is_opened = TRUE WHERE id = ? AND password = ?',
      [req.params.id, password]
    );
    res.json({ message: 'Letter unlocked', content: rows[0].content });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT sender_id FROM love_letters WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Letter not found' });
    if (req.user.role !== 'admin' && rows[0].sender_id !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own letters' });
    }
    await db.query('DELETE FROM love_letters WHERE id = ?', [req.params.id]);
    res.json({ message: 'Letter deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
