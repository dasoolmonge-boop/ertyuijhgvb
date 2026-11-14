import React from 'react';
import { useStore } from '../../context/StoreContext';
import './Footer.css';

const Footer: React.FC = () => {
  const { setCurrentPage, openLeadModal, setIsPrivacyModalOpen } = useStore();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          {/* Brand Info */}
          <div className="footer__brand">
            <button className="footer__logo" onClick={() => setCurrentPage('home')}>
              <span className="footer__monogram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 20L19 5M19 5L20 9M19 5L15 4" stroke="#B85D3B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="7" cy="17" r="1.5" stroke="#C2A882" strokeWidth="1.4"/>
                </svg>
              </span>
              <span className="footer__logo-text">KUZEL</span>
            </button>
            <p className="footer__tagline text-editorial">
              Премиальная тувинская национальная одежда. Сохраняя культурный код степей в каждой детали современного кроя.
            </p>
            <a
              href="https://www.instagram.com/kuzel.shop/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
            >
              <InstagramIcon />
              <span>@kuzel.shop</span>
            </a>
          </div>

          {/* Navigation Links */}
          <div className="footer__col">
            <span className="footer__col-head">КАТАЛОГ</span>
            <ul className="footer__list">
              <li><button onClick={() => setCurrentPage('women')}>Женская коллекция</button></li>
              <li><button onClick={() => setCurrentPage('men')}>Мужская коллекция</button></li>
              <li><button onClick={() => setCurrentPage('collections')}>Национальный дэль</button></li>
              <li><button onClick={() => setCurrentPage('collections')}>Аксессуары и пояса</button></li>
            </ul>
          </div>

          <div className="footer__col">
            <span className="footer__col-head">БРЕНД И СЕРВИС</span>
            <ul className="footer__list">
              <li><button onClick={() => setCurrentPage('about')}>История KUZEL</button></li>
              <li><button onClick={() => openLeadModal('consultation')}>Консультация мастера</button></li>
              <li><button onClick={() => openLeadModal('callback')}>Заказать обратный звонок</button></li>
              <li><button onClick={() => setIsPrivacyModalOpen(true)}>Политика данных</button></li>
            </ul>
          </div>

          <div className="footer__col">
            <span className="footer__col-head">ЗАКАЗ И СВЯЗЬ</span>
            <p className="footer__order-info">
              Все изделия KUZEL изготавливаются ограниченными партиями. Подбор размера, сроки пошива и доставка по всей России согласуются напрямую с мастером.
            </p>
            <div className="footer__action-buttons">
              <button
                className="btn-outline footer__order-cta"
                onClick={() => openLeadModal('callback')}
              >
                Обратный звонок
              </button>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            © {new Date().getFullYear()} KUZEL. Тувинская национальная одежда. Все права защищены.
          </p>
          <div className="footer__legal">
            <button className="footer__privacy-btn" onClick={() => setIsPrivacyModalOpen(true)}>
              Политика конфиденциальности
            </button>
            <span>·</span>
            <span>Республика Тыва</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const InstagramIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export default Footer;
