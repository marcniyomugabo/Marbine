const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 1,
  queueLimit: 0,
});

const db = pool.promise();

async function createAdmin() {
  const email = 'marbine@gmail.com';
  const password = 'Marbine@18';
  const fullname = 'Marbine Admin';
  const hashed = await bcrypt.hash(password, 10);

  const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    await db.query('UPDATE users SET role = ?, fullname = ? WHERE email = ?', ['admin', fullname, email]);
    console.log(`Admin user ${email} already exists — role updated to admin.`);
  } else {
    await db.query(
      'INSERT INTO users (fullname, email, password, role) VALUES (?, ?, ?, ?)',
      [fullname, email, hashed, 'admin']
    );
    console.log(`Admin user created: ${email} / ${password}`);
  }

  process.exit(0);
}

createAdmin().catch(e => { console.error(e.message); process.exit(1); });
