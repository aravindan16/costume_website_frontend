import React, { useState, useEffect } from 'react';

const heroImages = [
  '/hero_banner_1_1781767225017.png',
  '/hero_banner_2_1781767239930.png',
  '/hero_banner_3_1781767252820.png'
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero" id="top" style={{ position: 'relative', overflow: 'hidden' }}>
      {heroImages.map((src, idx) => (
        <img 
          key={src}
          src={src} 
          alt={`Hero banner ${idx + 1}`} 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: idx === currentImageIndex ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            zIndex: 0
          }}
        />
      ))}
      <div className="hero-copy" style={{ zIndex: 1 }}>
        <p>Fresh festive drapes</p>
        <h1>Nilavalayam</h1>
        <span>Silk, cotton, bridal, and party wear sarees selected for graceful everyday shopping.</span>
        <a href="#collection" className="primary-link">Shop Sarees</a>
      </div>
      
      <div style={{ position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 2 }}>
        {heroImages.map((_, idx) => (
          <button 
            key={idx}
            onClick={() => setCurrentImageIndex(idx)}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              border: 'none',
              background: idx === currentImageIndex ? '#fff' : 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              padding: 0,
              transition: 'background 0.3s ease'
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
