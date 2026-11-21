import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass,
  Users,
  MessageSquare,
  Calendar,
  History,
  User,
  Settings,
  LogOut,
  Shield,
  LayoutDashboard,
  Menu,
  X,
} from 'lucide-react';
import { NotificationBell } from '../feedback/NotificationBell.js';
import { BrandLogo } from '../ui/BrandLogo.js';
import { Avatar } from '../ui/Avatar.js';
import { api } from '../../services/apiClient.js';

export const AppLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res: any = await api.get('/auth/me');
        setCurrentUser(res.user);
      } catch {
        navigate('/login');
      }
    };
    fetchMe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore
    }
    localStorage.removeItem('skillswap_token');
    navigate('/login');
  };

  const navItems = [
    { label: 'Overview', path: '/app', icon: <LayoutDashboard size={19} /> },
    { label: 'Discover', path: '/app/discover', icon: <Compass size={19} /> },
    { label: 'Connections', path: '/app/connections', icon: <Users size={19} /> },
    { label: 'Messages', path: '/app/messages', icon: <MessageSquare size={19} /> },
    { label: 'Sessions', path: '/app/sessions', icon: <Calendar size={19} /> },
    { label: 'History', path: '/app/history', icon: <History size={19} /> },
    { label: 'Profile', path: '/app/profile', icon: <User size={19} /> },
    { label: 'Settings', path: '/app/settings', icon: <Settings size={19} /> },
  ];

  // Helper to determine page title for topbar
  const getPageTitle = (pathname: string) => {
    if (pathname === '/app') return 'Learning Overview';
    if (pathname.startsWith('/app/discover')) return 'Discover Partners';
    if (pathname.startsWith('/app/connections')) return 'My Connections';
    if (pathname.startsWith('/app/messages')) return 'Messages & Conversations';
    if (pathname.startsWith('/app/sessions')) return 'Scheduled Sessions';
    if (pathname.startsWith('/app/history')) return 'Learning History';
    if (pathname.startsWith('/app/profile')) return 'My Profile';
    if (pathname.startsWith('/app/settings')) return 'Account Settings';
    if (pathname.startsWith('/app/onboarding')) return 'Member Onboarding';
    return 'Workspace';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-paper)' }}>
      {/* Desktop Ember Noir Sidebar (256px wide per design.md §5.1, collapses below 900px) */}
      <aside
        className="app-sidebar sidebar"
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
        {/* Brand Lockup */}
        <div
          style={{
            height: '72px',
            padding: '0 var(--space-6)',
            display: 'flex',
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <BrandLogo variant="dark" to="/app" />
        </div>

        {/* Navigation list */}
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
            Learning Workspace
          </div>

          {navItems.map((item) => {
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

          {/* Moderator or Admin entry point */}
          {currentUser?.role === 'moderator' || currentUser?.role === 'admin' ? (
            <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
              <Link
                to="/staff"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: '10px var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.875rem',
                  fontWeight: 650,
                  color: 'var(--color-amber-400)',
                  backgroundColor: 'rgba(250, 163, 7, 0.12)',
                  border: '1px solid rgba(250, 163, 7, 0.28)',
                  textDecoration: 'none',
                }}
              >
                <Shield size={19} color="var(--color-amber-400)" />
                Staff Portal
              </Link>
            </div>
          ) : null}
        </nav>

        {/* User profile footer */}
        <div
          style={{
            padding: 'var(--space-4) var(--space-5)',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(3, 7, 30, 0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--space-3)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', overflow: 'hidden' }}>
            <Avatar name={currentUser?.displayName || 'Member'} avatarUrl={currentUser?.avatarUrl} size={36} />
            <div style={{ overflow: 'hidden' }}>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 650,
                  color: '#ffffff',
                  whiteSpace: 'nowrap',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {currentUser?.displayName || 'Member'}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'rgba(255, 255, 255, 0.72)', textTransform: 'capitalize' }}>
                {currentUser?.role || 'member'}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sign out"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'rgba(255, 255, 255, 0.65)',
              padding: 'var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color var(--transition-fast)',
            }}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main app region */}
      <div className="app-main app-canvas" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Refined Translucent Topbar (72px per design.md §5.4) */}
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
          {/* Breadcrumb / Title Context */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button
              type="button"
              className="mobile-nav-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: 'var(--color-ink-950)',
                cursor: 'pointer',
                padding: 'var(--space-1)',
              }}
              aria-label="Toggle navigation drawer"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h2
              style={{
                fontSize: '1.25rem',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                color: 'var(--color-ink-950)',
                letterSpacing: '-0.015em',
              }}
            >
              {getPageTitle(location.pathname)}
            </h2>
          </div>

          {/* Right Topbar Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <NotificationBell />
            <Link
              to="/app/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                textDecoration: 'none',
              }}
            >
              <Avatar name={currentUser?.displayName || 'User'} avatarUrl={currentUser?.avatarUrl} size={34} />
            </Link>
          </div>
        </header>

        {/* Mobile drawer popover if open */}
        {mobileMenuOpen ? (
          <div
            className="mobile-drawer glass-surface-strong"
            style={{
              position: 'fixed',
              top: '72px',
              left: 0,
              right: 0,
              padding: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)',
              zIndex: 95,
              borderBottom: '1px solid var(--color-line)',
            }}
          >
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: location.pathname === item.path ? 'var(--color-crimson-700)' : 'var(--color-ink-950)',
                  backgroundColor: location.pathname === item.path ? 'rgba(208, 0, 0, 0.08)' : 'transparent',
                  textDecoration: 'none',
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        ) : null}

        {/* Page Content */}
        <main
          style={{
            flex: 1,
            padding: 'var(--space-8) var(--space-8) var(--space-16)',
            maxWidth: '1240px',
            width: '100%',
            margin: '0 auto',
          }}
        >
          <Outlet context={{ currentUser }} />
        </main>

        {/* Mobile Bottom Navigation (Visible below 900px per design.md §8.4) */}
        <nav
          className="mobile-bottom-nav glass-surface-strong"
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '64px',
            borderTop: '1px solid var(--color-line)',
            display: 'none',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 100,
            paddingBottom: 'env(safe-area-inset-bottom)',
          }}
        >
          {navItems.slice(0, 5).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  fontSize: '0.6875rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--color-crimson-700)' : 'var(--color-muted)',
                  textDecoration: 'none',
                  gap: '3px',
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <style>{`
        @media (min-width: 900px) {
          .app-main { margin-left: 256px !important; }
        }
        @media (max-width: 899px) {
          .app-sidebar { display: none !important; }
          .mobile-bottom-nav { display: flex !important; }
          .mobile-nav-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  );
};
