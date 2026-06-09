-- ============================================================
-- Marbine Memories - Complete Database Schema
-- ============================================================
-- This file creates the database and ALL 18 tables used by
-- the Marbine Memories application.
-- Import with: mysql -u root -p < database.sql
-- Then run seed script: cd server && node scripts/seed.js
-- ============================================================

CREATE DATABASE IF NOT EXISTS marbine_memories;
USE marbine_memories;

-- ============================================================
-- 1. USERS
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  fullname VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile_image VARCHAR(255) DEFAULT NULL,
  bio TEXT DEFAULT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 2. MEMORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS memories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  image_url VARCHAR(255) DEFAULT NULL,
  memory_date DATE NOT NULL,
  location VARCHAR(255) DEFAULT NULL,
  category VARCHAR(100) DEFAULT NULL,
  likes INT DEFAULT 0,
  latitude DECIMAL(10,8) DEFAULT NULL,
  longitude DECIMAL(11,8) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 3. GALLERY
-- ============================================================
CREATE TABLE IF NOT EXISTS gallery (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  file_url VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 4. MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  receiver_id INT NOT NULL,
  subject VARCHAR(255) DEFAULT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 5. TIMELINE
-- ============================================================
CREATE TABLE IF NOT EXISTS timeline (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  event_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 6. GOALS
-- ============================================================
CREATE TABLE IF NOT EXISTS goals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  status ENUM('Pending', 'In Progress', 'Completed') DEFAULT 'Pending',
  target_date DATE DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 7. FEEDBACK
-- ============================================================
CREATE TABLE IF NOT EXISTS feedback (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  email VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 8. MEMORY REACTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS memory_reactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  memory_id INT NOT NULL,
  user_id INT NOT NULL,
  emoji VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (memory_id) REFERENCES memories(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_reaction (memory_id, user_id, emoji)
);

-- ============================================================
-- 9. LOVE LETTERS (Time Capsule)
-- ============================================================
CREATE TABLE IF NOT EXISTS love_letters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  unlock_date DATE DEFAULT NULL,
  is_opened BOOLEAN DEFAULT FALSE,
  password VARCHAR(255) DEFAULT NULL,
  password_hint VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 10. WISHLIST ITEMS
-- ============================================================
CREATE TABLE IF NOT EXISTS wishlist_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  added_by INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  url VARCHAR(500) DEFAULT NULL,
  price DECIMAL(10,2) DEFAULT NULL,
  is_purchased BOOLEAN DEFAULT FALSE,
  purchased_by INT DEFAULT NULL,
  occasion VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (added_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (purchased_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================
-- 11. SONGS / PLAYLIST
-- ============================================================
CREATE TABLE IF NOT EXISTS songs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255) NOT NULL,
  embed_url VARCHAR(500) DEFAULT NULL,
  album_art VARCHAR(255) DEFAULT NULL,
  added_by INT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (added_by) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 12. LOVE QUIZ QUESTIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS love_quiz_questions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  options JSON NOT NULL,
  correct_index INT NOT NULL,
  category VARCHAR(50) DEFAULT 'romance',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 13. LOVE QUIZ RESULTS
-- ============================================================
CREATE TABLE IF NOT EXISTS love_quiz_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  score INT NOT NULL,
  total INT NOT NULL,
  answers JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 14. LOVE REASONS
-- ============================================================
CREATE TABLE IF NOT EXISTS love_reasons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  added_by INT NOT NULL,
  reason TEXT NOT NULL,
  category VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (added_by) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- 15. MOOD ENTRIES
-- ============================================================
CREATE TABLE IF NOT EXISTS mood_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  mood VARCHAR(20) NOT NULL,
  note TEXT DEFAULT NULL,
  entry_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_entry (user_id, entry_date)
);

-- ============================================================
-- 16. DAILY LOVE MESSAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS love_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 17. ROMANTIC TEMPLATES
-- ============================================================
CREATE TABLE IF NOT EXISTS romantic_templates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('greeting','body','closing','full_message','song') NOT NULL,
  content TEXT NOT NULL,
  mood VARCHAR(30) DEFAULT NULL,
  special_day VARCHAR(30) DEFAULT NULL,
  time_of_day VARCHAR(10) DEFAULT NULL,
  usage_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 18. ROMANTIC HISTORY
-- ============================================================
CREATE TABLE IF NOT EXISTS romantic_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  message TEXT NOT NULL,
  song VARCHAR(255) DEFAULT NULL,
  mood VARCHAR(30) DEFAULT NULL,
  special_day VARCHAR(30) DEFAULT NULL,
  template_ids VARCHAR(100) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- SEED DATA - LOVE QUIZ QUESTIONS
-- ============================================================
INSERT IGNORE INTO love_quiz_questions (question, options, correct_index, category) VALUES
('What is our anniversary date?', '["April 18", "April 20", "March 18", "May 18"]', 0, 'romance'),
('What is my favorite color?', '["Blue", "Pink", "Red", "Purple"]', 1, 'personal'),
('What is my love language?', '["Words of Affirmation", "Physical Touch", "Quality Time", "Acts of Service"]', 0, 'romance'),
('Where did we first meet?', '["At a party", "Through friends", "At work", "Online"]', 1, 'memory'),
('What is my favorite flower?', '["Rose", "Lily", "Sunflower", "Tulip"]', 0, 'personal'),
('What song reminds me of us?', '["Perfect - Ed Sheeran", "All of Me - John Legend", "Thinking Out Loud", "A Thousand Years"]', 0, 'romance'),
('What is my dream vacation?', '["Paris", "Bali", "Maldives", "Switzerland"]', 0, 'personal'),
('What is my favorite way to spend a weekend?', '["Watching movies", "Going on adventures", "Cooking together", "Just relaxing at home"]', 1, 'personal'),
('What quality do I love most about you?', '["Your kindness", "Your humor", "Your intelligence", "Your ambition"]', 0, 'romance'),
('Where do I see us in 5 years?', '["Married with kids", "Traveling the world", "Building a business", "All of the above"]', 3, 'future');

-- ============================================================
-- SEED DATA - LOVE REASONS
-- ============================================================
INSERT IGNORE INTO love_reasons (added_by, reason, category) VALUES
  (1, 'The way your eyes light up when you smile', 'Eyes'),
  (1, 'How you always know exactly what to say to make me feel better', 'Personality'),
  (1, 'The little notes you leave for me', 'Thoughtfulness'),
  (1, 'The way you laugh at my silly jokes', 'Laughter'),
  (1, 'How you hold my hand like its the most natural thing in the world', 'Touch'),
  (1, 'Your endless patience and understanding', 'Personality'),
  (1, 'The way you look at me like I am the only person in the world', 'Eyes'),
  (1, 'How you always believe in me even when I doubt myself', 'Support'),
  (1, 'The warmth of your hugs after a long day', 'Comfort'),
  (1, 'Your beautiful heart that cares so deeply', 'Heart');

-- ============================================================
-- SEED DATA - DAILY LOVE MESSAGES
-- ============================================================
INSERT IGNORE INTO love_messages (message) VALUES
  ('You are the most beautiful part of my every day.'),
  ('Every love story is special, but ours is my absolute favorite.'),
  ('You make my world brighter just by being in it.'),
  ('I fall in love with you more and more each day.'),
  ('You are my today and all of my tomorrows.'),
  ('Thank you for being the amazing person you are.'),
  ('My heart is and always will be yours.'),
  ('You are the best thing that has ever happened to me.'),
  ('Every moment with you feels like a beautiful dream.'),
  ('I love you more than words can ever express.');

-- ============================================================
-- SEED DATA - ROMANTIC TEMPLATES
-- ============================================================
-- Greetings (time-of-day aware)
INSERT IGNORE INTO romantic_templates (type, content, time_of_day) VALUES
  ('greeting', 'Good morning my love,', 'morning'),
  ('greeting', 'Good morning my darling,', 'morning'),
  ('greeting', 'Morning sunshine,', 'morning'),
  ('greeting', 'Rise and shine, my love,', 'morning'),
  ('greeting', 'Good afternoon beautiful,', 'afternoon'),
  ('greeting', 'Good afternoon my darling,', 'afternoon'),
  ('greeting', 'Good evening my love,', 'evening'),
  ('greeting', 'Good evening beautiful,', 'evening'),
  ('greeting', 'Hey my love,', NULL),
  ('greeting', 'My dearest,', NULL),
  ('greeting', 'My darling,', NULL),
  ('greeting', 'To my one and only,', NULL),
  ('greeting', 'Hello my heart,', NULL),
  ('greeting', 'My love,', NULL);

-- Body openers
INSERT IGNORE INTO romantic_templates (type, content) VALUES
  ('body', 'I just wanted to remind you today how incredibly special you are to me.'),
  ('body', 'I was thinking about you and felt my heart smile.'),
  ('body', 'You have been on my mind all day and I needed to tell you something.'),
  ('body', 'Every single day I realize more and more how lucky I am to have you.'),
  ('body', 'I hope you know just how much you mean to me.'),
  ('body', 'There is something about today that made me think of us.'),
  ('body', 'I woke up today feeling grateful for you.'),
  ('body', 'You are the first thought in my mind and the last in my heart every day.');

-- Body middle (mood-specific)
INSERT IGNORE INTO romantic_templates (type, content, mood) VALUES
  ('body', 'The way you love me makes everything in life feel possible.', 'in_love'),
  ('body', 'My heart beats faster every time I think of you.', 'in_love'),
  ('body', 'Falling in love with you was the best thing that ever happened to me.', 'in_love'),
  ('body', 'You have completely captured my heart and soul.', 'in_love'),
  ('body', 'I love you more than words could ever describe.', 'in_love'),
  ('body', 'Being loved by you is the greatest gift I have ever received.', 'loved'),
  ('body', 'Your love makes me feel like the luckiest person in the world.', 'loved'),
  ('body', 'I feel so blessed to be wrapped in your love every day.', 'loved'),
  ('body', 'Thank you for loving me the way you do.', 'loved'),
  ('body', 'You make every day brighter just by being you.', 'happy'),
  ('body', 'Your smile is my favorite thing in the entire world.', 'happy'),
  ('body', 'Being with you fills my life with so much joy.', 'happy'),
  ('body', 'You bring so much happiness into my world.', 'happy'),
  ('body', 'I find so much peace in knowing you are mine.', 'peaceful'),
  ('body', 'There is a beautiful calmness in my heart when I am with you.', 'peaceful'),
  ('body', 'With you, everything feels quiet and right.', 'peaceful'),
  ('body', 'I am so thankful for every moment we share.', 'grateful'),
  ('body', 'Gratitude fills my heart when I think of all we have together.', 'grateful'),
  ('body', 'Thank you for being the amazing person you are.', 'grateful'),
  ('body', 'When you feel sad, I want you to know that my love for you is unshakable.', 'sad'),
  ('body', 'Even on difficult days, please remember that you are never alone.', 'sad'),
  ('body', 'Let my love wrap around you like a warm blanket today.', 'sad'),
  ('body', 'I am always here for you no matter what.', 'sad'),
  ('body', 'Take a deep breath my love. Everything will be okay because we have each other.', 'frustrated'),
  ('body', 'When life feels heavy, let my love carry some of the weight.', 'frustrated'),
  ('body', 'You are stronger than you know and I believe in you completely.', 'frustrated'),
  ('body', 'Rest now my love. Let tomorrow bring new strength.', 'tired'),
  ('body', 'You have done enough today. Close your eyes and feel my love.', 'tired'),
  ('body', 'Let go of all the stress and just be still in my heart.', 'tired');

-- Body middle (mood-independent)
INSERT IGNORE INTO romantic_templates (type, content) VALUES
  ('body', 'You are the most beautiful person I have ever known, inside and out.'),
  ('body', 'Every moment with you feels like a page from a fairytale.'),
  ('body', 'I cherish every laugh, every hug, every quiet moment we share.'),
  ('body', 'You make my world complete in ways I never knew were missing.'),
  ('body', 'I would choose you again and again in every lifetime.'),
  ('body', 'You are my greatest adventure and my safest place to rest.'),
  ('body', 'Our love story is my favorite chapter of my life.'),
  ('body', 'You are the poetry my heart has been writing since the day we met.'),
  ('body', 'In your eyes I found my forever home.'),
  ('body', 'Every day with you is a beautiful addition to my life.');

-- Closings
INSERT IGNORE INTO romantic_templates (type, content) VALUES
  ('closing', 'Forever yours, Marc 💖'),
  ('closing', 'Always and forever, Marc 💕'),
  ('closing', 'Yours always, Marc ❤️'),
  ('closing', 'With all my love, Marc 💗'),
  ('closing', 'Loving you endlessly, Marc 💘'),
  ('closing', 'My heart is yours, Marc 💖'),
  ('closing', 'Eternally yours, Marc 💝'),
  ('closing', 'Yours truly and forever, Marc 💕'),
  ('closing', 'All my love today and always, Marc 💗'),
  ('closing', 'Thinking of you always, Marc 💖');

-- Full messages for special days
INSERT IGNORE INTO romantic_templates (type, content, special_day) VALUES
  ('full_message', 'Today is the 18th and my heart is overflowing with love for you. Every 18th is a reminder of another beautiful chapter in our story. You are my everything, today and always. 💕', 'day18'),
  ('full_message', 'Another 18th has arrived and I find myself falling deeper in love with you. You are the most incredible person I have ever known and I cherish every single moment we share. Happy our day my love! 💖', 'day18'),
  ('full_message', 'Happy 18th my darling! This day is a celebration of us, of our love, of every beautiful memory we have created and every dream we are yet to fulfill. You are my heart. 💕', 'day18'),
  ('full_message', 'Every 18th I look back at our journey and feel nothing but gratitude. You have changed my life in the most beautiful ways and I will never stop loving you. Here is to many more 18ths together. 💖', 'day18'),
  ('full_message', 'From the moment I met you, my life became a beautiful love story. Happy anniversary my love. You are my past, my present, and my entire future. I love you more than I ever thought possible. 💖', 'anniversary'),
  ('full_message', 'Another year of loving you and I still get butterflies. You are my greatest blessing, my safest harbor, my forever. Happy anniversary to the woman who makes my world complete. 💕', 'anniversary'),
  ('full_message', 'I knew I loved you from the start, but I never knew I could love someone this deeply. Every day with you is a gift. Happy anniversary my beautiful Blandine. Here is to forever. 💖', 'anniversary'),
  ('full_message', 'Celebrating you today and every day. You are the most amazing person I know and I am so grateful to share life with you. Happy birthday my love, may your day be as beautiful as you are. 💕', 'birthday'),
  ('full_message', 'Happy birthday to the woman who stole my heart and made my world beautiful. You deserve all the love, joy, and happiness in the universe today and always. 💖', 'birthday'),
  ('full_message', 'On your special day I want you to know that you are loved beyond measure. You are my sunshine, my joy, my everything. Happy birthday my darling. 💕', 'birthday');

-- Songs mapped to mood
INSERT IGNORE INTO romantic_templates (type, content, mood) VALUES
  ('song', 'Perfect - Ed Sheeran', 'in_love'),
  ('song', 'Thinking Out Loud - Ed Sheeran', 'in_love'),
  ('song', 'All of Me - John Legend', 'in_love'),
  ('song', 'Endless Love - Lionel Richie', 'in_love'),
  ('song', 'Can''t Help Falling in Love - Elvis Presley', 'in_love'),
  ('song', 'Love On Top - Beyoncé', 'loved'),
  ('song', 'You Are the Best Thing - Ray LaMontagne', 'loved'),
  ('song', 'I Will Always Love You - Whitney Houston', 'loved'),
  ('song', 'Happy - Pharrell Williams', 'happy'),
  ('song', 'Here Comes the Sun - The Beatles', 'happy'),
  ('song', 'Best Day of My Life - American Authors', 'happy'),
  ('song', 'Better Together - Jack Johnson', 'peaceful'),
  ('song', 'Banana Pancakes - Jack Johnson', 'peaceful'),
  ('song', 'Thank You - Dido', 'grateful'),
  ('song', 'Fix You - Coldplay', 'sad'),
  ('song', 'Lean on Me - Bill Withers', 'sad'),
  ('song', 'Hold On - Wilson Phillips', 'sad'),
  ('song', 'Brave - Sara Bareilles', 'frustrated'),
  ('song', 'Count on Me - Bruno Mars', 'frustrated'),
  ('song', 'Weightless - Marconi Union', 'tired'),
  ('song', 'Someone Like You - Adele', 'tired');

-- ============================================================
-- NOTES
-- ============================================================
-- After importing, run the seed script to populate users + memories:
--   cd server && node scripts/seed.js
-- This creates:
--   - Marc (marc@marbine.com / marc123) - admin
--   - Blandine (blandine@marbine.com / blandine123) - admin
--   - 15 memories, 3 timeline events, 4 goals
--
-- To create the admin user (marbine18@gmail.com / marbine@18):
--   cd server && node scripts/create-admin.js
