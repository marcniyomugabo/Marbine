const mysql = require('mysql2/promise');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

async function migrate() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: 1,
  });

  try {
    const [cols] = await pool.execute(
      "SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'role'"
    );

    if (cols.length === 0) {
      await pool.execute("ALTER TABLE users ADD COLUMN role ENUM('admin', 'user') DEFAULT 'user'");
      console.log('Added role column');
    } else {
      console.log('Role column exists');
    }

    const adminEmails = (process.env.ADMIN_EMAILS || '').split(',').map(e => e.trim());
    for (const email of adminEmails) {
      if (email) {
        const [r] = await pool.execute('UPDATE users SET role = ? WHERE email = ?', ['admin', email]);
        if (r.affectedRows > 0) console.log('Admin:', email);
      }
    }

    const [r] = await pool.execute("UPDATE users SET role = 'user' WHERE role IS NULL OR role = ''");
    if (r.affectedRows > 0) console.log('Users updated:', r.affectedRows);

    console.log('Migration complete');
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

migrate();
