import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Shield, Flag, Users, BarChart3, Activity, ArrowLeft } from 'lucide-react';
import { BrandLogo } from '../ui/BrandLogo.js';

export const StaffLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const staffItems = [
    { label: 'Overview', path: '/staff', icon: <Shield size={19} /> },
    { label: 'Reports Queue', path: '/staff/reports', icon: <Flag size={19} /> },
    { label: 'Member Accounts', path: '/staff/members', icon: <Users size={19} /> },
    { label: 'Platform Analytics', path: '/staff/analytics', icon: <BarChart3 size={19} /> },
    { label: 'Staff Activity Log', path: '/staff/activity', icon: <Activity size={19} /> },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-paper)' }}>
      {/* Staff Sidebar */}
      <aside
        className="sidebar"
        style={{
          width: '256px',
          background: 'var(--gradient-sidebar)',
          borderRight: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 90,
          boxShadow: '4px 0 28px rgba(3, 7, 30, 0.35)',
        }}
      >
        <div
          style={{
            height: '72px',
            padding: '0 var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <BrandLogo variant="dark" to="/staff" size="sm" />
          <span
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: 'var(--radius-pill)',
              backgroundColor: 'rgba(250, 163, 7, 0.16)',
              color: 'var(--color-amber-400)',
              border: '1px solid rgba(250, 163, 7, 0.32)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Staff
          </span>
        </div>

        <nav
          style={{
            flex: 1,
            padding: 'var(--space-6) var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-1)',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              fontSize: '0.6875rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'rgba(255, 255, 255, 0.45)',
              padding: '0 var(--space-3) var(--space-2)',
            }}
          >
            Administration & Moderation
          </div>

          {staffItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: '10px var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 650 : 500,
                  color: isActive ? 'var(--color-white)' : 'rgba(255, 255, 255, 0.76)',
                  backgroundColor: isActive ? 'rgba(208, 0, 0, 0.18)' : 'transparent',
                  borderLeft: isActive ? '3px solid var(--color-gold-400)' : '3px solid transparent',
                  textDecoration: 'none',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <span
                  style={{
                    color: isActive ? 'var(--color-gold-400)' : 'rgba(255, 255, 255, 0.72)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div
          style={{
            padding: 'var(--space-4) var(--space-5)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(3, 7, 30, 0.45)',
          }}
        >
          <button
            type="button"
            onClick={() => navigate('/app')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              background: 'none',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.75)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              transition: 'color var(--transition-fast)',
            }}
          >
            <ArrowLeft size={16} /> Return to Member App
          </button>
        </div>
      </aside>

      <div className="app-canvas" style={{ flex: 1, marginLeft: '256px', display: 'flex', flexDirection: 'column' }}>
        <header
          className="glass-surface"
          style={{
            height: '72px',
            borderBottom: '1px solid var(--color-line)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--space-8)',
            position: 'sticky',
            top: 0,
            zIndex: 80,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--color-muted)' }}>Staff /</span>
            <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-ink-950)', fontFamily: 'var(--font-display)' }}>
              {staffItems.find((i) => i.path === location.pathname)?.label || 'Control Center'}
            </span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
            Authorized Staff Session
          </div>
        </header>

        <main style={{ flex: 1, padding: 'var(--space-8)', maxWidth: '1240px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
