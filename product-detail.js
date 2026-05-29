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

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id"));
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
        <p>Vui lòng kiểm tra file products.js.</p>
        <a class="btn" href="products.html">Quay lại danh sách sản phẩm</a>
      </section>
    `;
    return;
  }

  const productId = getProductIdFromUrl();

  if (!productId) {
    detailContainer.innerHTML = `
      <section class="page-title">
        <h1>Không tìm thấy mã sản phẩm</h1>
        <p>Link sản phẩm cần có dạng product-detail.html?id=1</p>
        <a class="btn" href="products.html">Quay lại danh sách sản phẩm</a>
      </section>
    `;
    return;
  }

  const product = products.find(item => Number(item.id) === Number(productId));

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

renderProductDetail();
// ===============================
// BẢNG SO SÁNH NÂNG CẤP - TRAVELSMART AI
// Dán nguyên đoạn này vào CUỐI file product-detail.js
// ===============================

function formatComparePrice(value) {
  if (!value) return "Đang cập nhật";

  if (typeof value === "string") {
    return value.includes("đ") ? value : value + "đ";
  }

  return Number(value).toLocaleString("vi-VN") + "đ";
}

function getCurrentProductForCompare() {
  const urlParams = new URLSearchParams(window.location.search);
  const id = Number(urlParams.get("id"));

  let product = null;

  if (typeof products !== "undefined" && Array.isArray(products)) {
    product = products.find(item => Number(item.id) === id);
  }

  if (!product && typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS)) {
    product = PRODUCTS.find(item => Number(item.id) === id);
  }

  if (!product && typeof tours !== "undefined" && Array.isArray(tours)) {
    product = tours.find(item => Number(item.id) === id);
  }

  if (!product) {
    const titleElement =
      document.querySelector(".product-title") ||
      document.querySelector("h1") ||
      document.querySelector(".detail-title");

    const priceElement =
      document.querySelector(".price") ||
      document.querySelector(".product-price") ||
      document.querySelector(".new-price");

    product = {
      name: titleElement ? titleElement.innerText.trim() : "Tour du lịch TravelSmart AI",
      price: priceElement ? priceElement.innerText.trim() : "Đang cập nhật",
      duration: "Theo lịch trình tour",
      competitorName: "Tour tương tự trên thị trường"
    };
  }

  return product;
}

function getCompetitorPrice(product) {
  if (product.competitorPrice) {
    return product.competitorPrice;
  }

  const priceNumber = Number(
    String(product.price || "")
      .replaceAll(".", "")
      .replaceAll(",", "")
      .replace(/[^\d]/g, "")
  );

  if (!priceNumber || Number.isNaN(priceNumber)) {
    return "Cao hơn hoặc chưa tối ưu";
  }

  return priceNumber + 450000;
}

function renderStrongComparison() {
  const product = getCurrentProductForCompare();

  if (!product) {
    return;
  }

  const oldCompareSections = document.querySelectorAll(
    ".compare-section, .compare-box, #compareBox, #comparisonBox"
  );

  oldCompareSections.forEach(section => {
    section.remove();
  });

  const productName = product.name || product.title || "Tour du lịch TravelSmart AI";
  const productPrice = product.price || product.newPrice || product.salePrice || "Đang cập nhật";
  const productDuration = product.duration || product.time || "Theo lịch trình tour";
  const competitorName = product.competitorName || "Đối thủ tham khảo";
  const competitorPrice = getCompetitorPrice(product);
  const competitorDuration = product.competitorDuration || productDuration;

  const compareSection = document.createElement("section");
  compareSection.className = "compare-section";

  compareSection.innerHTML = `
    <h2>So sánh với sản phẩm tương tự</h2>

    <div class="compare-highlight">
      <div>
        <strong>TravelSmart AI có lợi thế rõ ràng hơn</strong>
        <p>
          Không chỉ cung cấp tour, TravelSmart AI còn tích hợp AI tư vấn, giỏ hàng,
          đặt tour nhanh, lưu thông tin khách hàng và quy trình thanh toán rõ ràng.
        </p>
      </div>
    </div>

    <div class="compare-table-wrap">
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
            <td>
              <b>${productName}</b>
              <br>
              <span class="win-text">Tour được hiển thị rõ ràng, dễ xem, dễ đặt.</span>
            </td>
            <td>
              ${competitorName}
              <br>
              <span class="weak-text">Chỉ dùng để tham khảo, chưa tối ưu trải nghiệm như TravelSmart AI.</span>
            </td>
          </tr>

          <tr>
            <td>Giá tour</td>
            <td>
              <b class="strong-point">${formatComparePrice(productPrice)}</b>
              <br>
              <span class="win-text">Mức giá cạnh tranh, phù hợp khách muốn tiết kiệm chi phí.</span>
            </td>
            <td>
              ${formatComparePrice(competitorPrice)}
              <br>
              <span class="weak-text">Chi phí thường cao hơn hoặc chưa có lợi thế rõ ràng về giá.</span>
            </td>
          </tr>

          <tr>
            <td>Thời gian</td>
            <td>
              <b>${productDuration}</b>
              <br>
              <span class="win-text">Lịch trình được trình bày dễ hiểu, thuận tiện khi lựa chọn.</span>
            </td>
            <td>
              ${competitorDuration}
              <br>
              <span class="weak-text">Thông tin lịch trình thường phải đọc nhiều bước mới nắm được.</span>
            </td>
          </tr>

          <tr>
            <td>Tư vấn sản phẩm</td>
            <td>
              <b class="strong-point">Có AI tư vấn ngay trong trang chi tiết tour</b>
              <br>
              <span class="win-text">
                Khách có thể hỏi trực tiếp về giá, lịch trình, ưu đãi, dịch vụ bao gồm
                và cách đặt tour.
              </span>
            </td>
            <td>
              <span class="weak-text">
                Thường chỉ có thông tin cố định, khách phải tự tìm hiểu hoặc chờ nhân viên phản hồi.
              </span>
            </td>
          </tr>

          <tr>
            <td>Quy trình đặt tour</td>
            <td>
              <b class="strong-point">Có giỏ hàng và thanh toán rõ ràng</b>
              <br>
              <span class="win-text">
                Khách có thể thêm tour vào giỏ, kiểm tra đơn hàng, chọn phương thức thanh toán
                và gửi đơn nhanh chóng.
              </span>
            </td>
            <td>
              <span class="weak-text">
                Thường phải gọi điện, nhắn tin hoặc điền thông tin thủ công nhiều lần.
              </span>
            </td>
          </tr>

          <tr>
            <td>Lưu thông tin khách hàng</td>
            <td>
              <b class="strong-point">Có tài khoản và tự động điền thông tin khi thanh toán</b>
              <br>
              <span class="win-text">
                Khi đã đăng nhập, hệ thống lấy sẵn họ tên, số điện thoại, email và địa chỉ.
              </span>
            </td>
            <td>
              <span class="weak-text">
                Khách dễ phải nhập lại thông tin khi đặt đơn mới.
              </span>
            </td>
          </tr>

          <tr>
            <td>Quản lý đơn hàng</td>
            <td>
              <b class="strong-point">Có trang admin kiểm tra và xác nhận vé</b>
              <br>
              <span class="win-text">
                Đơn hàng được lưu lại, admin có thể xác nhận vé, hủy vé và xuất vé/hóa đơn.
              </span>
            </td>
            <td>
              <span class="weak-text">
                Quản lý đơn hàng thường rời rạc, phụ thuộc nhiều vào thao tác thủ công.
              </span>
            </td>
          </tr>

          <tr>
            <td>Thanh toán</td>
            <td>
              <b class="strong-point">Hỗ trợ QR ngân hàng và ví điện tử</b>
              <br>
              <span class="win-text">
                Khách có thể quét mã QR, xem nội dung chuyển khoản và hoàn tất thanh toán thuận tiện.
              </span>
            </td>
            <td>
              <span class="weak-text">
                Phương thức thanh toán có thể chưa trực quan hoặc thiếu hướng dẫn rõ ràng.
              </span>
            </td>
          </tr>

          <tr>
            <td>Trải nghiệm website</td>
            <td>
              <b class="strong-point">Thiết kế hiện đại, dễ dùng, thân thiện trên điện thoại</b>
              <br>
              <span class="win-text">
                Phù hợp với khách muốn tìm tour nhanh, hỏi nhanh và đặt tour ngay trên web.
              </span>
            </td>
            <td>
              <span class="weak-text">
                Trải nghiệm có thể chưa tập trung vào tốc độ, tự động hóa và hỗ trợ khách hàng.
              </span>
            </td>
          </tr>

          <tr class="final-row">
            <td>Kết luận</td>
            <td>
              <b>
                TravelSmart AI nổi bật hơn nhờ giá cạnh tranh, AI tư vấn, giỏ hàng,
                thanh toán rõ ràng, quản lý đơn hàng và trải nghiệm hiện đại.
              </b>
            </td>
            <td>
              <span>
                Đối thủ chỉ phù hợp để tham khảo, nhưng chưa có nhiều lợi thế tự động hóa
                và hỗ trợ khách hàng như TravelSmart AI.
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  const detailContainer =
    document.querySelector(".product-detail") ||
    document.querySelector(".detail-container") ||
    document.querySelector(".container") ||
    document.querySelector("main") ||
    document.body;

  detailContainer.appendChild(compareSection);
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(renderStrongComparison, 300);
});
// ===============================
// FIX BẢNG SO SÁNH - CHỈ HIỆN 1 BẢNG DUY NHẤT
// Dán nguyên đoạn này vào CUỐI file product-detail.js
// ===============================

