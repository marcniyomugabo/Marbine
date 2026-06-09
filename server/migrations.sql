-- ============================================================
-- Marbine Memories - New Features Migration
-- ============================================================

-- Memory Reactions
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

-- Love Letters (Time Capsule)
CREATE TABLE IF NOT EXISTS love_letters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  sender_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  unlock_date DATE DEFAULT NULL,
  is_opened BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Wishlist
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

-- Songs / Playlist
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

-- Add lat/lng columns to memories for map
ALTER TABLE memories ADD COLUMN IF NOT EXISTS latitude DECIMAL(10,8) DEFAULT NULL;
ALTER TABLE memories ADD COLUMN IF NOT EXISTS longitude DECIMAL(11,8) DEFAULT NULL;
