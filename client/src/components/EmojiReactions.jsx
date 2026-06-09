import { useState, useEffect } from 'react';
import { reactionsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EMOJIS = ['❤️', '😍', '🔥', '💕', '🥰', '😘', '💖', '✨', '😂', '😭'];

export default function EmojiReactions({ memoryId }) {
  const { user } = useAuth();
  const [reactions, setReactions] = useState({});
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    reactionsAPI.getByMemory(memoryId).then(r => setReactions(r.data)).catch(() => {});
  }, [memoryId]);

  const handleReact = async (emoji) => {
    if (!user) return;
    try {
      const res = await reactionsAPI.toggle(memoryId, emoji);
      const updated = { ...reactions };
      if (res.data.action === 'removed') {
        if (updated[emoji]) {
          updated[emoji].count--;
          updated[emoji].users = updated[emoji].users.filter(id => id !== user.id);
          if (updated[emoji].count <= 0) delete updated[emoji];
        }
      } else {
        if (!updated[emoji]) updated[emoji] = { count: 0, users: [] };
        updated[emoji].count = res.data.count;
        if (!updated[emoji].users.includes(user.id)) updated[emoji].users.push(user.id);
      }
      setReactions(updated);
    } catch {}
  };

  const userReacted = (emoji) => reactions[emoji]?.users?.includes(user?.id);

  return (
    <div className="flex items-center flex-wrap gap-1 pt-2 mt-2" style={{ borderTop: '1px solid var(--border-color)' }}>
      {Object.entries(reactions).map(([emoji, data]) => (
        <button
          key={emoji}
          onClick={() => handleReact(emoji)}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs transition-all duration-200 hover:scale-110"
          style={{
            background: userReacted(emoji) ? 'rgba(236,72,153,0.12)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${userReacted(emoji) ? 'rgba(236,72,153,0.2)' : 'transparent'}`,
          }}
        >
          <span>{emoji}</span>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>{data.count}</span>
        </button>
      ))}
      {user && (
        <div className="relative">
          <button
            onClick={() => setShowPicker(!showPicker)}
            className="px-1.5 py-0.5 rounded text-xs transition-all hover:scale-110"
            style={{ color: 'var(--text-tertiary)' }}
            title="Add reaction"
          >
            😊
          </button>
          {showPicker && (
            <div
              className="absolute bottom-full left-0 mb-1 p-1.5 rounded-xl flex gap-0.5 z-20"
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                boxShadow: 'var(--card-shadow)',
              }}
            >
              {EMOJIS.map(emoji => (
                <button
                  key={emoji}
                  onClick={() => { handleReact(emoji); setShowPicker(false); }}
                  className="text-sm hover:scale-125 transition-transform px-0.5"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
