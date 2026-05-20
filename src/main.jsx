import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const WHATSAPP_NUMBER = '917010802868';
const emptyAdminProduct = {
  name: '',
  category: '',
  price: '',
  color: '',
  stock: '',
  description: '',
  images: []
};
const emptySignup = { name: '', phone: '', email: '', password: '' };
const emptyLogin = { email: '', password: '' };

const fallbackProducts = [
  {
    id: 'fallback-1',
    name: 'Peacock Blue Silk Saree',
    category: 'Silk',
    price: 4299,
    color: 'Peacock Blue',
    stock: 8,
    image: '/nilla-sarres-hero.png',
    description: 'Rich silk finish with a woven border for weddings and festive evenings.'
  },
  {
    id: 'fallback-2',
    name: 'Rose Gold Party Saree',
    category: 'Party Wear',
    price: 2899,
    color: 'Rose Gold',
    stock: 12,
    image: '/nilla-sarres-hero.png',
    description: 'Soft drape, light shimmer, and a comfortable blouse-ready fall.'
  },
  {
    id: 'fallback-3',
    name: 'Ivory Cotton Saree',
    category: 'Cotton',
    price: 1499,
    color: 'Ivory',
    stock: 15,
    image: '/nilla-sarres-hero.png',
    description: 'Everyday elegance with breathable cotton and a crisp woven texture.'
  },
  {
    id: 'fallback-4',
    name: 'Emerald Bridal Saree',
    category: 'Bridal',
    price: 6999,
    color: 'Emerald',
    stock: 4,
    image: '/nilla-sarres-hero.png',
    description: 'Statement saree with a grand border and jewel-tone festive finish.'
  }
];

function money(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(value);
}

function productImageUrl(product) {
  const image = product.image || '/nilla-sarres-hero.png';
  if (image.startsWith('http://') || image.startsWith('https://')) {
    return image;
  }
  if (image.startsWith('/uploads/')) {
    return `${API_URL}${image}`;
  }
  return `${window.location.origin}${image}`;
}

function productShareUrl(product) {
  return `${window.location.origin}${window.location.pathname}#product=${encodeURIComponent(product.id)}`;
}

