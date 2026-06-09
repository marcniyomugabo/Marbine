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

async function seed() {
  // 1. Users
  const marcPassword = await bcrypt.hash('marc123', 10);
  const blandinePassword = await bcrypt.hash('blandine123', 10);
  const [marcResult] = await db.query(
    'INSERT IGNORE INTO users (fullname, email, password, role, bio) VALUES (?, ?, ?, ?, ?)',
    ['Marc', 'marc@marbine.com', marcPassword, 'admin', 'Building our love story, one memory at a time.']
  );
  const [blandineResult] = await db.query(
    'INSERT IGNORE INTO users (fullname, email, password, role, bio) VALUES (?, ?, ?, ?, ?)',
    ['Blandine', 'blandine@marbine.com', blandinePassword, 'admin', 'The heart behind Marbine.']
  );
  const marcId = marcResult.insertId || (await db.query('SELECT id FROM users WHERE email = ?', ['marc@marbine.com']))[0][0].id;
  const blandineId = blandineResult.insertId || (await db.query('SELECT id FROM users WHERE email = ?', ['blandine@marbine.com']))[0][0].id;

  console.log(`Users: Marc (${marcId}), Blandine (${blandineId})`);

  // 2. Memories
  const memories = [
    { user_id: marcId, title: 'First Date', description: 'Our first date at a cozy little café. We talked for hours and lost track of time.', memory_date: '2025-04-18', location: 'Downtown Café', category: 'dates' },
    { user_id: blandineId, title: 'Sunset Walk', description: 'A beautiful sunset walk along the beach. The sky was painted in shades of orange and pink.', memory_date: '2025-05-10', location: 'Beachside', category: 'adventures' },
    { user_id: marcId, title: 'Movie Night', description: 'Cozy movie night at home with homemade popcorn and our favorite film.', memory_date: '2025-06-01', location: 'Home', category: 'dates' },
    { user_id: blandineId, title: 'Cooking Together', description: 'We tried making pasta from scratch. It was messy but so much fun!', memory_date: '2025-06-22', location: 'Home Kitchen', category: 'milestones' },
    { user_id: marcId, title: 'Picnic at the Park', description: 'A surprise picnic with sandwiches, fresh juice, and a beautiful view of the lake.', memory_date: '2025-07-14', location: 'Central Park', category: 'adventures' },
    { user_id: blandineId, title: 'Stargazing Night', description: 'We lay on the rooftop counting stars and dreaming about our future together.', memory_date: '2025-08-05', location: 'Rooftop Terrace', category: 'romantic' },
    { user_id: marcId, title: 'Dancing in the Rain', description: 'Caught in a sudden downpour, we danced and laughed like nobody was watching.', memory_date: '2025-08-20', location: 'City Streets', category: 'romantic' },
    { user_id: blandineId, title: 'Homemade Pizza Evening', description: 'We made pizza from scratch with our favorite toppings. Marc\'s first attempt was surprisingly good!', memory_date: '2025-09-10', location: 'Home Kitchen', category: 'milestones' },
    { user_id: marcId, title: 'Library Date', description: 'We spent the afternoon reading to each other in the quiet corner of the library.', memory_date: '2025-09-28', location: 'City Library', category: 'dates' },
    { user_id: blandineId, title: 'Bike Ride Adventure', description: 'Cycled through the countryside trails, stopping for photos and ice cream along the way.', memory_date: '2025-10-12', location: 'Countryside Trails', category: 'adventures' },
    { user_id: marcId, title: 'Surprise Birthday Breakfast', description: 'Woke up early to make Blandine\'s favorite breakfast in bed with a handwritten letter.', memory_date: '2025-10-25', location: 'Home', category: 'milestones' },
    { user_id: blandineId, title: 'Karaoke Night', description: 'We sang our hearts out to cheesy love songs. Marc killed "My Heart Will Go On"!', memory_date: '2025-11-08', location: 'Karaoke Bar', category: 'fun' },
    { user_id: marcId, title: 'Christmas Market Stroll', description: 'Holding hands through the twinkling lights, sipping hot chocolate, and picking out ornaments.', memory_date: '2025-12-15', location: 'Christmas Market', category: 'romantic' },
    { user_id: blandineId, title: 'New Year\'s Eve Kiss', description: 'We welcomed the new year with a kiss under the fireworks. The perfect start to forever.', memory_date: '2025-12-31', location: 'City Square', category: 'romantic' },
    { user_id: marcId, title: 'Rainy Day Puzzles', description: 'Stuck indoors on a rainy Sunday, we built a 1000-piece puzzle while listening to jazz.', memory_date: '2026-01-18', location: 'Home', category: 'fun' },
  ];
  for (const m of memories) {
    await db.query(
      'INSERT IGNORE INTO memories (user_id, title, description, memory_date, location, category) VALUES (?, ?, ?, ?, ?, ?)',
      [m.user_id, m.title, m.description, m.memory_date, m.location, m.category]
    );
  }
  console.log('Memories seeded: ' + memories.length);

  // 3. Timeline
  const timelineEvents = [
    { title: 'First Met', description: 'The day our paths crossed for the very first time.', event_date: '2025-04-18' },
    { title: 'First "I Love You"', description: 'A moment neither of us will ever forget.', event_date: '2025-05-14' },
    { title: 'Marbine Memories Created', description: 'We decided to build this beautiful space to capture our journey.', event_date: '2025-07-01' },
  ];
  for (const t of timelineEvents) {
    await db.query(
      'INSERT IGNORE INTO timeline (title, description, event_date) VALUES (?, ?, ?)',
      [t.title, t.description, t.event_date]
    );
  }
  console.log('Timeline seeded: 3');

  // 4. Goals
  const goals = [
    { title: 'Travel to Paris', description: 'Visit the city of love together and see the Eiffel Tower.', status: 'Pending', target_date: '2026-12-31' },
    { title: 'Learn French', description: 'Take French lessons together to prepare for our Paris trip.', status: 'In Progress', target_date: '2026-06-30' },
    { title: 'Create 100 Memories', description: 'Fill Marbine with 100 beautiful memories.', status: 'In Progress', target_date: '2027-04-18' },
    { title: 'Anniversary Trip', description: 'Plan a special trip for our one-year anniversary.', status: 'Pending', target_date: '2026-04-18' },
  ];
  for (const g of goals) {
    await db.query(
      'INSERT IGNORE INTO goals (title, description, status, target_date) VALUES (?, ?, ?, ?)',
      [g.title, g.description, g.status, g.target_date]
    );
  }
  console.log('Goals seeded: 4');

  console.log('Seeding complete!');
  process.exit(0);
}

seed().catch(e => { console.error(e.message); process.exit(1); });
