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
import { Toaster } from 'react-hot-toast';

export default function App() {
  const { view, selectedProduct } = useAppContext();

  return (
    <main>
      <Toaster position="top-center" />
      <Header />
      {view === "admin" ? (
        <AdminPanel />
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
    </main>
  );
}
