import React, { useMemo } from 'react';
import { useAppContext } from '../AppContext';
import ProductCard from './ProductCard';

export default function ProductList() {
  const { products, categoryFilter, setCategoryFilter, searchQuery, setSearchQuery } = useAppContext();

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((item) => item.category)))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
      const searchText = `${item.name} ${item.category} ${item.color}`.toLowerCase();
      return matchesCategory && searchText.includes(searchQuery.toLowerCase());
    });
  }, [products, categoryFilter, searchQuery]);

  return (
    <section className="shop-band" id="collection">
      <div className="section-heading">
        <p>Curated collection</p>
        <h2>Choose your next saree</h2>
      </div>

      <div className="tools">
        <label>
          Search
          <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Silk, bridal, cotton..." />
        </label>
        <label>
          Category
          <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="product-grid">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
