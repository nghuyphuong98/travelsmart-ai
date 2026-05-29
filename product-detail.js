const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id"));
const product = products.find(item => item.id === productId);
const detailContainer = document.getElementById("detailContainer");

if (!product) {
  detailContainer.innerHTML = `
    <section class="not-found">
      <h2>Không tìm thấy sản phẩm</h2>
      <a class="btn" href="products.html">Quay lại danh sách sản phẩm</a>
    </section>
  `;
} else {
  window.currentProduct = product;

  detailContainer.innerHTML = `
    <section class="detail-layout">
      <div>
        <img class="detail-image" src="${product.image}" alt="${product.name}">
      </div>

      <div class="detail-info">
        <p class="sku">${product.sku}</p>
        <h1>${product.name}</h1>
        <p class="muted">${product.duration} • ${product.destination}</p>
        <p><b>Khởi hành:</b> ${product.startLocation}</p>
        <p><b>Phương tiện:</b> ${product.transport}</p>
        <p><b>Lưu trú:</b> ${product.hotel}</p>

        <p class="price big">${formatPrice(product.price)}</p>
        <p class="old-price">${formatPrice(product.oldPrice)}</p>

        <p>⭐ ${product.rating} | Đã bán ${product.sold}</p>
        <p class="promo">${product.promo}</p>

        <p>${product.description}</p>
        <p><b>Phù hợp:</b> ${product.suitable}</p>

        <div class="button-row">
          <button class="btn" onclick="addToCart(${product.id})">Thêm vào giỏ hàng</button>
          <button class="btn secondary" onclick="askAIAboutProduct()">💖 Hỏi AI về tour này</button>
        </div>
      </div>
    </section>

    <section class="detail-section">
      <h2>Lịch trình tóm tắt</h2>
      <ul>
        ${product.schedule.map(item => `<li>${item}</li>`).join("")}
      </ul>
    </section>

    <section class="detail-section">
      <h2>Dịch vụ bao gồm</h2>
      <ul>
        ${product.includes.map(item => `<li>${item}</li>`).join("")}
      </ul>
    </section>

    <section class="detail-section">
      <h2>Dịch vụ không bao gồm</h2>
      <ul>
        ${product.excludes.map(item => `<li>${item}</li>`).join("")}
      </ul>
    </section>

    <section class="detail-section">
      <h2>So sánh với sản phẩm tương tự của đối thủ</h2>

      <table class="compare-table">
        <tr>
          <th>Tiêu chí</th>
          <th>TravelSmart AI</th>
          <th>${product.competitor.name}</th>
        </tr>
        <tr>
          <td>Giá</td>
          <td>${formatPrice(product.price)}</td>
          <td>${formatPrice(product.competitor.price)}</td>
        </tr>
        <tr>
          <td>Thời gian</td>
          <td>${product.duration}</td>
          <td>${product.competitor.duration}</td>
        </tr>
        <tr>
          <td>Dịch vụ</td>
          <td>${product.includes.join(", ")}</td>
          <td>${product.competitor.includes}</td>
        </tr>
        <tr>
          <td>Lợi thế</td>
          <td>${product.competitor.advantage}</td>
          <td>Chưa có AI tư vấn trực tiếp trên từng sản phẩm</td>
        </tr>
      </table>
    </section>
  `;
}

function addToCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const selectedProduct = products.find(item => item.id === productId);

  const existingItem = cart.find(item => item.id === productId);

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
  alert("Đã thêm sản phẩm vào giỏ hàng!");
}

function askAIAboutProduct() {
  openAIChat();

  const message = `Hãy tư vấn chi tiết cho tôi về sản phẩm này: ${product.name}. Giá ${formatPrice(product.price)}, thời gian ${product.duration}, khuyến mãi ${product.promo}. Hãy so sánh thêm với đối thủ ${product.competitor.name}.`;

  const input = document.getElementById("aiInput");
  input.value = message;

  sendAIMessage();
}