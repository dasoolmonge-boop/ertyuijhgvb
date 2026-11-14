import React, { useState } from 'react';
import { products } from '../../data/products';
import ProductCard from '../ProductCard/ProductCard';
import { useStore } from '../../context/StoreContext';
import './CatalogPage.css';

interface Props {
  filter?: 'female' | 'male' | 'all';
  title: string;
  subtitle: string;
  heroImage: string;
}

const CatalogPage: React.FC<Props> = ({ filter = 'all', title, subtitle, heroImage }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const { setCurrentPage } = useStore();

  const baseProducts = filter === 'all'
    ? products
    : products.filter(p => p.gender === filter);

  const types = ['all', ...Array.from(new Set(baseProducts.map(p => p.type)))];

  const filtered = activeFilter === 'all'
    ? baseProducts
    : baseProducts.filter(p => p.type === activeFilter);

  return (
    <div className="catalog-page">
      {/* Editorial Catalog Hero */}
      <div className="catalog-hero">
        <div className="catalog-hero__bg">
          <img src={heroImage} alt={title} className="catalog-hero__img" />
          <div className="catalog-hero__gradient" />
        </div>

        <div className="container catalog-hero__content">
          <button className="catalog-hero__back" onClick={() => setCurrentPage('home')}>
            ← На главную
          </button>
          <span className="text-overline">КОЛЛЕКЦИЯ KUZEL</span>
          <h1 className="heading-display catalog-hero__title">{title}</h1>
          <p className="catalog-hero__sub text-editorial">{subtitle}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="catalog-filters-wrap">
        <div className="container catalog-filters">
          {types.map(type => (
            <button
              key={type}
              className={`catalog-filter ${activeFilter === type ? 'active' : ''}`}
              onClick={() => setActiveFilter(type)}
            >
              {type === 'all' ? 'Все модели' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="container catalog-grid">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
        {filtered.length === 0 && (
          <div className="catalog-empty">
            <p>В данной категории изделия скоро появятся.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogPage;
