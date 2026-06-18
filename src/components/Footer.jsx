import React from 'react';
import { useAppContext } from '../AppContext';

export default function Footer() {
  const { setView } = useAppContext();

  return (
    <footer style={{ backgroundColor: '#5c1039', color: '#fff', padding: '2rem 1.5rem', marginTop: 'auto', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '1.5rem' }}>
        
        {/* Brand Column */}
        <div style={{ flex: '1 1 200px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '1px' }}>NILAVALAYAM</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '1.8' }}>
            <li><a href="#about" onClick={() => setView('about')} style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>ABOUT US</a></li>
            <li><a href="#why-choose-us" onClick={() => setView('why-choose-us')} style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>WHY CHOOSE US</a></li>
            <li><a href="#purpose" onClick={() => setView('purpose')} style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>OUR PURPOSE</a></li>
            <li><a href="#mission" onClick={() => setView('mission')} style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>MISSION</a></li>
            <li><a href="#reviews" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>HEAR FROM OUR CUSTOMERS</a></li>
          </ul>
        </div>

        {/* Policies Column */}
        <div style={{ flex: '1 1 200px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '1px' }}>POLICIES</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, lineHeight: '1.8' }}>
            <li><a href="#returns" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>RETURNS</a></li>
            <li><a href="#terms" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>TERMS & CONDITIONS</a></li>
            <li><a href="#shipping" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>DOMESTIC & INTERNATIONAL SHIPPING</a></li>
            <li><a href="#privacy" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>PRIVACY POLICY</a></li>
            <li><a href="#donotsell" style={{ color: '#fff', textDecoration: 'none', fontSize: '0.9rem', opacity: 0.8 }}>DO NOT SELL MY INFORMATION</a></li>
          </ul>
        </div>

        {/* Support & Stores Column */}
        <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '1rem', letterSpacing: '1px' }}>SUPPORT</h3>
            <div style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.6' }}>
              <p style={{ margin: '0 0 5px 0' }}>Call : +91 1234567890</p>
              <p style={{ margin: '0 0 5px 0' }}>Email : support@nilavalayam.in</p>
              <p style={{ marginTop: '0.5rem', marginBottom: '0' }}><a href="#track" style={{ color: '#fff', textDecoration: 'underline' }}>INITIATE OR TRACK YOUR RETURN</a></p>
            </div>
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0', letterSpacing: '1px' }}>
              <a href="#contact" onClick={() => setView('contact')} style={{ color: '#fff', textDecoration: 'none' }}>CONTACT US</a>
            </h3>
          </div>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.8rem', opacity: 0.6, borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1rem' }}>
        © 2026 Nilavalayam Sarees
      </div>
    </footer>
  );
}
