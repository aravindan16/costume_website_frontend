import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { money, cartWhatsappLink } from '../utils';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, setCart } = useAppContext();
  const [customer, setCustomer] = useState({ name: "", phone: "", address: "" });
  
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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

  function placeOrder(event) {
    event.preventDefault();
    if (!cart.length) {
      toast.error("Please add at least one saree to the cart.");
      return;
    }
    window.open(cartWhatsappLink(cart, customer, subtotal), "_blank", "noreferrer");
    toast.success("WhatsApp opened with your cart details.");
  }

  return (
    <section className="cart-layout" id="cart">
      <div className="cart-panel">
        <div className="section-heading compact">
          <p>Your selection</p>
          <h2>Shopping cart</h2>
        </div>
        {cart.length === 0 ? (
          <p className="muted">Your cart is empty.</p>
        ) : (
          <div className="cart-list">
            {cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{money(item.price)}</span>
                </div>
                <div className="stepper" aria-label={`${item.name} quantity`}>
                  <button type="button" onClick={() => changeQuantity(item.id, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button type="button" onClick={() => changeQuantity(item.id, 1)}>+</button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="total-row">
          <span>Total</span>
          <strong>{money(subtotal)}</strong>
        </div>
      </div>

      <form className="checkout" onSubmit={placeOrder}>
        <div className="section-heading compact">
          <p>Order request</p>
          <h2>Customer details</h2>
        </div>
        <label>
          Name
          <input required value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} />
        </label>
        <label>
          Phone
          <input required value={customer.phone} onChange={(e) => setCustomer({ ...customer, phone: e.target.value })} />
        </label>
        <label>
          Address
          <textarea required rows="4" value={customer.address} onChange={(e) => setCustomer({ ...customer, address: e.target.value })} />
        </label>
        <button type="submit" className="checkout-button">Buy Cart on WhatsApp</button>
      </form>
    </section>
  );
}
