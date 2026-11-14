import React from 'react';
import { useStore } from '../../context/StoreContext';
import './Heritage.css';

const Heritage: React.FC = () => {
  const { setCurrentPage } = useStore();

  return (
    <section className="heritage section">
      <div className="container">
        <div className="heritage__layout">
          {/* Left: Editorial Framed Photography */}
          <div className="heritage__visual">
            <div className="heritage__frame">
              <img
                src="/images/model-extra-04.jpg"
                alt="Тувинский национальный костюм в полный рост"
                className="heritage__img"
                loading="lazy"
              />
            </div>
            <div className="heritage__detail-badge">
              <span className="heritage__badge-num">100%</span>
              <span className="heritage__badge-txt">РУЧНАЯ РАБОТА</span>
            </div>
          </div>

          {/* Right: Editorial Narrative */}
          <div className="heritage__content">
            <span className="text-overline">ИСТОРИЯ И КУЛЬТУРА</span>

            <h2 className="heading-lg heritage__title">
              ТРАДИЦИИ, ВПЛЕТЁННЫЕ В СОВРЕМЕННЫЙ СИЛУЭТ.
            </h2>

            <p className="heritage__lead text-editorial">
              Тувинская национальная одежда — это не музейный экспонат, а живой язык уважения к родной земле, климату и достоинству человека. Бренд KUZEL сохраняет анатомическую выверенность традиционного кроя, адаптируя его к современной эстетике.
            </p>

            <div className="heritage__pillars">
              <div className="heritage__pillar">
                <span className="heritage__pillar-index">01</span>
                <div>
                  <h4 className="heritage__pillar-name">МАТЕРИАЛЫ</h4>
                  <p className="heritage__pillar-desc">
                    Плотная шерсть, глубокий бархат, шёлк и меховая отделка, защищающие от ветров Центральной Азии.
                  </p>
                </div>
              </div>

              <div className="heritage__pillar">
                <span className="heritage__pillar-index">02</span>
                <div>
                  <h4 className="heritage__pillar-name">ТРАДИЦИОННЫЙ КРОЙ</h4>
                  <p className="heritage__pillar-desc">
                    Характерный восточный воротник-стойка, застёжка с асимметричным запахом и пояса с чеканной фурнитурой.
                  </p>
                </div>
              </div>

              <div className="heritage__pillar">
                <span className="heritage__pillar-index">03</span>
                <div>
                  <h4 className="heritage__pillar-name">СИМВОЛИКА</h4>
                  <p className="heritage__pillar-desc">
                    Деликатно интегрированные узоры и пропорции, подчеркивающие стать и внутреннее достоинство.
                  </p>
                </div>
              </div>
            </div>

            <div className="heritage__action">
              <button className="btn-primary" onClick={() => setCurrentPage('about')}>
                Читать историю бренда
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Heritage;
