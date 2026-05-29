const ORDER_WEBHOOK_URL = "https://dykp2013.app.n8n.cloud/webhook/travelsmart-order";

const profile = JSON.parse(localStorage.getItem("profile"));
const cart = JSON.parse(localStorage.getItem("cart")) || [];

if (profile) {
  document.getElementById("customerName").value = profile.name || "";
  document.getElementById("customerPhone").value = profile.phone || "";
  document.getElementById("customerEmail").value = profile.email || "";
  document.getElementById("customerAddress").value = profile.address || "";
}

function formatPrice(price) {
  return Number(price || 0).toLocaleString("vi-VN") + "đ";
}

function createOrderCode() {
  const now = new Date();
  const datePart =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0");

  const randomPart = Math.floor(1000 + Math.random() * 9000);

  return `TS-${datePart}-${randomPart}`;
}

function saveOrderToLocal(orderData) {
  const orders = JSON.parse(localStorage.getItem("travelOrders")) || [];
  orders.push(orderData);
  localStorage.setItem("travelOrders", JSON.stringify(orders));
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
        <li>Khách hàng gửi yêu cầu đặt tour trên website.</li>
        <li>TravelSmart tiếp nhận thông tin và kiểm tra tình trạng tour.</li>
        <li>Nhân viên liên hệ xác nhận lịch trình, số lượng khách và thông tin liên hệ.</li>
        <li>Khách hàng thanh toán theo phương thức đã chọn.</li>
        <li>TravelSmart gửi xác nhận đặt tour, lịch trình và thông tin cần thiết qua email, Zalo hoặc SMS.</li>
        <li>Khách hàng tham gia tour theo thời gian đã xác nhận.</li>
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

  const orderCode = createOrderCode();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const orderData = {
    orderCode: orderCode,
    customerName: customerName,
    customerPhone: customerPhone,
    customerEmail: customerEmail,
    customerAddress: customerAddress,
    paymentMethod: document.getElementById("paymentMethod").value,
    deliveryMethod: document.getElementById("deliveryMethod").value,
    note: document.getElementById("note").value,
    cart: cart,
    total: total,
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

    saveOrderToLocal(orderData);

    status.innerHTML = `
      <b>Đặt tour thành công! Đơn hàng của bạn đang chờ xác nhận.</b><br>
      Mã đơn hàng: <span style="color:#0b5ed7;font-weight:bold;">${orderCode}</span><br>
      Vui lòng lưu mã đơn hàng để nhân viên kiểm tra và xác nhận vé.
    `;

    localStorage.removeItem("cart");

  } catch (error) {
    saveOrderToLocal(orderData);

    status.innerHTML = `
      <b>Đặt tour thành công! Đơn hàng của bạn đang chờ xác nhận.</b><br>
      Mã đơn hàng: <span style="color:#0b5ed7;font-weight:bold;">${orderCode}</span><br>
      Dữ liệu đơn hàng đã được lưu tạm trên trình duyệt.
    `;
  }
}

renderOrderSummary();