const db = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [[{ totalMemories }]] = await db.query('SELECT COUNT(*) AS totalMemories FROM memories');
    const [[{ totalGallery }]] = await db.query('SELECT COUNT(*) AS totalGallery FROM gallery');
    const [[{ totalTimeline }]] = await db.query('SELECT COUNT(*) AS totalTimeline FROM timeline');
    const [[{ totalFeedback }]] = await db.query('SELECT COUNT(*) AS totalFeedback FROM feedback');
    const [[{ totalGoals }]] = await db.query('SELECT COUNT(*) AS totalGoals FROM goals');

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
