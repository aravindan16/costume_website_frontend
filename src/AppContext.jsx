import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { fetchProducts, fetchFavorites, addFavorite, removeFavorite } from './api';
import toast from 'react-hot-toast';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [currentAccount, setCurrentAccount] = useState(() => {
    const saved = localStorage.getItem("nillaAccount");
    if (!saved) return null;
    const account = JSON.parse(saved);
    return account.role === "admin" ? null : account;
  });
  
  const [view, setView] = useState("shop");
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Auth Modal State
  const [showSignup, setShowSignup] = useState(() => !localStorage.getItem("nillaAccount"));
  const [showAccount, setShowAccount] = useState(false);
  const [accountMode, setAccountMode] = useState("login");

  const isAdmin = currentAccount?.role === "admin";

  useEffect(() => {
    fetchProducts().then(setProducts).catch(console.error);
  }, []);

  useEffect(() => {
    if (!currentAccount) {
      setFavorites([]);
      return;
    }
    if (products.length === 0) return;
    
    const userId = currentAccount.id || currentAccount.email;
    fetchFavorites(userId)
      .then(productIds => {
        const favoriteProducts = productIds
          .map(id => products.find(p => p.id === id))
          .filter(Boolean);
        setFavorites(favoriteProducts);
      })
      .catch(console.error);
  }, [currentAccount, products]);

  async function toggleFavorite(product) {
    if (!currentAccount) {
      setAccountMode("signup");
      setShowSignup(true);
      toast.error("Please sign up or log in to save favorites.");
      return;
    }

    const userId = currentAccount.id || currentAccount.email;
    const isFavorite = favorites.some(f => f.id === product.id);
    setFavorites(curr => isFavorite ? curr.filter(f => f.id !== product.id) : [...curr, product]);

    try {
      if (isFavorite) {
        await removeFavorite(userId, product.id);
      } else {
        await addFavorite(userId, product.id);
      }
    } catch (error) {
      console.error(error);
      setFavorites(curr => isFavorite ? [...curr, product] : curr.filter(f => f.id !== product.id));
      toast.error("Failed to sync favorite.");
    }
  }

  function saveAccount(account) {
    setCurrentAccount(account);
    if (account.role === "admin") {
      localStorage.removeItem("nillaAccount");
    } else {
      localStorage.setItem("nillaAccount", JSON.stringify(account));
    }
  }

  function logout() {
    setCurrentAccount(null);
    setFavorites([]);
    localStorage.removeItem("nillaAccount");
    setView("shop");
    setShowAccount(false);
    setShowSignup(true);
    toast.success("Logged out.");
  }

  const value = {
    products, setProducts,
    cart, setCart,
    favorites, setFavorites, toggleFavorite,
    currentAccount, setCurrentAccount, saveAccount, logout, isAdmin,
    view, setView,
    selectedProduct, setSelectedProduct,
    showSignup, setShowSignup,
    showAccount, setShowAccount,
    accountMode, setAccountMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
