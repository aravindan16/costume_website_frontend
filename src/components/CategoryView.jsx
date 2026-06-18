import React, { useMemo, useState } from 'react';
import { useAppContext } from '../AppContext';
import ProductCard from './ProductCard';
import { BsX } from 'react-icons/bs';

export default function CategoryView() {
  const { products, categoryFilter, searchQuery } = useAppContext();
  const [sortOrder, setSortOrder] = useState("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter States
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedFabric, setSelectedFabric] = useState("");

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
      const matchesFabric = !selectedFabric || item.category === selectedFabric;
      const searchText = `${item.name} ${item.category} ${item.color}`.toLowerCase();
      const matchesSearch = matchesCategory && searchText.includes(searchQuery.toLowerCase());
      
      const pColor = (item.color || "").toLowerCase();
      const matchesColor = !selectedColor || pColor.includes(selectedColor.toLowerCase());
      
      const itemPrice = Number(item.price);
      const matchesPriceFrom = priceFrom === "" || itemPrice >= Number(priceFrom);
      const matchesPriceTo = priceTo === "" || itemPrice <= Number(priceTo);

      return matchesSearch && matchesFabric && matchesColor && matchesPriceFrom && matchesPriceTo;
    }).sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (sortOrder === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      if (sortOrder === "price_low") return Number(a.price) - Number(b.price);
      if (sortOrder === "price_high") return Number(b.price) - Number(a.price);
      if (sortOrder === "alpha_a") return a.name.localeCompare(b.name);
      if (sortOrder === "alpha_z") return b.name.localeCompare(a.name);
      return 0;
    });
  }, [products, categoryFilter, searchQuery, sortOrder, priceFrom, priceTo, selectedColor, selectedFabric]);

  const displayName = categoryFilter !== "All" ? categoryFilter : (searchQuery ? `Search: "${searchQuery}"` : "All Sarees");

  const availableColors = [...new Set(products.map(p => p.color).filter(Boolean))];
  const availableCategories = [...new Set(products.map(p => p.category).filter(Boolean))];

  function clearAllFilters() {
    setPriceFrom("");
    setPriceTo("");
    setSelectedColor("");
    setSelectedFabric("");
  }

  return (
    <div className="category-page" style={{ padding: '34px clamp(18px, 4vw, 54px) 64px', minHeight: 'calc(100vh - 67px)', background: '#fff', position: 'relative' }}>
      <div style={{ marginBottom: '30px', fontSize: '13px', color: '#6f5b52' }}>
        <a href="#home" style={{ color: 'inherit', textDecoration: 'underline' }} onClick={() => window.location.reload()}>Home</a> / <span style={{ color: '#261d1b' }}>{displayName}</span>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '400', margin: '0' }}>
          {displayName} <span style={{ fontSize: '14px', color: '#888', verticalAlign: 'top', marginLeft: '4px' }}>({filteredProducts.length})</span>
        </h1>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', borderBottom: '1px solid #eee', padding: '16px 0', marginBottom: '30px', fontSize: '14px' }}>
        <button 
          onClick={() => setIsFilterOpen(true)}
          style={{ background: 'none', border: 'none', color: '#261d1b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', padding: 0 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6"></path></svg>
          Filters
        </button>
        <select style={{ border: 'none', outline: 'none', background: 'transparent', cursor: 'pointer', color: '#261d1b' }} value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Date, new to old</option>
          <option value="oldest">Date, old to new</option>
          <option value="price_low">Price, low to high</option>
          <option value="price_high">Price, high to low</option>
          <option value="alpha_a">Alphabetically, A-Z</option>
          <option value="alpha_z">Alphabetically, Z-A</option>
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

      {/* Filters Side Drawer */}
      {isFilterOpen && (
        <>
          <div 
            style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000 }}
            onClick={() => setIsFilterOpen(false)}
          />
          <div 
            style={{ 
              position: 'fixed', top: 0, left: 0, width: '320px', maxWidth: '85vw', height: '100vh', 
              backgroundColor: '#fff', zIndex: 1001, display: 'flex', flexDirection: 'column',
              boxShadow: '4px 0 15px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', borderBottom: '1px solid #eee' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 500, margin: 0 }}>Filters</h2>
              <button 
                onClick={() => setIsFilterOpen(false)} 
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
              >
                <BsX size={28} color="#333" />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
              
              {/* Price Filter */}
              <div style={{ marginBottom: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', color: '#333' }}>Price</span>
                  <button onClick={() => { setPriceFrom(""); setPriceTo(""); }} style={{ background: 'none', border: 'none', fontSize: '12px', color: '#888', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>Reset</button>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>From</span>
                    <input type="number" placeholder="₹ 0" value={priceFrom} onChange={e => setPriceFrom(e.target.value)} style={{ width: '100%', padding: '8px 12px', background: '#f5f5f5', border: 'none', borderRadius: '4px', fontSize: '14px', minHeight: '36px' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px' }}>To</span>
                    <input type="number" placeholder="₹ Max" value={priceTo} onChange={e => setPriceTo(e.target.value)} style={{ width: '100%', padding: '8px 12px', background: '#f5f5f5', border: 'none', borderRadius: '4px', fontSize: '14px', minHeight: '36px' }} />
                  </div>
                </div>
              </div>

              {/* Color Filter */}
              <div style={{ marginBottom: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', color: '#333' }}>Color</span>
                  <button onClick={() => setSelectedColor("")} style={{ background: 'none', border: 'none', fontSize: '12px', color: '#888', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>Reset</button>
                </div>
                <select value={selectedColor} onChange={e => setSelectedColor(e.target.value)} style={{ width: '100%', padding: '10px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}>
                  <option value="">All Colors</option>
                  {availableColors.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Fabric/Category Filter */}
              <div style={{ marginBottom: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontSize: '14px', color: '#333' }}>Fabric / Category</span>
                  <button onClick={() => setSelectedFabric("")} style={{ background: 'none', border: 'none', fontSize: '12px', color: '#888', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}>Reset</button>
                </div>
                <select value={selectedFabric} onChange={e => setSelectedFabric(e.target.value)} style={{ width: '100%', padding: '10px', background: '#fff', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }}>
                  <option value="">All Fabrics</option>
                  {availableCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

            </div>

            <div style={{ padding: '20px', borderTop: '1px solid #eee', background: '#fff', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <button 
                onClick={() => setIsFilterOpen(false)}
                style={{ width: '100%', padding: '14px', background: '#d32f2f', color: 'white', border: 'none', borderRadius: '4px', fontWeight: '500', fontSize: '15px', cursor: 'pointer' }}
              >
                Showing {filteredProducts.length} Results
              </button>
              <button 
                onClick={clearAllFilters}
                style={{ width: '100%', padding: '8px', background: 'none', color: '#666', border: 'none', textDecoration: 'underline', fontSize: '14px', cursor: 'pointer' }}
              >
                Clear all
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
