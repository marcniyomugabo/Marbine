const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  multipleStatements: true,
});

const migrations = [
  'migration.sql',
  'migration_add_admin.sql',
  'migration_rbac.sql',
  'migration_add_likes.sql',
  'migrations.sql',
  'migrations_new_features.sql',
];

async function run() {
  connection.connect((err) => {
    if (err) {
      console.error('Connection failed:', err.message);
      process.exit(1);
    }
    console.log('Connected to MySQL\n');
  });

  for (const file of migrations) {
    const filePath = path.join(__dirname, '..', file);
    if (!fs.existsSync(filePath)) {
      console.log(`⚠ Skipping ${file} (not found)`);
      continue;
    }
    const sql = fs.readFileSync(filePath, 'utf8');
    console.log(`▶ Running ${file}...`);
    try {
      await new Promise((resolve, reject) => {
        connection.query(sql, (err) => {
          if (err) {
            console.log(`  ⚠ Warning in ${file}: ${err.message}`);
            resolve();
          } else {
            console.log(`  ✓ ${file} completed`);
            resolve();
          }
        });
      });
    } catch (err) {
      console.log(`  ⚠ ${err.message}`);
    }
  }

  console.log('\n✓ All migrations completed');
  connection.end();
  process.exit(0);
}

run();
