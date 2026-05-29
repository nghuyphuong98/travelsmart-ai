let currentDetailProduct = null;

function formatPrice(price) {
  return Number(price || 0).toLocaleString("vi-VN") + "đ";
}

function showToast(message, type = "success") {
  let toastContainer = document.getElementById("toastContainer");

  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.id = "toastContainer";
    toastContainer.style.position = "fixed";
    toastContainer.style.top = "24px";
    toastContainer.style.right = "24px";
    toastContainer.style.zIndex = "99999";
    toastContainer.style.display = "flex";
    toastContainer.style.flexDirection = "column";
    toastContainer.style.gap = "12px";
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement("div");

  const bgColor = type === "success" ? "#16a34a" : "#dc2626";
  const icon = type === "success" ? "✅" : "⚠️";

  toast.innerHTML = `
    <div style="font-size: 22px;">${icon}</div>
    <div>
      <b>${message}</b>
      <p style="margin: 4px 0 0; font-size: 14px; opacity: 0.95;">
        Bạn có thể vào giỏ hàng để kiểm tra đơn.
      </p>
    </div>
  `;

  toast.style.minWidth = "300px";
  toast.style.maxWidth = "380px";
  toast.style.background = bgColor;
  toast.style.color = "white";
  toast.style.padding = "15px 18px";
  toast.style.borderRadius = "14px";
  toast.style.boxShadow = "0 14px 35px rgba(0, 0, 0, 0.25)";
  toast.style.display = "flex";
  toast.style.alignItems = "center";
  toast.style.gap = "12px";
  toast.style.fontSize = "15px";
  toast.style.transform = "translateX(120%)";
  toast.style.opacity = "0";
  toast.style.transition = "all 0.35s ease";

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.transform = "translateX(0)";
    toast.style.opacity = "1";
  }, 50);

  setTimeout(() => {
    toast.style.transform = "translateX(120%)";
    toast.style.opacity = "0";

    setTimeout(() => {
      toast.remove();
    }, 350);
  }, 2600);
}

