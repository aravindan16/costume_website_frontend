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
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
          <button 
            type="button" 
            onClick={toggleSearch} 
            style={{ background: 'transparent', border: 'none', color: '#5e4942', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }} 
            aria-label="Search"
          >
            <BsSearch size={20} />
          </button>
          <form 
            onSubmit={handleSearchSubmit}
            style={{ 
              display: 'flex', 
              width: isSearchOpen ? '200px' : '0px', 
              opacity: isSearchOpen ? 1 : 0, 
              overflow: 'hidden', 
              transition: 'all 0.3s ease',
              position: 'absolute',
              right: '100%',
              marginRight: '12px'
            }}
          >
            <input 
              ref={searchInputRef}
              type="text" 
              placeholder="Search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: '20px', border: '1px solid #ddd', width: '100%', height: '32px', minHeight: '32px', fontSize: '14px' }}
            />
          </form>
        </div>

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
    </header>
  );
}
