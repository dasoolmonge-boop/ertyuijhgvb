import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Collections from './components/Collections/Collections';
import FeaturedProducts from './components/FeaturedProducts/FeaturedProducts';
import Heritage from './components/Heritage/Heritage';
import ModelGallery from './components/ModelGallery/ModelGallery';
import Footer from './components/Footer/Footer';
import Cart from './components/Cart/Cart';
import CatalogPage from './components/CatalogPage/CatalogPage';
import ProductPage from './components/ProductPage/ProductPage';
import AboutPage from './components/AboutPage/AboutPage';
import { LeadModal } from './components/Modals/LeadModal';
import { PrivacyModal } from './components/Modals/PrivacyModal';
import './styles/globals.css';

const AppContent: React.FC = () => {
  const { currentPage, selectedProduct } = useStore();

  const renderPage = () => {
    // Product detail page
    if (currentPage === 'product' && selectedProduct) {
      return <ProductPage product={selectedProduct} />;
    }

    switch (currentPage) {
      case 'women':
        return (
          <CatalogPage
            filter="female"
            title="Женская одежда"
            subtitle="Традиционная тувинская одежда для женщин — изящество и сила в каждом изделии"
            heroImage="/images/model-04.jpg"
          />
        );
      case 'men':
        return (
          <CatalogPage
            filter="male"
            title="Мужская одежда"
            subtitle="Тувинская одежда для мужчин — достоинство и мощь степного народа"
            heroImage="/images/model-06.jpg"
          />
        );
      case 'collections':
        return (
          <CatalogPage
            filter="all"
            title="Все коллекции"
            subtitle="Полная коллекция KUZEL — тувинская национальная одежда для всей семьи"
            heroImage="/images/model-extra-04.jpg"
          />
        );
      case 'about':
        return <AboutPage />;
      default:
        return (
          <>
            <Hero />
            <Collections />
            <FeaturedProducts />
            <Heritage />
            <ModelGallery />
          </>
        );
    }
  };

  return (
    <div className="app">
      <Navbar />
      <main>
        {renderPage()}
      </main>
      <Footer />
      <Cart />
      <LeadModal />
      <PrivacyModal />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
};

export default App;
