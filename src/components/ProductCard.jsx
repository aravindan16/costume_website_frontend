import React, { useState, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { getProductImageByIndex, money, productShareUrl } from '../utils';

export default function ProductCard({ product }) {
  const { favorites, toggleFavorite, setView, setSelectedProduct } = useAppContext();
  const isFavorite = favorites.some(f => f.id === product.id);
  const [isHovered, setIsHovered] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const imagesCount = product.images?.length > 0 ? product.images.length : 1;

  useEffect(() => {
    let interval;
    if (isHovered && imagesCount > 1) {
      interval = setInterval(() => {
        setImageIndex(prev => (prev + 1) % imagesCount);
      }, 1500);
    } else {
      setImageIndex(0);
    }
    return () => clearInterval(interval);
  }, [isHovered, imagesCount]);

  function openProduct() {
    setSelectedProduct(product);
    setView("shop");
    window.history.pushState(null, "", productShareUrl(product));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <article
      className="product-card myntra-card"
      role="button"
      tabIndex="0"
      onClick={openProduct}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") openProduct();
      }}
    >
      <div className="product-image-container">
        <img src={getProductImageByIndex(product, imageIndex)} alt={product.name} className="product-img" />
        
        {imagesCount > 1 && (
          <div className="carousel-dots">
            {Array.from({ length: imagesCount }).map((_, idx) => (
              <span key={idx} className={`dot ${idx === imageIndex ? 'active' : ''}`} />
            ))}
          </div>
        )}

        <div className={`wishlist-overlay ${isHovered ? 'visible' : ''}`}>
          <button
            type="button"
            className="myntra-wishlist-btn"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(product);
            }}
          >
            <svg viewBox="0 0 24 24" className={`wishlist-icon ${isFavorite ? 'filled' : ''}`}>
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <span className="wishlist-text">{isFavorite ? "WISHLISTED" : "WISHLIST"}</span>
          </button>
        </div>
      </div>
      <div className="product-info-container">
        <h3 className="brand-name">{product.category}</h3>
        <p className="product-title">{product.name}</p>
        <div className="price-row">
          <strong className="current-price">{money(product.price)}</strong>
        </div>
      </div>
    </article>
  );
}
