const AI_WEBHOOK_URL = "https://dykp2013.app.n8n.cloud/webhook/travelsmart-ai";

function createAIWidget() {
  let container = document.getElementById("aiWidget");

  if (!container) {
    container = document.createElement("div");
    container.id = "aiWidget";
    document.body.appendChild(container);
  }

  container.innerHTML = `
    <button class="ai-float-button" onclick="openAiChat()" title="Hỏi Linh AI">
      <img src="assets/ai-girl.png" alt="Linh AI" onerror="this.style.display='none'; this.parentElement.classList.add('ai-no-image');">
      <span>Hỏi AI</span>
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
          Xin chào! Mình là Trần Hà Linh 💖 Bạn cần tư vấn tour nào?
        </div>
      </div>

      <div class="ai-input-area">
        <input id="aiInput" type="text" placeholder="Nhập câu hỏi cho AI..." onkeydown="handleAIEnter(event)">
        <button type="button" onclick="sendAIMessage()">Gửi</button>
      </div>
    </div>
  `;
}

function openAiChat() {
  const chatBox = document.getElementById("aiChatBox");

  if (!chatBox) {
    createAIWidget();
  }

  const box = document.getElementById("aiChatBox");

  if (box) {
    box.classList.add("show");
  }

  setTimeout(function () {
    const input = document.getElementById("aiInput");
    if (input) {
      input.focus();
    }
  }, 100);
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

function addAIMessage(type, text) {
  const messages = document.getElementById("aiMessages");

  if (!messages) {
    return;
  }

  const div = document.createElement("div");
  div.className = type === "user" ? "ai-user" : "ai-bot";
  div.innerHTML = text.replace(/\n/g, "<br>");

  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}

function getCurrentTourInfo() {
  const title =
    document.querySelector(".product-info-box h1") ||
    document.querySelector(".product-title") ||
    document.querySelector("h1");

  const price =
    document.querySelector(".product-price") ||
    document.querySelector(".price");

  const meta =
    document.querySelector(".product-meta") ||
    document.querySelector(".meta");

  return {
    name: title ? title.innerText.trim() : "",
    price: price ? price.innerText.trim() : "",
    meta: meta ? meta.innerText.trim() : ""
  };
}

function createLocalAIReply(message) {
  const lower = message.toLowerCase();
  const tour = getCurrentTourInfo();

  if (
    lower.includes("tour") ||
    lower.includes("giá") ||
    lower.includes("lịch trình") ||
    lower.includes("tư vấn") ||
    lower.includes("sapa") ||
    lower.includes("đà nẵng") ||
    lower.includes("phú quốc") ||
    lower.includes("hàn quốc") ||
    lower.includes("nhật bản")
  ) {
    const tourName = tour.name || "tour này";
    const tourPrice = tour.price || "giá đang hiển thị trên website";
    const tourMeta = tour.meta || "thời gian theo chương trình tour";

    return `
      Mình gợi ý bạn tham khảo <b>${tourName}</b> nhé.<br><br>
      <b>Giá:</b> ${tourPrice}<br>
      <b>Thông tin:</b> ${tourMeta}<br><br>
      Tour này phù hợp nếu bạn muốn đặt nhanh, xem thông tin rõ ràng và được hỗ trợ trước khi thanh toán.
      Bạn có thể bấm <b>Thêm vào giỏ hàng</b>, sau đó vào phần <b>Thanh toán</b> để gửi đơn đặt tour.
    `;
  }

  if (lower.includes("thanh toán") || lower.includes("qr") || lower.includes("chuyển khoản")) {
    return `
      Bạn có thể thanh toán bằng chuyển khoản ngân hàng hoặc ví điện tử nếu website đã hiển thị mã QR.
      Khi chuyển khoản, hãy kiểm tra đúng số tiền và nội dung chuyển khoản trước khi xác nhận đơn.
    `;
  }

  if (lower.includes("giỏ hàng")) {
    return `
      Bạn có thể thêm nhiều tour vào giỏ hàng, kiểm tra lại số lượng và tổng tiền trước khi sang trang thanh toán.
    `;
  }

  return `
    Mình là Trần Hà Linh, mình có thể hỗ trợ bạn chọn tour, so sánh tour, xem giá, lịch trình và hướng dẫn đặt tour.
    Bạn hãy nhập tên tour hoặc điểm đến bạn quan tâm nhé.
  `;
}

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

  addAIMessage("bot", "Linh AI đang xem thông tin tour cho bạn...");

  const messages = document.getElementById("aiMessages");
  const loadingMessage = messages ? messages.lastElementChild : null;

  try {
    if (AI_WEBHOOK_URL) {
      const response = await fetch(AI_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: message,
          page: window.location.href,
          tour: getCurrentTourInfo()
        })
      });

      const data = await response.json();

      if (loadingMessage) {
        loadingMessage.remove();
      }

      const reply =
        data.reply ||
        data.message ||
        data.text ||
        createLocalAIReply(message);

      addAIMessage("bot", reply);
      return;
    }

    setTimeout(function () {
      if (loadingMessage) {
        loadingMessage.remove();
      }

      addAIMessage("bot", createLocalAIReply(message));
    }, 500);
  } catch (error) {
    if (loadingMessage) {
      loadingMessage.remove();
    }

    addAIMessage("bot", createLocalAIReply(message));
  }
}

function askAIAboutCurrentTour() {
  const tour = getCurrentTourInfo();

  openAiChat();

  const input = document.getElementById("aiInput");

  const tourName = tour.name || "tour này";
  const tourPrice = tour.price ? ` Giá hiện tại là ${tour.price}.` : "";
  const tourMeta = tour.meta ? ` Thông tin tour: ${tour.meta}.` : "";

  const question = `Hãy tư vấn chi tiết giúp tôi về ${tourName}.${tourPrice}${tourMeta} Tour này phù hợp với ai và có nên đặt không?`;

  if (input) {
    input.value = question;
    input.focus();
  }
}

/* Tên hàm phụ để các file khác gọi đều chạy được */
function askAiAboutProduct() {
  askAIAboutCurrentTour();
}

function askAIForProduct() {
  askAIAboutCurrentTour();
}

function askAiForProduct() {
  askAIAboutCurrentTour();
}

document.addEventListener("DOMContentLoaded", function () {
  createAIWidget();
});