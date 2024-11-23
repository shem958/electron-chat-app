const API_URL = "http://localhost:3001/api/messages";

const messagesContainer = document.getElementById("messages");
const inputField = document.getElementById("message-input");
const sendButton = document.getElementById("send-btn");
const emojiPickerBtn = document.getElementById("emoji-picker-btn");
const emojiPicker = document.getElementById("emoji-picker");
const searchBar = document.getElementById("search-bar");
const typingIndicator = document.getElementById("typing-indicator");
const settingsBtn = document.getElementById("settings-btn");
const settingsModal = document.getElementById("settings-modal");
const closeSettingsBtn = document.getElementById("close-settings-btn");
const themeToggle = document.getElementById("theme-toggle");
const fontSizeSelect = document.getElementById("font-size-select");
const themeSelect = document.getElementById("theme-select");

// Emoji Collection
const emojis = [
  "😀",
  "😂",
  "😍",
  "😎",
  "😭",
  "😡",
  "👍",
  "👏",
  "🙏",
  "💪",
  "🎉",
  "❤️",
];

// Populate Emoji Picker
function populateEmojiPicker() {
  emojis.forEach((emoji) => {
    const button = document.createElement("button");
    button.textContent = emoji;
    button.classList.add("emoji-button");
    button.addEventListener("click", () => {
      inputField.value += emoji;
      emojiPicker.classList.add("hidden");
    });
    emojiPicker.appendChild(button);
  });
}

// Fetch messages from the backend
async function fetchMessages(query = "") {
  const response = await fetch(`${API_URL}?search=${query}`);
  const messages = await response.json();
  renderMessages(messages);
}

// Render messages
function renderMessages(messages) {
  messagesContainer.innerHTML = "";
  messages.forEach((message) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.innerHTML = `
            <div class="text">
                <strong>${message.username}:</strong> ${message.content}
                <span class="timestamp">${new Date(
                  message.timestamp
                ).toLocaleTimeString()}</span>
            </div>
        `;
    messagesContainer.appendChild(messageElement);
  });
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Send a new message
async function sendMessage() {
  const content = inputField.value;
  if (!content) return;

  const message = {
    username: "You", // Replace with actual username in a real app
    content,
  };

  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message),
  });

  inputField.value = "";
  fetchMessages();
}

// Handle typing indicator
inputField.addEventListener("input", () => {
  typingIndicator.classList.remove("hidden");
  clearTimeout(inputField.typingTimeout);
  inputField.typingTimeout = setTimeout(() => {
    typingIndicator.classList.add("hidden");
  }, 1000);
});

// Search messages
searchBar.addEventListener("input", (e) => {
  const query = e.target.value.trim();
  fetchMessages(query);
});

// Toggle Emoji Picker
emojiPickerBtn.addEventListener("click", () => {
  emojiPicker.classList.toggle("hidden");
});

// Theme Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeToggle.textContent = themeToggle.textContent === "🌙" ? "☀️" : "🌙";
});

// Open and Close Settings Modal
settingsBtn.addEventListener("click", () => {
  settingsModal.classList.remove("hidden");
});
closeSettingsBtn.addEventListener("click", () => {
  settingsModal.classList.add("hidden");
});

// Apply Font Size
fontSizeSelect.addEventListener("change", (e) => {
  document.documentElement.style.fontSize =
    e.target.value === "small"
      ? "12px"
      : e.target.value === "large"
      ? "18px"
      : "16px";
});

// Apply Theme from Settings
themeSelect.addEventListener("change", (e) => {
  document.body.className = e.target.value === "dark" ? "dark-mode" : "";
});

// Initial Setup
populateEmojiPicker();
fetchMessages();
sendButton.addEventListener("click", sendMessage);
inputField.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
