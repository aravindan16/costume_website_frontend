import React, { useState, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { productImageUrl, whatsappLink, money } from '../utils';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { selectedProduct, setView, setSelectedProduct, toggleFavorite, cart, setCart } = useAppContext();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedProduct]);

  function closeProduct() {
    setSelectedProduct(null);
    setView("shop");
    window.history.pushState(null, "", `${window.location.pathname}#collection`);
    window.setTimeout(() => {
      document.getElementById("collection")?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  }

  function addToCart() {
    setCart((current) => {
      const existing = current.find((item) => item.id === selectedProduct.id);
      if (existing) {
        return current.map((item) =>
          item.id === selectedProduct.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...selectedProduct, quantity: 1 }];
    });
    toast.success(`${selectedProduct.name} added to cart.`);
  }

  async function shareProduct() {
    const shareData = {
      title: `${selectedProduct.name} - Nilavalayam`,
      text: `Check this saree from Nilavalayam: ${selectedProduct.name} (${money(selectedProduct.price)})`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        toast.success("Product link copied. You can share it now.");
      }
    } catch {
      toast.error("Sharing was cancelled.");
    }
  }

  if (!selectedProduct) return null;

  return (
    <section className="product-page" id="top">
      <button type="button" className="back-button" onClick={closeProduct}>Back to Collection</button>
      <div className="detail-layout">
        <div className="detail-gallery-container">
          <div className="detail-image">
            <img
              src={productImageUrl({
                image: selectedProduct.images?.length > 0 ? selectedProduct.images[activeImageIndex] : selectedProduct.image,
              })}
              alt={selectedProduct.name}
            />
            {selectedProduct.images?.length > 1 && (
              <>
                <button
                  type="button"
                  className="carousel-btn prev-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1));
                  }}
                >
                  &#10094;
                </button>
                <button
                  type="button"
                  className="carousel-btn next-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex((prev) => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1));
                  }}
                >
                  &#10095;
                </button>
              </>
            )}
          </div>
          {selectedProduct.images?.length > 1 && (
            <div className="gallery-thumbnails">
              {selectedProduct.images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`gallery-thumb-btn ${idx === activeImageIndex ? "active" : ""}`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={productImageUrl({ image: img })} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="detail-copy">
          <p className="detail-category">{selectedProduct.category}</p>
          <h1>{selectedProduct.name}</h1>
          <strong>{money(selectedProduct.price)}</strong>
          <p>{selectedProduct.description}</p>
          <dl className="detail-list">
            <div>
              <dt>Color</dt>
              <dd>{selectedProduct.color}</dd>
            </div>
            <div>
              <dt>Available</dt>
              <dd>{selectedProduct.stock} pieces</dd>
            </div>
          </dl>
          <div className="detail-actions">
            <a className="whatsapp-button" href={whatsappLink(selectedProduct)} target="_blank" rel="noreferrer">Buy on WhatsApp</a>
            <button type="button" className="share-button" onClick={shareProduct}>Share</button>
            <button type="button" onClick={addToCart}>Add to Cart</button>
            <button type="button" className="share-button" onClick={() => toggleFavorite(selectedProduct)}>Favorite</button>
          </div>
        </div>
      </div>
    </section>
  );
}
