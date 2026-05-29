/* =========================================================
   TRAVELSMART AI - PRODUCT DETAIL FULL CODE
   File: product-detail.js
   Xóa toàn bộ code cũ trong product-detail.js rồi dán nguyên file này
   ========================================================= */

const DEFAULT_PRODUCTS = [
  {
    id: 1,
    code: "TS-001",
    name: "Tour Đà Nẵng 3 ngày 2 đêm - Gói 1",
    destination: "Đà Nẵng",
    duration: "3 ngày 2 đêm",
    departure: "TP. Hồ Chí Minh",
    transport: "Xe du lịch chất lượng cao",
    hotel: "Khách sạn 3 sao gần biển",
    price: 5140000,
    oldPrice: 5840000,
    rating: 4.3,
    sold: 23,
    discount: "Giảm 10%",
    image: "assets/danang.jpg",
    competitorName: "TravelGo Đà Nẵng",
    competitorPrice: 5590000,
    competitorDuration: "3 ngày 2 đêm",
    description: "Tour Đà Nẵng 3 ngày 2 đêm được thiết kế cho khách hàng muốn có chuyến đi tiện lợi, tiết kiệm và nhiều trải nghiệm đáng nhớ.",
    suitable: "Phù hợp khách thích biển, nghỉ dưỡng, đi ngắn ngày",
    itinerary: [
      "Ngày 1: Khởi hành, nhận phòng, tham quan địa điểm chính.",
      "Ngày 2: Tham quan, trải nghiệm ẩm thực, vui chơi tự do.",
      "Ngày cuối: Mua sắm, trả phòng, trở về điểm xuất phát."
    ],
    included: [
      "Khách sạn theo chương trình",
      "Xe đưa đón theo lịch trình",
      "Vé tham quan theo chương trình",
      "Hướng dẫn viên du lịch",
      "Bảo hiểm du lịch"
    ],
    excluded: [
      "Chi phí cá nhân",
      "Dịch vụ ngoài chương trình",
      "Thuế VAT nếu khách yêu cầu xuất hóa đơn"
    ]
  },
  {
    id: 2,
    code: "TS-002",
    name: "Tour Phú Quốc 4 ngày 3 đêm - Gói 1",
    destination: "Phú Quốc",
    duration: "4 ngày 3 đêm",
    departure: "Hà Nội",
    transport: "Máy bay / xe du lịch",
    hotel: "Resort / khách sạn 4 sao",
    price: 6650000,
    oldPrice: 7350000,
    rating: 4.4,
    sold: 26,
    discount: "Tặng vé cáp treo",
    image: "assets/phuquoc.jpg",
    competitorName: "TravelGo Phú Quốc",
    competitorPrice: 7100000,
    competitorDuration: "4 ngày 3 đêm",
    description: "Tour Phú Quốc 4 ngày 3 đêm phù hợp với khách hàng muốn nghỉ dưỡng biển đảo, vui chơi và khám phá ẩm thực địa phương.",
    suitable: "Phù hợp khách thích nghỉ dưỡng biển đảo",
    itinerary: [
      "Ngày 1: Di chuyển đến Phú Quốc, nhận phòng, nghỉ ngơi.",
      "Ngày 2: Tham quan Nam đảo, vui chơi theo chương trình.",
      "Ngày 3: Tự do khám phá, trải nghiệm ẩm thực địa phương.",
      "Ngày cuối: Trả phòng, mua đặc sản, trở về."
    ],
    included: [
      "Khách sạn / resort theo chương trình",
      "Xe đưa đón",
      "Vé tham quan theo lịch trình",
      "Hướng dẫn viên",
      "Bảo hiểm du lịch"
    ],
    excluded: [
      "Chi phí cá nhân",
      "Ăn uống ngoài chương trình",
      "Dịch vụ phát sinh"
    ]
  }
];

let currentProduct = null;

function getProductsData() {
  if (typeof products !== "undefined" && Array.isArray(products)) {
    return products;
  }

  if (typeof PRODUCTS !== "undefined" && Array.isArray(PRODUCTS)) {
    return PRODUCTS;
  }

  if (typeof tours !== "undefined" && Array.isArray(tours)) {
    return tours;
  }

  return DEFAULT_PRODUCTS;
}

function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return Number(params.get("id")) || 1;
}

function formatPrice(value) {
  if (value === undefined || value === null || value === "") {
    return "Đang cập nhật";
  }

  if (typeof value === "string") {
    if (value.includes("đ") || value.includes("VND")) {
      return value;
    }

    return value + "đ";
  }

  return Number(value).toLocaleString("vi-VN") + "đ";
}

function getNumberPrice(value) {
  if (!value) return 0;

  const number = Number(
    String(value)
      .replaceAll(".", "")
      .replaceAll(",", "")
      .replace(/[^\d]/g, "")
  );

  return Number.isNaN(number) ? 0 : number;
}

