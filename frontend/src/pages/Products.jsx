import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  PlusCircle, 
  Search, 
  MessageCircle, 
  Trash2
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { ConfirmModal } from '../components/ConfirmModal';
import { translateCategory, translateTextItem } from '../services/translations';

export const Products = () => {
  const { isAdmin } = useAuth();
  const { t, language } = useLanguage();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inquiryModalProduct, setInquiryModalProduct] = useState(null);
  const [deleteConfirmProduct, setDeleteConfirmProduct] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Food / खाद्यपदार्थ',
    description: '',
    price: 100,
    unit: 'piece',
    imageUrl: '',
    makerName: '',
    contactPhone: '9822012345',
    availability: 'available'
  });

  // Inquiry Form
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [inquirySuccess, setInquirySuccess] = useState(false);

  const categories = [
    { id: 'All', label: t('allProductsTab') },
    { id: 'Food', label: t('foodTab') },
    { id: 'Handicrafts', label: t('handicraftsTab') },
    { id: 'Spices', label: t('spicesTab') },
    { id: 'Textiles', label: t('textilesTab') },
    { id: 'Cosmetics', label: t('cosmeticsTab') }
  ];

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts(selectedCategory, search);
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [selectedCategory, search]);

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      category: 'Food / खाद्यपदार्थ',
      description: '',
      price: 150,
      unit: language === 'en' ? '500g pack / 1 piece' : language === 'hi' ? '५०० ग्राम / १ नग' : '५०० ग्रॅम / १ नग',
      imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80',
      makerName: language === 'en' ? 'Sunita Patil (Member)' : 'सुनिता पाटील (सदस्य)',
      contactPhone: '9822012345',
      availability: 'available'
    });
    setIsAddModalOpen(true);
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.createProduct(formData);
      setIsAddModalOpen(false);
      loadProducts();
    } catch (err) {
      alert(err.message || t('errorMsg'));
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteConfirmProduct) return;
    try {
      await api.deleteProduct(deleteConfirmProduct._id);
      setDeleteConfirmProduct(null);
      loadProducts();
    } catch (err) {
      alert(err.message || t('errorMsg'));
    }
  };

  const handleSendInquiry = async (e) => {
    e.preventDefault();
    try {
      const res = await api.sendProductInquiry({
        productId: inquiryModalProduct._id,
        buyerName,
        buyerPhone,
        quantity
      });
      setInquirySuccess(true);
      if (res.whatsappUrl) {
        window.open(res.whatsappUrl, '_blank');
      }
    } catch (err) {
      alert(err.message || t('errorMsg'));
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <ShoppingBag size={24} color="#15803d" />
            <span>{t('productsTitle')}</span>
          </h1>
          <p className="page-subtitle">
            {t('productsSub')}
          </p>
        </div>

        {isAdmin && (
          <button type="button" className="btn btn-primary" onClick={handleOpenAddModal}>
            <PlusCircle size={18} />
            <span>{t('addProductBtn')}</span>
          </button>
        )}
      </div>

      {/* Category Pills & Search */}
      <div className="card" style={{ padding: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className={`btn btn-sm ${selectedCategory === c.id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ whiteSpace: 'nowrap' }}
                onClick={() => setSelectedCategory(c.id)}
              >
                {c.label}
              </button>
            ))}
          </div>

          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px' }}
              placeholder={t('searchProductPlaceholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          {t('loading')}
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <ShoppingBag size={48} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b' }}>{t('noProductsFound')}</h3>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>{t('tryAnotherCategory')}</p>
        </div>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <div key={product._id} className="product-card">
              <div style={{ position: 'relative' }}>
                <img src={product.imageUrl} alt={product.name} className="product-image" />
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmProduct(product)}
                    style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(255,255,255,0.9)', color: '#b91c1c', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }}
                    title={t('deleteProductTitle')}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="product-details">
                <span className="product-category">
                  {translateCategory(product.category, language)}
                </span>
                <h3 className="product-name">
                  {translateTextItem(product.name, language)}
                </h3>
                <p className="product-desc">{product.description}</p>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '12px', background: '#f8faf7', padding: '6px 10px', borderRadius: '6px' }}>
                  {t('craftedBy')} <strong>{product.makerName}</strong>
                </div>

                <div className="product-footer">
                  <div className="product-price">
                    ₹{product.price}
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748b', marginLeft: '4px' }}>
                      / {product.unit}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn btn-whatsapp btn-sm"
                    onClick={() => {
                      setInquiryModalProduct(product);
                      setInquirySuccess(false);
                    }}
                  >
                    <MessageCircle size={15} />
                    <span>{t('inquireWhatsapp')}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay" onClick={() => setIsAddModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('addProductBtn')}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setIsAddModalOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateProduct}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">{t('productNameLabel')}</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Homemade Mango Pickle / Cotton Bag"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                      <option value="Food / खाद्यपदार्थ">{translateCategory('Food', language)}</option>
                      <option value="Handicrafts / हस्तकला">{translateCategory('Handicrafts', language)}</option>
                      <option value="Spices / मसाले">{translateCategory('Spices', language)}</option>
                      <option value="Textiles / कापड व पिशव्या">{translateCategory('Textiles', language)}</option>
                      <option value="Cosmetics / घरगुती साबण व उत्पादने">{translateCategory('Cosmetics', language)}</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('priceLabel')}</label>
                    <input
                      type="number"
                      required
                      min="1"
                      className="form-input"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">{t('unitLabel')}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.unit}
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">{t('makerNameLabel')}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={formData.makerName}
                      onChange={(e) => setFormData({ ...formData, makerName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('imageUrlLabel')}</label>
                  <input
                    type="url"
                    className="form-input"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('descLabel')}</label>
                  <textarea
                    rows="3"
                    required
                    placeholder="Product specifications, ingredients and details..."
                    className="form-textarea"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

      {/* Inquiry Modal */}
      {inquiryModalProduct && (
        <div className="modal-overlay" onClick={() => setInquiryModalProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">{t('inquiryModalTitle')}</h3>
              <button type="button" className="modal-close-btn" onClick={() => setInquiryModalProduct(null)}>✕</button>
            </div>
            <form onSubmit={handleSendInquiry}>
              <div className="modal-body">
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center', background: '#f8faf7', padding: '12px', borderRadius: '10px', marginBottom: '16px' }}>
                  <img src={inquiryModalProduct.imageUrl} alt={inquiryModalProduct.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{translateTextItem(inquiryModalProduct.name, language)}</h4>
                    <p style={{ fontSize: '0.9rem', color: '#15803d', fontWeight: 800 }}>₹{inquiryModalProduct.price} / {inquiryModalProduct.unit}</p>
                    <p style={{ fontSize: '0.75rem', color: '#64748b' }}>{t('craftedBy')} {inquiryModalProduct.makerName}</p>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">{t('yourNameLabel')}</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('yourPhoneLabel')}</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    value={buyerPhone}
                    onChange={(e) => setBuyerPhone(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">{t('quantityLabel')}</label>
                  <input
                    type="number"
                    min="1"
                    className="form-input"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                {inquirySuccess && (
                  <div style={{ background: '#dcfce7', color: '#14532d', padding: '10px', borderRadius: '8px', fontSize: '0.85rem' }}>
                    ✅ {t('inquirySuccessMsg')}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setInquiryModalProduct(null)}>
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

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!deleteConfirmProduct}
        title={t('deleteProductTitle')}
        message={t('deleteProductMsg')}
        confirmText={t('yesDelete')}
        onConfirm={handleDeleteProduct}
        onCancel={() => setDeleteConfirmProduct(null)}
      />
    </div>
  );
};
