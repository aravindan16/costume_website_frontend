import React from 'react';
import { useAppContext } from '../AppContext';

export default function ContactUs() {
  const { setView } = useAppContext();

  return (
    <div className="contact-us-container" style={{ padding: '0', margin: '0 auto', color: '#333', minHeight: '60vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2rem 1rem 2rem', fontSize: '0.9rem', color: '#888', textAlign: 'left' }}>
        <a href="#home" onClick={(e) => { e.preventDefault(); setView('shop'); }} style={{ color: '#888', textDecoration: 'none', cursor: 'pointer' }}>Homepage</a> 
        <span style={{ margin: '0 8px' }}>&gt;</span> 
        <span style={{ color: '#333' }}>Contact Us</span>
      </div>
      
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#5c1039', fontWeight: '600' }}>Address details</h1>
      
      <div style={{ lineHeight: '1.8', fontSize: '1.05rem', marginBottom: '2rem' }}>
        <p style={{ margin: '0 0 5px 0' }}>268 murugan st, chinnapudhur</p>
        <p style={{ margin: '0 0 5px 0' }}>salem 636007</p>
        <p style={{ margin: '0' }}>India <a href="#" style={{ textDecoration: 'underline', color: '#5c1039', marginLeft: '5px' }}>Open in Google Maps ↗</a></p>
      </div>

      <div style={{ marginBottom: '4rem', fontSize: '0.95rem' }}>
        <a href="#track" style={{ textDecoration: 'underline', color: '#5c1039' }}>Track your last order</a>, <a href="#orders" style={{ textDecoration: 'underline', color: '#5c1039' }}>view all orders</a> or <a href="#account" style={{ textDecoration: 'underline', color: '#5c1039' }}>manage your addresses.</a>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', border: '1px solid #eee', borderRadius: '8px', padding: '1.5rem 0' }}>
        <div style={{ flex: '1 1 250px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', borderRight: '1px solid #eee', padding: '1rem' }}>
          <span style={{ fontSize: '1.4rem' }}>📞</span> <strong style={{ fontSize: '0.95rem' }}>+91 8220201096</strong>
        </div>
        <div style={{ flex: '1 1 250px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', borderRight: '1px solid #eee', padding: '1rem' }}>
          <span style={{ fontSize: '1.4rem' }}>✉️</span> <strong style={{ fontSize: '0.95rem' }}>support@nilavalayam.in</strong>
        </div>
        <div style={{ flex: '1 1 250px', display: 'flex', alignItems: 'center', gap: '12px', justifyContent: 'center', padding: '1rem' }}>
          <span style={{ fontSize: '1.4rem', color: '#25D366' }}>💬</span> <strong style={{ fontSize: '0.95rem' }}>Ask your questions on WhatsApp</strong>
        </div>
      </div>
      </div>
    </div>
  );
}