function findCurrentProduct() {
  const id = getProductIdFromUrl();
  const list = getProductsData();

  let product = list.find(function (item) {
    return Number(item.id) === id;
  });

  if (!product) {
    product = list[0];
  }

  return product;
}

function getProductImage(product) {
  return product.image || product.img || product.thumbnail || "assets/danang.jpg";
}

function getProductName(product) {
  return product.name || product.title || "Tour TravelSmart AI";
}

function getProductPrice(product) {
  return product.price || product.newPrice || product.salePrice || "Đang cập nhật";
}

function getProductOldPrice(product) {
  return product.oldPrice || product.originalPrice || "";
}

function getProductDuration(product) {
  return product.duration || product.time || "Theo lịch trình tour";
}

function getProductDescription(product) {
  return product.description || product.desc || "Tour được thiết kế nhằm mang đến cho khách hàng trải nghiệm du lịch tiện lợi, tiết kiệm và dễ dàng đặt tour trực tuyến.";
}

function getProductSuitable(product) {
  return product.suitable || "Phù hợp với khách hàng muốn đặt tour nhanh, tiện lợi và được hỗ trợ tư vấn rõ ràng.";
}

function safeArray(value, fallback) {
  if (Array.isArray(value) && value.length > 0) {
    return value;
  }

  return fallback;
}

function renderList(items) {
  return items.map(function (item) {
    return `<li>${item}</li>`;
  }).join("");
}

function renderProductDetail() {
  currentProduct = findCurrentProduct();

  const product = currentProduct;
  const productName = getProductName(product);
  const productImage = getProductImage(product);
  const productPrice = getProductPrice(product);
  const productOldPrice = getProductOldPrice(product);
  const productDuration = getProductDuration(product);

  const detailContainer =
    document.getElementById("productDetail") ||
    document.getElementById("product-detail") ||
    document.querySelector(".product-detail") ||
    document.querySelector(".detail-container") ||
    document.querySelector("main") ||
    document.body;

  detailContainer.innerHTML = `
    <section class="product-detail-wrapper">
      <div class="product-main-card">
        <div class="product-image-box">
          <img src="${productImage}" alt="${productName}" onerror="this.src='assets/danang.jpg'">
        </div>

        <div class="product-info-box">
          <div class="product-code">${product.code || "TS-" + String(product.id || 1).padStart(3, "0")}</div>

          <h1>${productName}</h1>

          <p class="product-meta">${productDuration} • ${product.destination || "Du lịch"}</p>

          <p><b>Khởi hành:</b> ${product.departure || "Theo lịch trình"}</p>
          <p><b>Phương tiện:</b> ${product.transport || "Xe du lịch / phương tiện phù hợp"}</p>
          <p><b>Lưu trú:</b> ${product.hotel || "Theo chương trình tour"}</p>

          <div class="product-price-row">
            <span class="product-price">${formatPrice(productPrice)}</span>
            ${productOldPrice ? `<span class="product-old-price">${formatPrice(productOldPrice)}</span>` : ""}
          </div>

          <p class="product-rating">⭐ ${product.rating || "4.5"} | Đã bán ${product.sold || 0}</p>

          ${product.discount ? `<p class="product-discount">${product.discount}</p>` : ""}

          <p class="product-desc">${getProductDescription(product)}</p>

          <p><b>Phù hợp:</b> ${getProductSuitable(product)}</p>

          <div class="product-actions">
            <button class="btn-cart" onclick="addProductToCart()">Thêm vào giỏ hàng</button>
            <button class="btn-ai" onclick="askAIAboutCurrentTour()">💖 Hỏi AI về tour này</button>
          </div>
        </div>
      </div>

      <div class="product-section">
        <h2>Lịch trình tóm tắt</h2>
        <ul>
          ${renderList(safeArray(product.itinerary, [
            "Ngày 1: Khởi hành, nhận phòng, tham quan địa điểm chính.",
            "Ngày 2: Tham quan, trải nghiệm ẩm thực, vui chơi tự do.",
            "Ngày cuối: Mua sắm, trả phòng, trở về điểm xuất phát."
          ]))}
        </ul>
      </div>

      <div class="product-section">
        <h2>Dịch vụ bao gồm</h2>
        <ul>
          ${renderList(safeArray(product.included, [
            "Xe đưa đón theo lịch trình",
            "Lưu trú theo chương trình",
            "Vé tham quan theo lịch trình",
            "Hướng dẫn viên",
            "Bảo hiểm du lịch"
          ]))}
        </ul>
      </div>

      <div class="product-section">
        <h2>Dịch vụ không bao gồm</h2>
        <ul>
          ${renderList(safeArray(product.excluded, [
            "Chi phí cá nhân",
            "Dịch vụ phát sinh ngoài chương trình",
            "Thuế VAT nếu khách yêu cầu xuất hóa đơn"
          ]))}
        </ul>
      </div>

      <div id="compareArea"></div>
    </section>
  `;

  renderCompareSection();
}

