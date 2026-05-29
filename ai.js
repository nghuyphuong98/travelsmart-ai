const AI_WEBHOOK_URL = "https://dykp2013.app.n8n.cloud/webhook/travelsmart-ai";

function createAIWidget() {
  const container = document.getElementById("aiWidget");

  if (!container) {
    return;
  }

  container.innerHTML = `
    <button class="ai-float-button" onclick="openAIChat()">
      <span class="ai-emoji">🤖💖</span>
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

async function sendAIMessage() {
  const input = document.getElementById("aiInput");
  const messages = document.getElementById("aiMessages");

  const text = input.value.trim();

  if (!text) {
    return;
  }

  messages.innerHTML += `<div class="ai-user">${text}</div>`;
  input.value = "";

  messages.innerHTML += `<div class="ai-bot loading">AI đang tư vấn...</div>`;
  messages.scrollTop = messages.scrollHeight;

  const currentProduct = window.currentProduct || {};
  const currentUrl = window.location.href;
  const profile = JSON.parse(localStorage.getItem("profile")) || {};

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
        Chatbot chưa kết nối được với n8n. Bạn cần tạo workflow AI rồi thay link webhook vào file ai.js.
      </div>
    `;
  }
}

createAIWidget();