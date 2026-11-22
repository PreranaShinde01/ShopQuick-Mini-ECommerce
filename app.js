/* ============================================================
   ShopQuick — app.js
   Mini E-Commerce App | Project 5 | Fullstack Web Dev
   ============================================================ */

"use strict";

/* ──────────────────────────────────────────────────────────────
   1. PRODUCT DATA  (at least 8 products as per requirements)
────────────────────────────────────────────────────────────── */
const products = [
  {
    id: 1,
    name: "Classic Hardcover Notebook",
    category: "Stationery",
    price: 299,
    originalPrice: 399,
    emoji: "📒",
    desc: "200 ruled pages, A5 size, premium cream paper.",
    rating: 4.5,
    reviews: 128,
    color: "#fef3c7"
  },
  {
    id: 2,
    name: "Gel Pen Pack (10 pcs)",
    category: "Stationery",
    price: 149,
    originalPrice: null,
    emoji: "🖊️",
    desc: "Smooth-write gel pens in 10 vibrant colours.",
    rating: 4.2,
    reviews: 85,
    color: "#ede9fe"
  },
  {
    id: 3,
    name: "LED Desk Lamp",
    category: "Electronics",
    price: 849,
    originalPrice: 1199,
    emoji: "💡",
    desc: "5-level brightness, USB-C powered, touch control.",
    rating: 4.7,
    reviews: 214,
    color: "#fce7f3"
  },
  {
    id: 4,
    name: "Wireless Bluetooth Earbuds",
    category: "Electronics",
    price: 1499,
    originalPrice: 2199,
    emoji: "🎧",
    desc: "30 hr playback, IPX5 water resistance, quick charge.",
    rating: 4.4,
    reviews: 342,
    color: "#dbeafe"
  },
  {
    id: 5,
    name: "The Art of Thinking Clearly",
    category: "Books",
    price: 349,
    originalPrice: 499,
    emoji: "📚",
    desc: "Rolf Dobelli's guide to 99 cognitive biases.",
    rating: 4.6,
    reviews: 97,
    color: "#d1fae5"
  },
  {
    id: 6,
    name: "Atomic Habits (Paperback)",
    category: "Books",
    price: 399,
    originalPrice: null,
    emoji: "🧠",
    desc: "James Clear's bestselling guide to building habits.",
    rating: 4.9,
    reviews: 512,
    color: "#ffedd5"
  },
  {
    id: 7,
    name: "Stainless Steel Water Bottle",
    category: "Kitchen",
    price: 599,
    originalPrice: 799,
    emoji: "🫙",
    desc: "1 litre, double-wall insulated, keeps cold 24 hrs.",
    rating: 4.3,
    reviews: 165,
    color: "#ecfdf5"
  },
  {
    id: 8,
    name: "Coffee Pour-Over Set",
    category: "Kitchen",
    price: 1199,
    originalPrice: 1599,
    emoji: "☕",
    desc: "Glass dripper + 100 filter papers + measuring spoon.",
    rating: 4.8,
    reviews: 76,
    color: "#fdf4ff"
  },
  {
    id: 9,
    name: "Yoga Mat (6 mm)",
    category: "Lifestyle",
    price: 749,
    originalPrice: 999,
    emoji: "🧘",
    desc: "Non-slip surface, eco TPE foam, carry strap included.",
    rating: 4.5,
    reviews: 203,
    color: "#fef9c3"
  },
  {
    id: 10,
    name: "Scented Soy Candle Set",
    category: "Lifestyle",
    price: 449,
    originalPrice: null,
    emoji: "🕯️",
    desc: "Set of 3 — lavender, vanilla, and sandalwood.",
    rating: 4.6,
    reviews: 89,
    color: "#fce7f3"
  },
  {
    id: 11,
    name: "Mechanical Keyboard (TKL)",
    category: "Electronics",
    price: 2799,
    originalPrice: 3499,
    emoji: "⌨️",
    desc: "Blue switches, RGB backlight, USB-C, tenkeyless.",
    rating: 4.7,
    reviews: 134,
    color: "#e0e7ff"
  },
  {
    id: 12,
    name: "Sticky Notes Mega Pack",
    category: "Stationery",
    price: 99,
    originalPrice: null,
    emoji: "🗒️",
    desc: "400 sheets across 5 neon colours, 3 × 3 inch.",
    rating: 4.1,
    reviews: 60,
    color: "#fef9c3"
  }
];

/* ──────────────────────────────────────────────────────────────
   2. CART STATE  — keyed by product id, value = quantity
   Load from localStorage so cart survives page reloads.
────────────────────────────────────────────────────────────── */
let cart = JSON.parse(localStorage.getItem("sq_cart") || "{}");

