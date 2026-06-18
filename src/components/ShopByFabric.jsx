import React from 'react';
import { useAppContext } from '../AppContext';

const fabrics = [
  { name: 'Silk Sarees', image: '/fabric_silk_1781764976371.png' },
  { name: 'Cotton Sarees', image: '/fabric_cotton_1781764993216.png' },
  { name: 'Tussar', image: '/fabric_tussar_1781765006974.png' },
  { name: 'Georgette Sarees', image: '/fabric_georgette_1781765019283.png' },
  { name: 'Banarasi Sarees', image: '/fabric_banarasi_1781765048488.png' },
  { name: 'Jute Sarees', image: '/fabric_jute_1781765060135.png' },
  { name: 'Art Silk', image: '/fabric_art_silk_1781765074192.png' }
];

export default function ShopByFabric() {
  const { setCategoryFilter, setView } = useAppContext();

  const handleFabricClick = (fabricName) => {
    setCategoryFilter(fabricName);
    setView('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="category-section">
      <div className="section-heading compact center-align">
        <p>Shop by Fabric</p>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 300, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
          A century of craft. A new way to wear tradition
        </h2>
      </div>
      <div className="fabric-container">
        {fabrics.map((fabric) => (
          <div key={fabric.name} className="fabric-item" onClick={() => handleFabricClick(fabric.name)}>
            <div className="fabric-circle">
              <img src={fabric.image} alt={fabric.name} />
            </div>
            <span className="fabric-name">{fabric.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
