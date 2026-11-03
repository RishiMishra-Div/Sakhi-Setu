import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Phone, 
  Calendar, 
  Eye, 
  Edit3, 
  Check,
  X
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { translateRole, translatePaymentMode } from '../services/translations';

export const Members = () => {
  const { isAdmin } = useAuth();
  const { t, language } = useLanguage();

  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [memberDetailModal, setMemberDetailModal] = useState(null);
  const [confirmToggleMember, setConfirmToggleMember] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    memberCode: '',
    phone: '',
    roleInGroup: 'सदस्य (Member)',
    joinDate: new Date().toISOString().split('T')[0],
    address: '',
    bankAccount: ''
  });

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await api.getMembers(search, statusFilter);
      setMembers(data);
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [search, statusFilter]);

  const handleOpenAdd = () => {
    const nextNum = members.length + 1;
    const nextCode = `MBG-${String(nextNum).padStart(3, '0')}`;
    setFormData({
      name: '',
      memberCode: nextCode,
      phone: '',
      roleInGroup: 'सदस्य (Member)',
      joinDate: new Date().toISOString().split('T')[0],
      address: '',
      bankAccount: ''
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setSelectedMember(member);
    setFormData({
      name: member.name,
      memberCode: member.memberCode,
      phone: member.phone || '',
      roleInGroup: member.roleInGroup || 'सदस्य (Member)',
      joinDate: member.joinDate ? new Date(member.joinDate).toISOString().split('T')[0] : '',
      address: member.address || '',
      bankAccount: member.bankAccount || ''
    });
    setIsEditModalOpen(true);
  };

  const handleOpenDetails = async (member) => {
    try {
      const details = await api.getMemberById(member._id);
      setMemberDetailModal(details);
    } catch (err) {
      alert(err.message || t('errorMsg'));
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      await api.createMember(formData);
      setIsAddModalOpen(false);
      loadMembers();
    } catch (err) {
      alert(err.message || t('errorMsg'));
    }
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      await api.updateMember(selectedMember._id, formData);
      setIsEditModalOpen(false);
      loadMembers();
    } catch (err) {
      alert(err.message || t('errorMsg'));
    }
  };

  const handleConfirmToggle = async () => {
    if (!confirmToggleMember) return;
    try {
      await api.toggleMemberStatus(confirmToggleMember._id);
      setConfirmToggleMember(null);
      loadMembers();
    } catch (err) {
      alert(err.message || t('errorMsg'));
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Users size={24} color="#15803d" />
            <span>{t('membersTitle')}</span>
          </h1>
          <p className="page-subtitle">
            {members.length} {t('membersSub')}
          </p>
        </div>

        {isAdmin && (
          <button type="button" className="btn btn-primary" onClick={handleOpenAdd}>
            <UserPlus size={18} />
            <span>{t('addMemberBtn')}</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px' }}>
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder={t('searchMembers')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ width: '180px' }}>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">{t('allStatus')}</option>
              <option value="active">{t('onlyActive')}</option>
              <option value="inactive">{t('onlyInactive')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Directory Table */}
      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>{t('memberCode')}</th>
                <th>{t('memberName')}</th>
                <th>{t('phone')}</th>
                <th>{t('roleInGroup')}</th>
                <th>{t('savingsCol')} (₹)</th>
                <th>{t('loansCol')}</th>
                <th>{t('status')}</th>
                <th style={{ textAlign: 'right' }}>{t('actions')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px' }}>
                    {t('loading')}
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                    {t('noData')}
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member._id}>
                    <td>
                      <span style={{ fontWeight: 700, color: '#15803d', background: '#f0fdf4', padding: '3px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>
                        {member.memberCode}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: '#1e293b' }}>{member.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {t('joinedOn')} {new Date(member.joinDate).toLocaleDateString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'mr-IN')}
                      </div>
                    </td>
                    <td>
                      {member.phone ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
                          <Phone size={14} color="#16a34a" />
                          <span>{member.phone}</span>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>-</span>
                      )}
                    </td>
                    <td>
                      <span className="badge badge-info" style={{ fontSize: '0.78rem' }}>
                        {translateRole(member.roleInGroup, language)}
                      </span>
                    </td>
                    <td style={{ fontWeight: 700, color: '#15803d' }}>
                      ₹{(member.totalSavings || 0).toLocaleString('en-IN')}
                    </td>
                    <td>
                      {member.activeLoansCount > 0 ? (
                        <span className="badge badge-warning">
                          ₹{(member.totalOutstandingLoan || 0).toLocaleString('en-IN')} {t('remainingDue')}
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{t('noActiveLoan')}</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${member.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                        {member.status === 'active' ? t('active') : t('inactive')}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          title={t('viewDetails')}
                          onClick={() => handleOpenDetails(member)}
                        >
                          <Eye size={15} />
                        </button>

                        {isAdmin && (
                          <>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              title={t('edit')}
                              onClick={() => handleOpenEdit(member)}
                            >
                              <Edit3 size={15} />
                            </button>
                            <button
                              type="button"
                              className={`btn btn-sm ${member.status === 'active' ? 'btn-danger' : 'btn-secondary'}`}
                              title={member.status === 'active' ? t('deactivate') : t('activate')}
                              onClick={() => setConfirmToggleMember(member)}
                            >
                              {member.status === 'active' ? <X size={15} /> : <Check size={15} />}
                            </button>
                          </>
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

      {/* Add Member Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('addMemberModalTitle')}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmitAdd}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">{t('memberCode')} *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={formData.memberCode}
                      onChange={(e) => setFormData({ ...formData, memberCode: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('memberName')} *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sunita Patil"
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('phone')}</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9822012345"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('roleInGroup')}</label>
                    <select
                      className="form-select"
                      value={formData.roleInGroup}
                      onChange={(e) => setFormData({ ...formData, roleInGroup: e.target.value })}
                    >
                      <option value="सदस्य (Member)">{translateRole('member', language)}</option>
                      <option value="अध्यक्ष (President)">{translateRole('president', language)}</option>
                      <option value="सचिव (Secretary)">{translateRole('secretary', language)}</option>
                      <option value="खजिनदार (Treasurer)">{translateRole('treasurer', language)}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('joinDate')}</label>
                    <input
                      type="date"
                      className="form-input"
                      value={formData.joinDate}
                      onChange={(e) => setFormData({ ...formData, joinDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('bankAccountOptional')}</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 60129845721"
                      value={formData.bankAccount}
                      onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('addressLabel')}</label>
                  <textarea
                    rows="2"
                    className="form-textarea"
                    placeholder="e.g. Shivaji Nagar, Pune"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsAddModalOpen(false)}>
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

      {/* Edit Member Modal */}
      {isEditModalOpen && (
        <div className="modal-overlay" onClick={() => setIsEditModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('editMemberModalTitle')}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setIsEditModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmitEdit}>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">{t('memberCode')}</label>
                    <input
                      type="text"
                      disabled
                      className="form-input"
                      style={{ background: '#f1f5f2' }}
                      value={formData.memberCode}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('memberName')} *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('phone')}</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('roleInGroup')}</label>
                    <select
                      className="form-select"
                      value={formData.roleInGroup}
                      onChange={(e) => setFormData({ ...formData, roleInGroup: e.target.value })}
                    >
                      <option value="सदस्य (Member)">{translateRole('member', language)}</option>
                      <option value="अध्यक्ष (President)">{translateRole('president', language)}</option>
                      <option value="सचिव (Secretary)">{translateRole('secretary', language)}</option>
                      <option value="खजिनदार (Treasurer)">{translateRole('treasurer', language)}</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('addressLabel')}</label>
                  <textarea
                    rows="2"
                    className="form-textarea"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsEditModalOpen(false)}>
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

      {/* Member Details & Financial History Modal */}
      {memberDetailModal && (
        <div className="modal-overlay" onClick={() => setMemberDetailModal(null)}>
          <div className="modal-content" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="user-avatar" style={{ width: '40px', height: '40px', fontSize: '1.1rem' }}>
                  {memberDetailModal.member.name.charAt(0)}
                </div>
                <div>
                  <h3 className="modal-title">{memberDetailModal.member.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    {memberDetailModal.member.memberCode} • {translateRole(memberDetailModal.member.roleInGroup, language)}
                  </span>
                </div>
              </div>
              <button type="button" className="modal-close-btn" onClick={() => setMemberDetailModal(null)}>✕</button>
            </div>

            <div className="modal-body">
              {/* Member Summary Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
                <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600 }}>{t('totalSavingsDeposited')}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d' }}>
                    ₹{memberDetailModal.totalSavings.toLocaleString('en-IN')}
                  </div>
                </div>

                <div style={{ background: '#fef3c7', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid #fde68a' }}>
                  <div style={{ fontSize: '0.75rem', color: '#92400e', fontWeight: 600 }}>{t('attendanceRateLabel')}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#b45309' }}>
                    {memberDetailModal.attendanceRate}%
                  </div>
                </div>

                <div style={{ background: '#f1f5f9', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>{t('totalLoansCount')}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>
                    {memberDetailModal.loans.length}
                  </div>
                </div>
              </div>

              {/* Savings History Table */}
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#14532d', marginBottom: '8px' }}>
                {t('memberSavingsHistoryTitle')} ({memberDetailModal.savings.length})
              </h4>
              <div className="table-responsive" style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>{t('dateLabel')}</th>
                      <th>{t('monthCol')}</th>
                      <th>{t('paymentModeCol')}</th>
                      <th style={{ textAlign: 'right' }}>{t('amount')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {memberDetailModal.savings.map((s) => (
                      <tr key={s._id}>
                        <td>{new Date(s.transactionDate).toLocaleDateString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'mr-IN')}</td>
                        <td>{s.monthYear}</td>
                        <td>{translatePaymentMode(s.paymentMode, language)}</td>
                        <td style={{ textAlign: 'right', fontWeight: 700, color: '#15803d' }}>+₹{s.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-secondary btn-sm" onClick={() => setMemberDetailModal(null)}>
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmToggleMember}
        title={confirmToggleMember?.status === 'active' ? t('confirmDeactivateTitle') : t('confirmActivateTitle')}
        message={t('confirmDeactivateMsg')}
        confirmText={confirmToggleMember?.status === 'active' ? t('yesDeactivate') : t('yesActivate')}
        isDanger={confirmToggleMember?.status === 'active'}
        onConfirm={handleConfirmToggle}
        onCancel={() => setConfirmToggleMember(null)}
      />
    </div>
  );
};
