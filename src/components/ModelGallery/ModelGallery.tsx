import React from 'react';
import './ModelGallery.css';

const galleryItems = [
  { src: '/images/model-01.jpg', title: 'ПАЛЬТО С ПОЯСОМ', note: 'Шоколадная шерсть' },
  { src: '/images/model-04.jpg', title: 'НАЦИОНАЛЬНЫЙ ДЭЛЬ', note: 'Бордовый бархат и золото' },
  { src: '/images/model-06.jpg', title: 'МУЖСКОЕ ПАЛЬТО', note: 'Утеплённый силуэт' },
  { src: '/images/model-03.jpg', title: 'ПЛАТЬЕ С ВЫШИВКОЙ', note: 'Изумрудный бархат' },
  { src: '/images/model-07.jpg', title: 'СТЁГАНЫЙ ДЭЛЬ', note: 'Чёрный хлопок' },
  { src: '/images/model-02.jpg', title: 'ПАЛЬТО МОЛОЧНОЕ', note: 'Кожаные детали' },
];

const ModelGallery: React.FC = () => {
  return (
    <section className="model-gallery section">
      <div className="container">
        <div className="model-gallery__header">
          <div>
            <span className="text-overline">ЛУКБУК</span>
            <h2 className="heading-lg model-gallery__title">ОБРАЗЫ В ОБЪЕКТИВЕ</h2>
          </div>
          <p className="model-gallery__desc text-editorial">
            Эстетика тувинского костюма в студийной съёмке. Каждая складка ткани и оттенок подобраны вручную.
          </p>
        </div>

        <div className="model-gallery__grid">
          {galleryItems.map((item, index) => (
            <div key={index} className="gallery-card">
              <div className="gallery-card__media">
                <img
                  src={item.src}
                  alt={item.title}
                  loading="lazy"
                  className="gallery-card__img"
                />
              </div>
              <div className="gallery-card__info">
                <span className="gallery-card__title">{item.title}</span>
                <span className="gallery-card__note">{item.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModelGallery;
