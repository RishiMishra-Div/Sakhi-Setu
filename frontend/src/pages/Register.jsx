import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, ShieldCheck, UserRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

export const Register = ({ onRegisterSuccess, onBackToHome, onNavigateLogin }) => {
  const { register } = useAuth();
  const { t } = useLanguage();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError(t('passwordsDontMatch'));
      return;
    }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password
      });
      onRegisterSuccess();
    } catch (registrationError) {
      setError(registrationError.message || t('errorMsg'));
    } finally {
      setLoading(false);
    }
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
            {t('appName')} {t('registerTitle')}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            {t('registerSubTitle')}
          </p>
        </div>

        <div style={{ padding: '28px' }}>
          {error && (
            <div role="alert" style={{ background: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '18px', border: '1px solid #fca5a5' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="register-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserRound size={15} color="#15803d" />
                <span>{t('registerNameLabel')}</span>
              </label>
              <input
                id="register-name"
                type="text"
                required
                maxLength={100}
                autoComplete="name"
                className="form-input"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-email" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={15} color="#15803d" />
                <span>{t('emailLabel')}</span>
              </label>
              <input
                id="register-email"
                type="email"
                required
                autoComplete="email"
                className="form-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-phone" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={15} color="#15803d" />
                <span>{t('phoneOptionalLabel')}</span>
              </label>
              <input
                id="register-phone"
                type="tel"
                autoComplete="tel"
                className="form-input"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-password" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={15} color="#15803d" />
                <span>{t('passwordLabel')}</span>
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="form-input"
                  style={{ paddingRight: '42px' }}
                  value={form.password}
                  onChange={(event) => setForm({ ...form, password: event.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}
                  aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="register-confirm-password" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Lock size={15} color="#15803d" />
                <span>{t('confirmPasswordLabel')}</span>
              </label>
              <input
                id="register-confirm-password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={8}
                autoComplete="new-password"
                className="form-input"
                value={form.confirmPassword}
                onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px', marginTop: '10px', fontSize: '0.95rem' }}
            >
              {loading ? t('loading') : t('createAccount')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f2' }}>
            <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {t('registrationAccessNotice')}
            </p>
            <button
              type="button"
              onClick={onNavigateLogin}
              className="btn btn-secondary btn-sm"
              style={{ marginTop: '12px' }}
            >
              {t('alreadyHaveAccount')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
