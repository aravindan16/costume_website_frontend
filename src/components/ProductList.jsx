import React, { useMemo, useState } from 'react';
import { useAppContext } from '../AppContext';
import ProductCard from './ProductCard';

export default function ProductList() {
  const { products } = useAppContext();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(products.map((item) => item.category)))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const searchText = `${item.name} ${item.category} ${item.color}`.toLowerCase();
      return matchesCategory && searchText.includes(query.toLowerCase());
    });
  }, [products, category, query]);

  return (
    <section className="shop-band" id="collection">
      <div className="section-heading">
        <p>Curated collection</p>
        <h2>Choose your next saree</h2>
      </div>

      <div className="tools">
        <label>
          Search
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Silk, bridal, cotton..." />
        </label>
        <label>
          Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
