import React from 'react';
import { products } from '../../data/products';
import ProductCard from '../ProductCard/ProductCard';
import { useStore } from '../../context/StoreContext';
import './FeaturedProducts.css';

const FeaturedProducts: React.FC = () => {
  const { setCurrentPage } = useStore();
  const featured = products.slice(0, 4);

  return (
    <section className="featured section">
      <div className="container">
        <div className="featured__header">
          <div className="featured__header-left">
            <span className="text-overline">ИЗБРАННОЕ</span>
            <h2 className="heading-lg featured__title">ПОПУЛЯРНЫЕ ИЗДЕЛИЯ</h2>
          </div>
          <p className="featured__desc text-editorial">
            Каждое изделие отшивается ограниченными сериями из премиальных натуральных тканей с сохранением сакральных элементов тувинского костюма.
          </p>
        </div>

        <div className="featured__grid">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="featured__footer">
          <button className="btn-outline" onClick={() => setCurrentPage('collections')}>
            Смотреть весь каталог
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
