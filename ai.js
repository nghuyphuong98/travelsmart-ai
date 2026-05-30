

const AI_WEBHOOK_URL = "https://dykp2013.app.n8n.cloud/webhook/travelsmart-ai";

/* ===============================
   TẠO GIAO DIỆN CHAT AI
   =============================== */

function createAIWidget() {
  let container = document.getElementById("aiWidget");

  if (!container) {
    container = document.createElement("div");
    container.id = "aiWidget";
    document.body.appendChild(container);
  }

  container.innerHTML = `
    <button class="ai-float-button" onclick="openAiChat()" title="Tư vấn cùng Trần Hà Linh">
      <img 
        src="assets/ai-girl.png" 
        alt="Trần Hà Linh"
        onerror="this.style.display='none'; this.parentElement.classList.add('ai-no-image');"
      >
      <span>Tư vấn</span>
    </button>

    <div class="ai-chat-box" id="aiChatBox">
      <div class="ai-chat-header">
        <div>
          <b>Trần Hà Linh</b>
          <p>Trợ lý tư vấn TravelSmart</p>
        </div>
        <button type="button" onclick="closeAiChat()">×</button>
      </div>

      <div class="ai-messages" id="aiMessages">
        <div class="ai-bot">
          Chào bạn, Linh có thể hỗ trợ bạn chọn tour, xem lịch trình, giá tour và hướng dẫn đặt tour trên TravelSmart.
        </div>
      </div>

      <div class="ai-input-area">
        <input 
          id="aiInput" 
          type="text" 
          placeholder="Nhập câu hỏi cho Trần Hà Linh..."
          onkeydown="handleAIEnter(event)"
        >
        <button type="button" onclick="sendAIMessage()">Gửi</button>
      </div>
    </div>
  `;
}

/* ===============================
   MỞ / ĐÓNG CHAT
   =============================== */

function openAiChat() {
  let chatBox = document.getElementById("aiChatBox");

  if (!chatBox) {
    createAIWidget();
    chatBox = document.getElementById("aiChatBox");
  }

  if (chatBox) {
    chatBox.classList.add("show");
  }

  setTimeout(function () {
    const input = document.getElementById("aiInput");
    if (input) {
      input.focus();
    }
  }, 200);
}

function closeAiChat() {
  const chatBox = document.getElementById("aiChatBox");

  if (chatBox) {
    chatBox.classList.remove("show");
  }
}

function handleAIEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    sendAIMessage();
  }
}

/* ===============================
   THÊM TIN NHẮN VÀO KHUNG CHAT
   =============================== */

function addAIMessage(type, text) {
  const messages = document.getElementById("aiMessages");

  if (!messages) {
    return;
  }

  const div = document.createElement("div");
  div.className = type === "user" ? "ai-user" : "ai-bot";

  const safeText = String(text || "")
    .replace(/\n/g, "<br>");

  div.innerHTML = safeText;

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

/* ===============================
   LẤY THÔNG TIN TOUR HIỆN TẠI
   =============================== */

function getCurrentTourInfo() {
  const title =
    document.querySelector(".product-info-box h1") ||
    document.querySelector(".product-title") ||
    document.querySelector(".detail-title") ||
    document.querySelector("h1");

  const price =
    document.querySelector(".product-price") ||
    document.querySelector(".price") ||
    document.querySelector(".detail-price");

  const meta =
    document.querySelector(".product-meta") ||
    document.querySelector(".meta") ||
    document.querySelector(".detail-meta");

  const description =
    document.querySelector(".product-desc") ||
    document.querySelector(".description") ||
    document.querySelector(".detail-description");

  return {
    name: title ? title.innerText.trim() : "",
    price: price ? price.innerText.trim() : "",
    meta: meta ? meta.innerText.trim() : "",
    description: description ? description.innerText.trim() : ""
  };
}

/* ===============================
   TRẢ LỜI DỰ PHÒNG NẾU N8N LỖI
   =============================== */

function createLocalAIReply(message) {
  const lower = String(message || "").toLowerCase();
  const tour = getCurrentTourInfo();

  const tourName = tour.name || "tour này";
  const tourPrice = tour.price || "giá đang hiển thị trên website";
  const tourMeta = tour.meta || "thông tin tour đang hiển thị trên website";

  if (
    lower.includes("tour") ||
    lower.includes("giá") ||
    lower.includes("lịch trình") ||
    lower.includes("tư vấn") ||
    lower.includes("đặt") ||
    lower.includes("sapa") ||
    lower.includes("đà nẵng") ||
    lower.includes("phú quốc") ||
    lower.includes("hàn quốc") ||
    lower.includes("nhật bản") ||
    lower.includes("thái lan") ||
    lower.includes("singapore")
  ) {
    return `
      Theo Linh, <b>${tourName}</b> khá phù hợp nếu bạn muốn xem thông tin rõ ràng và đặt tour nhanh trên TravelSmart.<br><br>

      <b>Giá hiện tại:</b> ${tourPrice}<br>
      <b>Thông tin tour:</b> ${tourMeta}<br><br>

      Nếu bạn thấy lịch trình và mức giá phù hợp, bạn có thể bấm <b>Thêm vào giỏ hàng</b>, sau đó vào <b>Giỏ hàng</b> hoặc <b>Thanh toán</b> để gửi đơn đặt tour.
    `;
  }

  if (lower.includes("thanh toán") || lower.includes("qr") || lower.includes("chuyển khoản")) {
    return `
      Bạn có thể vào trang <b>Thanh toán</b> để xem thông tin chuyển khoản hoặc mã QR nếu đơn hàng đã có trong giỏ. 
      Trước khi thanh toán, bạn nên kiểm tra lại tên tour, số lượng và tổng tiền.
    `;
  }

  if (lower.includes("giỏ hàng")) {
    return `
      Bạn có thể thêm tour vào giỏ hàng, kiểm tra lại thông tin tour, số lượng và tổng tiền trước khi chuyển sang bước thanh toán.
    `;
  }

  return `
    Linh có thể hỗ trợ bạn chọn tour, xem giá, lịch trình và gợi ý tour phù hợp với nhu cầu. 
    Bạn có thể nói cho Linh biết bạn muốn đi đâu, đi mấy ngày, ngân sách khoảng bao nhiêu và đi cùng bao nhiêu người nhé.
  `;
}

/* ===============================
   GỬI CÂU HỎI SANG N8N
   =============================== */

async function sendAIMessage() {
  const input = document.getElementById("aiInput");

  if (!input) {
    return;
  }

  const message = input.value.trim();

  if (!message) {
    return;
  }

  addAIMessage("user", message);
  input.value = "";

  addAIMessage("bot", "Trần Hà Linh đang kiểm tra thông tin cho bạn...");

  const messages = document.getElementById("aiMessages");
  const loadingMessage = messages ? messages.lastElementChild : null;

  try {
    if (
      !AI_WEBHOOK_URL ||
      AI_WEBHOOK_URL === "DAN_LINK_PRODUCTION_WEBHOOK_N8N_CUA_BAN_VAO_DAY"
    ) {
      setTimeout(function () {
        if (loadingMessage) {
          loadingMessage.remove();
        }

        addAIMessage("bot", createLocalAIReply(message));
      }, 500);

      return;
    }

    const response = await fetch(AI_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: message,
        page: window.location.href,
        tour: getCurrentTourInfo(),
        brand: "TravelSmart",
        assistant: "Trần Hà Linh"
      })
    });

    const data = await response.json();

    if (loadingMessage) {
      loadingMessage.remove();
    }

    let reply = "";

    if (Array.isArray(data)) {
      reply =
        data[0]?.reply ||
        data[0]?.output ||
        data[0]?.response ||
        data[0]?.text ||
        data[0]?.message ||
        data[0]?.response_ai_agent ||
        "";
    } else {
      reply =
        data.reply ||
        data.output ||
        data.response ||
        data.text ||
        data.message ||
        data.response_ai_agent ||
        "";
    }

    if (!reply) {
      reply = createLocalAIReply(message);
    }

    addAIMessage("bot", reply);
  } catch (error) {
    if (loadingMessage) {
      loadingMessage.remove();
    }

    addAIMessage("bot", createLocalAIReply(message));
  }
}

