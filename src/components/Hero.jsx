import React from 'react';

export default function Hero() {
  return (
    <section className="hero" id="top">
      <img src="/nilla-sarres-hero.png" alt="Elegant sarees arranged inside a boutique" />
      <div className="hero-copy">
        <p>Fresh festive drapes</p>
        <h1>Nilavalayam</h1>
        <span>Silk, cotton, bridal, and party wear sarees selected for graceful everyday shopping.</span>
        <a href="#collection" className="primary-link">Shop Sarees</a>
      </div>
    </section>
  );
}