function tsaiFormatPrice(value) {
  if (value === undefined || value === null || value === "") {
    return "Đang cập nhật";
  }

  if (typeof value === "string") {
    const hasVnd = value.includes("đ") || value.includes("VND");
    return hasVnd ? value : value + "đ";
  }

  return Number(value).toLocaleString("vi-VN") + "đ";
}

function tsaiGetNumberPrice(value) {
  if (!value) return 0;

  const number = Number(
    String(value)
      .replaceAll(".", "")
      .replaceAll(",", "")
      .replace(/[^\d]/g, "")
  );

  return Number.isNaN(number) ? 0 : number;
}

function tsaiGetCurrentProduct() {
  const urlParams = new URLSearchParams(window.location.search);
  const productId = Number(urlParams.get("id"));

  let product = null;

  if (typeof products !== "undefined" && Array.isArray(products)) {
    product = products.find(item => Number(item.id) === productId);
  }

  if (!product && typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS)) {
    product = PRODUCTS.find(item => Number(item.id) === productId);
  }

  if (!product && typeof tours !== "undefined" && Array.isArray(tours)) {
    product = tours.find(item => Number(item.id) === productId);
  }

  if (!product) {
    const nameElement =
      document.querySelector(".product-title") ||
      document.querySelector(".detail-title") ||
      document.querySelector("h1");

    const priceElement =
      document.querySelector(".price") ||
      document.querySelector(".product-price") ||
      document.querySelector(".new-price");

    const durationElement =
      document.querySelector(".duration") ||
      document.querySelector(".product-duration");

    product = {
      name: nameElement ? nameElement.innerText.trim() : "Tour TravelSmart AI",
      price: priceElement ? priceElement.innerText.trim() : "Đang cập nhật",
      duration: durationElement ? durationElement.innerText.trim() : "Theo lịch trình tour"
    };
  }

  return product;
}

