
const SEND_TICKET_WEBHOOK_URL = "https://dykp2013.app.n8n.cloud/webhook/travelsmart-send-ticket";

document.addEventListener("DOMContentLoaded", function () {
  checkAdminLogin();
  renderOrders();
});

/* ===============================
   KIỂM TRA ADMIN
   =============================== */

function checkAdminLogin() {
  const isAdmin =
    localStorage.getItem("isAdmin") === "true" ||
    localStorage.getItem("adminLoggedIn") === "true";

  if (!isAdmin) {
    // Nếu bạn muốn bắt buộc đăng nhập admin thì mở dòng dưới:
    // window.location.href = "/login";
  }
}

function adminLogout() {
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("adminLoggedIn");

  showAdminToast("Bạn đã đăng xuất khỏi trang quản trị.", "info", "Đã đăng xuất");

  setTimeout(function () {
    window.location.href = "/login";
  }, 800);
}

/* ===============================
   LẤY / LƯU ĐƠN HÀNG
   =============================== */

function getOrders() {
  try {
    return JSON.parse(localStorage.getItem("orders") || "[]");
  } catch (error) {
    return [];
  }
}

function saveOrders(orders) {
  localStorage.setItem("orders", JSON.stringify(orders));
}

/* ===============================
   FORMAT
   =============================== */

function formatMoney(value) {
  const number = Number(value) || 0;
  return number.toLocaleString("vi-VN") + "đ";
}

function formatDateVN(dateValue) {
  if (!dateValue) {
    return "Chưa chọn";
  }

  const date = new Date(dateValue);

  if (isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("vi-VN");
}

function formatDateTimeVN(value) {
  if (!value) {
    return "Chưa có";
  }

  return value;
}

function getStatusText(status) {
  if (status === "confirmed") {
    return "Đã xác nhận vé";
  }

  if (status === "cancelled") {
    return "Đã hủy vé";
  }

  return "Đang chờ xác nhận";
}

function getStatusClass(status) {
  if (status === "confirmed") {
    return "status-confirmed";
  }

  if (status === "cancelled") {
    return "status-cancelled";
  }

  return "status-pending";
}

/* ===============================
   HIỂN THỊ ĐƠN HÀNG
   =============================== */

function renderOrders() {
  const container =
    document.getElementById("ordersContainer") ||
    document.getElementById("adminOrders") ||
    document.getElementById("orderList");

  if (!container) {
    console.warn("Không tìm thấy vùng hiển thị đơn hàng trong admin.html");
    return;
  }

  const orders = getOrders();

  if (!orders || orders.length === 0) {
    container.innerHTML = `
      <div class="admin-empty">
        Chưa có đơn hàng nào được lưu trên trình duyệt này.
      </div>
    `;
    return;
  }

  const sortedOrders = orders.slice().reverse();

  container.innerHTML = sortedOrders
    .map(function (order) {
      return renderOrderCard(order);
    })
    .join("");
}

function renderOrderCard(order) {
  const status = order.status || "pending";
  const orderId = order.id || order.orderId || "Không rõ";
  const customerName = order.customerName || order.name || "Chưa có";
  const phone = order.phone || "Chưa có";
  const email = order.email || "Chưa có";
  const address = order.address || "Chưa có";
  const departureDate = formatDateVN(order.departureDate);
  const paymentMethod = order.paymentMethod || order.payment || "Chưa có";
  const deliveryMethod = order.deliveryMethod || order.delivery || "Chưa có";
  const createdAt = order.createdAt || "Chưa có";
  const confirmedAt = order.confirmedAt || "";
  const cancelledAt = order.cancelledAt || "";
  const note = order.note || "Không có";
  const total = formatMoney(order.total || 0);

  return `
    <div class="admin-order-card ${getStatusClass(status)}">
      <div class="admin-order-head">
        <h2>Đơn hàng: <span>${orderId}</span></h2>
        <div class="admin-status ${getStatusClass(status)}">
          ${getStatusText(status)}
        </div>
      </div>

      ${
        status === "confirmed"
          ? `
            <div class="admin-success-box">
              Vé đã được admin xác nhận.<br>
              Thời gian xác nhận: ${formatDateTimeVN(confirmedAt)}
            </div>
          `
          : ""
      }

      ${
        status === "cancelled"
          ? `
            <div class="admin-cancel-box">
              Vé đã bị hủy.<br>
              Thời gian hủy: ${formatDateTimeVN(cancelledAt)}
            </div>
          `
          : ""
      }

      ${
        status === "pending"
          ? `
            <div class="admin-warning-box">
              Đơn hàng đang chờ admin kiểm tra và xác nhận vé.
            </div>
          `
          : ""
      }

      <div class="admin-order-grid">
        <p><b>Khách hàng:</b> ${customerName}</p>
        <p><b>Số điện thoại:</b> ${phone}</p>

        <p><b>Email:</b> ${email}</p>
        <p><b>Địa chỉ:</b> ${address}</p>

        <p><b>Ngày khởi hành:</b> ${departureDate}</p>
        <p><b>Thời gian đặt:</b> ${createdAt}</p>

        <p><b>Thanh toán:</b> ${paymentMethod}</p>
        <p><b>Giao vé:</b> ${deliveryMethod}</p>

        <p><b>Tổng tiền:</b> ${total}</p>
      </div>

      <div class="admin-items-box">
        <b>Sản phẩm:</b>
        ${renderOrderItems(order.items)}
      </div>

      <p class="admin-note"><b>Ghi chú:</b> ${note}</p>

      <div class="admin-actions">
        ${
          status === "pending"
            ? `
              <button class="btn-confirm" onclick="confirmOrder('${orderId}')">
                Xác nhận vé & gửi Gmail
              </button>

              <button class="btn-cancel" onclick="cancelOrder('${orderId}')">
                Hủy vé
              </button>
            `
            : ""
        }

        ${
          status === "confirmed"
            ? `
              <button class="btn-mail" onclick="resendTicketEmail('${orderId}')">
                Gửi lại vé qua Gmail
              </button>

              <button class="btn-cancel" onclick="cancelConfirmedOrder('${orderId}')">
                Hủy vé đã xác nhận
              </button>
            `
            : ""
        }

        ${
          status === "cancelled"
            ? `
              <button class="btn-confirm" onclick="restoreOrder('${orderId}')">
                Khôi phục đơn
              </button>
            `
            : ""
        }
      </div>
    </div>
  `;
}

function renderOrderItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return `<p>Không có thông tin tour.</p>`;
  }

  return items
    .map(function (item) {
      const name = item.name || item.title || "Tour";
      const quantity = item.quantity || item.qty || 1;
      const price = formatMoney(item.price || 0);

      return `
        <div class="admin-item">
          ${name} x ${quantity} - ${price}
        </div>
      `;
    })
    .join("");
}