/* ===============================
   NÚT "HỎI AI VỀ TOUR NÀY"
   =============================== */

function askAIAboutCurrentTour() {
  const tour = getCurrentTourInfo();

  openAiChat();

  setTimeout(function () {
    const input = document.getElementById("aiInput");

    const tourName = tour.name || "tour này";
    const tourPrice = tour.price ? ` Giá hiện tại là ${tour.price}.` : "";
    const tourMeta = tour.meta ? ` Thông tin tour: ${tour.meta}.` : "";

    const question = `Hãy tư vấn giúp tôi về ${tourName}.${tourPrice}${tourMeta} Tour này phù hợp với ai và có nên đặt không?`;

    if (input) {
      input.value = question;
      input.focus();
    }

    showToast("Đã mở Trần Hà Linh để tư vấn tour này cho bạn.", "info", "Trần Hà Linh");
  }, 260);
}

/* Các tên hàm phụ để nút cũ vẫn chạy */
function askAiAboutProduct() {
  askAIAboutCurrentTour();
}

function askAIForProduct() {
  askAIAboutCurrentTour();
}

function askAiForProduct() {
  askAIAboutCurrentTour();
}

/* ===============================
   TOAST THÔNG BÁO ĐẸP
   =============================== */

function createToastContainer() {
  let container = document.querySelector(".site-toast-container");

  if (!container) {
    container = document.createElement("div");
    container.className = "site-toast-container";
    document.body.appendChild(container);
  }

  return container;
}

function showToast(message, type = "success", title = "") {
  const container = createToastContainer();

  const toast = document.createElement("div");
  toast.className = `site-toast ${type}`;

  let icon = "✓";
  let toastTitle = title || "Thông báo";

  if (type === "success") {
    icon = "✓";
    toastTitle = title || "Thành công";
  }

  if (type === "info") {
    icon = "i";
    toastTitle = title || "Thông báo";
  }

  if (type === "warning") {
    icon = "!";
    toastTitle = title || "Lưu ý";
  }

  if (type === "error") {
    icon = "×";
    toastTitle = title || "Có lỗi xảy ra";
  }

  toast.innerHTML = `
    <div class="site-toast-icon">${icon}</div>

    <div class="site-toast-content">
      <div class="site-toast-title">${toastTitle}</div>
      <div class="site-toast-message">${message}</div>
    </div>

    <button class="site-toast-close" type="button">×</button>
  `;

  container.appendChild(toast);

  const closeBtn = toast.querySelector(".site-toast-close");

  closeBtn.addEventListener("click", function () {
    hideToast(toast);
  });

  setTimeout(function () {
    toast.classList.add("show");
  }, 30);

  setTimeout(function () {
    hideToast(toast);
  }, 3200);
}

function hideToast(toast) {
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

/* ===============================
   KHỞI TẠO
   =============================== */

document.addEventListener("DOMContentLoaded", function () {
  createAIWidget();
});