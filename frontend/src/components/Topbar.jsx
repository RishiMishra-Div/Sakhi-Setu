import React from 'react';
import { Menu, LogIn, LogOut } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Topbar = ({ groupInfo, onToggleMobileNav, onLoginClick }) => {
  const { user, logout, isAdmin } = useAuth();
  const { t, language } = useLanguage();

  const getGroupName = () => {
    if (language === 'en') return 'Sakhi Mahila Bachat Gat (SHG)';
    if (language === 'hi') return 'सखी महिला बचत समूह (SHG)';
    return 'सखी महिला बचत गट';
  };

  const getVillageLocation = () => {
    if (language === 'en') return 'Shivaji Nagar, Pune, Maharashtra';
    if (language === 'hi') return 'शिवाजी नगर, पुणे, महाराष्ट्र';
    return 'शिवाजी नगर, पुणे, महाराष्ट्र';
  };

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <button
          type="button"
          onClick={onToggleMobileNav}
          className="btn-secondary btn-sm"
          style={{ display: 'inline-flex', padding: '6px' }}
          aria-label="Toggle menu"
        >
          <Menu size={22} />
        </button>

        <div className="group-header-info">
          <div>
            <h2 className="group-title">
              {getGroupName()}
            </h2>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '2px' }}>
              <span className="group-reg-badge">
                {t('regNoLabel')} {groupInfo?.registrationNumber || 'MH/PUN/SHG/2023/0489'}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                • {getVillageLocation()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="topbar-actions">
        <LanguageSelector />

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#14532d' }}>
              {user.name}
            </span>
            <button
              type="button"
              onClick={logout}
              className="btn btn-secondary btn-sm"
              title={t('logout')}
            >
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onLoginClick}
            className="btn btn-primary btn-sm"
          >
            <LogIn size={16} />
            <span>{t('login')}</span>
          </button>
        )}
      </div>
    </header>
  );
};
