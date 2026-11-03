import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText, cancelText, isDanger = true }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-content" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ color: isDanger ? '#b91c1c' : '#d97706' }}>
              <AlertTriangle size={24} />
            </div>
            <h3 className="modal-title">{title || 'Confirm Action'}</h3>
          </div>
          <button type="button" className="modal-close-btn" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' }}>
            {message}
          </p>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary btn-sm" onClick={onCancel}>
            {cancelText || t('cancel')}
          </button>
          <button
            type="button"
            className={`btn ${isDanger ? 'btn-danger' : 'btn-primary'} btn-sm`}
            onClick={onConfirm}
          >
            {confirmText || t('submit')}
          </button>
        </div>
      </div>
    </div>
  );
};
