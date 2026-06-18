import React from 'react';
import { useAppContext } from './AppContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ShopByFabric from './components/ShopByFabric';
import ShopByOccasion from './components/ShopByOccasion';
import CategoryView from './components/CategoryView';
import ProductDetail from './components/ProductDetail';
import FavoritesList from './components/FavoritesList';
import Cart from './components/Cart';
import AuthModal from './components/AuthModal';
import AdminPanel from './components/AdminPanel';
import AboutUs from './components/AboutUs';
import ContactUs from './components/ContactUs';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

export default function App() {
  const { view, selectedProduct } = useAppContext();

  return (
    <main className="main-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Toaster position="top-center" />
      <Header />
      {view === "admin" ? (
        <AdminPanel />
      ) : ["about", "why-choose-us", "purpose", "mission"].includes(view) ? (
        <AboutUs />
      ) : view === "contact" ? (
        <ContactUs />
      ) : selectedProduct ? (
        <ProductDetail />
      ) : view === "favorites" ? (
        <div style={{ padding: '40px clamp(18px, 4vw, 54px)', flex: 1, background: '#fbf7f1' }}>
          <FavoritesList />
        </div>
      ) : view === "category" ? (
        <CategoryView />
      ) : (
        <>
          <Hero />
          <ShopByFabric />
          <ShopByOccasion />
        </>
      )}

      <Cart />

      <AuthModal />
      <Footer />
    </main>
  );
}
