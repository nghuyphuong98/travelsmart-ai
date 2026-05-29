const ORDER_WEBHOOK_URL = "https://dykp2013.app.n8n.cloud/webhook/travelsmart-order";

const profile = JSON.parse(localStorage.getItem("profile"));
const cart = JSON.parse(localStorage.getItem("cart")) || [];

if (profile) {
  document.getElementById("customerName").value = profile.name || "";
  document.getElementById("customerPhone").value = profile.phone || "";
  document.getElementById("customerEmail").value = profile.email || "";
  document.getElementById("customerAddress").value = profile.address || "";
}

function renderOrderSummary() {
  const orderSummary = document.getElementById("orderSummary");

  if (cart.length === 0) {
    orderSummary.innerHTML = `
      <h2>Đơn hàng</h2>
      <p>Chưa có sản phẩm trong giỏ hàng.</p>
      <a class="btn" href="products.html">Xem sản phẩm</a>
    `;
    return;
  }

  let total = 0;

  orderSummary.innerHTML = "<h2>Đơn hàng</h2>";

  cart.forEach(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    orderSummary.innerHTML += `
      <div class="summary-item">
        <p><b>${item.name}</b></p>
        <p>${formatPrice(item.price)} x ${item.quantity}</p>
        <p>Tạm tính: ${formatPrice(itemTotal)}</p>
      </div>
    `;
  });

  orderSummary.innerHTML += `
    <hr>
    <h2>Tổng cộng: ${formatPrice(total)}</h2>

    <div class="process-box">
      <h3>Quy trình thanh toán và giao hàng</h3>
      <ol>
        <li>Khách hàng gửi đơn đặt tour trên website.</li>
        <li>n8n tiếp nhận đơn hàng và lưu vào Google Sheet.</li>
        <li>Nhân viên liên hệ xác nhận thông tin.</li>
        <li>Khách thanh toán theo phương thức đã chọn.</li>
        <li>TravelSmart gửi vé/lịch trình qua email, Zalo hoặc SMS.</li>
        <li>Khách tham gia tour theo ngày khởi hành.</li>
      </ol>
    </div>
  `;
}

async function submitOrder() {
  const status = document.getElementById("checkoutStatus");

  if (cart.length === 0) {
    status.innerText = "Giỏ hàng đang trống.";
    return;
  }

  const customerName = document.getElementById("customerName").value.trim();
  const customerPhone = document.getElementById("customerPhone").value.trim();
  const customerEmail = document.getElementById("customerEmail").value.trim();
  const customerAddress = document.getElementById("customerAddress").value.trim();

  if (!customerName || !customerPhone || !customerEmail) {
    status.innerText = "Vui lòng nhập họ tên, số điện thoại và email.";
    return;
  }

  const orderData = {
    customerName: customerName,
    customerPhone: customerPhone,
    customerEmail: customerEmail,
    customerAddress: customerAddress,
    paymentMethod: document.getElementById("paymentMethod").value,
    deliveryMethod: document.getElementById("deliveryMethod").value,
    note: document.getElementById("note").value,
    cart: cart,
    total: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    orderStatus: "Đang chờ xác nhận",
    createdAt: new Date().toLocaleString("vi-VN")
  };

  status.innerText = "Đang gửi đơn hàng...";

  try {
    const response = await fetch(ORDER_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();

    status.innerText = data.message || "Đặt tour thành công! Đơn hàng đang chờ xác nhận.";
    localStorage.removeItem("cart");

  } catch (error) {
    status.innerText = "Chưa kết nối được n8n. Hãy kiểm tra webhook đơn hàng trong file checkout.js.";
  }
}

renderOrderSummary();