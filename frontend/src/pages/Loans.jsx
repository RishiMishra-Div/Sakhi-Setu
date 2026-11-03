import React, { useState, useEffect } from 'react';
import { 
  HandCoins, 
  PlusCircle, 
  History
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translatePaymentMode, translateTextItem } from '../services/translations';

export const Loans = () => {
  const { isAdmin } = useAuth();
  const { t, language } = useLanguage();

  const [loans, setLoans] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Modals
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [ledgerModalLoan, setLedgerModalLoan] = useState(null);

  // Issue Loan Form
  const [loanFormData, setLoanFormData] = useState({
    memberId: '',
    principalAmount: 5000,
    monthlyInterestRate: 1.0,
    agreedTerms: '',
    purpose: '',
    loanDate: new Date().toISOString().split('T')[0]
  });

  // Repayment Form
  const [repayFormData, setRepayFormData] = useState({
    amount: 1000,
    principalPaid: 1000,
    interestPaid: 50,
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMode: 'Cash / रोख',
    note: ''
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [loansRes, membersRes] = await Promise.all([
        api.getLoans(statusFilter),
        api.getMembers('', 'active')
      ]);
      setLoans(loansRes.loans || []);
      setMembers(membersRes || []);
    } catch (err) {
      console.error('Failed to load loans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleOpenIssueModal = () => {
    setLoanFormData({
      memberId: members[0]?._id || '',
      principalAmount: 5000,
      monthlyInterestRate: 1.0,
      agreedTerms: language === 'en' ? '1% monthly interest, 6 monthly installments' : language === 'hi' ? '1% प्रतिमाह ब्याज, 6 मासिक किस्तें' : '1% दरमहा व्याज, 6 मासिक हप्ते',
      purpose: language === 'en' ? 'Micro-business / Sewing machine / Agriculture' : language === 'hi' ? 'लघु व्यवसाय / सिलाई मशीन / कृषि' : 'लहान व्यवसाय / शेती / घरगुती उद्योग',
      loanDate: new Date().toISOString().split('T')[0]
    });
    setErrorMsg('');
    setIsIssueModalOpen(true);
  };

  const handleOpenRepayModal = (loan) => {
    setSelectedLoan(loan);
    setRepayFormData({
      amount: Math.min(1000, loan.outstandingBalance || 1000),
      principalPaid: Math.min(1000, loan.outstandingBalance || 1000),
      interestPaid: Math.round((loan.outstandingBalance * 0.01) || 0),
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMode: 'Cash / रोख',
      note: language === 'en' ? 'Monthly installment repayment' : language === 'hi' ? 'मासिक किस्त भुगतान' : 'मासिक हप्ता परतफेड'
    });
    setErrorMsg('');
    setIsRepayModalOpen(true);
  };

  const handleIssueSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (Number(loanFormData.principalAmount) <= 0) {
      setErrorMsg(t('errorMsg'));
      return;
    }

    try {
      await api.createLoan(loanFormData);
      setIsIssueModalOpen(false);
      setSuccessMsg(t('successMsg'));
      loadData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || t('errorMsg'));
    }
  };

  const handleRepaySubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (Number(repayFormData.amount) <= 0) {
      setErrorMsg(t('errorMsg'));
      return;
    }

    try {
      await api.recordRepayment(selectedLoan._id, repayFormData);
      setIsRepayModalOpen(false);
      setSuccessMsg(t('successMsg'));
      loadData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      setErrorMsg(err.message || t('errorMsg'));
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <HandCoins size={24} color="#15803d" />
            <span>{t('loansTitle')}</span>
          </h1>
          <p className="page-subtitle">
            {t('loansSub')}
          </p>
        </div>

        {isAdmin && (
          <button type="button" className="btn btn-primary" onClick={handleOpenIssueModal}>
            <PlusCircle size={18} />
            <span>{t('issueLoanBtn')}</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div style={{ background: '#dcfce7', color: '#14532d', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontWeight: 600, border: '1px solid #86efac' }}>
          ✅ {successMsg}
        </div>
      )}

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          type="button"
          className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setStatusFilter('all')}
        >
          {t('allLoansTab')} ({loans.length})
        </button>
        <button
          type="button"
          className={`btn btn-sm ${statusFilter === 'active' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setStatusFilter('active')}
        >
          {t('activeLoansTab')}
        </button>
        <button
          type="button"
          className={`btn btn-sm ${statusFilter === 'repaid' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setStatusFilter('repaid')}
        >
          {t('repaidLoansTab')}
        </button>
      </div>

      {/* Loans Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('loanNumber')}</th>
                <th>{t('memberName')}</th>
                <th>{t('approvedDateCol')}</th>
                <th>{t('principalAmount')}</th>
                <th>{t('purpose')}</th>
                <th>{t('agreedTerms')}</th>
                <th>{t('outstandingBalance')}</th>
                <th>{t('status')}</th>
                <th style={{ textAlign: 'right' }}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '30px' }}>
                    {t('loading')}
                  </td>
                </tr>
              ) : loans.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    {t('noData')}
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan._id}>
                    <td>
                      <span style={{ fontWeight: 700, color: '#15803d', background: '#f0fdf4', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                        {loan.loanNumber}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{loan.memberId?.name}</div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {loan.memberId?.memberCode}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>
                      {new Date(loan.loanDate).toLocaleDateString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'mr-IN')}
                    </td>
                    <td style={{ fontWeight: 700 }}>
                      ₹{loan.principalAmount.toLocaleString('en-IN')}
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#475569', maxWidth: '180px' }}>
                      {translateTextItem(loan.purpose, language)}
                    </td>
                    <td style={{ fontSize: '0.8rem', color: '#64748b' }}>
                      {translateTextItem(loan.agreedTerms, language)}
                    </td>
                    <td>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: loan.outstandingBalance > 0 ? '#b91c1c' : '#15803d' }}>
                        ₹{loan.outstandingBalance.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${loan.status === 'active' ? 'badge-warning' : 'badge-success'}`}>
                        {loan.status === 'active' ? t('activeLoanBadge') : t('repaidLoanBadge')}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          title={t('viewRepaymentsTitle')}
                          onClick={() => setLedgerModalLoan(loan)}
                        >
                          <History size={15} />
                        </button>

                        {isAdmin && loan.status === 'active' && (
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '0.78rem' }}
                            onClick={() => handleOpenRepayModal(loan)}
                          >
                            {t('recordInstallmentBtn')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Issue Loan Modal */}
      {isIssueModalOpen && (
        <div className="modal-overlay" onClick={() => setIsIssueModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('issueLoanModalTitle')}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setIsIssueModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleIssueSubmit}>
              <div className="modal-body">
                {errorMsg && (
                  <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px' }}>
                    ⚠️ {errorMsg}
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">{t('borrowerMember')} *</label>
                  <select
                    className="form-select"
                    required
                    value={loanFormData.memberId}
                    onChange={(e) => setLoanFormData({ ...loanFormData, memberId: e.target.value })}
                  >
                    <option value="" disabled>{t('selectBorrowerPrompt')}</option>
                    {members.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.memberCode} - {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">{t('principalAmount')} *</label>
                    <input
                      type="number"
                      required
                      min="500"
                      step="500"
                      className="form-input"
                      value={loanFormData.principalAmount}
                      onChange={(e) => setLoanFormData({ ...loanFormData, principalAmount: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('interestRateMonthly')}</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      className="form-input"
                      value={loanFormData.monthlyInterestRate}
                      onChange={(e) => setLoanFormData({ ...loanFormData, monthlyInterestRate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('purpose')} *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tailoring machine, Agriculture, Raw materials"
                    className="form-input"
                    value={loanFormData.purpose}
                    onChange={(e) => setLoanFormData({ ...loanFormData, purpose: e.target.value })}
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">{t('loanDisbursalDate')}</label>
                    <input
                      type="date"
                      required
                      className="form-input"
                      value={loanFormData.loanDate}
                      onChange={(e) => setLoanFormData({ ...loanFormData, loanDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('agreedTerms')}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={loanFormData.agreedTerms}
                      onChange={(e) => setLoanFormData({ ...loanFormData, agreedTerms: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsIssueModalOpen(false)}>
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

      {/* Record Repayment Modal */}
      {isRepayModalOpen && selectedLoan && (
        <div className="modal-overlay" onClick={() => setIsRepayModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('recordInstallmentBtn')} ({selectedLoan.loanNumber})</h3>
              <button type="button" className="modal-close-btn" onClick={() => setIsRepayModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleRepaySubmit}>
              <div className="modal-body">
                <div style={{ background: '#f8faf7', padding: '14px', borderRadius: '10px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('borrowerMember')}</span>
                    <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{selectedLoan.memberId?.name}</h4>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('balanceRemaining')}</span>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#b91c1c' }}>
                      ₹{selectedLoan.outstandingBalance?.toLocaleString('en-IN')}
                    </h4>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">{t('principalRepayment')}</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="form-input"
                      value={repayFormData.principalPaid}
                      onChange={(e) => setRepayFormData({ ...repayFormData, principalPaid: e.target.value, amount: Number(e.target.value) + Number(repayFormData.interestPaid) })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('interestPayment')}</label>
                    <input
                      type="number"
                      min="0"
                      className="form-input"
                      value={repayFormData.interestPaid}
                      onChange={(e) => setRepayFormData({ ...repayFormData, interestPaid: e.target.value, amount: Number(repayFormData.principalPaid) + Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">{t('paymentModeCol')}</label>
                    <select
                      className="form-select"
                      value={repayFormData.paymentMode}
                      onChange={(e) => setRepayFormData({ ...repayFormData, paymentMode: e.target.value })}
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
                      value={repayFormData.paymentDate}
                      onChange={(e) => setRepayFormData({ ...repayFormData, paymentDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('receiptNote')}</label>
                  <input
                    type="text"
                    className="form-input"
                    value={repayFormData.note}
                    onChange={(e) => setRepayFormData({ ...repayFormData, note: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsRepayModalOpen(false)}>
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

      {/* Repayment History Ledger Modal */}
      {ledgerModalLoan && (
        <div className="modal-overlay" onClick={() => setLedgerModalLoan(null)}>
          <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h3 className="modal-title">{t('repaymentLedgerModalTitle')} ({ledgerModalLoan.loanNumber})</h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  {t('borrowerMember')}: {ledgerModalLoan.memberId?.name} • {t('principalAmount')}: ₹{ledgerModalLoan.principalAmount}
                </span>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setLedgerModalLoan(null)}>✕</button>
            </div>

            <div className="modal-body">
              {ledgerModalLoan.repayments?.length > 0 ? (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>{t('installmentDateCol')}</th>
                        <th>{t('principalPaidCol')}</th>
                        <th>{t('interestPaidCol')}</th>
                        <th>{t('paymentModeCol')}</th>
                        <th>{t('noteCol')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ledgerModalLoan.repayments.map((r, idx) => (
                        <tr key={idx}>
                          <td>{new Date(r.paymentDate).toLocaleDateString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'mr-IN')}</td>
                          <td style={{ fontWeight: 700, color: '#15803d' }}>₹{r.principalPaid || r.amount}</td>
                          <td>₹{r.interestPaid || 0}</td>
                          <td style={{ fontSize: '0.85rem' }}>{translatePaymentMode(r.paymentMode, language)}</td>
                          <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{r.note || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
                  {t('noInstallmentsYet')}
                </p>
              )}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setLedgerModalLoan(null)}>
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
