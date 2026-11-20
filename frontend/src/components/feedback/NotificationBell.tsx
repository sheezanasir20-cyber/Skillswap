import React, { useState, useEffect } from 'react';
import { Bell, Check, Sparkles, MessageSquare, Calendar, UserCheck } from 'lucide-react';
import { api } from '../../services/apiClient.js';
import { NotificationItem } from '../../types/index.js';

export const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res: any = await api.get('/notifications?limit=10');
      setNotifications(res.notifications || []);
      setUnreadCount(res.unreadCount || 0);
    } catch {
      // Ignore background notification fetch errors
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, readAt: new Date().toISOString() })));
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: string) => {
    if (type.includes('message')) return <MessageSquare size={16} color="var(--color-jade-700)" />;
    if (type.includes('session')) return <Calendar size={16} color="var(--color-clay-600)" />;
    if (type.includes('connection')) return <UserCheck size={16} color="var(--color-sky-700)" />;
    return <Sparkles size={16} color="var(--color-amber-600)" />;
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        aria-label={`Notifications, ${unreadCount} unread`}
        onClick={() => setOpen(!open)}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 'var(--space-2)',
          color: 'var(--color-forest-900)',
          borderRadius: 'var(--radius-pill)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background-color var(--transition-fast)',
        }}
      >
        <Bell size={20} />
        {unreadCount > 0 ? (
          <span
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '9px',
              height: '9px',
              backgroundColor: 'var(--color-amber-600)',
              border: '2px solid var(--color-paper)',
              borderRadius: '50%',
            }}
          />
        ) : null}
      </button>

      {open ? (
        <div
          className="glass-surface-strong"
          style={{
            position: 'absolute',
            right: 0,
            top: '48px',
            width: '340px',
            maxHeight: '420px',
            borderRadius: 'var(--radius-lg)',
            zIndex: 200,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: 'var(--space-3) var(--space-5)',
              borderBottom: '1px solid var(--color-line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'rgba(255, 254, 250, 0.65)',
            }}
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-forest-950)', fontFamily: 'var(--font-display)' }}>
              Notifications
            </span>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={handleMarkAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-jade-700)',
                  fontSize: '0.75rem',
                  fontWeight: 650,
                }}
              >
                Mark all read
              </button>
            ) : null}
          </div>

          <div style={{ overflowY: 'auto', flex: 1 }}>
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: 'var(--space-8) var(--space-4)',
                  textAlign: 'center',
                  fontSize: '0.8125rem',
                  color: 'var(--color-muted)',
                }}
              >
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: 'var(--space-3) var(--space-5)',
                    borderBottom: '1px solid rgba(228, 228, 217, 0.6)',
                    backgroundColor: n.readAt ? 'transparent' : 'rgba(220, 237, 230, 0.45)',
                    fontSize: '0.8125rem',
                    display: 'flex',
                    gap: 'var(--space-3)',
                    alignItems: 'flex-start',
                  }}
                >
                  <div style={{ marginTop: '2px', flexShrink: 0 }}>{getIcon(n.type)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 650, color: 'var(--color-forest-950)' }}>{n.title}</div>
                    <div style={{ color: 'var(--color-ink-soft)', marginTop: '2px', lineHeight: 1.4 }}>{n.body}</div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-muted)', marginTop: '4px' }}>
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
