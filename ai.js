const AI_WEBHOOK_URL = "https://dykp2013.app.n8n.cloud/webhook/travelsmart-ai";

function createAIWidget() {
  const container = document.getElementById("aiWidget");

  if (!container) {
    return;
  }

  container.innerHTML = `
   <button class="ai-float-button" onclick="openAiChat()">
  <img src="assets/ai-girl.png" alt="Linh AI">
  <span>Hỏi AI</span>
</button>

    <div class="ai-chat-box" id="aiChatBox">
      <div class="ai-chat-header">
        <div>
          <b>Linh AI</b>
          <p>Trợ lý tư vấn TravelSmart</p>
        </div>
        <button onclick="closeAIChat()">×</button>
      </div>

      <div class="ai-messages" id="aiMessages">
        <div class="ai-bot">
          Xin chào! Mình là Linh AI 💖 Bạn cần tư vấn tour nào?
        </div>
      </div>

      <div class="ai-input-area">
        <input id="aiInput" type="text" placeholder="Nhập câu hỏi cho AI...">
        <button onclick="sendAIMessage()">Gửi</button>
      </div>
    </div>
  `;
}

function openAIChat() {
  const box = document.getElementById("aiChatBox");

  if (box) {
    box.style.display = "flex";
  }
}

function closeAIChat() {
  const box = document.getElementById("aiChatBox");

  if (box) {
    box.style.display = "none";
  }
}

function findProductFromMessage(message) {
  if (typeof products === "undefined") {
    return null;
  }

  const lowerText = message.toLowerCase();

  // Tìm theo mã sản phẩm, ví dụ TS-001
  let foundProduct = products.find(product => {
    return lowerText.includes(product.sku.toLowerCase());
  });

  if (foundProduct) {
    return foundProduct;
  }

  // Tìm theo tên tour hoặc điểm đến
  foundProduct = products.find(product => {
    return (
      lowerText.includes(product.name.toLowerCase()) ||
      lowerText.includes(product.destination.toLowerCase())
    );
  });

  if (foundProduct) {
    return foundProduct;
  }

  // Tìm theo câu kiểu: gói 1, gói 2, gói 10...
  const packageMatch = lowerText.match(/gói\s*(\d+)/);

  if (packageMatch) {
    const packageNumber = Number(packageMatch[1]);

    foundProduct = products.find(product => {
      return product.name.toLowerCase().includes(`gói ${packageNumber}`);
    });

    if (foundProduct) {
      return foundProduct;
    }
  }

  // Tìm theo câu kiểu: sản phẩm 1, tour 1, id 1
  const numberMatch = lowerText.match(/(?:sản phẩm|tour|id)\s*(\d+)/);

  if (numberMatch) {
    const productId = Number(numberMatch[1]);

    foundProduct = products.find(product => {
      return product.id === productId;
    });

    if (foundProduct) {
      return foundProduct;
    }
  }

  return null;
}

async function sendAIMessage() {
  const input = document.getElementById("aiInput");
  const messages = document.getElementById("aiMessages");

  if (!input || !messages) {
    return;
  }

  const text = input.value.trim();

  if (!text) {
    return;
  }

  messages.innerHTML += `<div class="ai-user">${text}</div>`;
  input.value = "";

  messages.innerHTML += `<div class="ai-bot loading">AI đang tư vấn...</div>`;
  messages.scrollTop = messages.scrollHeight;

  const profile = JSON.parse(localStorage.getItem("profile")) || {};

  let currentProduct = window.currentProduct || null;
  let currentUrl = window.location.href;

  // Nếu đang ở trang chủ hoặc trang danh sách, AI sẽ tự tìm sản phẩm theo câu hỏi
  if (!currentProduct) {
    currentProduct = findProductFromMessage(text);

    if (currentProduct) {
      currentUrl = `${window.location.origin}/product-detail.html?id=${currentProduct.id}`;
    }
  }

  if (!currentProduct) {
    currentProduct = {};
  }

  try {
    const response = await fetch(AI_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: text,
        product: currentProduct,
        productUrl: currentUrl,
        profile: profile
      })
    });

    const data = await response.json();

    const loading = document.querySelector(".loading");

    if (loading) {
      loading.remove();
    }

    messages.innerHTML += `<div class="ai-bot">${data.reply || "AI chưa có câu trả lời phù hợp."}</div>`;
    messages.scrollTop = messages.scrollHeight;

  } catch (error) {
    const loading = document.querySelector(".loading");

    if (loading) {
      loading.remove();
    }

    messages.innerHTML += `
      <div class="ai-bot">
        Chatbot chưa kết nối được với n8n. Bạn cần kiểm tra lại webhook AI trong file ai.js.
      </div>
    `;
  }
}

createAIWidget();