function addProductToCart() {
  if (!currentProduct) {
    currentProduct = findCurrentProduct();
  }

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  const productId = Number(currentProduct.id);
  const existing = cart.find(function (item) {
    return Number(item.id) === productId;
  });

  if (existing) {
    existing.quantity = Number(existing.quantity || 1) + 1;
  } else {
    cart.push({
      id: currentProduct.id,
      code: currentProduct.code || "TS-" + String(currentProduct.id || 1).padStart(3, "0"),
      name: getProductName(currentProduct),
      price: getProductPrice(currentProduct),
      image: getProductImage(currentProduct),
      quantity: 1
    });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  showToast("Đã thêm tour vào giỏ hàng.");
}

function askAiAboutProduct() {
  if (!currentProduct) {
    currentProduct = findCurrentProduct();
  }

  const productName = getProductName(currentProduct);
  const productPrice = formatPrice(getProductPrice(currentProduct));
  const productDuration = getProductDuration(currentProduct);

  const message = `Hãy tư vấn chi tiết cho tôi về sản phẩm này: ${productName}. Giá ${productPrice}, thời gian ${productDuration}. Hãy so sánh thêm với đối thủ ${currentProduct.competitorName || "tham khảo"}.`;

  const chatInput =
    document.getElementById("aiInput") ||
    document.querySelector("#chatInput") ||
    document.querySelector(".chat-input input") ||
    document.querySelector("input[placeholder*='AI']");

  if (chatInput) {
    chatInput.value = message;
    chatInput.focus();
  }

  showToast("Đã tạo nội dung hỏi AI về tour này.");
}

function showToast(message) {
  let toast = document.getElementById("tsaiToast");

  if (!toast) {
    toast = document.createElement("div");
    toast.id = "tsaiToast";
    toast.className = "tsai-toast";
    document.body.appendChild(toast);
  }

  toast.innerText = message;
  toast.classList.add("show");

  setTimeout(function () {
    toast.classList.remove("show");
  }, 2200);
}

function getCompetitorInfo(product) {
  const price = getProductPrice(product);
  const priceNumber = getNumberPrice(price);

  return {
    name: product.competitorName || product.referenceName || "Tour tương tự trên thị trường",
    price: product.competitorPrice || product.referencePrice || (priceNumber ? priceNumber + 450000 : "Cao hơn"),
    duration: product.competitorDuration || product.referenceDuration || getProductDuration(product)
  };
}

function renderCompareSection() {
  const product = currentProduct || findCurrentProduct();
  const competitor = getCompetitorInfo(product);

  const compareArea = document.getElementById("compareArea");

  if (!compareArea) {
    return;
  }

  compareArea.innerHTML = `
    <section class="tsai-compare-section">
      <h2>So sánh với đối thủ tham khảo</h2>

      <div class="tsai-compare-intro">
        <strong>TravelSmart AI nổi bật hơn nhờ AI tư vấn, đặt tour nhanh và quy trình tự động.</strong>
        <p>
          Bảng dưới đây giúp khách hàng thấy rõ ưu điểm của TravelSmart AI so với một tour tương tự trên thị trường.
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
                <b>${getProductName(product)}</b>
                <p class="tsai-good">Thông tin tour rõ ràng, dễ xem và dễ đặt.</p>
              </td>
              <td>
                <b>${competitor.name}</b>
                <p class="tsai-bad">Chỉ dùng để tham khảo, trải nghiệm đặt tour chưa nổi bật bằng TravelSmart AI.</p>
              </td>
            </tr>

            <tr>
              <td>Giá tour</td>
              <td>
                <b class="tsai-price-good">${formatPrice(getProductPrice(product))}</b>
                <p class="tsai-good">Mức giá cạnh tranh, phù hợp với khách muốn tiết kiệm chi phí.</p>
              </td>
              <td>
                <b class="tsai-price-bad">${formatPrice(competitor.price)}</b>
                <p class="tsai-bad">Chi phí cao hơn hoặc chưa có lợi thế rõ ràng về giá.</p>
              </td>
            </tr>

            <tr>
              <td>Thời gian</td>
              <td>
                <b>${getProductDuration(product)}</b>
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
                  Khách có thể hỏi ngay về giá, lịch trình, ưu đãi, dịch vụ bao gồm và cách đặt tour.
                </p>
              </td>
              <td>
                <b>Phụ thuộc tư vấn thủ công</b>
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
                  Khách có thể thêm tour vào giỏ, kiểm tra đơn và gửi thông tin đặt tour nhanh chóng.
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
              <td>Quản lý đơn hàng</td>
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
                <b>Hướng dẫn chưa trực quan bằng</b>
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
    </section>
  `;
}

document.addEventListener("DOMContentLoaded", function () {
  renderProductDetail();
});