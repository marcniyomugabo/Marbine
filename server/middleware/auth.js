const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const required = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await db.query('SELECT id, fullname, email, role, profile_image FROM users WHERE id = ?', [decoded.id]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'User not found' });
    }
    req.user = users[0];
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

const optional = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }
  try {
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [users] = await db.query('SELECT id, fullname, email, role, profile_image FROM users WHERE id = ?', [decoded.id]);
    req.user = users.length > 0 ? users[0] : null;
  } catch {
    req.user = null;
  }
  next();
};

module.exports = { required, optional };
