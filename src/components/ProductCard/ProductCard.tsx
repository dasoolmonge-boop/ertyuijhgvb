import React, { useState } from 'react';
import type { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import './ProductCard.css';

interface Props {
  product: Product;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  const { addToCart, toggleWishlist, isInWishlist, setSelectedProduct, setCurrentPage } = useStore();
  const [isHovered, setIsHovered] = useState(false);
  const inWishlist = isInWishlist(product.id);

  const handleView = () => {
    setSelectedProduct(product);
    setCurrentPage('product');
  };

  return (
    <article
      className="product-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-card__media-wrap" onClick={handleView}>
        <img
          src={product.image}
          alt={product.name}
          className={`product-card__img product-card__img--primary ${isHovered && product.hoverImage ? 'is-hidden' : ''}`}
          loading="lazy"
        />
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt={`${product.name} — альтернативный ракурс`}
            className={`product-card__img product-card__img--hover ${isHovered ? 'is-visible' : ''}`}
            loading="lazy"
          />
        )}

        {/* Quick Add Pill on Hover */}
        <div className={`product-card__hover-bar ${isHovered ? 'is-visible' : ''}`}>
          <button
            className="product-card__add-btn"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
          >
            В корзину
          </button>
        </div>

        {/* Minimalist Heart Icon */}
        <button
          className={`product-card__wishlist ${inWishlist ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label={inWishlist ? 'Удалить из избранного' : 'Добавить в избранное'}
        >
          <HeartIcon filled={inWishlist} />
        </button>
      </div>

      <div className="product-card__details">
        <div className="product-card__header-line">
          <span className="product-card__category">{product.type}</span>
          <span className="product-card__color">{product.color}</span>
        </div>

        <h3 className="product-card__title" onClick={handleView}>
          {product.name}
        </h3>

        <div className="product-card__price-row">
          <span className="product-card__price">{product.price}</span>
          <button className="product-card__detail-link" onClick={handleView}>
            Подробнее →
          </button>
        </div>
      </div>
    </article>
  );
};

const HeartIcon: React.FC<{ filled: boolean }> = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? '#B85D3B' : 'none'} stroke={filled ? '#B85D3B' : 'currentColor'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

export default ProductCard;
