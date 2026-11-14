import React from 'react';
import { useStore } from '../../context/StoreContext';
import './Collections.css';

interface CategoryItem {
  id: string;
  title: string;
  caption: string;
  image: string;
  page: 'women' | 'men' | 'collections';
}

const categories: CategoryItem[] = [
  {
    id: 'women',
    title: 'ЖЕНСКАЯ ОДЕЖДА',
    caption: 'Пальто, бархатные платья и жакеты',
    image: '/images/model-04.jpg',
    page: 'women',
  },
  {
    id: 'men',
    title: 'МУЖСКАЯ ОДЕЖДА',
    caption: 'Зимние дэли и стёганые пальто',
    image: '/images/model-06.jpg',
    page: 'men',
  },
  {
    id: 'national',
    title: 'НАЦИОНАЛЬНЫЕ КОСТЮМЫ',
    caption: 'Традиционные вышивки и орнаменты',
    image: '/images/model-03.jpg',
    page: 'collections',
  },
  {
    id: 'heritage-details',
    title: 'ДЕТАЛИ И АКСЕССУАРЫ',
    caption: 'Пояса, меховая отделка и фурнитура',
    image: '/images/model-05.jpg',
    page: 'collections',
  },
];

const Collections: React.FC = () => {
  const { setCurrentPage } = useStore();

  return (
    <section className="collections section">
      <div className="container">
        <div className="collections__header">
          <span className="text-overline">КАТЕГОРИИ</span>
          <div className="collections__header-row">
            <h2 className="heading-lg collections__title">КОЛЛЕКЦИИ KUZEL</h2>
            <p className="collections__header-desc text-editorial">
              Аутентичный тувинский крой, переосмысленный для гардероба современного ценителя высокой этнической моды.
            </p>
          </div>
        </div>

        <div className="collections__grid">
          {categories.map((cat, index) => (
            <div
              key={cat.id}
              className={`collection-card ${index === 0 ? 'collection-card--featured' : ''}`}
              onClick={() => setCurrentPage(cat.page)}
            >
              <div className="collection-card__media">
                <img
                  src={cat.image}
                  alt={cat.title}
                  loading="lazy"
                  className="collection-card__img"
                />
              </div>
              <div className="collection-card__meta">
                <div className="collection-card__info">
                  <span className="collection-card__caption">{cat.caption}</span>
                  <h3 className="collection-card__title">{cat.title}</h3>
                </div>
                <span className="collection-card__btn" aria-hidden="true">
                  <ArrowRightIcon />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

export default Collections;
