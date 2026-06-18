import React from 'react';
import { useAppContext } from '../AppContext';
import { BsWhatsapp, BsHandbag, BsPerson, BsHeart } from 'react-icons/bs';

export default function Header() {
  const { cart, favorites, currentAccount, setView, setSelectedProduct, setShowAccount, setShowSignup, setAccountMode, logout } = useAppContext();
  const isAdmin = currentAccount?.role === "admin";

  function openShop() {
    setView("shop");
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
        
        <a href="https://wa.me/?text=Hi" target="_blank" rel="noopener noreferrer" style={{ color: '#5e4942', display: 'flex', alignItems: 'center' }} aria-label="WhatsApp">
           <BsWhatsapp size={22} />
        </a>
        
        {!isAdmin && (
          <a href="#favorites" onClick={openShop} style={{ color: '#5e4942', display: 'flex', position: 'relative' }} aria-label="Favorites">
             <BsHeart size={22} />
             {favorites.length > 0 && (
               <span style={{ position: 'absolute', top: '-6px', right: '-8px', background: '#5e4942', color: 'white', fontSize: '10px', fontWeight: 'bold', borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 {favorites.length}
               </span>
             )}
          </a>
        )}

        <button
          type="button"
          onClick={openProfileOrSignup}
          style={{ background: 'transparent', border: 'none', color: '#5e4942', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
          aria-label={currentAccount ? "Open profile" : "Open signup"}
          title={currentAccount ? currentAccount.name : "Create account"}
        >
           <BsPerson size={26} />
        </button>

        <a href="#cart" onClick={openShop} style={{ color: '#5e4942', position: 'relative', display: 'flex', alignItems: 'center' }} aria-label="Cart">
           <BsHandbag size={22} />
           <span style={{ position: 'absolute', top: '-6px', right: '-10px', background: '#5e4942', color: 'white', fontSize: '11px', fontWeight: 'bold', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
             {cart.reduce((sum, item) => sum + item.quantity, 0)}
           </span>
        </a>
      </nav>
    </header>
  );
}
