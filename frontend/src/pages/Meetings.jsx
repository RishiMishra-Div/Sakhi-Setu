import React, { useState, useEffect } from 'react';
import { 
  CalendarCheck, 
  PlusCircle, 
  MapPin, 
  Clock, 
  Save
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { translateTextItem } from '../services/translations';

export const Meetings = () => {
  const { isAdmin } = useAuth();
  const { t, language } = useLanguage();

  const [meetings, setMeetings] = useState([]);
  const [selectedMeetingId, setSelectedMeetingId] = useState(null);
  const [meetingDetail, setMeetingDetail] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingAttendance, setSavingAttendance] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Schedule Meeting Modal
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [newMeetingData, setNewMeetingData] = useState({
    title: '',
    meetingDate: new Date().toISOString().split('T')[0],
    startTime: '04:00 PM',
    location: '',
    agenda: '',
    notes: ''
  });

  const loadMeetings = async () => {
    try {
      setLoading(true);
      const data = await api.getMeetings();
      setMeetings(data);
      if (data.length > 0 && !selectedMeetingId) {
        setSelectedMeetingId(data[0]._id);
      }
    } catch (err) {
      console.error('Failed to load meetings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, []);

  useEffect(() => {
    if (!selectedMeetingId) return;

    const loadMeetingAttendance = async () => {
      try {
        const data = await api.getMeetingById(selectedMeetingId);
        setMeetingDetail(data.meeting);
        setAttendanceList(data.attendance);
      } catch (err) {
        console.error('Failed to load meeting details:', err);
      }
    };

    loadMeetingAttendance();
  }, [selectedMeetingId]);

  const handleOpenScheduleModal = () => {
    setNewMeetingData({
      title: language === 'en' ? 'Monthly Bachat Meeting' : language === 'hi' ? 'मासिक बचत बैठक' : 'मासिक बचत सभा',
      meetingDate: new Date().toISOString().split('T')[0],
      startTime: '04:00 PM',
      location: language === 'en' ? 'Community Hall, Shivaji Nagar, Pune' : 'समाज मंदिर हॉल, शिवाजी नगर, पुणे',
      agenda: language === 'en' 
        ? 'Monthly savings collection\nReview loan repayment status\nDiwali exhibition stall planning'
        : language === 'hi'
        ? 'मासिक बचत संग्रह\nऋण पुनर्भुगतान समीक्षा\nदिवाली प्रदर्शनी स्टॉल तैयारी'
        : 'मासिक बचत गोळा करणे\nकर्ज वाटप व परतफेड आढावा\nदिवाळी प्रदर्शन स्टॉल नियोजन',
      notes: ''
    });
    setIsScheduleModalOpen(true);
  };

  const handleStatusChange = (memberId, newStatus) => {
    setAttendanceList((prev) =>
      prev.map((item) => (item.memberId === memberId ? { ...item, status: newStatus } : item))
    );
  };

  const handleNoteChange = (memberId, newNote) => {
    setAttendanceList((prev) =>
      prev.map((item) => (item.memberId === memberId ? { ...item, note: newNote } : item))
    );
  };

  const handleSaveAttendance = async () => {
    try {
      setSavingAttendance(true);
      setSuccessMsg('');
      const records = attendanceList.map((item) => ({
        memberId: item.memberId,
        status: item.status,
        note: item.note
      }));

      await api.saveMeetingAttendance(selectedMeetingId, records);
      setSuccessMsg(t('attendanceSavedSuccess'));
      loadMeetings();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.message || t('errorMsg'));
    } finally {
      setSavingAttendance(false);
    }
  };

  const handleCreateMeeting = async (e) => {
    e.preventDefault();
    try {
      const created = await api.createMeeting(newMeetingData);
      setIsScheduleModalOpen(false);
      await loadMeetings();
      setSelectedMeetingId(created._id);
    } catch (err) {
      alert(err.message || t('errorMsg'));
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <CalendarCheck size={24} color="#15803d" />
            <span>{t('meetingsTitle')}</span>
          </h1>
          <p className="page-subtitle">
            {t('meetingsSub')}
          </p>
        </div>

        {isAdmin && (
          <button type="button" className="btn btn-primary" onClick={handleOpenScheduleModal}>
            <PlusCircle size={18} />
            <span>{t('scheduleMeetingBtn')}</span>
          </button>
        )}
      </div>

      {/* 2-Column: Left list of meetings, Right attendance sheet */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        {/* Left Column: Meetings Selector */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">{t('meetingsListTitle')} ({meetings.length})</h3>
          </div>
          <div className="card-body" style={{ padding: '12px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {meetings.map((m) => {
                const isSelected = m._id === selectedMeetingId;
                const isUpcoming = m.status === 'upcoming';
                return (
                  <div
                    key={m._id}
                    onClick={() => setSelectedMeetingId(m._id)}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      border: isSelected ? '2px solid #16a34a' : '1px solid #e2e8f0',
                      background: isSelected ? '#f0fdf4' : '#ffffff',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span className={`badge ${isUpcoming ? 'badge-warning' : 'badge-success'}`}>
                        {isUpcoming ? t('upcomingMeetingBadge') : t('completedMeetingBadge')}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>
                        {new Date(m.meetingDate).toLocaleDateString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'mr-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b', marginBottom: '4px' }}>
                      {translateTextItem(m.title, language)}
                    </h4>

                    <p style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} color="#16a34a" /> {m.location}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Attendance Sheet for Selected Meeting */}
        <div className="card" style={{ gridColumn: 'span 2' }}>
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 className="card-title">
                {translateTextItem(meetingDetail?.title, language) || t('attendanceSheetTitle')}
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {t('dateLabel')}: {meetingDetail ? new Date(meetingDetail.meetingDate).toLocaleDateString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'mr-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : ''} • {t('timeLabel')}: {meetingDetail?.startTime}
              </p>
            </div>

            {isAdmin && (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                disabled={savingAttendance}
                onClick={handleSaveAttendance}
              >
                <Save size={16} />
                <span>{savingAttendance ? t('loading') : t('saveAttendanceBtn')}</span>
              </button>
            )}
          </div>

          <div className="card-body" style={{ padding: 0 }}>
            {successMsg && (
              <div style={{ margin: '14px', background: '#dcfce7', color: '#14532d', padding: '10px 14px', borderRadius: '8px', fontSize: '0.88rem', fontWeight: 600 }}>
                ✅ {successMsg}
              </div>
            )}

            {/* Attendance Summary Count */}
            <div style={{ display: 'flex', gap: '16px', padding: '12px 20px', background: '#f8faf7', borderBottom: '1px solid #e2e8f0', fontSize: '0.85rem', flexWrap: 'wrap' }}>
              <span>
                {t('totalMembersCount')} <strong>{attendanceList.length}</strong>
              </span>
              <span style={{ color: '#15803d' }}>
                {t('presentCount')} <strong>{attendanceList.filter((a) => a.status === 'present').length}</strong>
              </span>
              <span style={{ color: '#b91c1c' }}>
                {t('absentCount')} <strong>{attendanceList.filter((a) => a.status === 'absent').length}</strong>
              </span>
              <span style={{ color: '#b45309' }}>
                {t('leaveCount')} <strong>{attendanceList.filter((a) => a.status === 'excused').length}</strong>
              </span>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>{t('memberCode')}</th>
                    <th>{t('memberName')}</th>
                    <th>{t('phone')}</th>
                    <th>{t('status')}</th>
                    <th>{t('noteCol')}</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceList.map((item) => (
                    <tr key={item.memberId}>
                      <td style={{ fontWeight: 600, color: '#15803d' }}>{item.memberCode}</td>
                      <td style={{ fontWeight: 600 }}>{item.name}</td>
                      <td style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.phone || '-'}</td>
                      <td>
                        {isAdmin ? (
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              type="button"
                              className={`btn btn-sm ${item.status === 'present' ? 'btn-primary' : 'btn-secondary'}`}
                              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                              onClick={() => handleStatusChange(item.memberId, 'present')}
                            >
                              {t('present')}
                            </button>
                            <button
                              type="button"
                              className={`btn btn-sm ${item.status === 'absent' ? 'btn-danger' : 'btn-secondary'}`}
                              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                              onClick={() => handleStatusChange(item.memberId, 'absent')}
                            >
                              {t('absent')}
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm"
                              style={{ padding: '4px 10px', fontSize: '0.75rem', background: item.status === 'excused' ? '#fef3c7' : 'white', color: item.status === 'excused' ? '#b45309' : 'inherit', border: '1px solid #e2e8f0' }}
                              onClick={() => handleStatusChange(item.memberId, 'excused')}
                            >
                              {t('excused')}
                            </button>
                          </div>
                        ) : (
                          <span className={`badge ${item.status === 'present' ? 'badge-success' : item.status === 'absent' ? 'badge-danger' : 'badge-warning'}`}>
                            {item.status === 'present' ? t('present') : item.status === 'absent' ? t('absent') : t('excused')}
                          </span>
                        )}
                      </td>
                      <td>
                        {isAdmin ? (
                          <input
                            type="text"
                            placeholder={t('noteOrReason')}
                            className="form-input"
                            style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                            value={item.note || ''}
                            onChange={(e) => handleNoteChange(item.memberId, e.target.value)}
                          />
                        ) : (
                          <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{item.note || '-'}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Meeting Modal */}
      {isScheduleModalOpen && (
        <div className="modal-overlay" onClick={() => setIsScheduleModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('scheduleMeetingBtn')}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setIsScheduleModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateMeeting}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">{t('meetingTitleLabel')}</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={newMeetingData.title}
                    onChange={(e) => setNewMeetingData({ ...newMeetingData, title: e.target.value })}
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">{t('meetingDateLabel')}</label>
                    <input
                      type="date"
                      required
                      className="form-input"
                      value={newMeetingData.meetingDate}
                      onChange={(e) => setNewMeetingData({ ...newMeetingData, meetingDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('meetingTimeLabel')}</label>
                    <input
                      type="text"
                      required
                      placeholder="04:00 PM"
                      className="form-input"
                      value={newMeetingData.startTime}
                      onChange={(e) => setNewMeetingData({ ...newMeetingData, startTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('locationFieldLabel')}</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={newMeetingData.location}
                    onChange={(e) => setNewMeetingData({ ...newMeetingData, location: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('agendaFieldLabel')}</label>
                  <textarea
                    rows="3"
                    className="form-textarea"
                    value={newMeetingData.agenda}
                    onChange={(e) => setNewMeetingData({ ...newMeetingData, agenda: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setIsScheduleModalOpen(false)}>
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
