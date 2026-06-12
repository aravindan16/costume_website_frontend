import React from 'react';
import { useAppContext } from './AppContext';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
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
      ) : (
        <>
          <Hero />
          <ProductList />
        </>
      )}

      {view === "shop" && !selectedProduct && (
        <>
          <FavoritesList />
          <Cart />
        </>
      )}

      <AuthModal />
      <Footer />
    </main>
  );
}