/* ===============================
   XÁC NHẬN / HỦY VÉ
   =============================== */

async function confirmOrder(orderId) {
  const orders = getOrders();

  const index = orders.findIndex(function (order) {
    return order.id === orderId || order.orderId === orderId;
  });

  if (index === -1) {
    showAdminToast("Không tìm thấy đơn hàng.", "error", "Lỗi");
    return;
  }

  orders[index].status = "confirmed";
  orders[index].confirmedAt = new Date().toLocaleString("vi-VN");

  saveOrders(orders);
  renderOrders();

  showAdminToast("Đã xác nhận vé. Đang gửi Gmail cho khách...", "info", "Đang xử lý");

  try {
    await sendTicketEmailByN8N(orders[index]);

    showAdminToast(
      "Đã xác nhận vé và gửi Gmail cho khách thành công.",
      "success",
      "Thành công"
    );
  } catch (error) {
    console.error(error);

    showAdminToast(
      "Vé đã xác nhận nhưng Gmail chưa gửi được. Kiểm tra lại n8n/Gmail.",
      "warning",
      "Lưu ý"
    );
  }

  renderOrders();
}

function confirmTicket(orderId) {
  confirmOrder(orderId);
}

function approveOrder(orderId) {
  confirmOrder(orderId);
}

function cancelOrder(orderId) {
  const confirmCancel = confirm("Bạn có chắc muốn hủy vé này không?");

  if (!confirmCancel) {
    return;
  }

  const orders = getOrders();

  const index = orders.findIndex(function (order) {
    return order.id === orderId || order.orderId === orderId;
  });

  if (index === -1) {
    showAdminToast("Không tìm thấy đơn hàng.", "error", "Lỗi");
    return;
  }

  orders[index].status = "cancelled";
  orders[index].cancelledAt = new Date().toLocaleString("vi-VN");

  saveOrders(orders);
  renderOrders();

  showAdminToast("Đã hủy vé thành công.", "error", "Đã hủy");
}

function cancelConfirmedOrder(orderId) {
  cancelOrder(orderId);
}

function restoreOrder(orderId) {
  const orders = getOrders();

  const index = orders.findIndex(function (order) {
    return order.id === orderId || order.orderId === orderId;
  });

  if (index === -1) {
    showAdminToast("Không tìm thấy đơn hàng.", "error", "Lỗi");
    return;
  }

  orders[index].status = "pending";
  orders[index].cancelledAt = "";

  saveOrders(orders);
  renderOrders();

  showAdminToast("Đã khôi phục đơn hàng về trạng thái chờ xác nhận.", "info", "Đã khôi phục");
}

