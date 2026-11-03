import React, { useState, useEffect } from 'react';
import { 
  Users, 
  PiggyBank, 
  ShoppingBag, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  MessageCircle, 
  Sparkles,
  HeartHandshake,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { api } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { translateCategory, translateNoticeCategory, translateTextItem } from '../services/translations';

export const PublicHome = ({ onNavigateLogin, onNavigateProducts }) => {
  const { t, language } = useLanguage();
  const [products, setProducts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryQty, setInquiryQty] = useState(1);
  const [inquirySuccess, setInquirySuccess] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodData, annData] = await Promise.all([
          api.getProducts(),
          api.getAnnouncements()
        ]);
        setProducts(prodData.slice(0, 4));
        setAnnouncements(annData.slice(0, 3));
      } catch (err) {
        console.error('Failed to load public data:', err);
      }
    };
    fetchData();
  }, []);

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !inquiryName || !inquiryPhone) return;

    try {
      const res = await api.sendProductInquiry({
        productId: selectedProduct._id,
        buyerName: inquiryName,
        buyerPhone: inquiryPhone,
        quantity: inquiryQty
      });
      setInquirySuccess(res);
      if (res.whatsappUrl) {
        window.open(res.whatsappUrl, '_blank');
      }
    } catch (error) {
      alert(error.message || 'Error sending inquiry');
    }
  };

  const getUpcomingMeetingName = () => {
    if (language === 'en') return 'Monthly Savings Meeting - 26 October 2026';
    if (language === 'hi') return 'मासिक बचत बैठक - २६ अक्टूबर २०२६';
    return 'मासिक बचत सभा - २६ ऑक्टोबर २०२६';
  };

  const getMeetingLocation = () => {
    if (language === 'en') return 'Community Hall, Shivaji Nagar, Pune';
    if (language === 'hi') return 'समाज मंदिर हॉल, शिवाजी नगर, पुणे';
    return 'समाज मंदिर हॉल, शिवाजी नगर, पुणे';
  };

  const getMeetingTimeNotice = () => {
    if (language === 'en') return 'Time: 4:00 PM • Attendance mandatory for all members';
    if (language === 'hi') return 'समय: दोपहर ४:०० बजे • सभी सदस्यों की उपस्थिति अनिवार्य';
    return 'वेळ: दुपारी ४:०० वाजता • सर्व सदस्यांची उपस्थिती अनिवार्य';
  };

  const getMeetingSummaryDesc = () => {
    if (language === 'en') return 'Meetings review monthly member savings, process loan applications, and introduce government livelihood welfare schemes.';
    if (language === 'hi') return 'बैठक में महिलाओं की बचत प्रविष्टि, ऋण समीक्षा और आगामी सरकारी योजनाओं का मार्गदर्शन किया जाता है।';
    return 'सभांमध्ये महिलांच्या बचतीची नोंद, कर्ज परतफेड आढावा आणि आगामी शासकीय योजनांचे मार्गदर्शन केले जाते.';
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Hero Banner */}
      <div 
        style={{
          background: 'linear-gradient(135deg, #14532d 0%, #166534 60%, #15803d 100%)',
          borderRadius: '24px',
          padding: '48px 36px',
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 30px -10px rgba(20, 83, 45, 0.3)',
          marginBottom: '36px'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '750px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', padding: '6px 14px', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px' }}>
            <Sparkles size={16} color="#fbbf24" />
            <span>{t('heroTag')}</span>
          </div>

          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px', letterSpacing: '-0.02em' }}>
            {t('appName')} – {t('slogan')}
          </h1>

          <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.6, marginBottom: '28px', maxWidth: '650px' }}>
            {t('heroDesc')}
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onNavigateLogin}
              className="btn btn-primary"
              style={{ background: '#f59e0b', color: '#000', fontWeight: 700, padding: '12px 26px', fontSize: '1rem', border: 'none' }}
            >
              <ShieldCheck size={20} />
              <span>{t('heroAdminBtn')}</span>
            </button>

            <button
              type="button"
              onClick={onNavigateProducts}
              className="btn btn-secondary"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'white', borderColor: 'rgba(255,255,255,0.3)', padding: '12px 24px' }}
            >
              <ShoppingBag size={20} />
              <span>{t('heroProductsBtn')}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Decorative Lotus Motif */}
        <div style={{ position: 'absolute', right: '-40px', bottom: '-40px', opacity: 0.1, pointerEvents: 'none' }}>
          <svg width="400" height="400" viewBox="0 0 100 100" fill="white">
            <circle cx="50" cy="50" r="48" />
            <path d="M50 20 C35 35 25 50 25 70 C25 85 35 90 50 90 C65 90 75 85 75 70 C75 50 65 35 50 20 Z" />
          </svg>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <div className="card" style={{ padding: '24px', borderLeft: '4px solid #16a34a' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d', marginBottom: '14px' }}>
            <PiggyBank size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#14532d', marginBottom: '8px' }}>
            {t('feat1Title')}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5 }}>
            {t('feat1Desc')}
          </p>
        </div>

        <div className="card" style={{ padding: '24px', borderLeft: '4px solid #d97706' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309', marginBottom: '14px' }}>
            <TrendingUp size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#14532d', marginBottom: '8px' }}>
            {t('feat2Title')}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5 }}>
            {t('feat2Desc')}
          </p>
        </div>

        <div className="card" style={{ padding: '24px', borderLeft: '4px solid #0284c7' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0369a1', marginBottom: '14px' }}>
            <ShoppingBag size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#14532d', marginBottom: '8px' }}>
            {t('feat3Title')}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5 }}>
            {t('feat3Desc')}
          </p>
        </div>

        <div className="card" style={{ padding: '24px', borderLeft: '4px solid #8b5cf6' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed', marginBottom: '14px' }}>
            <HeartHandshake size={24} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#14532d', marginBottom: '8px' }}>
            {t('feat4Title')}
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.5 }}>
            {t('feat4Desc')}
          </p>
        </div>
      </div>

      {/* Featured Products Showcase */}
      <div className="card" style={{ marginBottom: '40px' }}>
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 className="card-title">
              <ShoppingBag size={20} color="#16a34a" />
              <span>{t('productsTitle')}</span>
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              {t('productsSub')}
            </p>
          </div>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onNavigateProducts}
          >
            <span>{t('viewAll')} ({products.length}+)</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="card-body">
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="product-card">
                <img src={product.imageUrl} alt={product.name} className="product-image" />
                <div className="product-details">
                  <span className="product-category">
                    {translateCategory(product.category, language)}
                  </span>
                  <h3 className="product-name">
                    {translateTextItem(product.name, language)}
                  </h3>
                  <p className="product-desc">{product.description}</p>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '8px' }}>
                    {t('craftedBy')} <strong>{product.makerName}</strong>
                  </p>
                  <div className="product-footer">
                    <div className="product-price">
                      ₹{product.price} <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b' }}>/ {product.unit}</span>
                    </div>
                    <button
                      type="button"
                      className="btn btn-whatsapp btn-sm"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <MessageCircle size={15} />
                      <span>{t('inquireWhatsapp')}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Announcements & Meetings */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <Calendar size={18} color="#15803d" />
              <span>{t('nextMeetingDetails')}</span>
            </h3>
          </div>
          <div className="card-body">
            <div style={{ padding: '16px', background: '#f0fdf4', borderRadius: '12px', border: '1px solid #bbf7d0', marginBottom: '14px' }}>
              <span className="badge badge-success" style={{ marginBottom: '8px' }}>{t('upcomingMeetingBadge')}</span>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#14532d', marginBottom: '4px' }}>
                {getUpcomingMeetingName()}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <MapPin size={15} color="#16a34a" /> {getMeetingLocation()}
              </p>
              <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
                {getMeetingTimeNotice()}
              </p>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
              {getMeetingSummaryDesc()}
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <CheckCircle2 size={18} color="#d97706" />
              <span>{t('recentAnnouncements')}</span>
            </h3>
          </div>
          <div className="card-body">
            {announcements.map((item) => (
              <div key={item._id} style={{ paddingBottom: '12px', marginBottom: '12px', borderBottom: '1px solid #f1f5f2' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                  <span className={`badge ${item.priority === 'high' ? 'badge-danger' : 'badge-info'}`} style={{ fontSize: '0.7rem' }}>
                    {item.priority === 'high' ? t('urgentPriority') : t('normalPriority')}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    {new Date(item.postedDate).toLocaleDateString(language === 'en' ? 'en-US' : language === 'hi' ? 'hi-IN' : 'mr-IN')}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 600, color: '#1e293b', marginBottom: '3px' }}>
                  {translateTextItem(item.title, language)}
                </h4>
                <p style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.4 }}>
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Inquiry Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('inquiryModalTitle')}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setSelectedProduct(null)}>✕</button>
            </div>
            <form onSubmit={handleInquirySubmit}>
              <div className="modal-body">
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', background: '#f8faf7', padding: '12px', borderRadius: '10px', marginBottom: '18px' }}>
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{translateTextItem(selectedProduct.name, language)}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#15803d', fontWeight: 700 }}>₹{selectedProduct.price} / {selectedProduct.unit}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('craftedBy')} {selectedProduct.makerName}</p>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('yourNameLabel')}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Shinde"
                    className="form-input"
                    value={inquiryName}
                    onChange={(e) => setInquiryName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('yourPhoneLabel')}</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9823000000"
                    className="form-input"
                    value={inquiryPhone}
                    onChange={(e) => setInquiryPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('quantityLabel')}</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={inquiryQty}
                    onChange={(e) => setInquiryQty(e.target.value)}
                  />
                </div>

                {inquirySuccess && (
                  <div style={{ background: '#dcfce7', color: '#14532d', padding: '10px', borderRadius: '8px', fontSize: '0.85rem', marginTop: '10px' }}>
                    ✅ {t('inquirySuccessMsg')}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setSelectedProduct(null)}>
                  {t('cancel')}
                </button>
                <button type="submit" className="btn btn-whatsapp btn-sm">
                  <MessageCircle size={16} />
                  <span>{t('sendWhatsappBtn')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