function tsaiGetCompetitorInfo(product) {
  const name = product.competitorName ||
               product.competitor ||
               product.referenceName ||
               "Đối thủ tham khảo";

  const currentPrice = tsaiGetNumberPrice(product.price || product.newPrice || product.salePrice);
  const competitorPrice = product.competitorPrice ||
                          product.referencePrice ||
                          (currentPrice ? currentPrice + 450000 : "Cao hơn hoặc chưa tối ưu");

  const duration = product.competitorDuration ||
                   product.referenceDuration ||
                   product.duration ||
                   product.time ||
                   "Tương đương";

  return {
    name,
    price: competitorPrice,
    duration
  };
}

function tsaiRemoveOldComparisonBlocks() {
  const selectors = [
    ".compare-section",
    ".comparison-section",
    ".compare-box",
    ".comparison-box",
    "#compareBox",
    "#comparisonBox",
    ".similar-compare",
    ".product-compare"
  ];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      element.remove();
    });
  });

  document.querySelectorAll("section, div, article").forEach(element => {
    const title = element.querySelector("h2, h3");

    if (!title) return;

    const text = title.innerText.trim().toLowerCase();

    if (
      text.includes("so sánh với sản phẩm tương tự") ||
      text.includes("so sánh sản phẩm") ||
      text.includes("so sánh với đối thủ")
    ) {
      element.remove();
    }
  });
}

