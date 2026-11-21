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
    if (type.includes('message')) return <MessageSquare size={16} color="var(--color-crimson-700)" />;
    if (type.includes('session')) return <Calendar size={16} color="var(--color-ember-600)" />;
    if (type.includes('connection')) return <UserCheck size={16} color="var(--color-burgundy-800)" />;
    return <Sparkles size={16} color="var(--color-gold-400)" />;
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
          color: 'var(--color-ink-950)',
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
              backgroundColor: 'var(--color-amber-500)',
              border: '2px solid var(--color-surface)',
              borderRadius: '50%',
            }}
          />
        ) : null}
      </button>

      {open ? (
        <div
          className="glass-surface"
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
            border: '1px solid var(--color-line)',
            boxShadow: 'var(--shadow-popover)',
          }}
        >
          <div
            style={{
              padding: 'var(--space-3) var(--space-5)',
              borderBottom: '1px solid var(--color-line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--color-surface)',
            }}
          >
            <span style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-ink-950)' }}>
              Notifications
            </span>
            {unreadCount > 0 ? (
              <button
                type="button"
                onClick={handleMarkAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--color-crimson-700)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <Check size={12} /> Mark all read
              </button>
            ) : null}
          </div>

          <div style={{ overflowY: 'auto', flex: 1, backgroundColor: 'var(--color-surface)' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.875rem' }}>
                No notifications right now.
              </div>
            ) : (
              notifications.map((n) => {
                const unread = !n.readAt;
                return (
                  <div
                    key={n.id}
                    style={{
                      padding: 'var(--space-3) var(--space-4)',
                      borderBottom: '1px solid var(--color-line-subtle)',
                      backgroundColor: unread ? 'rgba(106, 4, 15, 0.04)' : 'transparent',
                      display: 'flex',
                      gap: 'var(--space-3)',
                      alignItems: 'flex-start',
                      transition: 'background-color var(--transition-fast)',
                    }}
                  >
                    <div style={{ marginTop: '2px', flexShrink: 0 }}>{getIcon(n.type)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8125rem', fontWeight: unread ? 700 : 500, color: 'var(--color-ink-950)' }}>
                        {n.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-muted)', marginTop: '2px', lineHeight: 1.4 }}>
                        {n.body}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--color-muted-light)', marginTop: '4px' }}>
                        {new Date(n.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
};
