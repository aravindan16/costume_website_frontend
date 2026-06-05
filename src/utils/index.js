export const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://costume-website-backend.onrender.com";
export const WHATSAPP_NUMBER = "917010802868";

export function money(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function productImageUrl(product) {
  const image = product.image || "/nilla-sarres-hero.png";
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  if (image.startsWith("/uploads/")) {
    return `${API_URL}${image}`;
  }
  return `${window.location.origin}${image}`;
}

export function getProductImageByIndex(product, index) {
  const images = (product.images && product.images.length > 0) ? product.images : [product.image];
  const safeIndex = index % images.length;
  const image = images[safeIndex] || "/nilla-sarres-hero.png";
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  if (image.startsWith("/uploads/")) {
    return `${API_URL}${image}`;
  }
  return `${window.location.origin}${image}`;
}

export function productShareUrl(product) {
  return `${window.location.origin}${window.location.pathname}#product=${encodeURIComponent(product.id)}`;
}

export function whatsappLink(product) {
  const message = [
    `Hi Nilavalayam, I want to buy ${product.name} (${money(product.price)}).`,
    `Saree image: ${productImageUrl(product)}`,
    "Please share more details.",
  ].join("\n");
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function cartWhatsappLink(cart, customer, total) {
  const itemLines = cart.flatMap((item, index) => [
    `${index + 1}. ${item.name}`,
    `   Qty: ${item.quantity}`,
    `   Price: ${money(item.price)} each`,
    `   Subtotal: ${money(item.price * item.quantity)}`,
    `   Image: ${productImageUrl(item)}`,
  ]);

  const message = [
    "Hi Nilavalayam, I want to buy these sarees:",
    "",
    ...itemLines,
    "",
    `Total: ${money(total)}`,
    "",
    "Customer details:",
    `Name: ${customer.name}`,
    `Phone: ${customer.phone}`,
    `Address: ${customer.address}`,
    "",
    "Please confirm availability and payment details.",
  ].join("\n");

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
