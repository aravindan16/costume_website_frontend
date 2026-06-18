import React, { useState, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { saveProductApi, deleteProductApi, fetchProducts } from '../api';
import { productImageUrl, money } from '../utils';
import toast from 'react-hot-toast';

const emptyAdminProduct = {
  name: "", category: "", price: "", color: "", stock: "", description: "", images: [],
};

const CATEGORIES = [
  { label: "Fabrics", options: ["Silk Sarees", "Cotton Sarees", "Tussar", "Georgette Sarees", "Banarasi Sarees", "Jute Sarees", "Art Silk"] },
  { label: "Occasions", options: ["Weddings & Events", "Evenings & Celebrations", "Festive", "Work & Everyday Elegance", "Gifting"] }
];

export default function AdminPanel() {
  const { isAdmin, products, setProducts, currentAccount } = useAppContext();
  const [adminTab, setAdminTab] = useState("upload");
  const [adminProduct, setAdminProduct] = useState(emptyAdminProduct);
  const [editingProduct, setEditingProduct] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [manageCategoryFilter, setManageCategoryFilter] = useState("All");

  useEffect(() => {
    if (adminProduct.images?.length > 0) {
      const urls = adminProduct.images.map((file) => URL.createObjectURL(file));
      setImagePreviews(urls);
      return () => urls.forEach((url) => URL.revokeObjectURL(url));
    } else if (editingProduct?.images?.length > 0) {
      setImagePreviews(editingProduct.images.map((img) => productImageUrl({ image: img })));
    } else if (editingProduct?.image) {
      setImagePreviews([productImageUrl(editingProduct)]);
    } else {
      setImagePreviews([]);
    }
  }, [adminProduct.images, editingProduct]);

  if (!isAdmin) {
    return (
      <section className="admin-page" id="admin">
        <div className="admin-login">
          <p className="muted">Only the manual admin account can access this.</p>
        </div>
      </section>
    );
  }

  async function submitAdminProduct(event) {
    event.preventDefault();
    const formData = new FormData();
    Object.entries(adminProduct).forEach(([key, value]) => {
      if (key === "images") {
        if (Array.isArray(value)) value.forEach(file => formData.append("images", file));
      } else if (value !== null && value !== "") {
        formData.append(key, value);
      }
    });

    if (editingProduct) {
      existingImages.forEach((img) => formData.append("existing_images", img));
    }

    const isEditing = Boolean(editingProduct);
    await toast.promise(
      saveProductApi(formData, isEditing, editingProduct?.id, currentAccount.email, window.adminPassword).then(savedProduct => {
        setProducts((current) => isEditing ? current.map(p => p.id === savedProduct.id ? savedProduct : p) : [savedProduct, ...current]);
        resetAdminForm();
        setAdminTab("manage");
      }),
      {
        loading: isEditing ? 'Updating saree...' : 'Posting saree...',
        success: isEditing ? "Saree updated successfully." : "Saree posted successfully.",
        error: (err) => err.message,
      }
    );
  }

  function startEditProduct(product) {
    setEditingProduct(product);
    setExistingImages(product.images?.length > 0 ? product.images : [product.image]);
    setAdminProduct({
      name: product.name, category: product.category, price: String(product.price), color: product.color,
      stock: String(product.stock), description: product.description, images: [],
    });
    setAdminTab("upload");
    toast(`Editing ${product.name}`, { icon: '✏️' });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetAdminForm() {
    setEditingProduct(null);
    setExistingImages([]);
    setAdminProduct(emptyAdminProduct);
  }

  async function deleteProduct(product) {
    if (!window.confirm(`Delete ${product.name}?`)) return;
    await toast.promise(
      deleteProductApi(product.id, currentAccount.email, window.adminPassword).then(() => {
        setProducts(current => current.filter(item => item.id !== product.id));
        if (editingProduct?.id === product.id) resetAdminForm();
      }),
      {
        loading: `Deleting ${product.name}...`,
        success: `Deleted ${product.name}.`,
        error: (err) => err.message,
      }
    );
  }

  const filteredManageProducts = manageCategoryFilter === "All" 
    ? products 
    : products.filter(p => p.category === manageCategoryFilter);

  return (
    <section className="admin-page" id="admin">
      <div className="section-heading">
        <p>Admin role</p>
        <h2>Saree dashboard</h2>
      </div>

      <div className="admin-shell">
        <div className="admin-tabs" role="tablist">
          <button type="button" className={adminTab === "upload" ? "active" : ""} onClick={() => setAdminTab("upload")}>
            {editingProduct ? "Edit Saree" : "Upload Saree"}
          </button>
          <button type="button" className={adminTab === "manage" ? "active" : ""} onClick={() => { setAdminTab("manage"); resetAdminForm(); }}>
            Manage Collection
          </button>
        </div>

        {adminTab === "upload" ? (
          <form className="admin-form" onSubmit={submitAdminProduct}>
            {editingProduct && (
              <div className="edit-banner wide-field">
                <span>Editing {editingProduct.name}</span>
                <button type="button" className="share-button" onClick={resetAdminForm}>Cancel Edit</button>
              </div>
            )}
            <label>Name<input required value={adminProduct.name} onChange={(e) => setAdminProduct({ ...adminProduct, name: e.target.value })} /></label>
            <label>Category
              <select required value={adminProduct.category} onChange={(e) => setAdminProduct({ ...adminProduct, category: e.target.value })}>
                <option value="" disabled>Select a category...</option>
                {CATEGORIES.map(group => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
            <label>Price<input required type="number" value={adminProduct.price} onChange={(e) => setAdminProduct({ ...adminProduct, price: e.target.value })} /></label>
            <label>Color<input required value={adminProduct.color} onChange={(e) => setAdminProduct({ ...adminProduct, color: e.target.value })} /></label>
            <label>Stock<input required type="number" value={adminProduct.stock} onChange={(e) => setAdminProduct({ ...adminProduct, stock: e.target.value })} /></label>
            <label className="image-upload-label">
              Images
              <input required={!editingProduct} multiple type="file" accept="image/*" onChange={(e) => setAdminProduct({ ...adminProduct, images: Array.from(e.target.files || []) })} />
            </label>
            
            <div className="image-preview-container">
              {editingProduct && existingImages.length > 0 && (
                <div className="preview-section">
                  <span className="preview-title">Saved Images</span>
                  <div className="image-preview-grid">
                    {existingImages.map((img, idx) => (
                      <div className="image-preview-wrapper" key={idx}>
                        <img src={productImageUrl({ image: img })} alt="" />
                        <button type="button" className="remove-preview-btn" onClick={() => setExistingImages(existingImages.filter((_, i) => i !== idx))}>&times;</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="preview-section">
                <span className="preview-title">New Images</span>
                {imagePreviews.length > 0 && (
                  <div className="image-preview-grid">
                    {imagePreviews.map((url, idx) => (
                      <div className="image-preview-wrapper" key={idx}>
                        <img src={url} alt="" />
                        <button type="button" className="remove-preview-btn" onClick={() => setAdminProduct({ ...adminProduct, images: adminProduct.images.filter((_, i) => i !== idx) })}>&times;</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <label className="wide-field">Description<textarea required rows="4" value={adminProduct.description} onChange={(e) => setAdminProduct({ ...adminProduct, description: e.target.value })} /></label>
            <button type="submit" className="checkout-button">{editingProduct ? "Update Saree" : "Post Saree"}</button>
          </form>
        ) : (
          <div className="manage-panel">
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
              <select 
                value={manageCategoryFilter} 
                onChange={(e) => setManageCategoryFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', outline: 'none' }}
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(group => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            {filteredManageProducts.length === 0 ? (
              <p className="muted" style={{ textAlign: 'center', padding: '40px 0' }}>No products found in this category.</p>
            ) : (
              filteredManageProducts.map((product) => (
                <article className="manage-row" key={product.id}>
                  <img src={productImageUrl(product)} alt={product.name} />
                  <div className="manage-row-details">
                    <strong>{product.name}</strong>
                    <span className="manage-row-meta">
                      <span className="badge-cat">{product.category}</span>
                      <span className="price-tag">{money(product.price)}</span>
                      <span className={`stock-status ${product.stock === 0 ? "out-of-stock" : ""}`}>{product.stock} left</span>
                    </span>
                  </div>
                  <div className="manage-row-actions">
                    <button type="button" className="share-button edit-action-btn" onClick={() => startEditProduct(product)}>Edit</button>
                    <button type="button" className="delete-action-btn" onClick={() => deleteProduct(product)}>Delete</button>
                  </div>
                </article>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