/* ──────────────────────────────────────────────────────────────
   3. DOM REFERENCES
────────────────────────────────────────────────────────────── */
const productGrid      = document.getElementById("productGrid");
const cartBadge        = document.getElementById("cartBadge");
const cartSidebar      = document.getElementById("cartSidebar");
const cartBody         = document.getElementById("cartBody");
const cartFooter       = document.getElementById("cartFooter");
const cartToggle       = document.getElementById("cartToggle");
const closeCart        = document.getElementById("closeCart");
const mainLayout       = document.querySelector(".main-layout");
const searchInput      = document.getElementById("searchInput");
const categoryFilter   = document.getElementById("categoryFilter");
const noResults        = document.getElementById("noResults");
const catalogueHeading = document.getElementById("catalogueHeading");
const checkoutDialog   = document.getElementById("checkoutDialog");
const dialogBody       = document.getElementById("dialogBody");
const dialogClose      = document.getElementById("dialogClose");
const dialogCancel     = document.getElementById("dialogCancel");
const placeOrderBtn    = document.getElementById("placeOrder");
const confirmDialog    = document.getElementById("confirmDialog");
const confirmOk        = document.getElementById("confirmOk");

/* ──────────────────────────────────────────────────────────────
   4. CURRENCY FORMATTER  (en-IN, INR)
────────────────────────────────────────────────────────────── */
function fmt(amount) {
  return amount.toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
}

/* ──────────────────────────────────────────────────────────────
   5. CART OPERATIONS
────────────────────────────────────────────────────────────── */
function addToCart(id) {
  cart[id] = (cart[id] || 0) + 1;
  save();
  showToast("Added to cart 🛒");
}

function changeQuantity(id, delta) {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) {
    delete cart[id];
    showToast("Item removed");
  }
  save();
}

function removeItem(id) {
  delete cart[id];
  save();
  showToast("Item removed");
}

function clearCart() {
  cart = {};
  save();
  showToast("Cart cleared");
}

/* ──────────────────────────────────────────────────────────────
   6. TOTALS (using reduce)
   Delivery: FREE if subtotal >= ₹500, else ₹49 flat.
   Discount: 5% off if subtotal >= ₹2000.
────────────────────────────────────────────────────────────── */
function computeTotals() {
  const ids = Object.keys(cart);

  const subtotal = ids.reduce(function (sum, id) {
    const product = products.find(function (p) { return p.id === Number(id); });
    return product ? sum + product.price * cart[id] : sum;
  }, 0);

  const itemCount = ids.reduce(function (count, id) {
    return count + cart[id];
  }, 0);

  const delivery   = subtotal > 0 && subtotal < 500 ? 49 : 0;
  const discountPct = subtotal >= 2000 ? 5 : 0;
  const discount   = Math.round(subtotal * discountPct / 100);
  const total      = subtotal - discount + delivery;

  return { subtotal, delivery, discount, discountPct, total, itemCount };
}

/* ──────────────────────────────────────────────────────────────
   7. PERSIST  &  RE-RENDER
────────────────────────────────────────────────────────────── */
function save() {
  localStorage.setItem("sq_cart", JSON.stringify(cart));
  renderCart();
  renderCatalogue(); // refresh Add-to-cart button states
}

/* ──────────────────────────────────────────────────────────────
   8. RENDER CATALOGUE
────────────────────────────────────────────────────────────── */
function getFilteredProducts() {
  const query    = searchInput.value.trim().toLowerCase();
  const category = categoryFilter.value;

  return products.filter(function (p) {
    const matchCat  = category === "all" || p.category === category;
    const matchSearch = !query ||
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query) ||
      p.desc.toLowerCase().includes(query);
    return matchCat && matchSearch;
  });
}

