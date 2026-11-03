import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="lang-selector" title="भाषा निवडा / Select Language">
      <button
        type="button"
        className={`lang-btn ${language === 'mr' ? 'active' : ''}`}
        onClick={() => setLanguage('mr')}
      >
        मराठी
      </button>
      <button
        type="button"
        className={`lang-btn ${language === 'hi' ? 'active' : ''}`}
        onClick={() => setLanguage('hi')}
      >
        हिंदी
      </button>
      <button
        type="button"
        className={`lang-btn ${language === 'en' ? 'active' : ''}`}
        onClick={() => setLanguage('en')}
      >
        English
      </button>
    </div>
  );
};
