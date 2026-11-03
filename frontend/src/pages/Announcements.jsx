import React, { useState, useEffect } from 'react';
import { 
  BellRing, 
  PlusCircle, 
  Calendar, 
  Trash2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { translateNoticeCategory, translateTextItem } from '../services/translations';

export const Announcements = () => {
  const { isAdmin } = useAuth();
  const { t, language } = useLanguage();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteConfirmAnn, setDeleteConfirmAnn] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: 'Meeting Notice / सभा सूचना',
    priority: 'normal'
  });

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await api.getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error('Failed to load announcements:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await api.createAnnouncement(formData);
      setIsAddModalOpen(false);
      setFormData({
        title: '',
        body: '',
        category: 'Meeting Notice / सभा सूचना',
        priority: 'normal'
      });
      loadAnnouncements();
    } catch (err) {
      alert(err.message || t('errorMsg'));
    }
  };

  const handleDeleteAnnouncement = async () => {
    if (!deleteConfirmAnn) return;
    try {
      await api.deleteAnnouncement(deleteConfirmAnn._id);
      setDeleteConfirmAnn(null);
      loadAnnouncements();
    } catch (err) {
      alert(err.message || t('errorMsg'));
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <BellRing size={24} color="#d97706" />
            <span>{t('announcementsTitle')}</span>
          </h1>
          <p className="page-subtitle">
            {t('announcementsSub')}
          </p>
        </div>

        {isAdmin && (
          <button type="button" className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
            <PlusCircle size={18} />
            <span>{t('addNoticeBtn')}</span>
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          {t('loading')}
        </div>
      ) : announcements.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <BellRing size={48} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{t('noNoticesAvailable')}</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {announcements.map((ann) => {
            const isHigh = ann.priority === 'high';
            return (
              <div
                key={ann._id}
                className="card"
                style={{
                  borderLeft: isHigh ? '5px solid #dc2626' : '5px solid #16a34a',
                  marginBottom: 0
                }}
              >
                <div className="card-header" style={{ background: isHigh ? '#fef2f2' : '#fafdfa' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className={`badge ${isHigh ? 'badge-danger' : 'badge-info'}`}>
                      {isHigh ? t('urgentPriority') : t('normalPriority')}
                    </span>
                    <span className="badge badge-success" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                      {translateNoticeCategory(ann.category, language)}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} /> {new Date(ann.postedDate).toLocaleDateString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'mr-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmAnn(ann)}
                        className="btn btn-secondary btn-sm"
                        style={{ color: '#b91c1c', padding: '4px 8px' }}
                        title={t('deleteNoticeTitle')}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="card-body">
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1e293b', marginBottom: '8px' }}>
                    {translateTextItem(ann.title, language)}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                    {ann.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Announcement Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('postNoticeModalTitle')}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateAnnouncement}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">{t('noticeTitleLabel')}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Monthly Meeting Notice / Contribution Deadline"
                    className="form-input"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">{t('categoryLabel')}</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Meeting Notice / सभा सूचना">{translateNoticeCategory('Meeting Notice', language)}</option>
                      <option value="Financial / आर्थिक सूचना">{translateNoticeCategory('Financial', language)}</option>
                      <option value="Government Scheme / शासकीय योजना">{translateNoticeCategory('Government Scheme', language)}</option>
                      <option value="Exhibition / प्रदर्शन व विक्री">{translateNoticeCategory('Exhibition', language)}</option>
                      <option value="General / सामान्य">{translateNoticeCategory('General', language)}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('priorityLabel')}</label>
                    <select
                      className="form-select"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="normal">{t('normalPriority')}</option>
                      <option value="high">{t('urgentPriority')}</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('noticeContentLabel')}</label>
                  <textarea
                    rows="4"
                    required
                    placeholder="Write detailed announcement text for members..."
                    className="form-textarea"
                    value={formData.body}
                    onChange={(e) => setFormData({ ...formData, body: e.target.value })}
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirmAnn}
        title={t('deleteNoticeTitle')}
        message={t('deleteNoticeMsg')}
        confirmText={t('yesDelete')}
        onConfirm={handleDeleteAnnouncement}
        onCancel={() => setDeleteConfirmAnn(null)}
      />
    </div>
  );
};
