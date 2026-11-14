import React from 'react';
import type { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import './ProductPage.css';

interface Props {
  product: Product;
}

const ProductPage: React.FC<Props> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setCurrentPage, setSelectedProduct, openLeadModal } = useStore();
  const inWishlist = isInWishlist(product.id);

  const handleBack = () => {
    setSelectedProduct(null);
    setCurrentPage(product.gender === 'female' ? 'women' : product.gender === 'male' ? 'men' : 'collections');
  };

  return (
    <div className="product-page">
      <div className="container product-page__container">
        <button className="product-page__back" onClick={handleBack}>
          ← Вернуться в каталог
        </button>

        <div className="product-page__layout">
          {/* Left: Product Imagery */}
          <div className="product-page__imagery">
            <div className="product-page__img-main">
              <img src={product.image} alt={product.name} />
            </div>
            {product.hoverImage && (
              <div className="product-page__img-secondary">
                <img src={product.hoverImage} alt={`${product.name} — дополнительный ракурс`} />
              </div>
            )}
          </div>

          {/* Right: Editorial Information & Actions */}
          <div className="product-page__info">
            <div className="product-page__meta">
              <span className="text-overline">{product.type}</span>
              <span className="product-page__collection-tag">КОЛЛЕКЦИЯ KUZEL</span>
            </div>

            <h1 className="heading-lg product-page__title">{product.name}</h1>

            <div className="product-page__price-wrap">
              <span className="product-page__price">{product.price}</span>
            </div>

            <p className="product-page__desc text-editorial">
              {product.description}
            </p>

            {/* Specifications */}
            <div className="product-page__specs">
              <div className="product-page__spec">
                <span className="product-page__spec-label">ОТТЕНОК</span>
                <span className="product-page__spec-val">{product.color}</span>
              </div>
              <div className="product-page__spec">
                <span className="product-page__spec-label">ПОШИВ</span>
                <span className="product-page__spec-val">Ручная работа мастеров</span>
              </div>
              <div className="product-page__spec">
                <span className="product-page__spec-label">РАЗМЕРЫ</span>
                <span className="product-page__spec-val">По индивидуальным меркам</span>
              </div>
            </div>

            {/* Actions */}
            <div className="product-page__actions">
              <button
                className="btn-primary product-page__add-btn"
                onClick={() => addToCart(product)}
              >
                Добавить в корзину
              </button>

              <button
                className={`product-page__wish-btn ${inWishlist ? 'active' : ''}`}
                onClick={() => toggleWishlist(product)}
                aria-label="В избранное"
              >
                <HeartIcon filled={inWishlist} />
              </button>
            </div>

            {/* Direct Order Concierge Note */}
            <div className="product-page__concierge">
              <h4 className="product-page__concierge-title">ИНДИВИДУАЛЬНАЯ КОНСУЛЬТАЦИЯ</h4>
              <p className="product-page__concierge-text">
                Чтобы уточнить наличие вашего размера или заказать индивидуальный пошив по вашим меркам:
              </p>
              <div className="product-page__concierge-buttons">
                <button
                  className="btn-outline product-page__consult-btn"
                  onClick={() => openLeadModal('consultation', product.name)}
                >
                  Запросить консультацию мастера
                </button>
                <a
                  href="https://www.instagram.com/kuzel.shop/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="product-page__insta-link"
                >
                  Instagram @kuzel.shop →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const HeartIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? '#B85D3B' : 'none'} stroke={filled ? '#B85D3B' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default ProductPage;
