import React from 'react';
import { useStore } from '../../context/StoreContext';
import './AboutPage.css';

const AboutPage: React.FC = () => {
  const { setCurrentPage } = useStore();

  return (
    <div className="about-page">
      {/* Editorial Hero */}
      <div className="about-hero">
        <div className="about-hero__bg">
          <img src="/images/model-extra-04.jpg" alt="KUZEL о бренде" className="about-hero__img" />
          <div className="about-hero__gradient" />
        </div>

        <div className="container about-hero__content">
          <button className="about-hero__back" onClick={() => setCurrentPage('home')}>
            ← На главную
          </button>
          <span className="text-overline">О БРЕНДЕ KUZEL</span>
          <h1 className="heading-display about-hero__title">НАСЛЕДИЕ ВЕКОВ В КАЖДОЙ ДЕТАЛИ</h1>
          <p className="about-hero__sub text-editorial">
            Мы создаём тувинскую национальную одежду, соединяющую сакральную историю кочевников Центральной Азии с эстетикой современного гардероба.
          </p>
        </div>
      </div>

      {/* Philosophy Section */}
      <section className="about-philosophy section">
        <div className="container about-philosophy__layout">
          <div className="about-philosophy__media">
            <img src="/images/model-03.jpg" alt="Тувинское национальное платье" />
          </div>

          <div className="about-philosophy__content">
            <span className="text-overline">ФИЛОСОФИЯ</span>
            <h2 className="heading-lg about-philosophy__title">
              ОДЕЖДА КАК ХРАНИТЕЛЬ КУЛЬТУРНОГО КОДА.
            </h2>
            <div className="about-philosophy__text text-editorial">
              <p>
                Бренд KUZEL родился из стремления дать тувинскому национальному костюму новую жизнь вне рамок праздников и музеев. Мы верим, что традиции сильны тогда, когда они живут каждый день.
              </p>
              <p>
                Каждое изделие отшивается вручную с особым вниманием к деталям: фирменному асимметричному запаху, воротнику-стойке, фактуре бархата и плотной шерсти. Это не просто одежда — это чувство связи с корнями и гордости за свой народ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles Section (Clean Editorial Columns) */}
      <section className="about-principles section">
        <div className="container">
          <div className="about-principles__header">
            <span className="text-overline">ПРИНЦИПЫ РЕМЕСЛА</span>
            <h2 className="heading-lg">ОСНОВА НАШЕГО КАЧЕСТВА</h2>
          </div>

          <div className="about-principles__grid">
            <div className="principle-card">
              <span className="principle-card__num">01</span>
              <h3 className="principle-card__title">ПОДЛИННОСТЬ</h3>
              <p className="principle-card__text text-editorial">
                Мы сохраняем истинные пропорции традиционного тувинского кроя и исторически достоверные линии дэлей.
              </p>
            </div>

            <div className="principle-card">
              <span className="principle-card__num">02</span>
              <h3 className="principle-card__title">МАТЕРИАЛЫ</h3>
              <p className="principle-card__text text-editorial">
                Используем только натуральные ткани высочайшей плотности: шерсть, шёлк, бархат и выделку натурального меха.
              </p>
            </div>

            <div className="principle-card">
              <span className="principle-card__num">03</span>
              <h3 className="principle-card__title">РУЧНАЯ РАБОТА</h3>
              <p className="principle-card__text text-editorial">
                Каждое изделие создаётся тувинскими мастерами, бережно передающими секреты шитья из поколения в поколение.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Concierge Section */}
      <section className="about-contact section">
        <div className="container about-contact__box">
          <span className="text-overline">СВЯЗЬ С МАСТЕРОМ</span>
          <h2 className="heading-lg about-contact__title">ИНДИВИДУАЛЬНЫЙ ЗАКАЗ</h2>
          <p className="about-contact__desc text-editorial">
            Хотите обсудить индивидуальный пошив по вашим меркам или задать вопрос о наличии моделей? Напишите нам напрямую.
          </p>
          <a
            href="https://www.instagram.com/kuzel.shop/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Написать в Instagram @kuzel.shop
          </a>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