function tsaiRenderCleanComparison() {
  tsaiRemoveOldComparisonBlocks();

  const product = tsaiGetCurrentProduct();
  if (!product) return;

  const competitor = tsaiGetCompetitorInfo(product);

  const productName = product.name || product.title || "Tour TravelSmart AI";
  const productPrice = product.price || product.newPrice || product.salePrice || "Đang cập nhật";
  const productDuration = product.duration || product.time || "Theo lịch trình tour";

  const compareSection = document.createElement("section");
  compareSection.className = "tsai-compare-section";
  compareSection.id = "tsaiCompareSection";

  compareSection.innerHTML = `
    <h2>So sánh với đối thủ tham khảo</h2>

    <div class="tsai-compare-intro">
      <b>TravelSmart AI nổi bật hơn về trải nghiệm đặt tour, hỗ trợ AI và quy trình tự động.</b>
      <p>
        Bảng dưới đây giúp khách hàng thấy rõ lợi thế của TravelSmart AI so với một tour tương tự trên thị trường.
      </p>
    </div>

    <div class="tsai-compare-table-wrap">
      <table class="tsai-compare-table">
        <thead>
          <tr>
            <th>Tiêu chí</th>
            <th>TravelSmart AI</th>
            <th>Đối thủ tham khảo</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>Tên tour</td>
            <td>
              <b>${productName}</b>
              <p class="tsai-good">Thông tin tour rõ ràng, dễ xem và dễ đặt.</p>
            </td>
            <td>
              <b>${competitor.name}</b>
              <p class="tsai-bad">Chỉ dùng để tham khảo, trải nghiệm đặt tour chưa nổi bật bằng.</p>
            </td>
          </tr>

          <tr>
            <td>Giá tour</td>
            <td>
              <b class="tsai-price-good">${tsaiFormatPrice(productPrice)}</b>
              <p class="tsai-good">Giá cạnh tranh, phù hợp với khách muốn tiết kiệm chi phí.</p>
            </td>
            <td>
              <b class="tsai-price-bad">${tsaiFormatPrice(competitor.price)}</b>
              <p class="tsai-bad">Chi phí cao hơn hoặc chưa có lợi thế rõ ràng về giá.</p>
            </td>
          </tr>

          <tr>
            <td>Thời gian</td>
            <td>
              <b>${productDuration}</b>
              <p class="tsai-good">Lịch trình được trình bày ngắn gọn, dễ hiểu.</p>
            </td>
            <td>
              <b>${competitor.duration}</b>
              <p class="tsai-bad">Thông tin thường phải đọc nhiều bước mới nắm được đầy đủ.</p>
            </td>
          </tr>

          <tr>
            <td>Tư vấn khách hàng</td>
            <td>
              <b>Có AI tư vấn trực tiếp</b>
              <p class="tsai-good">
                Khách có thể hỏi ngay về giá, lịch trình, dịch vụ bao gồm, ưu đãi và cách đặt tour.
              </p>
            </td>
            <td>
              <b>Phụ thuộc vào tư vấn thủ công</b>
              <p class="tsai-bad">
                Khách thường phải tự đọc thông tin hoặc chờ nhân viên phản hồi.
              </p>
            </td>
          </tr>

          <tr>
            <td>Đặt tour</td>
            <td>
              <b>Có giỏ hàng và quy trình thanh toán rõ ràng</b>
              <p class="tsai-good">
                Khách có thể thêm tour vào giỏ, kiểm tra đơn hàng và gửi thông tin đặt tour nhanh chóng.
              </p>
            </td>
            <td>
              <b>Quy trình kém tự động hơn</b>
              <p class="tsai-bad">
                Thường phải liên hệ qua tin nhắn, gọi điện hoặc nhập lại thông tin nhiều lần.
              </p>
            </td>
          </tr>

          <tr>
            <td>Thông tin khách hàng</td>
            <td>
              <b>Có tài khoản khách hàng</b>
              <p class="tsai-good">
                Khi đăng nhập, hệ thống tự điền họ tên, số điện thoại, email và địa chỉ khi thanh toán.
              </p>
            </td>
            <td>
              <b>Ít tiện lợi hơn</b>
              <p class="tsai-bad">
                Khách dễ phải nhập lại thông tin ở mỗi lần đặt tour.
              </p>
            </td>
          </tr>

          <tr>
            <td>Quản lý đơn</td>
            <td>
              <b>Có trang admin xác nhận vé</b>
              <p class="tsai-good">
                Admin có thể kiểm tra đơn, xác nhận vé, hủy vé và hỗ trợ xuất vé/hóa đơn.
              </p>
            </td>
            <td>
              <b>Quản lý thủ công nhiều hơn</b>
              <p class="tsai-bad">
                Dễ bị rời rạc giữa tin nhắn, cuộc gọi và bảng ghi chú.
              </p>
            </td>
          </tr>

          <tr>
            <td>Thanh toán</td>
            <td>
              <b>Hỗ trợ QR ngân hàng và ví điện tử</b>
              <p class="tsai-good">
                Khách có thể quét mã thanh toán nhanh, nội dung chuyển khoản được hướng dẫn rõ ràng.
              </p>
            </td>
            <td>
              <b>Hướng dẫn có thể chưa trực quan</b>
              <p class="tsai-bad">
                Khách có thể phải tự nhập nội dung hoặc hỏi lại nhân viên.
              </p>
            </td>
          </tr>

          <tr class="tsai-final-row">
            <td>Kết luận</td>
            <td>
              <b>TravelSmart AI vượt trội hơn về giá, AI tư vấn, đặt tour, thanh toán và quản lý đơn hàng.</b>
            </td>
            <td>
              <b>Đối thủ chỉ phù hợp để tham khảo, chưa nổi bật về tự động hóa và trải nghiệm khách hàng.</b>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  const insertTarget =
    document.querySelector(".product-detail") ||
    document.querySelector(".detail-container") ||
    document.querySelector("main") ||
    document.querySelector(".container") ||
    document.body;

  insertTarget.appendChild(compareSection);
}

document.addEventListener("DOMContentLoaded", function () {
  setTimeout(tsaiRenderCleanComparison, 500);
  setTimeout(tsaiRenderCleanComparison, 1200);
});