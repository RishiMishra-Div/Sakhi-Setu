import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useLanguage } from './context/LanguageContext';
import { api } from './services/api';

// Components
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { MobileNav } from './components/MobileNav';

// Pages
import { PublicHome } from './pages/PublicHome';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Members } from './pages/Members';
import { Meetings } from './pages/Meetings';
import { Savings } from './pages/Savings';
import { Loans } from './pages/Loans';
import { Products } from './pages/Products';
import { Announcements } from './pages/Announcements';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

export default function App() {
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  const [currentTab, setCurrentTab] = useState(() => {
    return isAuthenticated ? 'dashboard' : 'public';
  });

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [groupInfo, setGroupInfo] = useState(null);

  // Sync tab with auth changes
  useEffect(() => {
    if (isAuthenticated && currentTab === 'login') {
      setCurrentTab('dashboard');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const data = await api.getGroup();
        setGroupInfo(data);
      } catch (err) {
        console.warn('Could not load group info in topbar:', err);
      }
    };
    fetchGroup();
  }, []);

  const renderContent = () => {
    switch (currentTab) {
      case 'public':
        return (
          <PublicHome
            onNavigateLogin={() => setCurrentTab('login')}
            onNavigateProducts={() => setCurrentTab('products')}
          />
        );
      case 'login':
        return (
          <Login
            onLoginSuccess={() => setCurrentTab('dashboard')}
            onBackToHome={() => setCurrentTab('public')}
          />
        );
      case 'dashboard':
        return <Dashboard onNavigate={(tab) => setCurrentTab(tab)} />;
      case 'members':
        return <Members />;
      case 'meetings':
        return <Meetings />;
      case 'savings':
        return <Savings />;
      case 'loans':
        return <Loans />;
      case 'products':
        return <Products />;
      case 'announcements':
        return <Announcements />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard onNavigate={(tab) => setCurrentTab(tab)} />;
    }
  };

  return (
    <div className="app-container">
      {/* Desktop & Mobile Drawer Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Wrapper */}
      <div className="main-wrapper">
        <Topbar
          groupInfo={groupInfo}
          onToggleMobileNav={() => setIsMobileOpen(!isMobileOpen)}
          onLoginClick={() => setCurrentTab('login')}
        />

        <main className="page-content">
          {renderContent()}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
        />
      </div>
    </div>
  );
}
