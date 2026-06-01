const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM gallery ORDER BY uploaded_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.upload = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const fileUrl = `/uploads/${req.file.filename}`;
    const fileType = req.file.mimetype;
    const [result] = await db.query(
      'INSERT INTO gallery (user_id, file_url, file_type) VALUES (?, ?, ?)',
      [req.user.id, fileUrl, fileType]
    );
    res.status(201).json({ id: result.insertId, file_url: fileUrl, message: 'File uploaded' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await db.query('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    res.json({ message: 'Media deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
