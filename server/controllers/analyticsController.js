const db = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [[{ totalMemories }]] = await db.query('SELECT COUNT(*) AS totalMemories FROM memories');
    const [[{ totalGallery }]] = await db.query('SELECT COUNT(*) AS totalGallery FROM gallery');
    const [[{ totalTimeline }]] = await db.query('SELECT COUNT(*) AS totalTimeline FROM timeline');
    const [[{ totalFeedback }]] = await db.query('SELECT COUNT(*) AS totalFeedback FROM feedback');
    const [[{ totalGoals }]] = await db.query('SELECT COUNT(*) AS totalGoals FROM goals');
    const [[{ totalReactions }]] = await db.query('SELECT COUNT(*) AS totalReactions FROM memory_reactions');
    const [[{ totalLetters }]] = await db.query('SELECT COUNT(*) AS totalLetters FROM love_letters');
    const [[{ totalSongs }]] = await db.query('SELECT COUNT(*) AS totalSongs FROM songs');
    const [[{ totalWishlist }]] = await db.query('SELECT COUNT(*) AS totalWishlist FROM wishlist_items');

    const [[{ totalAdmins }]] = await db.query("SELECT COUNT(*) AS totalAdmins FROM users WHERE role = 'admin'");
    const [[{ totalUsersRole }]] = await db.query("SELECT COUNT(*) AS totalUsersRole FROM users WHERE role = 'user'");

    const [recentUsers] = await db.query(
      'SELECT id, fullname, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5'
    );
    const [recentMemories] = await db.query(
      'SELECT id, title, created_at FROM memories ORDER BY created_at DESC LIMIT 5'
    );
    const [recentFeedback] = await db.query(
      'SELECT id, name, comment, created_at FROM feedback ORDER BY created_at DESC LIMIT 5'
    );

    res.json({
      users: totalUsers,
      memories: totalMemories,
      gallery: totalGallery,
      timeline: totalTimeline,
      feedback: totalFeedback,
      goals: totalGoals,
      reactions: totalReactions,
      letters: totalLetters,
      songs: totalSongs,
      wishlist: totalWishlist,
      admins: totalAdmins,
      usersRole: totalUsersRole,
      recentUsers,
      recentMemories,
      recentFeedback,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getLoveStats = async (req, res) => {
  try {
    const [[{ totalMemories }]] = await db.query('SELECT COUNT(*) AS totalMemories FROM memories');
    const [[{ totalPhotos }]] = await db.query('SELECT COUNT(*) AS totalPhotos FROM gallery');
    const [[{ totalMessages }]] = await db.query('SELECT COUNT(*) AS totalMessages FROM messages');
    const [[{ totalGoals }]] = await db.query('SELECT COUNT(*) AS totalGoals FROM goals');
    const [[{ totalReactions }]] = await db.query('SELECT COUNT(*) AS totalReactions FROM memory_reactions');
    const [[{ totalSongs }]] = await db.query('SELECT COUNT(*) AS totalSongs FROM songs');
    const [[{ totalWishlist }]] = await db.query('SELECT COUNT(*) AS totalWishlist FROM wishlist_items');
    const [[{ totalLetters }]] = await db.query('SELECT COUNT(*) AS totalLetters FROM love_letters');

    const [[{ totalLikes }]] = await db.query('SELECT COALESCE(SUM(likes), 0) AS totalLikes FROM memories');
    const [[{ mostLiked }]] = await db.query(
      'SELECT id, title, likes FROM memories ORDER BY likes DESC LIMIT 1'
    );

    const [[{ topCategory }]] = await db.query(
      'SELECT category, COUNT(*) AS cnt FROM memories WHERE category IS NOT NULL GROUP BY category ORDER BY cnt DESC LIMIT 1'
    );

    const [[{ longestMessage }]] = await db.query(
      'SELECT COALESCE(MAX(LENGTH(message)), 0) AS longestMessage FROM messages'
    );

    const [[{ memoryStreak }]] = await db.query(
      "SELECT DATEDIFF(CURRENT_DATE, COALESCE(MIN(DATE(memory_date)), CURRENT_DATE)) AS days FROM memories"
    );

    const startDate = new Date('2025-04-18');
    const now = new Date();
    const daysTogether = Math.floor((now - startDate) / 86400000);

    const [monthlyActivity] = await db.query(
      "SELECT DATE_FORMAT(memory_date, '%Y-%m') AS month, COUNT(*) AS count FROM memories GROUP BY month ORDER BY month DESC LIMIT 12"
    );

    const [recentMemories] = await db.query(
      'SELECT id, title, created_at FROM memories ORDER BY created_at DESC LIMIT 3'
    );
    const [recentMessages] = await db.query(
      'SELECT id, subject, message FROM messages ORDER BY sent_at DESC LIMIT 3'
    );

    res.json({
      totalMemories,
      totalPhotos,
      totalMessages,
      totalGoals,
      totalReactions,
      totalSongs,
      totalWishlist,
      totalLetters,
      totalLikes,
      daysTogether,
      mostLiked: mostLiked || null,
      topCategory: topCategory || null,
      longestMessage,
      memoryStreak: memoryStreak || 0,
      monthlyActivity,
      recentMemories,
      recentMessages,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
