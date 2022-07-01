const sleep = (m) => new Promise((r) => setTimeout(r, m));
const chatBox = document.getElementById("chatbox");
const chatForm = document.getElementById("chatbot_form");

const messageInput = document.querySelector(".message");
const messgaeSubmit = document.querySelector(".send_msg");

const startConversation = [
  "Welcome to Atos callaboratory services",
  "We inform you that as part of our quality control this conversation is registrable",
  "Start the conversation with our automatic assistance",
];
window.addEventListener("DOMContentLoaded", async function (e) {
  inputDisable(true);
  for (el of startConversation) {
    await sleep(1000);
    chatBox.appendChild(botMessage(el));
  }
  inputDisable(false);
});

chatForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const formData = new FormData(chatForm);
  inputDisable(true);
  messageInput.value = "";
  const userMessageData = formData.get("message");
  console.log(UserMessage);
  if (UserMessage == "") return;
  chatBox.appendChild(UserMessage(userMessageData));
  sleep(1000);
  const botMsg = await GetBotMessage(userMessageData);
  chatBox.appendChild(botMessage(botMsg["message"]));
  inputDisable(false);
  messageInput.focus();
  chatBox.scrollTop = chatBox.scrollHeight;
});

async function GetBotMessage(message) {
  const botMsg = await fetch(`api/bot/${message}`);

  return await botMsg.json();
}

function botMessage(msg) {
  const el = document.createElement("div");
  el.classList.add("bot");
  const HTML = `
  <img class="bot_img" src="./../static/img/bot_avatar.png" />
  <div class="bot_msg">${msg}</div>
  `;
  el.insertAdjacentHTML("afterbegin", HTML);
  return el;
}
function UserMessage(msg) {
  const el = document.createElement("div");
  el.classList.add("user");
  const HTML = `
  <div class="user_msg">${msg}</div>
  <img class="bot_img" src="./../static/img/bot_avatar.png" />
  `;
  el.insertAdjacentHTML("afterbegin", HTML);
  return el;
}

function inputDisable(statu) {
  messageInput.disabled = statu;
  messgaeSubmit.disabled = statu;
}
