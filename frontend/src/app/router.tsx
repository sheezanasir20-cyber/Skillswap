import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from '../components/layout/PublicLayout.js';
import { AppLayout } from '../components/layout/AppLayout.js';
import { StaffLayout } from '../components/layout/StaffLayout.js';

// Public Pages
import { LandingPage } from '../features/public/LandingPage.js';
import { HowItWorksPage } from '../features/public/HowItWorksPage.js';
import { TermsPage, PrivacyPage } from '../features/public/LegalPages.js';

// Auth Pages
import { LoginPage } from '../features/auth/LoginPage.js';
import { RegisterPage } from '../features/auth/RegisterPage.js';
import { ForgotPasswordPage } from '../features/auth/ForgotPasswordPage.js';
import { ResetPasswordPage } from '../features/auth/ResetPasswordPage.js';

// Member Pages
import { OverviewDashboard } from '../features/profile/OverviewDashboard.js';
import { OnboardingPage } from '../features/onboarding/OnboardingPage.js';
import { DiscoverPage } from '../features/discover/DiscoverPage.js';
import { MemberProfilePage } from '../features/profile/MemberProfilePage.js';
import { ConnectionsPage } from '../features/connections/ConnectionsPage.js';
import { MessagesPage } from '../features/messages/MessagesPage.js';
import { SessionsPage } from '../features/sessions/SessionsPage.js';
import { SessionHistoryPage } from '../features/sessions/SessionHistoryPage.js';
import { ProfileSettingsPage } from '../features/profile/ProfileSettingsPage.js';
import { AccountSettingsPage } from '../features/profile/AccountSettingsPage.js';

// Staff Pages
import { StaffOverviewPage } from '../features/staff/StaffOverviewPage.js';
import { StaffReportsPage } from '../features/staff/StaffReportsPage.js';
import { StaffMembersPage } from '../features/staff/StaffMembersPage.js';
import { StaffAnalyticsPage } from '../features/staff/StaffAnalyticsPage.js';
import { StaffActivityPage } from '../features/staff/StaffActivityPage.js';

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'how-it-works', element: <HowItWorksPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
    ],
  },

  // Member app routes
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      { index: true, element: <OverviewDashboard /> },
      { path: 'onboarding', element: <OnboardingPage /> },
      { path: 'discover', element: <DiscoverPage /> },
      { path: 'members/:id', element: <MemberProfilePage /> },
      { path: 'connections', element: <ConnectionsPage /> },
      { path: 'messages', element: <MessagesPage /> },
      { path: 'messages/:id', element: <MessagesPage /> },
      { path: 'sessions', element: <SessionsPage /> },
      { path: 'sessions/:id', element: <SessionsPage /> },
      { path: 'history', element: <SessionHistoryPage /> },
      { path: 'profile', element: <ProfileSettingsPage /> },
      { path: 'settings', element: <AccountSettingsPage /> },
    ],
  },

  // Staff & Administration routes
  {
    path: '/staff',
    element: <StaffLayout />,
    children: [
      { index: true, element: <StaffOverviewPage /> },
      { path: 'reports', element: <StaffReportsPage /> },
      { path: 'reports/:id', element: <StaffReportsPage /> },
      { path: 'members', element: <StaffMembersPage /> },
      { path: 'analytics', element: <StaffAnalyticsPage /> },
      { path: 'activity', element: <StaffActivityPage /> },
    ],
  },

  // Fallback redirect
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
