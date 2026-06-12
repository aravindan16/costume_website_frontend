import React, { useState } from 'react';
import { useAppContext } from '../AppContext';

const whyChooseUsData = [
  { title: "Direct from the Weaving Source", content: "Every saree is sourced directly from skilled weaving communities, ensuring authenticity, transparency, and exceptional value." },
  { title: "Craftsmanship with Purpose", content: "Each creation reflects meticulous attention to detail, combining traditional techniques with refined artistry." },
  { title: "Quality Without Compromise", content: "We use carefully selected materials and rigorous quality standards to deliver products that are both beautiful and durable." },
  { title: "Heritage-Inspired Designs", content: "Our collections celebrate the richness of traditional weaving while incorporating contemporary aesthetics for today's woman." },
  { title: "Customization & Exclusive Collections", content: "We offer thoughtfully curated designs and select customization options to meet individual preferences and special occasions." },
  { title: "Ethically Crafted", content: "By working closely with weaving artisans, we support sustainable livelihoods and help preserve a valuable cultural heritage." },
  { title: "Customer-Centric Experience", content: "From product selection to delivery, we are committed to providing a seamless, reliable, and satisfying shopping experience." },
  { title: "Trusted Legacy", content: "Built on generations of weaving knowledge, our brand stands for trust, authenticity, and enduring craftsmanship." },
  { title: "Timeless Value", content: "Every saree is designed to be more than a purchase—it's an investment in elegance, tradition, and lasting quality." },
];

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState(0);
  const { view, setView } = useAppContext();

  return (
    <div className="about-us-container" style={{ padding: '0', margin: '0 auto', color: '#333' }}>
      
      {/* Breadcrumbs */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 2rem 1rem 2rem', fontSize: '0.9rem', color: '#888', textAlign: 'left' }}>
        <a href="#home" onClick={(e) => { e.preventDefault(); setView('shop'); }} style={{ color: '#888', textDecoration: 'none', cursor: 'pointer' }}>Homepage</a> 
        <span style={{ margin: '0 8px' }}>&gt;</span> 
        <span style={{ color: '#333' }}>
          {view === 'about' ? 'About Us' : 
           view === 'purpose' ? 'Our Purpose' : 
           view === 'mission' ? 'Mission' : 
           view === 'why-choose-us' ? 'Why Choose Us' : ''}
        </span>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem', minHeight: '40vh' }}>
        
        {view === 'about' && (
          <section style={{ textAlign: 'left', marginBottom: '4rem' }}>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#5c1039', fontWeight: '600' }}>About Us</h1>
            <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#333' }}>
              <p style={{ marginBottom: '1.5rem' }}>
                At Nilavalayam, we believe that a saree is not just a piece of clothing but an expression of tradition, culture, and elegance. With years of experience in curating exquisite sarees, Nilavalayam has become a name synonymous with authenticity, quality, and timeless style.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                Rooted in a legacy of weaving, we are committed to bringing exceptional craftsmanship and timeless elegance to every saree we create. Our journey is inspired by generations of expertise, dedication, and a deep appreciation for the rich heritage of Indian textiles.
              </p>
              <p style={{ marginBottom: '1.5rem' }}>
                We combine traditional weaving techniques with contemporary design sensibilities to offer sarees that reflect sophistication, quality, and authenticity. Every piece is thoughtfully crafted, ensuring attention to detail, superior workmanship, and lasting value.
              </p>
              <p>
                Our vision is to make heritage-inspired sarees accessible to customers who appreciate fine craftsmanship and distinctive designs. By preserving the essence of traditional weaving while embracing modern preferences, we strive to create collections that are both meaningful and enduring.
              </p>
            </div>
          </section>
        )}

        {view === 'purpose' && (
          <section style={{ textAlign: 'left', marginBottom: '4rem' }}>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#5c1039', fontWeight: '600' }}>Our Purpose</h1>
            <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#333' }}>
              <p>
                From the hands of dedicated weavers to the wardrobes of confident women, we strive to transform every thread into a symbol of grace, heritage, and pride.
              </p>
            </div>
          </section>
        )}

        {view === 'mission' && (
          <section style={{ textAlign: 'left', marginBottom: '4rem' }}>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#5c1039', fontWeight: '600' }}>Mission</h1>
            <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#333' }}>
              <ul style={{ listStyleType: 'disc', paddingLeft: '20px', margin: 0 }}>
                {[
                  "To support and celebrate the artistry of skilled weavers.",
                  "To deliver premium-quality sarees with authenticity and care.",
                  "To blend traditional weaving techniques with contemporary preferences.",
                  "To ensure customer satisfaction through excellence and trust."
                ].map((mission, index) => (
                  <li key={index} style={{ marginBottom: '0.5rem' }}>
                    {mission}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {view === 'why-choose-us' && (
          <section id="why-choose-us" style={{ textAlign: 'left', marginBottom: '4rem' }}>
            <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', color: '#5c1039', fontWeight: '600' }}>Why Choose Us?</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {whyChooseUsData.map((item, index) => (
                <div key={index} style={{ border: '1px solid #eaeaea', borderRadius: '8px', overflow: 'hidden', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
                  <button 
                    onClick={() => setActiveTab(activeTab === index ? null : index)}
                    style={{ 
                      width: '100%', 
                      padding: '1.5rem', 
                      backgroundColor: activeTab === index ? '#fcfaf5' : '#fff', 
                      border: 'none', 
                      textAlign: 'left', 
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600', color: '#1a1a1a' }}>{item.title}</h3>
                    <span style={{ 
                      transform: activeTab === index ? 'rotate(180deg)' : 'none', 
                      transition: 'transform 0.3s ease',
                      color: '#d4af37',
                      fontSize: '1.2rem'
                    }}>▼</span>
                  </button>
                  <div 
                    style={{ 
                      maxHeight: activeTab === index ? '200px' : '0',
                      overflow: 'hidden',
                      transition: 'max-height 0.3s ease-in-out',
                    }}
                  >
                    <div style={{ padding: '0 1.5rem 1.5rem 1.5rem', backgroundColor: '#fcfaf5', lineHeight: '1.6', color: '#555', fontSize: '1.1rem' }}>
                      {item.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
