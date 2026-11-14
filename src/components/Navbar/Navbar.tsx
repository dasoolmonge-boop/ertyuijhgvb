import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { cartCount, setIsCartOpen, setCurrentPage, currentPage, isMobileMenuOpen, setIsMobileMenuOpen } = useStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Женщинам', page: 'women' as const },
    { label: 'Мужчинам', page: 'men' as const },
    { label: 'Коллекции', page: 'collections' as const },
    { label: 'О бренде', page: 'about' as const },
  ];

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner">
        {/* Brand Logo with needle/motif monogram */}
        <button
          className="navbar__logo"
          onClick={() => { setCurrentPage('home'); setIsMobileMenuOpen(false); }}
          aria-label="KUZEL Главная"
        >
          <span className="navbar__monogram">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M4 20L19 5M19 5L20 9M19 5L15 4" stroke="#B85D3B" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="7" cy="17" r="1.5" stroke="#C2A882" strokeWidth="1.4"/>
            </svg>
          </span>
          <span className="navbar__logo-text">KUZEL</span>
        </button>

        {/* Right Nav & Actions */}
        <div className="navbar__right">
          <nav className="navbar__nav" role="navigation" aria-label="Главное меню">
            {navLinks.map(link => (
              <button
                key={link.page}
                className={`navbar__link ${currentPage === link.page ? 'navbar__link--active' : ''}`}
                onClick={() => setCurrentPage(link.page)}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="navbar__actions">
            <button className="navbar__icon-btn" aria-label="Поиск" title="Поиск">
              <SearchIcon />
            </button>
            <button
              className="navbar__icon-btn navbar__cart-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Корзина (${cartCount})`}
              title="Корзина"
            >
              <BagIcon />
              {cartCount > 0 && (
                <span className="navbar__cart-count">{cartCount}</span>
              )}
            </button>
            <button
              className="navbar__burger"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Меню"
              aria-expanded={isMobileMenuOpen}
            >
              <span className={`navbar__burger-line ${isMobileMenuOpen ? 'open' : ''}`} />
              <span className={`navbar__burger-line ${isMobileMenuOpen ? 'open' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <div className={`navbar__mobile-menu ${isMobileMenuOpen ? 'navbar__mobile-menu--open' : ''}`}>
        <nav className="navbar__mobile-nav">
          {navLinks.map(link => (
            <button
              key={link.page}
              className={`navbar__mobile-link ${currentPage === link.page ? 'active' : ''}`}
              onClick={() => { setCurrentPage(link.page); setIsMobileMenuOpen(false); }}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <div className="navbar__mobile-footer">
          <span className="text-overline">KUZEL · ТУВИНСКИЙ БРЕНД</span>
          <a
            href="https://www.instagram.com/kuzel.shop/"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__mobile-social"
          >
            Instagram: @kuzel.shop
          </a>
        </div>
      </div>
    </header>
  );
};

const SearchIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="7.5"/>
    <line x1="21" y1="21" x2="16.5" y2="16.5"/>
  </svg>
);

const BagIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 3L3 7v13a2 2 0 002 2h14a2 2 0 002-2V7l-3-4z"/>
    <line x1="3" y1="7" x2="21" y2="7"/>
    <path d="M16 11a4 4 0 01-8 0"/>
  </svg>
);

export default Navbar;