function renderProductDetail() {
  const detailContainer = document.getElementById("productDetail");

  if (!detailContainer) {
    return;
  }

  if (typeof products === "undefined" || !Array.isArray(products)) {
    detailContainer.innerHTML = `
      <section class="page-title">
        <h1>Chưa tải được dữ liệu sản phẩm</h1>
        <p>Vui lòng kiểm tra file products.js đã được nhúng trước product-detail.js.</p>
        <a class="btn" href="products.html">Quay lại danh sách sản phẩm</a>
      </section>
    `;
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const productId = Number(params.get("id"));

  const product = products.find(item => Number(item.id) === productId);
  currentDetailProduct = product;
  window.currentProduct = product;

  if (!product) {
    detailContainer.innerHTML = `
      <section class="page-title">
        <h1>Không tìm thấy sản phẩm</h1>
        <a class="btn" href="products.html">Quay lại danh sách sản phẩm</a>
      </section>
    `;
    return;
  }

  const competitor = product.competitor || {};

  detailContainer.innerHTML = `
    <section class="detail-layout">
      <div>
        <img class="detail-image" src="${product.image}" alt="${product.name}">
      </div>

      <div class="detail-info">
        <p class="sku">${product.sku || ""}</p>
        <h1>${product.name}</h1>

        <p>${product.duration || ""} • ${product.destination || ""}</p>
        <p><b>Khởi hành:</b> ${product.departure || "Đang cập nhật"}</p>
        <p><b>Phương tiện:</b> ${product.transport || "Đang cập nhật"}</p>
        <p><b>Lưu trú:</b> ${product.hotel || "Đang cập nhật"}</p>

        <p class="price big">${formatPrice(product.price)}</p>

        ${product.oldPrice ? `<p class="old-price">${formatPrice(product.oldPrice)}</p>` : ""}

        <p>⭐ ${product.rating || "4.5"} | Đã bán ${product.sold || 0}</p>

        ${product.promo ? `<p class="promo">${product.promo}</p>` : ""}

        <p>${product.description || ""}</p>

        <p><b>Phù hợp:</b> ${product.suitable || "Khách hàng muốn tham khảo tour du lịch phù hợp."}</p>

        <div class="button-row">
          <button class="btn" onclick="addToCart(${product.id})">Thêm vào giỏ hàng</button>
          <button class="btn pink" onclick="askAIAboutProduct()">💖 Hỏi AI về tour này</button>
        </div>
      </div>
    </section>

    <section class="detail-section">
      <h2>Lịch trình tóm tắt</h2>
      <ul>
        ${
          product.itinerary && product.itinerary.length > 0
            ? product.itinerary.map(item => `<li>${item}</li>`).join("")
            : `
              <li>Ngày 1: Khởi hành, nhận phòng, tham quan địa điểm chính.</li>
              <li>Ngày 2: Tham quan, trải nghiệm ẩm thực, vui chơi tự do.</li>
              <li>Ngày cuối: Mua sắm, trả phòng, trở về điểm xuất phát.</li>
            `
        }
      </ul>
    </section>

    <section class="detail-section">
      <h2>Dịch vụ bao gồm</h2>
      <ul>
        ${
          product.included && product.included.length > 0
            ? product.included.map(item => `<li>${item}</li>`).join("")
            : `
              <li>Khách sạn theo tiêu chuẩn tour</li>
              <li>Xe đưa đón theo lịch trình</li>
              <li>Vé tham quan theo chương trình</li>
              <li>Hướng dẫn viên du lịch</li>
              <li>Bảo hiểm du lịch</li>
            `
        }
      </ul>
    </section>

    <section class="detail-section">
      <h2>Dịch vụ không bao gồm</h2>
      <ul>
        ${
          product.excluded && product.excluded.length > 0
            ? product.excluded.map(item => `<li>${item}</li>`).join("")
            : `
              <li>Chi phí cá nhân ngoài chương trình</li>
              <li>Đồ uống riêng trong bữa ăn</li>
              <li>Phụ thu nếu có</li>
            `
        }
      </ul>
    </section>

    <section class="detail-section">
      <h2>So sánh với sản phẩm tương tự</h2>

      <table class="compare-table">
        <thead>
          <tr>
            <th>Tiêu chí</th>
            <th>TravelSmart AI</th>
            <th>Đối thủ tham khảo</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Tên sản phẩm</td>
            <td>${product.name}</td>
            <td>${competitor.name || "Tour tương tự"}</td>
          </tr>

          <tr>
            <td>Giá</td>
            <td>${formatPrice(product.price)}</td>
            <td>${formatPrice(competitor.price || Number(product.price || 0) + 300000)}</td>
          </tr>

          <tr>
            <td>Thời gian</td>
            <td>${product.duration || "Đang cập nhật"}</td>
            <td>${competitor.duration || product.duration || "Đang cập nhật"}</td>
          </tr>

          <tr>
            <td>Ưu điểm</td>
            <td>${product.advantage || "Có AI tư vấn, hỗ trợ đặt tour nhanh và dễ sử dụng."}</td>
            <td>${competitor.advantage || "Có nhiều chương trình tour tương tự."}</td>
          </tr>
        </tbody>
      </table>
    </section>
  `;
}

function addToCart(id) {
  if (typeof products === "undefined" || !Array.isArray(products)) {
    showToast("Chưa tải được dữ liệu sản phẩm.", "error");
    return;
  }

  const selectedProduct = products.find(item => Number(item.id) === Number(id));

  if (!selectedProduct) {
    showToast("Không tìm thấy sản phẩm.", "error");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const existingItem = cart.find(item => Number(item.id) === Number(selectedProduct.id));

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: selectedProduct.id,
      sku: selectedProduct.sku,
      name: selectedProduct.name,
      price: selectedProduct.price,
      image: selectedProduct.image,
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  showToast("Đã thêm sản phẩm vào giỏ hàng!");
}

function askAIAboutProduct() {
  const product = currentDetailProduct;

  if (!product) {
    showToast("Chưa có sản phẩm để tư vấn.", "error");
    return;
  }

  if (typeof openAIChat === "function") {
    openAIChat();
  }

  const aiInput = document.getElementById("aiInput");
  const competitor = product.competitor || {};

  if (aiInput) {
    aiInput.value = `Hãy tư vấn chi tiết cho tôi về sản phẩm này: ${product.name}. Giá ${formatPrice(product.price)}, thời gian ${product.duration}, khuyến mãi ${product.promo || "không có"}. Hãy so sánh thêm với đối thủ ${competitor.name || "tương tự"}.`;
  }
}

window.addEventListener("load", renderProductDetail);