function renderCatalogue() {
  const filtered = getFilteredProducts();
  const query    = categoryFilter.value;

  catalogueHeading.textContent =
    query === "all" ? "All Products" : query + " — Products";

  productGrid.innerHTML = "";

  if (filtered.length === 0) {
    noResults.classList.remove("hidden");
    return;
  }
  noResults.classList.add("hidden");

  filtered.forEach(function (p) {
    const inCart  = !!cart[p.id];
    const qty     = cart[p.id] || 0;
    const pct     = p.originalPrice
      ? Math.round((1 - p.price / p.originalPrice) * 100)
      : null;

    // Star rendering: filled / half / empty
    const stars = renderStars(p.rating);

    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-img" style="background:${p.color}">
        ${p.emoji}
      </div>
      <div class="product-info">
        <span class="product-category">${p.category}</span>
        <h3 class="product-name">${p.name}</h3>
        <p class="product-desc">${p.desc}</p>
        <div class="product-rating">
          <span class="stars">${stars}</span>
          <span class="rating-count">(${p.reviews})</span>
        </div>
        <div class="product-price">
          ${fmt(p.price)}
          ${p.originalPrice ? `<span class="original">${fmt(p.originalPrice)}</span>` : ""}
          ${pct ? `<span class="discount-tag">${pct}% off</span>` : ""}
        </div>
      </div>
      <button
        class="btn-add-cart${inCart ? " in-cart" : ""}"
        data-id="${p.id}"
        aria-label="${inCart ? "Add more " + p.name + " to cart" : "Add " + p.name + " to cart"}"
      >
        ${inCart ? "✔ In Cart (" + qty + ")" : "＋ Add to Cart"}
      </button>
    `;
    productGrid.appendChild(card);
  });

  // Delegate click events on the grid
  productGrid.querySelectorAll(".btn-add-cart").forEach(function (btn) {
    btn.addEventListener("click", function () {
      addToCart(Number(this.dataset.id));
    });
  });
}

function renderStars(rating) {
  let result = "";
  for (let i = 1; i <= 5; i++) {
    if (rating >= i)       result += "★";
    else if (rating >= i - 0.5) result += "½";
    else                   result += "☆";
  }
  return result;
}

/* ──────────────────────────────────────────────────────────────
   9. RENDER CART SIDEBAR
────────────────────────────────────────────────────────────── */
function renderCart() {
  const { subtotal, delivery, discount, discountPct, total, itemCount } = computeTotals();
  const ids = Object.keys(cart);

  // Update badge
  cartBadge.textContent = itemCount;
  cartBadge.style.display = itemCount > 0 ? "" : "none";

  // ── Empty state ──
  if (ids.length === 0) {
    cartBody.innerHTML = `
      <div class="empty-cart-msg">
        <div class="empty-icon">🛒</div>
        <p>Your cart is empty.<br>Add some products to get started!</p>
      </div>`;
    cartFooter.innerHTML = "";
    return;
  }

  // ── Cart rows ──
  cartBody.innerHTML = "";
  ids.forEach(function (id) {
    const p        = products.find(function (x) { return x.id === Number(id); });
    if (!p) return;
    const qty      = cart[id];
    const lineTotal = p.price * qty;

    const row = document.createElement("div");
    row.className = "cart-row";
    row.innerHTML = `
      <div class="cart-row-icon" title="${p.name}">${p.emoji}</div>
      <div class="cart-row-info">
        <div class="cart-row-name" title="${p.name}">${p.name}</div>
        <div class="cart-row-line-price">${fmt(p.price)} × ${qty} = ${fmt(lineTotal)}</div>
      </div>
      <div class="cart-row-controls">
        <div class="qty-wrap">
          <button class="qty-btn" data-id="${id}" data-delta="-1" aria-label="Decrease quantity">−</button>
          <span class="qty-num">${qty}</span>
          <button class="qty-btn" data-id="${id}" data-delta="1"  aria-label="Increase quantity">＋</button>
        </div>
        <button class="btn-remove" data-id="${id}" aria-label="Remove ${p.name} from cart">Remove</button>
      </div>
    `;
    cartBody.appendChild(row);
  });

  // Attach qty / remove handlers
  cartBody.querySelectorAll(".qty-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      changeQuantity(Number(this.dataset.id), Number(this.dataset.delta));
    });
  });
  cartBody.querySelectorAll(".btn-remove").forEach(function (btn) {
    btn.addEventListener("click", function () {
      removeItem(Number(this.dataset.id));
    });
  });

  // ── Footer summary ──
  const freeThreshold = 500;
  const remaining     = freeThreshold - subtotal;

  cartFooter.innerHTML = `
    <div class="summary-row">
      <span>Subtotal (${itemCount} item${itemCount !== 1 ? "s" : ""})</span>
      <span>${fmt(subtotal)}</span>
    </div>
    ${discountPct > 0 ? `
    <div class="summary-row" style="color:var(--clr-success)">
      <span>Loyalty discount (${discountPct}%)</span>
      <span>−${fmt(discount)}</span>
    </div>` : ""}
    <div class="summary-row">
      <span>Delivery</span>
      <span>${delivery === 0
        ? '<span class="delivery-free">FREE</span>'
        : fmt(delivery)}</span>
    </div>
    ${delivery > 0 ? `<p class="delivery-note">Add ${fmt(remaining)} more for free delivery</p>` : ""}
    <div class="summary-row total">
      <span>Grand Total</span>
      <span>${fmt(total)}</span>
    </div>
    <button class="btn-checkout" id="checkoutBtn">Proceed to Checkout →</button>
    <button class="btn-clear" id="clearCartBtn">🗑 Clear Cart</button>
  `;

  document.getElementById("checkoutBtn").addEventListener("click", openCheckoutDialog);
  document.getElementById("clearCartBtn").addEventListener("click", function () {
    if (confirm("Remove all items from cart?")) clearCart();
  });
}

/* ──────────────────────────────────────────────────────────────
   10. CHECKOUT DIALOG
────────────────────────────────────────────────────────────── */
function openCheckoutDialog() {
  const { subtotal, delivery, discount, discountPct, total, itemCount } = computeTotals();
  const ids = Object.keys(cart);

  // Build rows
  let rows = "";
  ids.forEach(function (id) {
    const p = products.find(function (x) { return x.id === Number(id); });
    if (!p) return;
    const qty = cart[id];
    rows += `
      <div class="dlg-item">
        <div class="dlg-item-left">
          <span class="dlg-item-emoji">${p.emoji}</span>
          <div>
            <div class="dlg-item-name">${p.name}</div>
            <div class="dlg-item-qty">Qty: ${qty} × ${fmt(p.price)}</div>
          </div>
        </div>
        <div class="dlg-item-price">${fmt(p.price * qty)}</div>
      </div>`;
  });

  rows += `<div class="dlg-divider"></div>`;
  rows += `<div class="dlg-summary-row"><span>Subtotal</span><span>${fmt(subtotal)}</span></div>`;
  if (discountPct > 0) {
    rows += `<div class="dlg-summary-row" style="color:var(--clr-success)"><span>Discount (${discountPct}%)</span><span>−${fmt(discount)}</span></div>`;
  }
  rows += `<div class="dlg-summary-row"><span>Delivery</span><span>${delivery === 0 ? "FREE" : fmt(delivery)}</span></div>`;
  rows += `<div class="dlg-divider"></div>`;
  rows += `<div class="dlg-summary-row grand"><span>Total Payable</span><span>${fmt(total)}</span></div>`;

  dialogBody.innerHTML = rows;
  checkoutDialog.showModal();
}

/* ──────────────────────────────────────────────────────────────
   11. TOAST NOTIFICATION
────────────────────────────────────────────────────────────── */
let toastTimer = null;
function showToast(message) {
  // Remove existing toast if any
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();
  if (toastTimer) clearTimeout(toastTimer);

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  toastTimer = setTimeout(function () {
    toast.classList.add("hide");
    setTimeout(function () { toast.remove(); }, 400);
  }, 2000);
}

/* ──────────────────────────────────────────────────────────────
   12. CART SIDEBAR TOGGLE
────────────────────────────────────────────────────────────── */
function openCartSidebar() {
  cartSidebar.classList.add("open");
  mainLayout.classList.add("cart-open");
  cartToggle.setAttribute("aria-expanded", "true");
}

function closeCartSidebar() {
  cartSidebar.classList.remove("open");
  mainLayout.classList.remove("cart-open");
  cartToggle.setAttribute("aria-expanded", "false");
}

/* ──────────────────────────────────────────────────────────────
   13. EVENT LISTENERS
────────────────────────────────────────────────────────────── */
// Cart toggle
cartToggle.addEventListener("click", function () {
  const isOpen = cartSidebar.classList.contains("open");
  if (isOpen) closeCartSidebar(); else openCartSidebar();
});

closeCart.addEventListener("click", closeCartSidebar);

// Search & filter
searchInput.addEventListener("input", renderCatalogue);
categoryFilter.addEventListener("change", renderCatalogue);

// Dialog close buttons
dialogClose.addEventListener("click", function () { checkoutDialog.close(); });
dialogCancel.addEventListener("click", function () { checkoutDialog.close(); });

// Close dialog by clicking backdrop
checkoutDialog.addEventListener("click", function (e) {
  if (e.target === checkoutDialog) checkoutDialog.close();
});

// Place demo order
placeOrderBtn.addEventListener("click", function () {
  checkoutDialog.close();
  clearCart();
  closeCartSidebar();
  confirmDialog.showModal();
});

// Confirm OK
confirmOk.addEventListener("click", function () {
  confirmDialog.close();
});

// Close confirm by clicking backdrop
confirmDialog.addEventListener("click", function (e) {
  if (e.target === confirmDialog) confirmDialog.close();
});

// Keyboard: Escape closes dialogs (native for <dialog>) and sidebar
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeCartSidebar();
});

/* ──────────────────────────────────────────────────────────────
   14. INITIAL RENDER
────────────────────────────────────────────────────────────── */
renderCatalogue();
renderCart();

// If cart already has items on load, show a subtle toast
if (Object.keys(cart).length > 0) {
  showToast("Welcome back! Your cart has been restored 🛒");
}
