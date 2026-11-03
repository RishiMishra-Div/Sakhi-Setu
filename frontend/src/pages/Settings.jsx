import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Building, 
  KeyRound, 
  Save, 
  Globe
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Settings = () => {
  const { user, isAdmin } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [groupData, setGroupData] = useState({
    name: '',
    registrationNumber: '',
    village: '',
    district: '',
    leaderName: '',
    leaderPhone: '',
    secretaryName: '',
    treasurerName: '',
    monthlyContribution: 500,
    meetingSchedule: '',
    bankDetails: {
      bankName: '',
      accountNumber: '',
      ifscCode: '',
      branch: ''
    }
  });

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(true);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');

  const loadGroup = async () => {
    try {
      setLoading(true);
      const data = await api.getGroup();
      setGroupData(data);
    } catch (err) {
      console.error('Failed to load group settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroup();
  }, []);

  const handleSaveGroup = async (e) => {
    e.preventDefault();
    try {
      await api.updateGroup(groupData);
      setSaveSuccess(t('successMsg'));
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      alert(err.message || t('errorMsg'));
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');

    if (newPassword !== confirmPassword) {
      setPwdError(language === 'en' ? 'New passwords do not match' : language === 'hi' ? 'नए पासवर्ड मेल नहीं खाते' : 'नवीन पासवर्ड जुळत नाही');
      return;
    }

    try {
      await api.changePassword(currentPassword, newPassword);
      setPwdSuccess(language === 'en' ? 'Password updated successfully!' : language === 'hi' ? 'पासवर्ड सफलतापूर्वक बदल दिया गया!' : 'पासवर्ड यशस्वीरीत्या बदलला गेला!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPwdSuccess(''), 4000);
    } catch (err) {
      setPwdError(err.message || t('errorMsg'));
    }
  };

  if (loading) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>{t('loading')}</div>;
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <SettingsIcon size={24} color="#15803d" />
            <span>{t('settingsTitle')}</span>
          </h1>
          <p className="page-subtitle">
            {t('settingsSub')}
          </p>
        </div>
      </div>

      {saveSuccess && (
        <div style={{ background: '#dcfce7', color: '#14532d', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontWeight: 600 }}>
          ✅ {saveSuccess}
        </div>
      )}

      {/* Language Preference Card */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">
            <Globe size={18} color="#15803d" />
            <span>{t('langSelectTitle')}</span>
          </h3>
        </div>
        <div className="card-body">
          <p style={{ fontSize: '0.88rem', color: '#64748b', marginBottom: '14px' }}>
            {t('langSelectDesc')}
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className={`btn ${language === 'mr' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setLanguage('mr')}
            >
              🚩 मराठी (Marathi)
            </button>
            <button
              type="button"
              className={`btn ${language === 'hi' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setLanguage('hi')}
            >
              🇮🇳 हिंदी (Hindi)
            </button>
            <button
              type="button"
              className={`btn ${language === 'en' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setLanguage('en')}
            >
              🌐 English
            </button>
          </div>
        </div>
      </div>

      {/* Group Information Form (Admin Only can edit) */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div className="card-header">
          <h3 className="card-title">
            <Building size={18} color="#15803d" />
            <span>{t('officialInfoTitle')}</span>
          </h3>
          {!isAdmin && (
            <span className="badge badge-info">{t('adminOnlyEditBadge')}</span>
          )}
        </div>
        <div className="card-body">
          <form onSubmit={handleSaveGroup}>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">{t('groupNameLabel')}</label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  className="form-input"
                  value={groupData.name}
                  onChange={(e) => setGroupData({ ...groupData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('regNumLabel')}</label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  className="form-input"
                  value={groupData.registrationNumber}
                  onChange={(e) => setGroupData({ ...groupData, registrationNumber: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('villageLabel')}</label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  className="form-input"
                  value={groupData.village}
                  onChange={(e) => setGroupData({ ...groupData, village: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('districtLabel')}</label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  className="form-input"
                  value={groupData.district}
                  onChange={(e) => setGroupData({ ...groupData, district: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('leaderNameLabel')}</label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  className="form-input"
                  value={groupData.leaderName}
                  onChange={(e) => setGroupData({ ...groupData, leaderName: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('leaderPhoneLabel')}</label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  className="form-input"
                  value={groupData.leaderPhone}
                  onChange={(e) => setGroupData({ ...groupData, leaderPhone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('monthlySavingsAmountLabel')}</label>
                <input
                  type="number"
                  disabled={!isAdmin}
                  className="form-input"
                  value={groupData.monthlyContribution}
                  onChange={(e) => setGroupData({ ...groupData, monthlyContribution: Number(e.target.value) })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('regularMeetingScheduleLabel')}</label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  className="form-input"
                  value={groupData.meetingSchedule}
                  onChange={(e) => setGroupData({ ...groupData, meetingSchedule: e.target.value })}
                />
              </div>
            </div>

            {/* Bank Details Sub-section */}
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#14532d', marginTop: '14px', marginBottom: '12px' }}>
              {t('bankDetailsHeader')}
            </h4>

            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">{t('bankNameLabel')}</label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  className="form-input"
                  value={groupData.bankDetails?.bankName || ''}
                  onChange={(e) => setGroupData({ ...groupData, bankDetails: { ...groupData.bankDetails, bankName: e.target.value } })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('accountNumberLabel')}</label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  className="form-input"
                  value={groupData.bankDetails?.accountNumber || ''}
                  onChange={(e) => setGroupData({ ...groupData, bankDetails: { ...groupData.bankDetails, accountNumber: e.target.value } })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('ifscCodeLabel')}</label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  className="form-input"
                  value={groupData.bankDetails?.ifscCode || ''}
                  onChange={(e) => setGroupData({ ...groupData, bankDetails: { ...groupData.bankDetails, ifscCode: e.target.value } })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{t('branchLabel')}</label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  className="form-input"
                  value={groupData.bankDetails?.branch || ''}
                  onChange={(e) => setGroupData({ ...groupData, bankDetails: { ...groupData.bankDetails, branch: e.target.value } })}
                />
              </div>
            </div>

            {isAdmin && (
              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn btn-primary btn-sm">
                  <Save size={16} />
                  <span>{t('saveInfoBtn')}</span>
                </button>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Password Change Card */}
      {user && (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <KeyRound size={18} color="#15803d" />
              <span>{t('securityHeader')}</span>
            </h3>
          </div>
          <div className="card-body">
            {pwdSuccess && (
              <div style={{ background: '#dcfce7', color: '#14532d', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px' }}>
                ✅ {pwdSuccess}
              </div>
            )}
            {pwdError && (
              <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '14px' }}>
                ⚠️ {pwdError}
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">{t('currentPasswordLabel')}</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('newPasswordLabel')}</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('confirmPasswordLabel')}</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="submit" className="btn btn-primary btn-sm">
                  <span>{t('updatePasswordBtn')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
