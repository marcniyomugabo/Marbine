const db = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT w.*, a.fullname AS added_by_name, p.fullname AS purchased_by_name
       FROM wishlist_items w
       LEFT JOIN users a ON w.added_by = a.id
       LEFT JOIN users p ON w.purchased_by = p.id
       ORDER BY w.is_purchased ASC, w.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { title, description, url, price, occasion } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const [result] = await db.query(
      'INSERT INTO wishlist_items (added_by, title, description, url, price, occasion) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, title, description, url, price || null, occasion || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Wishlist item added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markPurchased = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM wishlist_items WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    const isPurchased = rows[0].is_purchased;
    if (isPurchased) {
      await db.query('UPDATE wishlist_items SET is_purchased = FALSE, purchased_by = NULL WHERE id = ?', [req.params.id]);
      return res.json({ message: 'Item marked as not purchased' });
    }
    await db.query('UPDATE wishlist_items SET is_purchased = TRUE, purchased_by = ? WHERE id = ?', [req.user.id, req.params.id]);
    res.json({ message: 'Item marked as purchased' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT added_by FROM wishlist_items WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Item not found' });
    if (req.user.role !== 'admin' && rows[0].added_by !== req.user.id) {
      return res.status(403).json({ error: 'You can only delete your own items' });
    }
    await db.query('DELETE FROM wishlist_items WHERE id = ?', [req.params.id]);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
