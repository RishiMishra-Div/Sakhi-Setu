import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Download
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { translatePaymentMode } from '../services/translations';

export const Reports = () => {
  const { t, language } = useLanguage();

  const [selectedMonth, setSelectedMonth] = useState('2026-10');
  const [reportType, setReportType] = useState('all');
  const [reportData, setReportData] = useState(null);
  const [groupInfo, setGroupInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadReport = async () => {
    try {
      setLoading(true);
      const [repData, grpData] = await Promise.all([
        api.getMonthlyReport(selectedMonth, reportType),
        api.getGroup()
      ]);
      setReportData(repData);
      setGroupInfo(grpData);
    } catch (err) {
      console.error('Failed to generate report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, [selectedMonth, reportType]);

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    if (!reportData?.savings?.transactions) return;

    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Date,Member Code,Member Name,Month,Payment Mode,Amount (INR),Notes\r\n';

    reportData.savings.transactions.forEach((tx) => {
      const row = [
        new Date(tx.transactionDate).toISOString().split('T')[0],
        `"${tx.memberId?.memberCode || ''}"`,
        `"${tx.memberId?.name || ''}"`,
        `"${tx.monthYear || ''}"`,
        `"${tx.paymentMode || ''}"`,
        tx.amount,
        `"${tx.note || ''}"`
      ];
      csvContent += row.join(',') + '\r\n';
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SakhiSetu_Report_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getGroupName = () => {
    if (language === 'en') return 'Sakhi Mahila Bachat Gat (SHG)';
    if (language === 'hi') return 'सखी महिला बचत समूह (SHG)';
    return 'सखी महिला बचत गट';
  };

  const getMonthLabel = (mStr) => {
    if (mStr === '2026-10') return language === 'en' ? 'October 2026' : language === 'hi' ? 'अक्टूबर २०२६' : 'ऑक्टोबर २०२६';
    if (mStr === '2026-09') return language === 'en' ? 'September 2026' : language === 'hi' ? 'सितम्बर २०२६' : 'सप्टेंबर २०२६';
    if (mStr === '2026-08') return language === 'en' ? 'August 2026' : language === 'hi' ? 'अगस्त २०२६' : 'ऑगस्ट २०२६';
    return mStr;
  };

  return (
    <div>
      {/* Official Print Letterhead */}
      <div 
        style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          marginBottom: '24px',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#15803d', fontWeight: 800, fontSize: '1.4rem' }}>
          <span>🌸 {getGroupName()}</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>
          {t('regNoLabel')} {groupInfo?.registrationNumber || 'MH/PUN/SHG/2023/0489'} • Shivaji Nagar, Pune, Maharashtra
        </p>
        <p style={{ fontSize: '0.82rem', color: '#15803d', fontWeight: 700, marginTop: '2px' }}>
          {t('reportsSub')} - {getMonthLabel(selectedMonth)}
        </p>
      </div>

      {/* Control Bar */}
      <div className="card no-print" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                {t('selectMonth')}
              </label>
              <select
                className="form-select"
                style={{ width: '180px' }}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="2026-10">{getMonthLabel('2026-10')}</option>
                <option value="2026-09">{getMonthLabel('2026-09')}</option>
                <option value="2026-08">{getMonthLabel('2026-08')}</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '4px' }}>
                {t('reportType')}
              </label>
              <select
                className="form-select"
                style={{ width: '220px' }}
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="all">{t('fullAuditOption')}</option>
                <option value="savings">{t('savingsOnlyOption')}</option>
                <option value="loans">{t('loansOnlyOption')}</option>
                <option value="attendance">{t('attendanceOnlyOption')}</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-secondary btn-sm" onClick={handleExportCSV}>
              <Download size={16} />
              <span>{t('exportExcel')}</span>
            </button>
            <button type="button" className="btn btn-primary btn-sm" onClick={handlePrint}>
              <Printer size={16} />
              <span>{t('printReport')}</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          {t('loading')}
        </div>
      ) : (
        <>
          {/* Consolidated Financial Summary Boxes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
            <div style={{ background: '#f0fdf4', padding: '18px', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#166534' }}>{t('savingsCollectedMonth')}</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#15803d', marginTop: '4px' }}>
                ₹{(reportData?.consolidated?.totalSavingsCollected || 0).toLocaleString('en-IN')}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#166534', marginTop: '2px' }}>
                {reportData?.savings?.count || 0} {t('membersContributions')}
              </p>
            </div>

            <div style={{ background: '#fef3c7', padding: '18px', borderRadius: '12px', border: '1px solid #fde68a' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#92400e' }}>{t('loanRepaymentsMonth')}</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b45309', marginTop: '4px' }}>
                ₹{(reportData?.consolidated?.loanRepaymentsReceived || 0).toLocaleString('en-IN')}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#92400e', marginTop: '2px' }}>
                {t('installmentsDeposited')}: {reportData?.loans?.repaymentsCount || 0}
              </p>
            </div>

            <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>{t('newLoansDisbursedMonth')}</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', marginTop: '4px' }}>
                ₹{(reportData?.consolidated?.loansDisbursed || 0).toLocaleString('en-IN')}
              </div>
              <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>
                {t('sanctionedLoans')}: {reportData?.loans?.newLoansCount || 0}
              </p>
            </div>

            <div style={{ background: '#eff6ff', padding: '18px', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af' }}>{t('meetingAttendanceMonth')}</span>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1d4ed8', marginTop: '4px' }}>
                {reportData?.attendance?.attendanceRate || 0}%
              </div>
              <p style={{ fontSize: '0.75rem', color: '#1e40af', marginTop: '2px' }}>
                {t('organizedMeetings')}: {reportData?.attendance?.meetingsHeld || 0}
              </p>
            </div>
          </div>

          {/* Savings Ledger in Month */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <h3 className="card-title">{t('savingsSummaryHeader')}</h3>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#15803d' }}>
                {t('totalCollection')} ₹{(reportData?.savings?.totalAmount || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('dateLabel')}</th>
                      <th>{t('memberCode')}</th>
                      <th>{t('memberName')}</th>
                      <th>{t('paymentModeCol')}</th>
                      <th>{t('noteCol')}</th>
                      <th style={{ textAlign: 'right' }}>{t('amountDepositedCol')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData?.savings?.transactions?.map((tx) => (
                      <tr key={tx._id}>
                        <td>{new Date(tx.transactionDate).toLocaleDateString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'mr-IN')}</td>
                        <td style={{ fontWeight: 600, color: '#15803d' }}>{tx.memberId?.memberCode}</td>
                        <td style={{ fontWeight: 700 }}>{tx.memberId?.name}</td>
                        <td>{translatePaymentMode(tx.paymentMode, language)}</td>
                        <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{tx.note || '-'}</td>
                        <td style={{ textAlign: 'right', fontWeight: 800, color: '#15803d' }}>
                          +₹{tx.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Loan Repayments in Month */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div className="card-header">
              <h3 className="card-title">{t('loansSummaryHeader')}</h3>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#b45309' }}>
                {t('totalRepayments')} ₹{(reportData?.loans?.repaymentsReceived || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {reportData?.loans?.repayments?.length > 0 ? (
                <div className="table-responsive">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>{t('dateLabel')}</th>
                        <th>{t('loanNumber')}</th>
                        <th>{t('memberName')}</th>
                        <th>{t('principalPaidCol')}</th>
                        <th>{t('interestPaidCol')}</th>
                        <th>{t('totalRepaidCol')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.loans.repayments.map((rep, idx) => (
                        <tr key={idx}>
                          <td>{new Date(rep.paymentDate).toLocaleDateString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'mr-IN')}</td>
                          <td style={{ fontWeight: 600 }}>{rep.loanNumber}</td>
                          <td style={{ fontWeight: 700 }}>{rep.member?.name}</td>
                          <td>₹{rep.principalPaid || rep.amount}</td>
                          <td>₹{rep.interestPaid || 0}</td>
                          <td style={{ fontWeight: 800, color: '#15803d' }}>₹{rep.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                  {t('noRepaymentsThisMonth')}
                </p>
              )}
            </div>
          </div>

          {/* Official Signatures Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '20px', borderTop: '2px solid #e2e8f0', textAlign: 'center' }}>
            <div>
              <div style={{ height: '40px' }} />
              <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Sunita Patil</p>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('presidentTitle')}</p>
            </div>
            <div>
              <div style={{ height: '40px' }} />
              <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Meera Deshmukh</p>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('secretaryTitle')}</p>
            </div>
            <div>
              <div style={{ height: '40px' }} />
              <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Asha Shinde</p>
              <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('treasurerTitle')}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
