import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import './Hero.css';

interface HeroSlideItem {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
}

const slides: HeroSlideItem[] = [
  {
    id: 1,
    image: '/images/model-04.jpg',
    title: 'НАСЛЕДИЕ ВЕКОВ,\nСОВРЕМЕННЫЙ ДУХ.',
    subtitle: 'Тувинская национальная одежда, в которой вековые традиции обретают новое современное звучание.',
    cta: 'СМОТРЕТЬ КОЛЛЕКЦИЮ',
  },
  {
    id: 2,
    image: '/images/model-03.jpg',
    title: 'ЗОЛОТО СТЕПИ,\nШЁЛК И БАРХАТ.',
    subtitle: 'Традиционные орнаменты, меховая отделка и ручная работа тувинских мастеров.',
    cta: 'ОТКРЫТЬ КОЛЛЕКЦИЮ',
  },
  {
    id: 3,
    image: '/images/model-01.jpg',
    title: 'ЧИСТЫЕ ЛИНИИ,\nЖИВАЯ ПАМЯТЬ.',
    subtitle: 'Авторский крой и натуральная шерсть, созданные для уверенной элегантности.',
    cta: 'СМОТРЕТЬ КОЛЛЕКЦИЮ',
  },
  {
    id: 4,
    image: '/images/model-06.jpg',
    title: 'МУЖСКОЙ ДЭЛЬ,\nСИЛА И СТАТЬ.',
    subtitle: 'Современный взгляд на мужской тувинский костюм для сурового сибирского климата.',
    cta: 'ОТКРЫТЬ КОЛЛЕКЦИЮ',
  },
  {
    id: 5,
    image: '/images/model-07.jpg',
    title: 'В СЕРДЦЕ АЗИИ,\nВ ТЕПЛЕ ЮРТЫ.',
    subtitle: 'Стёганые пальто и утеплённые дэли с аутентичными элементами кочевой культуры.',
    cta: 'СМОТРЕТЬ КОЛЛЕКЦИЮ',
  },
];

const Hero: React.FC = () => {
  const { setCurrentPage } = useStore();
  const [activeIndex, setActiveIndex] = useState(0);

  const currentSlide = slides[activeIndex];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  // 4 thumbnails to display in the vertical strip
  const visibleThumbIndices = [
    activeIndex,
    (activeIndex + 1) % slides.length,
    (activeIndex + 2) % slides.length,
    (activeIndex + 3) % slides.length,
  ];

  return (
    <section className="hero">
      <div className="hero__canvas">
        {/* Left Column: Framed Model Portrait */}
        <div className="hero__portrait-frame">
          {slides.map((s, idx) => (
            <img
              key={s.id}
              src={s.image}
              alt="Модель в тувинской национальной одежде KUZEL"
              className={`hero__portrait-img ${idx === activeIndex ? 'active' : ''}`}
              loading={idx === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </div>

        {/* Center Column: Asymmetric Typography & Terracotta Pill CTA */}
        <div className="hero__editorial">
          <h1 className="hero__title">
            {currentSlide.title.split('\n').map((line, i) => (
              <span key={i} className="hero__title-line">
                {line}
              </span>
            ))}
          </h1>

          <p className="hero__subtitle">
            {currentSlide.subtitle}
          </p>

          <div className="hero__action">
            <button
              className="btn-primary hero__cta-btn"
              onClick={() => setCurrentPage('collections')}
            >
              {currentSlide.cta}
            </button>
          </div>
        </div>

        {/* Right Column: SŪTRA-style Vertical Thumbnail Gallery with Chevrons */}
        <div className="hero__strip">
          <button
            className="hero__strip-arrow hero__strip-arrow--up"
            onClick={handlePrev}
            aria-label="Предыдущий образ"
          >
            <ChevronUpIcon />
          </button>

          <div className="hero__thumbnails">
            {visibleThumbIndices.map((slideIdx) => {
              const item = slides[slideIdx];
              const isSelected = slideIdx === activeIndex;
              return (
                <button
                  key={item.id}
                  className={`hero__thumb-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => setActiveIndex(slideIdx)}
                  aria-label={`Выбрать образ ${item.id}`}
                >
                  <img
                    src={item.image}
                    alt="Миниатюра образа"
                    className="hero__thumb-img"
                  />
                </button>
              );
            })}
          </div>

          <button
            className="hero__strip-arrow hero__strip-arrow--down"
            onClick={handleNext}
            aria-label="Следующий образ"
          >
            <ChevronDownIcon />
          </button>
        </div>
      </div>
    </section>
  );
};

const ChevronUpIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default Hero;
