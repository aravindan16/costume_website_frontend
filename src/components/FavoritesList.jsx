import React from 'react';
import { useAppContext } from '../AppContext';
import ProductCard from './ProductCard';

export default function FavoritesList() {
  const { favorites } = useAppContext();

  return (
    <section className="cart-layout" id="favorites" style={{ paddingBottom: '0' }}>
      <div className="cart-panel" style={{ gridColumn: "1 / -1" }}>
        <div className="section-heading compact">
          <p>Your wishlist</p>
          <h2>Favorites</h2>
        </div>
        {favorites.length === 0 ? (
          <p className="muted">You have no favorites yet.</p>
        ) : (
          <div className="product-grid" style={{ marginTop: '20px' }}>
            {favorites.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
