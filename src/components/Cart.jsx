import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { money, cartWhatsappLink, productImageUrl } from '../utils';
import toast from 'react-hot-toast';
import { BsTrash, BsX } from 'react-icons/bs';

export default function Cart() {
  const { cart, setCart, isCartOpen, setIsCartOpen } = useAppContext();
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  function changeQuantity(id, delta) {
    setCart((current) =>
      current
        .map((item) => ({
          ...item,
          quantity: item.id === id ? item.quantity + delta : item.quantity,
        }))
        .filter((item) => item.quantity > 0),
    );
  }

  function removeItem(id) {
    setCart(current => current.filter(item => item.id !== id));
  }

  function placeOrder(event) {
    event.preventDefault();
    if (!cart.length) {
      toast.error("Please add at least one saree to the cart.");
      return;
    }
    window.open(cartWhatsappLink(cart, customer, subtotal), "_blank", "noreferrer");
    toast.success("WhatsApp opened with your cart details.");
  }

  if (!isCartOpen) return null;

  return (
    <>
      <div 
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }}
        onClick={() => setIsCartOpen(false)}
      />
      <div 
        style={{ 
          position: 'fixed', top: 0, right: 0, width: '400px', maxWidth: '100vw', height: '100%', 
          backgroundColor: '#fff', zIndex: 1000, display: 'flex', flexDirection: 'column',
          boxShadow: '-4px 0 15px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', borderBottom: '1px solid #eee' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 300, margin: 0 }}>Cart ({totalItems})</h2>
          <button 
            onClick={() => setIsCartOpen(false)} 
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 0 }}
          >
            <BsX size={32} color="#333" />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {cart.length === 0 ? (
            <p className="muted">Your cart is empty.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '16px' }}>
                  <img src={productImageUrl(item)} alt={item.name} style={{ width: '100px', height: '130px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 400, margin: 0, lineHeight: 1.4 }}>{item.name}</h3>
                    <span style={{ fontSize: '15px', fontWeight: 500 }}>{money(item.price)}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: 'auto' }}>
                      <div style={{ display: 'flex', alignItems: 'center', background: '#f5f5f5', borderRadius: '4px', overflow: 'hidden' }}>
                        <button type="button" onClick={() => changeQuantity(item.id, -1)} style={{ background: 'transparent', border: 'none', padding: '6px 12px', fontSize: '18px', cursor: 'pointer', color: '#666' }}>&minus;</button>
                        <span style={{ fontSize: '15px', padding: '0 8px', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                        <button type="button" onClick={() => changeQuantity(item.id, 1)} style={{ background: 'transparent', border: 'none', padding: '6px 12px', fontSize: '18px', cursor: 'pointer', color: '#666' }}>&#43;</button>
                      </div>
                      <button type="button" onClick={() => removeItem(item.id)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#666', padding: '4px' }} aria-label="Remove item">
                        <BsTrash size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ padding: '24px', borderTop: '1px solid #eee', background: '#fbfbfb' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <span style={{ fontSize: '16px', fontWeight: 500 }}>Total</span>
            <strong style={{ fontSize: '20px' }}>{money(subtotal)}</strong>
          </div>
          
          <form onSubmit={placeOrder} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input required placeholder="Your Name" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
            <input required placeholder="Phone Number" value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px' }} />
            <textarea required placeholder="Delivery Address" rows="3" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', resize: 'vertical' }} />
            <button type="submit" className="checkout-button" style={{ marginTop: '8px' }}>Buy Cart on WhatsApp</button>
          </form>
        </div>
      </div>
    </>
  );
}
