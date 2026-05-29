const cartContainer = document.getElementById("cartContainer");

function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    cartContainer.innerHTML = `
      <div class="empty-box">
        <h2>Giỏ hàng đang trống</h2>
        <p>Bạn hãy xem danh sách tour và thêm sản phẩm vào giỏ hàng.</p>
        <a class="btn" href="products.html">Xem sản phẩm</a>
      </div>
    `;
    return;
  }

  let total = 0;

  cartContainer.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <p class="sku">${item.sku}</p>
          <h3>${item.name}</h3>
          <p>Đơn giá: ${formatPrice(item.price)}</p>
          <p>Số lượng: ${item.quantity}</p>
          <p><b>Tạm tính:</b> ${formatPrice(itemTotal)}</p>
          <button class="small-btn" onclick="decreaseQuantity(${item.id})">-</button>
          <button class="small-btn" onclick="increaseQuantity(${item.id})">+</button>
          <button class="small-btn danger" onclick="removeItem(${item.id})">Xóa</button>
        </div>
      </div>
    `;
  }).join("");

  cartContainer.innerHTML += `
    <div class="cart-total">
      <h2>Tổng tiền: ${formatPrice(total)}</h2>
      <a class="btn" href="checkout.html">Tiến hành thanh toán</a>
    </div>
  `;
}

function increaseQuantity(id) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(product => product.id === id);

  if (item) {
    item.quantity += 1;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function decreaseQuantity(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const item = cart.find(product => product.id === id);

  if (item) {
    item.quantity -= 1;
  }

  cart = cart.filter(product => product.quantity > 0);

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

function removeItem(id) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter(item => item.id !== id);

  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

renderCart();