function whatsappLink(product) {
  const message = [
    `Hi Nilla Sarres, I want to buy ${product.name} (${money(product.price)}).`,
    `Saree image: ${productImageUrl(product)}`,
    'Please share more details.'
  ].join('\n');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function cartWhatsappLink(cart, customer, total) {
  const itemLines = cart.flatMap((item, index) => [
    `${index + 1}. ${item.name}`,
    `   Qty: ${item.quantity}`,
    `   Price: ${money(item.price)} each`,
    `   Subtotal: ${money(item.price * item.quantity)}`,
    `   Image: ${productImageUrl(item)}`
  ]);

  const message = [
    'Hi Nilla Sarres, I want to buy these sarees:',
    '',
    ...itemLines,
    '',
    `Total: ${money(total)}`,
    '',
    'Customer details:',
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `Address: ${customer.address}`,
    '',
    'Please confirm availability and payment details.'
  ].join('\n');

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function App() {
  const [products, setProducts] = useState(fallbackProducts);
  const [cart, setCart] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [customer, setCustomer] = useState({ name: '', phone: '', address: '' });
  const [status, setStatus] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [selectedProduct]);

  const [view, setView] = useState('shop');
  const [showSignup, setShowSignup] = useState(() => !localStorage.getItem('nillaAccount'));
  const [showAccount, setShowAccount] = useState(false);
  const [accountMode, setAccountMode] = useState('login');
  const [signup, setSignup] = useState(emptySignup);
  const [login, setLogin] = useState(emptyLogin);
  const [currentAccount, setCurrentAccount] = useState(() => {
    const saved = localStorage.getItem('nillaAccount');
    if (!saved) return null;
    const account = JSON.parse(saved);
    return account.role === 'admin' ? null : account;
  });
  const [adminPassword, setAdminPassword] = useState('');
  const [adminProduct, setAdminProduct] = useState(emptyAdminProduct);
  const [adminTab, setAdminTab] = useState('upload');
  const [editingProduct, setEditingProduct] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [adminStatus, setAdminStatus] = useState('');
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (adminProduct.images && adminProduct.images.length > 0) {
      const urls = adminProduct.images.map((file) => URL.createObjectURL(file));
      setImagePreviews(urls);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    } else if (editingProduct && editingProduct.images && editingProduct.images.length > 0) {
      setImagePreviews(editingProduct.images.map((img) => productImageUrl({ image: img })));
    } else if (editingProduct && editingProduct.image) {
      setImagePreviews([productImageUrl(editingProduct)]);
    } else {
      setImagePreviews([]);
    }
  }, [adminProduct.images, editingProduct]);

  const isAdmin = currentAccount?.role === 'admin';

  function loadProducts() {
    return fetch(`${API_URL}/api/products`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setProducts)
      .catch(() => setProducts(fallbackProducts));
  }

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const selectProductFromHash = () => {
      if (!window.location.hash.startsWith('#product=')) {
        setSelectedProduct(null);
        return;
      }

      const productId = window.location.hash.replace('#product=', '');
      if (!productId) {
        setSelectedProduct(null);
        return;
      }

      const matchingProduct = products.find((product) => product.id === decodeURIComponent(productId));
      if (matchingProduct) {
        setSelectedProduct(matchingProduct);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    selectProductFromHash();
    window.addEventListener('hashchange', selectProductFromHash);
    return () => window.removeEventListener('hashchange', selectProductFromHash);
  }, [products]);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map((item) => item.category)))],
    [products]
  );

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory = category === 'All' || item.category === category;
      const searchText = `${item.name} ${item.category} ${item.color}`.toLowerCase();
      return matchesCategory && searchText.includes(query.toLowerCase());
    });
  }, [products, category, query]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function openProduct(product) {
    setSelectedProduct(product);
    setView('shop');
    window.history.pushState(null, '', productShareUrl(product));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeProduct() {
    setSelectedProduct(null);
    setView('shop');
    window.history.pushState(null, '', `${window.location.pathname}#collection`);
    window.setTimeout(() => {
      document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  }

  function openShop() {
    setView('shop');
    setSelectedProduct(null);
  }

  function openAdmin() {
    if (!isAdmin) {
      setAccountMode('login');
      setShowAccount(true);
      setStatus('Login with the admin account to upload sarees.');
      return;
    }
    setView('admin');
    setSelectedProduct(null);
    setShowAccount(false);
    window.history.pushState(null, '', `${window.location.pathname}#admin`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeSignup() {
    setShowSignup(false);
  }

  function openProfileOrSignup() {
    if (currentAccount) {
      setShowAccount(true);
      return;
    }
    setAccountMode('signup');
    setShowSignup(true);
  }

  function saveAccount(account) {
    setCurrentAccount(account);
    if (account.role === 'admin') {
      localStorage.removeItem('nillaAccount');
    } else {
      localStorage.setItem('nillaAccount', JSON.stringify(account));
    }
  }

  function logout() {
    setCurrentAccount(null);
    setAdminPassword('');
    localStorage.removeItem('nillaAccount');
    openShop();
    setShowAccount(false);
    setShowSignup(true);
    setStatus('Logged out.');
  }

  async function submitSignup(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signup)
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Signup failed.');
      }
      const account = await response.json();
      saveAccount(account);
      setCustomer((current) => ({
        ...current,
        name: account.name || current.name,
        phone: account.phone || current.phone
      }));
      setSignup(emptySignup);
      closeSignup();
      setShowAccount(false);
      setStatus('User account created.');
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function submitLogin(event) {
    event.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(login)
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Login failed.');
      }
      const account = await response.json();
      saveAccount(account);
      setAdminPassword(account.role === 'admin' ? login.password : '');
      setCustomer((current) => ({
        ...current,
        name: account.name || current.name,
        phone: account.phone || current.phone
      }));
      setLogin(emptyLogin);
      setShowAccount(false);
      setShowSignup(false);
      setStatus(`${account.role === 'admin' ? 'Admin' : 'User'} login successful.`);
      if (account.role === 'admin') {
        setView('admin');
        window.history.pushState(null, '', `${window.location.pathname}#admin`);
      }
    } catch (error) {
      setStatus(error.message);
    }
  }

  async function submitAdminProduct(event) {
    event.preventDefault();
    if (!isAdmin) {
      setAdminStatus('Only the manual admin account can post sarees.');
      return;
    }

    const formData = new FormData();
    Object.entries(adminProduct).forEach(([key, value]) => {
      if (key === 'images') {
        if (Array.isArray(value)) {
          value.forEach((file) => {
            formData.append('images', file);
          });
        }
      } else if (value !== null && value !== '') {
        formData.append(key, value);
      }
    });

    if (editingProduct) {
      existingImages.forEach((img) => {
        formData.append('existing_images', img);
      });
    }

    try {
      const isEditing = Boolean(editingProduct);
      const response = await fetch(
        `${API_URL}/api/admin/products${isEditing ? `/${editingProduct.id}` : ''}`,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            'X-Admin-Email': currentAccount.email,
            'X-Admin-Password': adminPassword
          },
          body: formData
        }
      );
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Could not save saree.');
      }
      const savedProduct = await response.json();
      setProducts((current) => {
        if (isEditing) {
          return current.map((product) => (product.id === savedProduct.id ? savedProduct : product));
        }
        return [savedProduct, ...current];
      });
      setAdminProduct(emptyAdminProduct);
      setEditingProduct(null);
      setAdminTab('manage');
      event.currentTarget.reset();
      setAdminStatus(isEditing ? 'Saree updated successfully.' : 'Saree posted successfully.');
      await loadProducts();
    } catch (error) {
      setAdminStatus(error.message);
    }
  }

  function startEditProduct(product) {
    setEditingProduct(product);
    const imgs = product.images && product.images.length > 0
      ? product.images
      : [product.image || '/nilla-sarres-hero.png'];
    setExistingImages(imgs);
    setAdminProduct({
      name: product.name,
      category: product.category,
      price: String(product.price),
      color: product.color,
      stock: String(product.stock),
      description: product.description,
      images: []
    });
    setAdminTab('upload');
    setAdminStatus(`Editing ${product.name}.`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetAdminForm() {
    setEditingProduct(null);
    setExistingImages([]);
    setAdminProduct(emptyAdminProduct);
    setAdminStatus('');
  }

  async function deleteProduct(product) {
    if (!isAdmin) {
      setAdminStatus('Only the admin account can delete sarees.');
      return;
    }
    const confirmDelete = window.confirm(`Are you sure you want to delete the saree "${product.name}"?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API_URL}/api/admin/products/${product.id}`, {
        method: 'DELETE',
        headers: {
          'X-Admin-Email': currentAccount.email,
          'X-Admin-Password': adminPassword
        }
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || 'Could not delete saree.');
      }

      setProducts((current) => current.filter((item) => item.id !== product.id));
      setAdminStatus(`Saree "${product.name}" deleted successfully.`);
      
      if (editingProduct?.id === product.id) {
        resetAdminForm();
      }
      await loadProducts();
    } catch (error) {
      setAdminStatus(error.message);
    }
  }

  async function shareProduct(product) {
    const shareData = {
      title: `${product.name} - Nilla Sarres`,
      text: `Check this saree from Nilla Sarres: ${product.name} (${money(product.price)})`,
      url: productShareUrl(product)
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      setStatus('Product link copied. You can share it now.');
    } catch {
      setStatus('Sharing was cancelled.');
    }
  }

  function addToCart(product) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setStatus(`${product.name} added to cart.`);
  }

  function changeQuantity(id, delta) {
    setCart((current) =>
      current
        .map((item) => ({ ...item, quantity: item.id === id ? item.quantity + delta : item.quantity }))
        .filter((item) => item.quantity > 0)
    );
  }

  function placeOrder(event) {
    event.preventDefault();
    if (!cart.length) {
      setStatus('Please add at least one saree to the cart.');
      return;
    }

    window.open(cartWhatsappLink(cart, customer, subtotal), '_blank', 'noreferrer');
    setStatus('WhatsApp opened with your cart details.');
  }

  return (
    <main>
      <header className="nav">
        <a className="brand" href="#top" aria-label="Nilla Sarres home" onClick={openShop}>
          <img className="brand-logo" src="/websiteLogo.jpeg" alt="" />
          <span>Nilla Sarres</span>
        </a>
        <nav>
          <a href="#collection" onClick={openShop}>Collection</a>
          <a href="#cart" onClick={openShop}>
            Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </a>
          <button
            type="button"
            className="avatar-button"
            onClick={openProfileOrSignup}
            aria-label={currentAccount ? 'Open profile' : 'Open signup'}
            title={currentAccount ? currentAccount.name : 'Create account'}
          >
            {currentAccount ? (
              currentAccount.name.charAt(0).toUpperCase()
            ) : (
              <>
                <span className="avatar-head" />
                <span className="avatar-body" />
              </>
            )}
          </button>
        </nav>
      </header>

      {view === 'admin' ? (
        <section className="admin-page" id="admin">
          <div className="section-heading">
            <p>Admin role</p>
            <h2>Saree dashboard</h2>
          </div>

          {!isAdmin ? (
            <div className="admin-login">
              <p className="muted">Only the manual admin account can upload sarees.</p>
              <button
                type="button"
                className="checkout-button"
                onClick={() => {
                  setAccountMode('login');
                  setShowAccount(true);
                }}
              >
                Login to Continue
              </button>
            </div>
          ) : (
            <div className="admin-shell">
              <div className="admin-tabs" role="tablist" aria-label="Saree admin tabs">
                <button
                  type="button"
                  className={adminTab === 'upload' ? 'active' : ''}
                  onClick={() => setAdminTab('upload')}
                >
                  {editingProduct ? 'Edit Saree' : 'Upload Saree'}
                </button>
                <button
                  type="button"
                  className={adminTab === 'manage' ? 'active' : ''}
                  onClick={() => {
                    setAdminTab('manage');
                    resetAdminForm();
                  }}
                >
                  Manage Collection
                </button>
              </div>

              {adminTab === 'upload' ? (
                <form className="admin-form" onSubmit={submitAdminProduct}>
                  {editingProduct && (
                    <div className="edit-banner wide-field">
                      <span>Editing {editingProduct.name}</span>
                      <button type="button" className="share-button" onClick={resetAdminForm}>
                        Cancel Edit
                      </button>
                    </div>
                  )}
                  <label>
                    Saree name
                    <input
                      required
                      value={adminProduct.name}
                      onChange={(event) => setAdminProduct({ ...adminProduct, name: event.target.value })}
                    />
                  </label>
                  <label>
                    Category
                    <input
                      required
                      value={adminProduct.category}
                      onChange={(event) => setAdminProduct({ ...adminProduct, category: event.target.value })}
                      placeholder="Silk, Cotton, Bridal..."
                    />
                  </label>
                  <label>
                    Price
                    <input
                      required
                      min="1"
                      type="number"
                      value={adminProduct.price}
                      onChange={(event) => setAdminProduct({ ...adminProduct, price: event.target.value })}
                    />
                  </label>
                  <label>
                    Color
                    <input
                      required
                      value={adminProduct.color}
                      onChange={(event) => setAdminProduct({ ...adminProduct, color: event.target.value })}
                    />
                  </label>
                  <label>
                    Stock
                    <input
                      required
                      min="0"
                      type="number"
                      value={adminProduct.stock}
                      onChange={(event) => setAdminProduct({ ...adminProduct, stock: event.target.value })}
                    />
                  </label>
                  <label className="image-upload-label">
                    Saree images
                    <input
                      required={!editingProduct}
                      multiple
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) => setAdminProduct({ ...adminProduct, images: Array.from(event.target.files || []) })}
                    />
                  </label>
                  <div className="image-preview-container">
                    {/* Saved Images (if editing) */}
                    {editingProduct && existingImages.length > 0 && (
                      <div className="preview-section">
                        <span className="preview-title">Saved Images ({existingImages.length}) - Click &times; to remove</span>
                        <div className="image-preview-grid">
                          {existingImages.map((img, idx) => (
                            <div className="image-preview-wrapper existing-image-wrapper" key={idx}>
                              <img src={productImageUrl({ image: img })} alt={`Saved ${idx + 1}`} />
                              <button
                                type="button"
                                className="remove-preview-btn"
                                onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}
                                title="Remove this image"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Newly Selected Previews */}
                    <div className="preview-section">
                      <span className="preview-title">
                        {editingProduct ? 'Add New Images' : 'Saree Images Preview'} ({imagePreviews.length})
                      </span>
                      {imagePreviews.length > 0 ? (
                        <div className="image-preview-grid">
                          {imagePreviews.map((url, idx) => (
                            <div className="image-preview-wrapper new-image-wrapper" key={idx}>
                              <img src={url} alt={`New Preview ${idx + 1}`} />
                              <button
                                type="button"
                                className="remove-preview-btn"
                                onClick={() => {
                                  const updatedFiles = adminProduct.images.filter((_, i) => i !== idx);
                                  setAdminProduct({ ...adminProduct, images: updatedFiles });
                                }}
                                title="Remove this preview"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="image-preview-placeholder">
                          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                          <span>No new images selected</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <label className="wide-field">
                    Description
                    <textarea
                      required
                      rows="4"
                      value={adminProduct.description}
                      onChange={(event) => setAdminProduct({ ...adminProduct, description: event.target.value })}
                    />
                  </label>
                  <button type="submit" className="checkout-button">
                    {editingProduct ? 'Update Saree' : 'Post Saree'}
                  </button>
                  <button type="button" className="share-button" onClick={openShop}>View User Shop</button>
                  {adminStatus && <p className="status wide-field">{adminStatus}</p>}
                </form>
              ) : (
                <div className="manage-panel">
                  {products.length === 0 ? (
                    <div className="empty-manage-state">
                      <p>No sarees found. Use the first tab to upload a new saree!</p>
                    </div>
                  ) : (
                    products.map((product) => (
                      <article className="manage-row" key={product.id}>
                        <img src={productImageUrl(product)} alt={product.name} />
                        <div className="manage-row-details">
                          <strong>{product.name}</strong>
                          <span className="manage-row-meta">
                            <span className="badge-cat">{product.category}</span>
                            <span className="divider">•</span>
                            <span className="price-tag">{money(product.price)}</span>
                            <span className="divider">•</span>
                            <span className={`stock-status ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                              {product.stock} left
                            </span>
                          </span>
                        </div>
                        <div className="manage-row-actions">
                          <button
                            type="button"
                            className="share-button edit-action-btn"
                            onClick={() => startEditProduct(product)}
                            title="Edit Saree"
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                              <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                            </svg>
                            Edit
                          </button>
                          <button
                            type="button"
                            className="delete-action-btn"
                            onClick={() => deleteProduct(product)}
                            title="Delete Saree"
                          >
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                              <line x1="10" y1="11" x2="10" y2="17"/>
                              <line x1="14" y1="11" x2="14" y2="17"/>
                            </svg>
                            Delete
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </section>
      ) : selectedProduct ? (
        <section className="product-page" id="top">
          <button type="button" className="back-button" onClick={closeProduct}>Back to Collection</button>
          <div className="detail-layout">
            <div className="detail-gallery-container">
              <div className="detail-image">
                <img
                  src={productImageUrl({
                    image: (selectedProduct.images && selectedProduct.images.length > 0)
                      ? selectedProduct.images[activeImageIndex]
                      : selectedProduct.image
                  })}
                  alt={selectedProduct.name}
                />
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="carousel-btn prev-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex((prev) => (prev === 0 ? selectedProduct.images.length - 1 : prev - 1));
                      }}
                      aria-label="Previous image"
                    >
                      &#10094;
                    </button>
                    <button
                      type="button"
                      className="carousel-btn next-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex((prev) => (prev === selectedProduct.images.length - 1 ? 0 : prev + 1));
                      }}
                      aria-label="Next image"
                    >
                      &#10095;
                    </button>
                  </>
                )}
              </div>
              {selectedProduct.images && selectedProduct.images.length > 1 && (
                <div className="gallery-thumbnails">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`gallery-thumb-btn ${idx === activeImageIndex ? 'active' : ''}`}
                      onClick={() => setActiveImageIndex(idx)}
                    >
                      <img src={productImageUrl({ image: img })} alt="" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="detail-copy">
              <p className="detail-category">{selectedProduct.category}</p>
              <h1>{selectedProduct.name}</h1>
              <strong>{money(selectedProduct.price)}</strong>
              <p>{selectedProduct.description}</p>
              <dl className="detail-list">
                <div>
                  <dt>Color</dt>
                  <dd>{selectedProduct.color}</dd>
                </div>
                <div>
                  <dt>Available</dt>
                  <dd>{selectedProduct.stock} pieces</dd>
                </div>
              </dl>
              <div className="detail-actions">
                <a className="whatsapp-button" href={whatsappLink(selectedProduct)} target="_blank" rel="noreferrer">
                  Buy on WhatsApp
                </a>
                <button type="button" className="share-button" onClick={() => shareProduct(selectedProduct)}>
                  Share
                </button>
                <button type="button" onClick={() => addToCart(selectedProduct)}>Add to Cart</button>
              </div>
              {status && <p className="status">{status}</p>}
            </div>
          </div>
        </section>
      ) : (
        <>
          <section className="hero" id="top">
            <img src="/nilla-sarres-hero.png" alt="Elegant sarees arranged inside a boutique" />
            <div className="hero-copy">
              <p>Fresh festive drapes</p>
              <h1>Nilla Sarres</h1>
              <span>Silk, cotton, bridal, and party wear sarees selected for graceful everyday shopping.</span>
              <a href="#collection" className="primary-link">Shop Sarees</a>
            </div>
          </section>

          <section className="shop-band" id="collection">
            <div className="section-heading">
              <p>Curated collection</p>
              <h2>Choose your next saree</h2>
            </div>

            <div className="tools">
              <label>
                Search
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Silk, bridal, cotton..."
                />
              </label>
              <label>
                Category
                <select value={category} onChange={(event) => setCategory(event.target.value)}>
                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <article
                  className="product-card"
                  key={product.id}
                  role="button"
                  tabIndex="0"
                  onClick={() => openProduct(product)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') openProduct(product);
                  }}
                >
                  <img src={productImageUrl(product)} alt={product.name} />
                  <div>
                    <div className="card-topline">
                      <span>{product.category}</span>
                      <span>{product.stock} left</span>
                    </div>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <div className="buy-row">
                      <strong>{money(product.price)}</strong>
                      <button
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          openProduct(product);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </>
      )}

      {view === 'shop' && !selectedProduct && (
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
              <input
                required
                value={customer.name}
                onChange={(event) => setCustomer({ ...customer, name: event.target.value })}
              />
            </label>
            <label>
              Phone
              <input
                required
                value={customer.phone}
                onChange={(event) => setCustomer({ ...customer, phone: event.target.value })}
              />
            </label>
            <label>
              Address
              <textarea
                required
                rows="4"
                value={customer.address}
                onChange={(event) => setCustomer({ ...customer, address: event.target.value })}
              />
            </label>
            <button type="submit" className="checkout-button">Buy Cart on WhatsApp</button>
            {status && <p className="status">{status}</p>}
          </form>
        </section>
      )}

      {showSignup && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="signup-title">
          <form className="signup-modal" onSubmit={submitSignup}>
            <button type="button" className="modal-close" onClick={closeSignup} aria-label="Close signup">
              x
            </button>
            <div className="section-heading compact">
              {/* <p>User role</p> */}
              <h2 id="signup-title">Welcome to Nilla Sarres</h2>
            </div>
            <label>
              Name
              <input
                required
                value={signup.name}
                onChange={(event) => setSignup({ ...signup, name: event.target.value })}
                placeholder="Your name"
              />
            </label>
            <label>
              Phone
              <input
                required
                value={signup.phone}
                onChange={(event) => setSignup({ ...signup, phone: event.target.value })}
                placeholder="WhatsApp number"
              />
            </label>
            <label>
              Email
              <input
                required
                type="email"
                value={signup.email}
                onChange={(event) => setSignup({ ...signup, email: event.target.value })}
                placeholder="you@example.com"
              />
            </label>
            <label>
              Password
              <input
                required
                minLength="6"
                type="password"
                value={signup.password}
                onChange={(event) => setSignup({ ...signup, password: event.target.value })}
                placeholder="Create password"
              />
            </label>
            <button type="submit" className="checkout-button">Create User Account</button>
            <button type="button" className="google-button" onClick={closeSignup}>
              Continue with Google
            </button>
            <button
              type="button"
              className="skip-button"
              onClick={() => {
                closeSignup();
                setShowAccount(true);
                setAccountMode('login');
              }}
            >
              Already have account
            </button>
            <button type="button" className="skip-button" onClick={closeSignup}>
              Skip for now
            </button>
            {status && <p className="status">{status}</p>}
          </form>
        </div>
      )}

      {showAccount && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="account-title">
          <div className="signup-modal">
            <button type="button" className="modal-close" onClick={() => setShowAccount(false)} aria-label="Close account">
              x
            </button>
            <div className="section-heading compact">
              <p>{currentAccount ? currentAccount.role : 'Account'}</p>
              <h2 id="account-title">{currentAccount ? currentAccount.name : 'Login or Signup'}</h2>
            </div>

            {currentAccount ? (
              <>
                <p className="muted">{currentAccount.email}</p>
                {isAdmin && (
                  <button type="button" className="checkout-button" onClick={openAdmin}>
                    Open Upload Panel
                  </button>
                )}
                <button type="button" className="skip-button" onClick={logout}>
                  Logout
                </button>
              </>
            ) : accountMode === 'login' ? (
              <form className="account-form" onSubmit={submitLogin}>
                <label>
                  Email
                  <input
                    required
                    type="email"
                    value={login.email}
                    onChange={(event) => setLogin({ ...login, email: event.target.value })}
                    placeholder="Email"
                  />
                </label>
                <label>
                  Password
                  <input
                    required
                    minLength="6"
                    type="password"
                    value={login.password}
                    onChange={(event) => setLogin({ ...login, password: event.target.value })}
                    placeholder="Password"
                  />
                </label>
                <button type="submit" className="checkout-button">Login</button>
                <button type="button" className="google-button" onClick={() => setShowAccount(false)}>
                  Continue with Google
                </button>
                <button type="button" className="skip-button" onClick={() => setAccountMode('signup')}>
                  Create user account
                </button>
              </form>
            ) : (
              <form className="account-form" onSubmit={submitSignup}>
                <label>
                  Name
                  <input
                    required
                    value={signup.name}
                    onChange={(event) => setSignup({ ...signup, name: event.target.value })}
                    placeholder="Your name"
                  />
                </label>
                <label>
                  Phone
                  <input
                    required
                    value={signup.phone}
                    onChange={(event) => setSignup({ ...signup, phone: event.target.value })}
                    placeholder="WhatsApp number"
                  />
                </label>
                <label>
                  Email
                  <input
                    required
                    type="email"
                    value={signup.email}
                    onChange={(event) => setSignup({ ...signup, email: event.target.value })}
                    placeholder="you@example.com"
                  />
                </label>
                <label>
                  Password
                  <input
                    required
                    minLength="6"
                    type="password"
                    value={signup.password}
                    onChange={(event) => setSignup({ ...signup, password: event.target.value })}
                    placeholder="Create password"
                  />
                </label>
                <button type="submit" className="checkout-button">Create User Account</button>
                <button type="button" className="skip-button" onClick={() => setAccountMode('login')}>
                  Back to login
                </button>
              </form>
            )}

            {status && <p className="status">{status}</p>}
          </div>
        </div>
      )}
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
