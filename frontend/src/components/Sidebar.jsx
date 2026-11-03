import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarCheck, 
  PiggyBank, 
  HandCoins, 
  ShoppingBag, 
  BellRing, 
  FileText, 
  Settings, 
  LogOut, 
  Home,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Sidebar = ({ currentTab, setCurrentTab, isMobileOpen, setIsMobileOpen }) => {
  const { user, logout, isAdmin } = useAuth();
  const { t } = useLanguage();

  const navItems = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'members', label: t('navMembers'), icon: Users },
    { id: 'meetings', label: t('navMeetings'), icon: CalendarCheck },
    { id: 'savings', label: t('navSavings'), icon: PiggyBank },
    { id: 'loans', label: t('navLoans'), icon: HandCoins },
    { id: 'products', label: t('navProducts'), icon: ShoppingBag },
    { id: 'announcements', label: t('navAnnouncements'), icon: BellRing },
    { id: 'reports', label: t('navReports'), icon: FileText },
    { id: 'settings', label: t('navSettings'), icon: Settings }
  ];

  const handleNavClick = (tabId) => {
    setCurrentTab(tabId);
    if (setIsMobileOpen) setIsMobileOpen(false);
  };

  return (
    <aside className={`sidebar ${isMobileOpen ? 'open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-header">
        <div className="logo-icon-wrap">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div className="brand-text">
          <h1>
            {t('appName')}
            <span style={{ fontSize: '0.65rem', background: '#f59e0b', color: '#000', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>SHG</span>
          </h1>
          <span className="brand-tagline">{t('saveSupportGrow')}</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="sidebar-nav">
        <button
          type="button"
          className={`nav-link ${currentTab === 'public' ? 'active' : ''}`}
          onClick={() => handleNavClick('public')}
        >
          <Home size={18} />
          <span>{t('navPublicHome')}</span>
        </button>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '6px 8px' }} />

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`nav-link ${isActive ? 'active' : ''}`}
              onClick={() => handleNavClick(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Info & Logout Footer */}
      <div className="sidebar-footer">
        {user ? (
          <>
            <div className="user-badge">
              <div className="user-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-info">
                <p className="user-name">{user.name}</p>
                <span className="user-role-label">
                  {isAdmin ? t('roleAdmin') : t('roleMember')}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              style={{ width: '100%', color: '#fee2e2', borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.06)' }}
              onClick={logout}
            >
              <LogOut size={16} />
              <span>{t('logout')}</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn btn-primary"
            style={{ width: '100%' }}
            onClick={() => handleNavClick('login')}
          >
            <ShieldCheck size={18} />
            <span>{t('login')}</span>
          </button>
        )}
      </div>
    </aside>
  );
};
