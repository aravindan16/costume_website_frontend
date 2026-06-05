import { API_URL } from "../utils";

export async function fetchProducts() {
  const res = await fetch(`${API_URL}/api/products`);
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

export async function fetchFavorites(userId) {
  const res = await fetch(`${API_URL}/api/favorites`, {
    headers: { "X-User-Id": userId },
  });
  if (!res.ok) throw new Error("Failed to load favorites");
  return res.json();
}

export async function addFavorite(userId, productId) {
  const res = await fetch(`${API_URL}/api/favorites`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId,
    },
    body: JSON.stringify({ product_id: productId, user_id: userId }),
  });
  if (!res.ok) throw new Error("Failed to add favorite");
}

export async function removeFavorite(userId, productId) {
  const res = await fetch(`${API_URL}/api/favorites/${productId}`, {
    method: "DELETE",
    headers: { "X-User-Id": userId },
  });
  if (!res.ok) throw new Error("Failed to remove favorite");
}

export async function loginApi(email, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Login failed.");
  }
  return res.json();
}

export async function signupApi(signupData) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(signupData),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Signup failed.");
  }
  return res.json();
}

export async function updateProfileApi(profileData, userId) {
  const res = await fetch(`${API_URL}/api/auth/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "X-User-Id": userId,
    },
    body: JSON.stringify(profileData),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Profile update failed.");
  }
  return res.json();
}

export async function googleAuthApi(token) {
  const res = await fetch(`${API_URL}/api/auth/google`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Google Sign-In failed.");
  }
  return res.json();
}

export async function deleteProductApi(productId, adminEmail, adminPassword) {
  const res = await fetch(`${API_URL}/api/admin/products/${productId}`, {
    method: "DELETE",
    headers: {
      "X-Admin-Email": adminEmail,
      "X-Admin-Password": adminPassword,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Could not delete saree.");
  }
}

export async function saveProductApi(formData, isEditing, productId, adminEmail, adminPassword) {
  const url = `${API_URL}/api/admin/products${isEditing ? `/${productId}` : ""}`;
  const res = await fetch(url, {
    method: isEditing ? "PUT" : "POST",
    headers: {
      "X-Admin-Email": adminEmail,
      "X-Admin-Password": adminPassword,
    },
    body: formData,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || "Could not save saree.");
  }
  return res.json();
}
