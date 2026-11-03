import React from 'react';
import { LayoutDashboard, Users, PiggyBank, ShoppingBag, BellRing } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const MobileNav = ({ currentTab, setCurrentTab }) => {
  const { t } = useLanguage();

  const items = [
    { id: 'dashboard', label: t('navDashboard'), icon: LayoutDashboard },
    { id: 'members', label: t('navMembers'), icon: Users },
    { id: 'savings', label: t('navSavings'), icon: PiggyBank },
    { id: 'products', label: t('navProducts'), icon: ShoppingBag },
    { id: 'announcements', label: t('navAnnouncements'), icon: BellRing }
  ];

  return (
    <nav className="mobile-nav">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setCurrentTab(item.id)}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
