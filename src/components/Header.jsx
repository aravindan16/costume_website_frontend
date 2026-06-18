import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { BsWhatsapp, BsHandbag, BsPerson, BsHeart, BsSearch } from 'react-icons/bs';

export default function Header() {
  const { cart, favorites, currentAccount, setView, setSelectedProduct, setShowAccount, setShowSignup, setAccountMode, logout, searchQuery, setSearchQuery, setIsCartOpen } = useAppContext();
  const isAdmin = currentAccount?.role === "admin";
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef(null);

  function openShop() {
    setView("shop");
    setSelectedProduct(null);
  }

  function openFavorites(e) {
    e.preventDefault();
    setView("favorites");
    setSelectedProduct(null);
  }

  function openProfileOrSignup() {
    if (isAdmin) {
      setView("admin");
      return;
    }
    if (currentAccount) {
      setShowAccount(true);
      return;
    }
    setAccountMode("signup");
    setShowSignup(true);
  }

  function openCart(e) {
    e.preventDefault();
    setIsCartOpen(true);
  }

  function toggleSearch() {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (searchQuery.trim()) {
      setView("category");
    }
  }

  return (
    <header className="nav">
      <a className="brand" href="#top" aria-label="Nilavalayam home" onClick={openShop}>
        <img className="brand-logo" src="/websiteLogo.png" alt="" />
        <span>Nilavalayam</span>
      </a>
      <nav style={{ gap: '24px', display: 'flex', alignItems: 'center' }}>
        {isAdmin && (
          <>
            <a href="#admin" onClick={() => setView("admin")}>Upload Panel</a>
            <button type="button" style={{ background: "transparent", border: "none", color: "inherit", cursor: "pointer", fontSize: "14px", fontWeight: "600" }} onClick={logout}>Logout</button>
          </>
        )}
        
        <button 
          type="button" 
          onClick={toggleSearch} 
          style={{ background: 'transparent', border: 'none', color: '#5e4942', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }} 
          aria-label="Search"
        >
          <BsSearch size={20} />
        </button>

        <a href="https://wa.me/?text=Hi" target="_blank" rel="noopener noreferrer" style={{ color: '#5e4942', display: 'flex', alignItems: 'center' }} aria-label="WhatsApp">
           <BsWhatsapp size={22} />
        </a>
        
        <a href="#favorites" onClick={openFavorites} style={{ color: '#5e4942', display: 'flex', position: 'relative' }} aria-label="Favorites">
           <BsHeart size={22} />
           {favorites.length > 0 && (
             <span style={{ position: 'absolute', top: '-6px', right: '-8px', background: '#5e4942', color: 'white', fontSize: '10px', fontWeight: 'bold', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               {favorites.length}
             </span>
           )}
        </a>

        <button
          type="button"
          onClick={openProfileOrSignup}
          style={{ background: 'transparent', border: 'none', color: '#5e4942', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
          aria-label={currentAccount ? "Open profile" : "Open signup"}
          title={currentAccount ? currentAccount.name : "Create account"}
        >
           <BsPerson size={26} />
        </button>

        <a href="#cart" onClick={openCart} style={{ color: '#5e4942', position: 'relative', display: 'flex', alignItems: 'center' }} aria-label="Cart">
           <BsHandbag size={22} />
           <span style={{ position: 'absolute', top: '-6px', right: '-10px', background: '#5e4942', color: 'white', fontSize: '11px', fontWeight: 'bold', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             {cart.reduce((sum, item) => sum + item.quantity, 0)}
           </span>
        </a>
      </nav>

      {/* Full-width Search Dropdown */}
      {isSearchOpen && (
        <div 
          style={{ 
            position: 'absolute', 
            top: '100%', 
            left: 0, 
            width: '100%', 
            backgroundColor: '#f8f8f8', 
            padding: '24px 40px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)', 
            borderBottom: '1px solid #ddd', 
            zIndex: 99,
            boxSizing: 'border-box'
          }}
        >
          <form 
            onSubmit={handleSearchSubmit}
            style={{ display: 'flex', maxWidth: '800px', margin: '0 auto', height: '48px', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}
          >
            <div style={{ padding: '0 15px', display: 'flex', alignItems: 'center', backgroundColor: '#fff' }}>
              <BsSearch size={20} color="#666" />
            </div>
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '0 15px', border: 'none', outline: 'none', fontSize: '16px', minHeight: '48px', borderRadius: 0, color: '#333' }}
            />
            <button type="submit" style={{ backgroundColor: '#e53935', color: 'white', border: 'none', padding: '0 30px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
              Search
            </button>
          </form>
        </div>
      )}
    </header>
  );
}
