import React, { useState } from 'react';
import { ShieldCheck, Eye, EyeOff, Lock, Mail, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Login = ({ onLoginSuccess, onBackToHome }) => {
  const { login } = useAuth();
  const { t } = useLanguage();

  const [email, setEmail] = useState('admin@sakhisetu.org');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.message || t('errorMsg'));
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (type) => {
    if (type === 'admin') {
      setEmail('admin@sakhisetu.org');
      setPassword('admin123');
    } else {
      setEmail('meera@sakhisetu.org');
      setPassword('member123');
    }
    setError('');
  };

  return (
    <div style={{ maxWidth: '480px', margin: '40px auto', padding: '0 16px' }}>
      <button
        type="button"
        onClick={onBackToHome}
        className="btn btn-secondary btn-sm"
        style={{ marginBottom: '16px' }}
      >
        <ArrowLeft size={16} />
        <span>{t('backToHome')}</span>
      </button>

      <div className="card" style={{ boxShadow: 'var(--shadow-xl)', border: '1px solid rgba(22, 163, 74, 0.2)' }}>
        <div style={{ padding: '32px 28px', textAlign: 'center', background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)', borderBottom: '1px solid var(--border-light)' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #16a34a, #15803d)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', boxShadow: '0 8px 16px rgba(22, 163, 74, 0.25)' }}>
            <ShieldCheck size={32} />
          </div>
          <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#14532d', marginBottom: '4px' }}>
            {t('appName')} {t('login')}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            {t('loginSubTitle')}
          </p>
        </div>

        <div style={{ padding: '28px' }}>
          {error && (
            <div style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '18px', border: '1px solid #fca5a5' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Academic Demo Auto-fill Helper */}
          <div style={{ background: '#f8faf7', border: '1px dashed #86efac', padding: '12px', borderRadius: '10px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#15803d', marginBottom: '8px' }}>
              <Sparkles size={14} color="#f59e0b" />
              <span>{t('demoAccountsTitle')}</span>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.75rem', borderColor: '#bbf7d0', background: email === 'admin@sakhisetu.org' ? '#dcfce7' : 'white' }}
                onClick={() => handleDemoFill('admin')}
              >
                {t('demoAdminBtn')}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, fontSize: '0.75rem', borderColor: '#bbf7d0', background: email === 'meera@sakhisetu.org' ? '#dcfce7' : 'white' }}
                onClick={() => handleDemoFill('member')}
              >
                {t('demoMemberBtn')}
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={15} color="#15803d" />
                <span>{t('emailLabel')}</span>
              </label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="admin@sakhisetu.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={15} color="#15803d" />
                <span>{t('passwordLabel')}</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="form-input"
                  style={{ paddingRight: '42px' }}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '10px', fontSize: '0.95rem' }}
            >
              {loading ? t('loading') : t('login')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f2' }}>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {t('loginHelperText')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
