const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const priceFilter = document.getElementById("priceFilter");
const productCount = document.getElementById("productCount");

function renderProducts(list) {
  productGrid.innerHTML = "";

  productCount.innerHTML = `
    <p>Đang hiển thị <b>${list.length}</b> / <b>${products.length}</b> sản phẩm</p>
  `;

  list.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <div class="product-body">
        <p class="sku">${product.sku}</p>
        <h3>${product.name}</h3>
        <p class="muted">${product.duration} • ${product.destination}</p>
        <p class="price">${formatPrice(product.price)}</p>
        <p class="old-price">${formatPrice(product.oldPrice)}</p>
        <p>⭐ ${product.rating} | Đã bán ${product.sold}</p>
        <p class="promo">${product.promo}</p>
        <a class="btn" href="/product-detail?id=${product.id}">Xem chi tiết</a>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

function filterProducts() {
  const keyword = searchInput.value.toLowerCase().trim();
  const price = priceFilter.value;

  const filtered = products.filter(product => {
    const matchKeyword =
      product.name.toLowerCase().includes(keyword) ||
      product.destination.toLowerCase().includes(keyword) ||
      product.sku.toLowerCase().includes(keyword);

    let matchPrice = true;

    if (price === "low") {
      matchPrice = product.price < 5000000;
    }

    if (price === "medium") {
      matchPrice = product.price >= 5000000 && product.price <= 10000000;
    }

    if (price === "high") {
      matchPrice = product.price > 10000000;
    }

    return matchKeyword && matchPrice;
  });

  renderProducts(filtered);
}

searchInput.addEventListener("input", filterProducts);
priceFilter.addEventListener("change", filterProducts);

renderProducts(products);