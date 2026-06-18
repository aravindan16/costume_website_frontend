import React, { useMemo, useState } from 'react';
import { useAppContext } from '../AppContext';
import ProductCard from './ProductCard';

export default function CategoryView() {
  const { products, categoryFilter, searchQuery } = useAppContext();
  const [sortOrder, setSortOrder] = useState("newest");

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
      const searchText = `${item.name} ${item.category} ${item.color}`.toLowerCase();
      return matchesCategory && searchText.includes(searchQuery.toLowerCase());
    }).sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0); // Assuming we might have dates, otherwise falls back to keeping order
      }
      return 0;
    });
  }, [products, categoryFilter, searchQuery, sortOrder]);

  const displayName = categoryFilter !== "All" ? categoryFilter : (searchQuery ? `Search: "${searchQuery}"` : "All Sarees");

  return (
    <div className="category-page" style={{ padding: '34px clamp(18px, 4vw, 54px) 64px', minHeight: 'calc(100vh - 67px)', background: '#fff' }}>
      <div style={{ marginBottom: '30px', fontSize: '13px', color: '#6f5b52' }}>
        <a href="#home" style={{ color: 'inherit', textDecoration: 'underline' }} onClick={() => window.location.reload()}>Home</a> / <span style={{ color: '#261d1b' }}>{displayName}</span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '400', margin: '0' }}>
          {displayName} <span style={{ fontSize: '14px', color: '#888', verticalAlign: 'top', marginLeft: '4px' }}>({filteredProducts.length})</span>
        </h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '16px 0', marginBottom: '30px', fontSize: '14px' }}>
        <button style={{ background: 'none', border: 'none', color: '#261d1b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6"></path></svg>
          Filters
        </button>
        <select style={{ border: 'none', outline: 'none', background: 'transparent', cursor: 'pointer', color: '#261d1b' }} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Date, new to old</option>
          <option value="oldest">Date, old to new</option>
        </select>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#6f5b52' }}>
          <p>No products found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