/* ===============================
   GỬI VÉ QUA N8N GMAIL
   =============================== */

function buildItemsTextForEmail(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return "Không có thông tin tour.";
  }

  return items
    .map(function (item, index) {
      const name = item.name || item.title || "Tour";
      const quantity = item.quantity || item.qty || 1;
      const price = formatMoney(item.price || 0);

      return `
        <p style="margin:8px 0;">
          <b>${index + 1}. ${name}</b><br>
          Số lượng: ${quantity}<br>
          Giá: ${price}
        </p>
      `;
    })
    .join("");
}

async function sendTicketEmailByN8N(order) {
  if (
    !SEND_TICKET_WEBHOOK_URL ||
    SEND_TICKET_WEBHOOK_URL.includes("DAN_LINK_PRODUCTION")
  ) {
    throw new Error("Bạn chưa cấu hình Production URL n8n gửi vé trong admin.js.");
  }

  const payload = {
    id: order.id || order.orderId || "Không rõ",
    customerName: order.customerName || order.name || "Khách hàng",
    phone: order.phone || "Chưa có",
    email: order.email || "",
    address: order.address || "Chưa có",
    departureDate: formatDateVN(order.departureDate),
    paymentMethod: order.paymentMethod || order.payment || "Chưa có",
    deliveryMethod: order.deliveryMethod || order.delivery || "Gửi qua email",
    total: order.total || 0,
    totalText: formatMoney(order.total || 0),
    items: order.items || [],
    itemsText: buildItemsTextForEmail(order.items || []),
    note: order.note || "Không có",
    confirmedAt: order.confirmedAt || new Date().toLocaleString("vi-VN")
  };

  if (!payload.email || payload.email === "Chưa có") {
    throw new Error("Đơn hàng chưa có email khách hàng.");
  }

  const response = await fetch(SEND_TICKET_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error("n8n chưa gửi được email vé.");
  }

  return await response.json();
}

async function resendTicketEmail(orderId) {
  const orders = getOrders();

  const order = orders.find(function (item) {
    return item.id === orderId || item.orderId === orderId;
  });

  if (!order) {
    showAdminToast("Không tìm thấy đơn hàng.", "error", "Lỗi");
    return;
  }

  showAdminToast("Đang gửi lại vé qua Gmail...", "info", "Đang gửi");

  try {
    await sendTicketEmailByN8N(order);

    showAdminToast("Đã gửi lại vé qua Gmail thành công.", "success", "Thành công");
  } catch (error) {
    console.error(error);

    showAdminToast(
      "Chưa gửi lại được Gmail. Kiểm tra webhook n8n hoặc Gmail node.",
      "warning",
      "Lưu ý"
    );
  }
}

/* ===============================
   TẢI LẠI / XUẤT DỮ LIỆU
   =============================== */

function reloadOrders() {
  renderOrders();
  showAdminToast("Đã tải lại danh sách đơn hàng.", "info", "Đã tải lại");
}

function exportOrders() {
  const orders = getOrders();

  if (!orders || orders.length === 0) {
    showAdminToast("Chưa có đơn hàng để xuất.", "warning", "Lưu ý");
    return;
  }

  const dataStr = JSON.stringify(orders, null, 2);
  const blob = new Blob([dataStr], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "travelsmart-orders.json";
  a.click();

  URL.revokeObjectURL(url);

  showAdminToast("Đã xuất dữ liệu đơn hàng.", "success", "Thành công");
}

/* ===============================
   TOAST ADMIN
   =============================== */

function showAdminToast(message, type = "success", title = "Thông báo") {
  let container = document.querySelector(".site-toast-container");

  if (!container) {
    container = document.createElement("div");
    container.className = "site-toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `site-toast ${type}`;

  let icon = "✓";

  if (type === "info") {
    icon = "i";
  }

  if (type === "warning") {
    icon = "!";
  }

  if (type === "error") {
    icon = "×";
  }

  toast.innerHTML = `
    <div class="site-toast-icon">${icon}</div>

    <div class="site-toast-content">
      <div class="site-toast-title">${title}</div>
      <div class="site-toast-message">${message}</div>
    </div>

    <button class="site-toast-close" type="button">×</button>
  `;

  container.appendChild(toast);

  const closeBtn = toast.querySelector(".site-toast-close");

  closeBtn.addEventListener("click", function () {
    hideAdminToast(toast);
  });

  setTimeout(function () {
    toast.classList.add("show");
  }, 30);

  setTimeout(function () {
    hideAdminToast(toast);
  }, 3600);
}

function hideAdminToast(toast) {
  if (!toast) {
    return;
  }

  toast.classList.remove("show");

  setTimeout(function () {
    if (toast.parentElement) {
      toast.remove();
    }
  }, 350);
}