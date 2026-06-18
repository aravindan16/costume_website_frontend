import React from 'react';
import { useAppContext } from '../AppContext';

const occasions = [
  { name: 'Weddings & Events', image: '/occ_wedding_1781765087891.png' },
  { name: 'Evenings & Celebrations', image: '/occ_evenings_1781765120173.png' },
  { name: 'Festive', image: '/occ_festive_1781765133027.png' },
  { name: 'Work & Everyday Elegance', image: '/occ_work_1781765149307.png' },
  { name: 'Gifting', image: '/occ_gifting_1781765163141.png' }
];

export default function ShopByOccasion() {
  const { setSearchQuery, setView } = useAppContext();

  const handleOccasionClick = (occasionName) => {
    setSearchQuery(occasionName.split(' ')[0]); // Searching for 'Wedding', 'Evening', etc.
    setView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="category-section occasion-section">
      <div className="section-heading compact center-align">
        <p>Shop by Occasion</p>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 300, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          Inspired by women who wear tradition differently.
        </h2>
      </div>
      <div className="occasion-container">
        {occasions.map((occasion) => (
          <div key={occasion.name} className="occasion-card" onClick={() => handleOccasionClick(occasion.name)}>
            <img src={occasion.image} alt={occasion.name} />
            <div className="occasion-overlay">
              <h3 className="occasion-title">{occasion.name}</h3>
              <button className="shop-now-btn">Shop Now</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
