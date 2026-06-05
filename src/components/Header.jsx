import React from 'react';
import { useAppContext } from '../AppContext';

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
      <nav>
        {!isAdmin && (
          <>
            <a href="#collection" onClick={openShop}>Collection</a>
            <a href="#favorites" onClick={openShop}>Favorites ({favorites.length})</a>
            <a href="#cart" onClick={openShop}>
              Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
            </a>
          </>
        )}
        {isAdmin && (
          <>
            <a href="#collection" onClick={openShop}>View Store</a>
            <a href="#admin" onClick={() => setView("admin")}>Upload Panel</a>
            <button type="button" style={{ background: "transparent", border: "none", color: "inherit", cursor: "pointer", fontSize: "14px", fontWeight: "600" }} onClick={logout}>Logout</button>
          </>
        )}
        <button
          type="button"
          className="avatar-button"
          onClick={openProfileOrSignup}
          aria-label={currentAccount ? "Open profile" : "Open signup"}
          title={currentAccount ? currentAccount.name : "Create account"}
        >
          {currentAccount ? (
            currentAccount.name.charAt(0).toUpperCase()
          ) : (
            <>
              <span className="avatar-head" />
              <span className="avatar-body" />
            </>
          )}
        </button>
      </nav>
    </header>
  );
}
