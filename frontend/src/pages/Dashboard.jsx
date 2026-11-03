import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Calendar, 
  PiggyBank, 
  HandCoins, 
  ArrowUpRight, 
  PlusCircle, 
  Clock, 
  MapPin, 
  BellRing,
  FileSpreadsheet
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translatePaymentMode, translateTextItem } from '../services/translations';

export const Dashboard = ({ onNavigate }) => {
  const { user, isAdmin } = useAuth();
  const { t, language } = useLanguage();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await api.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
        <p>{t('loading')}</p>
      </div>
    );
  }

  const getGroupName = () => {
    if (language === 'en') return 'Sakhi Mahila Bachat Gat, Shivaji Nagar, Pune';
    if (language === 'hi') return 'सखी महिला बचत समूह, शिवाजी नगर, पुणे';
    return 'सखी महिला बचत गट, शिवाजी नगर, पुणे';
  };

  return (
    <div>
      {/* Welcome Banner */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #15803d, #14532d)', 
          borderRadius: '16px', 
          padding: '24px 28px', 
          color: 'white', 
          marginBottom: '28px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <span style={{ fontSize: '0.82rem', background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '999px', fontWeight: 600 }}>
            {isAdmin ? t('adminOffice') : t('memberOffice')}
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '8px' }}>
            {t('welcomeBack')}, {user?.name || 'Sakhi'}!
          </h2>
          <p style={{ opacity: 0.9, fontSize: '0.9rem', marginTop: '2px' }}>
            {getGroupName()}
          </p>
        </div>

        {/* Quick Shortcut Buttons */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {isAdmin && (
            <>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                style={{ background: '#f59e0b', color: '#000', fontWeight: 700 }}
                onClick={() => onNavigate('savings')}
              >
                <PlusCircle size={16} />
                <span>{t('recordSavingsQuick')}</span>
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
                onClick={() => onNavigate('meetings')}
              >
                <Calendar size={16} />
                <span>{t('scheduleMeetingQuick')}</span>
              </button>
            </>
          )}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            style={{ background: 'rgba(255,255,255,0.15)', color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}
            onClick={() => onNavigate('reports')}
          >
            <FileSpreadsheet size={16} />
            <span>{t('auditReportQuick')}</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="stats-grid">
        {/* Total Members */}
        <div className="stat-card" onClick={() => onNavigate('members')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon green">
            <Users size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="stat-value">{stats?.totalMembers || 20}</div>
            <div className="stat-label">
              {t('totalMembers')} ({stats?.activeMembers || 20} {t('activeMembersCount')})
            </div>
          </div>
          <ArrowUpRight size={18} color="#94a3b8" />
        </div>

        {/* Next Meeting */}
        <div className="stat-card" onClick={() => onNavigate('meetings')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon gold">
            <Calendar size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="stat-value" style={{ fontSize: '1.25rem' }}>
              {stats?.nextMeeting ? new Date(stats.nextMeeting.meetingDate).toLocaleDateString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'mr-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '26 Oct 2026'}
            </div>
            <div className="stat-label">{t('nextMeetingSub')}</div>
          </div>
          <ArrowUpRight size={18} color="#94a3b8" />
        </div>

        {/* Total Savings */}
        <div className="stat-card" onClick={() => onNavigate('savings')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon green">
            <PiggyBank size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="stat-value" style={{ color: '#15803d' }}>
              ₹{(stats?.totalSavings || 25000).toLocaleString('en-IN')}
            </div>
            <div className="stat-label">{t('totalSavings')}</div>
          </div>
          <ArrowUpRight size={18} color="#94a3b8" />
        </div>

        {/* Total Loans */}
        <div className="stat-card" onClick={() => onNavigate('loans')} style={{ cursor: 'pointer' }}>
          <div className="stat-icon red">
            <HandCoins size={26} />
          </div>
          <div style={{ flex: 1 }}>
            <div className="stat-value" style={{ color: '#b91c1c' }}>
              ₹{(stats?.totalOutstandingLoans || 8000).toLocaleString('en-IN')}
            </div>
            <div className="stat-label">{t('totalLoans')}</div>
          </div>
          <ArrowUpRight size={18} color="#94a3b8" />
        </div>
      </div>

      {/* 2 Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '24px' }}>
        {/* Next Meeting Details Card */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Calendar size={18} color="#15803d" />
              <span>{t('nextMeetingDetails')}</span>
            </h3>
            <span className="badge badge-warning">{t('timeRemaining')}</span>
          </div>
          <div className="card-body">
            {stats?.nextMeeting ? (
              <div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#14532d', marginBottom: '8px' }}>
                  {translateTextItem(stats.nextMeeting.title, language)}
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', background: '#f8faf7', padding: '14px', borderRadius: '12px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Calendar size={18} color="#16a34a" />
                    <div>
                      <p style={{ fontSize: '0.72rem', color: '#64748b' }}>{t('dateLabel')}</p>
                      <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                        {new Date(stats.nextMeeting.meetingDate).toLocaleDateString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'mr-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={18} color="#d97706" />
                    <div>
                      <p style={{ fontSize: '0.72rem', color: '#64748b' }}>{t('timeLabel')}</p>
                      <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>{stats.nextMeeting.startTime}</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', gridColumn: '1 / -1' }}>
                    <MapPin size={18} color="#0284c7" />
                    <div>
                      <p style={{ fontSize: '0.72rem', color: '#64748b' }}>{t('locationLabel')}</p>
                      <p style={{ fontSize: '0.88rem', fontWeight: 600 }}>{stats.nextMeeting.location}</p>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h5 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                    {t('agendaLabel')}
                  </h5>
                  <ul style={{ paddingLeft: '20px', fontSize: '0.85rem', color: '#475569', lineHeight: '1.6' }}>
                    {stats.nextMeeting.agenda?.map((ag, i) => (
                      <li key={i}>{translateTextItem(ag, language)}</li>
                    ))}
                  </ul>
                </div>

                {isAdmin && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{ width: '100%' }}
                    onClick={() => onNavigate('meetings')}
                  >
                    <span>{t('markMeetingBtn')}</span>
                  </button>
                )}
              </div>
            ) : (
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{t('noUpcomingMeetings')}</p>
            )}
          </div>
        </div>

        {/* Recent Announcements */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <BellRing size={18} color="#d97706" />
              <span>{t('recentAnnouncements')}</span>
            </h3>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('announcements')}
            >
              {t('viewAll')}
            </button>
          </div>
          <div className="card-body">
            {stats?.recentAnnouncements?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {stats.recentAnnouncements.map((ann) => (
                  <div key={ann._id} style={{ padding: '12px', background: '#fafdfa', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span className={`badge ${ann.priority === 'high' ? 'badge-danger' : 'badge-info'}`}>
                        {ann.priority === 'high' ? t('urgentPriority') : t('normalPriority')}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                        {new Date(ann.postedDate).toLocaleDateString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'mr-IN')}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#1e293b' }}>
                      {translateTextItem(ann.title, language)}
                    </h4>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px', lineHeight: 1.4 }}>
                      {ann.body}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{t('noNotices')}</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Savings Transactions Ledger */}
      <div className="card" style={{ marginTop: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">
            <PiggyBank size={18} color="#15803d" />
            <span>{t('recentTransactions')}</span>
          </h3>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => onNavigate('savings')}
          >
            {t('viewAll')}
          </button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('dateLabel')}</th>
                  <th>{t('memberName')}</th>
                  <th>{t('actions')}</th>
                  <th>{t('paymentModeCol')}</th>
                  <th style={{ textAlign: 'right' }}>{t('amount')}</th>
                </tr>
              </thead>
              <tbody>
                {stats?.recentTransactions?.map((tx) => (
                  <tr key={tx._id}>
                    <td>{new Date(tx.transactionDate).toLocaleDateString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'mr-IN')}</td>
                    <td style={{ fontWeight: 600 }}>
                      {tx.memberId?.name || 'Member'}
                      <span style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block' }}>
                        {tx.memberId?.memberCode}
                      </span>
                    </td>
                    <td>
                      <span className="badge badge-success">{t('typeMonthlySavings')}</span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: '#64748b' }}>
                      {translatePaymentMode(tx.paymentMode, language)}
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: '#15803d' }}>
                      +₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
