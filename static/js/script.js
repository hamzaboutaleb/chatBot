const login_container = document.getElementById("login-form");
const register_container = document.getElementById("register-form");
const form_links = document.querySelector(".form-links");
const register_form = document.getElementById("register");
const login_form = document.getElementById("login");

form_links.addEventListener("click", function (e) {
  e.preventDefault();
  const el = e.target.closest("a");
  if (el.classList.contains("login")) {
    showLogin();
  } else if (el.classList.contains("register")) {
    showRegister();
  }
});

async function RequestPOST(link, form) {
  const formData = new FormData(form);
  console.log([...formData.entries()]);
  const response = await fetch(`${location.href}${link}`, {
    method: "POST",
    body: formData,
  });
  return await response.json();
}

//REGISTER
register_form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const modal = createModal();
  const resp = await RequestPOST("auth/register", register_form);
  if (resp.status == "fail") {
    modal.appendChild(message(resp.message, "error"));
    removeModal(modal);
    return;
  }
  modal.appendChild(message("Account created", "success"));
  setTimeout(() => (location.href = "home"), 1500);
});

//LOGIN
login_form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const modal = createModal();
  const resp = await RequestPOST("auth/login", login_form);
  if (resp.status == "fail") {
    modal.appendChild(message(resp.message, "error"));
    removeModal(modal);
    return;
  }
  modal.appendChild(message("Logged", "success"));
  setTimeout(() => (location.href = "home"), 1500);
});

function showLogin() {
  login_container.classList.remove("hidden");
  register_container.classList.add("hidden");
}
function showRegister() {
  login_container.classList.add("hidden");
  register_container.classList.remove("hidden");
}

function createModal() {
  const modal = document.createElement("div");
  modal.classList.add("modal");
  document.body.appendChild(modal);
  return modal;
}
function removeModal(el) {
  setTimeout(() => el.remove(), 2000);
}
function message(msg, classes) {
  const errorDiv = document.createElement("div");
  errorDiv.classList.add(classes);
  errorDiv.textContent = msg;
  return errorDiv;
}
