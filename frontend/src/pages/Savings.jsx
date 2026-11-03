import React, { useState, useEffect } from 'react';
import { 
  PiggyBank, 
  PlusCircle
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translatePaymentMode } from '../services/translations';

export const Savings = () => {
  const { isAdmin } = useAuth();
  const { t, language } = useLanguage();

  const [transactions, setTransactions] = useState([]);
  const [members, setMembers] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  // Record Savings Modal
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    memberId: '',
    amount: 500,
    transactionDate: new Date().toISOString().split('T')[0],
    paymentMode: 'Cash / रोख',
    monthYear: '2026-10',
    note: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [savingsRes, membersRes, summaryRes] = await Promise.all([
        api.getSavings(selectedMemberId, selectedMonth),
        api.getMembers('', 'active'),
        api.getSavingsSummary()
      ]);
      setTransactions(savingsRes.transactions || []);
      setMembers(membersRes || []);
      setSummary(summaryRes);
    } catch (err) {
      console.error('Failed to load savings data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedMemberId, selectedMonth]);

  const handleOpenRecordModal = (memberId = '') => {
    setFormData({
      memberId: memberId || (members[0]?._id || ''),
      amount: 500,
      transactionDate: new Date().toISOString().split('T')[0],
      paymentMode: 'Cash / रोख',
      monthYear: '2026-10',
      note: language === 'en' ? 'Monthly savings deposit' : language === 'hi' ? 'मासिक बचत अंशदान' : 'मासिक बचत योगदान'
    });
    setErrorMsg('');
    setIsRecordModalOpen(true);
  };

  const handleRecordSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (Number(formData.amount) <= 0) {
      setErrorMsg(t('errorMsg'));
      return;
    }

    try {
      await api.createSavings(formData);
      setIsRecordModalOpen(false);
      setSuccessMsg(t('successMsg'));
      loadData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || t('errorMsg'));
    }
  };

  const getMonthLabel = (mStr) => {
    if (mStr === '2026-10') return language === 'en' ? 'October 2026' : language === 'hi' ? 'अक्टूबर २०२६' : 'ऑक्टोबर २०२६';
    if (mStr === '2026-09') return language === 'en' ? 'September 2026' : language === 'hi' ? 'सितम्बर २०२६' : 'सप्टेंबर २०२६';
    if (mStr === '2026-08') return language === 'en' ? 'August 2026' : language === 'hi' ? 'अगस्त २०२६' : 'ऑगस्ट २०२६';
    return mStr;
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <PiggyBank size={24} color="#15803d" />
            <span>{t('savingsTitle')}</span>
          </h1>
          <p className="page-subtitle">
            {t('savingsSub')}
          </p>
        </div>

        {isAdmin && (
          <button type="button" className="btn btn-primary" onClick={() => handleOpenRecordModal()}>
            <PlusCircle size={18} />
            <span>{t('recordSavingsBtn')}</span>
          </button>
        )}
      </div>

      {/* Group Total Savings Card Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #15803d 0%, #166534 100%)',
          borderRadius: '16px',
          padding: '24px 28px',
          color: 'white',
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <span style={{ fontSize: '0.82rem', background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '999px', fontWeight: 600 }}>
            {t('treasuryBalance')}
          </span>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, marginTop: '6px' }}>
            ₹{(summary?.groupTotal || 25000).toLocaleString('en-IN')}
          </div>
          <p style={{ opacity: 0.9, fontSize: '0.88rem' }}>
            {transactions.length} {t('savingsFromTransactions')}
          </p>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px 20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)' }}>
          <p style={{ fontSize: '0.78rem', opacity: 0.85 }}>{t('regularMonthlySavings')}</p>
          <p style={{ fontSize: '1.25rem', fontWeight: 700 }}>{t('perMemberPerMonth')}</p>
        </div>
      </div>

      {successMsg && (
        <div style={{ background: '#dcfce7', color: '#14532d', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontWeight: 600, border: '1px solid #86efac' }}>
          ✅ {successMsg}
        </div>
      )}

      {/* Filter Bar */}
      <div className="card" style={{ padding: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '220px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
              {t('filterByMember')}
            </label>
            <select
              className="form-select"
              value={selectedMemberId}
              onChange={(e) => setSelectedMemberId(e.target.value)}
            >
              <option value="">{t('allMembersOption')}</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.memberCode} - {m.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ width: '200px' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
              {t('filterByMonth')}
            </label>
            <select
              className="form-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="">{t('allMonthsOption')}</option>
              <option value="2026-10">{getMonthLabel('2026-10')}</option>
              <option value="2026-09">{getMonthLabel('2026-09')}</option>
              <option value="2026-08">{getMonthLabel('2026-08')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Ledger Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">{t('savingsLedgerTitle')}</h3>
          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
            {t('showingRecords')} {transactions.length}
          </span>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>{t('dateLabel')}</th>
                  <th>{t('monthCol')}</th>
                  <th>{t('memberCode')}</th>
                  <th>{t('memberName')}</th>
                  <th>{t('paymentModeCol')}</th>
                  <th>{t('noteCol')}</th>
                  <th style={{ textAlign: 'right' }}>{t('amountDepositedCol')}</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>
                      {t('loading')}
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                      {t('noData')}
                    </td>
                  </tr>
                ) : (
                  transactions.map((tx) => (
                    <tr key={tx._id}>
                      <td>{new Date(tx.transactionDate).toLocaleDateString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'mr-IN')}</td>
                      <td>
                        <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                          {tx.monthYear}
                        </span>
                      </td>
                      <td style={{ fontWeight: 600, color: '#15803d' }}>
                        {tx.memberId?.memberCode}
                      </td>
                      <td style={{ fontWeight: 700 }}>
                        {tx.memberId?.name || 'Member'}
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#475569' }}>
                        {translatePaymentMode(tx.paymentMode, language)}
                      </td>
                      <td style={{ fontSize: '0.82rem', color: '#64748b' }}>
                        {tx.note || '-'}
                      </td>
                      <td style={{ textAlign: 'right', fontWeight: 800, color: '#15803d' }}>
                        +₹{tx.amount.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Record Savings Modal */}
      {isRecordModalOpen && (
        <div className="modal-overlay" onClick={() => setIsRecordModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('recordSavingsBtn')}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setIsRecordModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleRecordSubmit}>
              <div className="modal-body">
                {errorMsg && (
                  <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px' }}>
                    ⚠️ {errorMsg}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">{t('filterByMember')} *</label>
                  <select
                    className="form-select"
                    required
                    value={formData.memberId}
                    onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                  >
                    <option value="" disabled>{t('selectMemberPrompt')}</option>
                    {members.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.memberCode} - {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">{t('amount')} *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="form-input"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('whichMonthSavings')}</label>
                    <input
                      type="month"
                      required
                      className="form-input"
                      value={formData.monthYear}
                      onChange={(e) => setFormData({ ...formData, monthYear: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">{t('paymentModeCol')}</label>
                    <select
                      className="form-select"
                      value={formData.paymentMode}
                      onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                    >
                      <option value="Cash / रोख">{translatePaymentMode('Cash', language)}</option>
                      <option value="UPI / फोनपे/गुगलपे">{translatePaymentMode('UPI', language)}</option>
                      <option value="Bank Transfer / बँक ट्रान्सफर">{translatePaymentMode('Bank Transfer', language)}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('transactionDate')}</label>
                    <input
                      type="date"
                      required
                      className="form-input"
                      value={formData.transactionDate}
                      onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('noteCol')}</label>
                  <input
                    type="text"
                    placeholder="e.g. Monthly contribution"
                    className="form-input"
                    value={formData.note}
                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsRecordModalOpen(false)}>
                  {t('cancel')}
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
