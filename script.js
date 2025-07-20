const products = [
  
  {
    id: 1,
    name: "Lamborghini Huracán",
    price: 280000,
    image: "card1.jpg"
  },
  {
    id: 2,
    name: "BMW i8",
    price: 120000,
    image: "card2.jpg"
  },
  {
    id: 3,
    name: "Ferrai s.P",
    price: 200000,
    image: "card3.jpg"
  },
  
  {
    id: 4,
    name: "Rolls-Royce",
    price: 70000,
    image: "card5.jpg"
  },
  
  {
    id: 5,
    name: "Toyota Hilux",
    price: 21000000,
    image: "card4.avif"
  }
];

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || {};
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const count = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  const countEl = document.getElementById("cart-count");
  if (countEl) countEl.textContent = count;
}

function renderProducts() {
  const container = document.getElementById("product-list");
  if (!container) return;

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>$${product.price}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    container.appendChild(card);
  });
}

function addToCart(productId) {
  const cart = getCart();
  if (cart[productId]) {
    cart[productId].quantity += 1;
  } else {
    const product = products.find(p => p.id === productId);
    cart[productId] = { ...product, quantity: 1 };
  }
  saveCart(cart);
  updateCartCount();
}

function renderCartItems() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  const cart = getCart();
  container.innerHTML = "";
  let totalQty = 0;
  let totalPrice = 0;

  for (const key in cart) {
    const item = cart[key];
    totalQty += item.quantity;
    totalPrice += item.price * item.quantity;

    const div = document.createElement("div");
    div.className = "cart-item";
    div.innerHTML = `
      <div>${item.name}</div>
      <div>₹${item.price}</div>
      <div class="quantity-controls">
        <button onclick="changeQty(${item.id}, -1)">-</button>
        <span>${item.quantity}</span>
        <button onclick="changeQty(${item.id}, 1)">+</button>
      </div>
    `;
    container.appendChild(div);
  }

  const summary = document.getElementById("cart-summary");
  if (summary) {
    summary.innerHTML = `
      Total Quantity: ${totalQty} <br>
      Total Price: ₹${totalPrice}
    `;
  }
}

function changeQty(productId, delta) {
  const cart = getCart();
  if (!cart[productId]) return;

  cart[productId].quantity += delta;
  if (cart[productId].quantity <= 0) {
    delete cart[productId];
  }
  saveCart(cart);
  renderCartItems();
  updateCartCount();
}

document.addEventListener("DOMContentLoaded", () => {
  renderProducts();
  renderCartItems();
  updateCartCount();
});