const form = document.querySelector("form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const rememberInput = document.getElementById("remember");
const toggleBtn = document.getElementById("toggle-password");
const submitBtn = document.getElementById("submit-btn");
const statusEl = document.getElementById("status");

const emailError = document.getElementById("email-error");
const passwordError = document.getElementById("password-error");

// --- Isi email otomatis jika sebelumnya dicentang "Remember me" ---
try {
  const savedEmail = localStorage.getItem("rememberedEmail");
  if (savedEmail) {
    emailInput.value = savedEmail;
    rememberInput.checked = true;
  }
} catch (e) {}

// --- Tampilkan / sembunyikan password ---
toggleBtn.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";
  toggleBtn.classList.toggle("showing", isHidden);
  toggleBtn.setAttribute("aria-label", isHidden ? "Sembunyikan password" : "Tampilkan password");
});

// --- Validasi ---
function validateEmail() {
  const value = emailInput.value.trim();
  let message = "";
  if (!value) message = "Email wajib diisi.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) message = "Format email tidak valid.";
  emailError.textContent = message;
  emailInput.classList.toggle("invalid", !!message);
  return !message;
}

function validatePassword() {
  const value = passwordInput.value;
  let message = "";
  if (!value) message = "Password wajib diisi.";
  else if (value.length < 6) message = "Password minimal 6 karakter.";
  passwordError.textContent = message;
  passwordInput.classList.toggle("invalid", !!message);
  return !message;
}

// Validasi saat selesai mengisi, dan hilangkan error saat mengetik ulang
emailInput.addEventListener("blur", validateEmail);
passwordInput.addEventListener("blur", validatePassword);
emailInput.addEventListener("input", () => emailInput.classList.contains("invalid") && validateEmail());
passwordInput.addEventListener("input", () => passwordInput.classList.contains("invalid") && validatePassword());

// --- Submit ---
form.addEventListener("submit", (event) => {
  event.preventDefault();
  statusEl.textContent = "";
  statusEl.classList.remove("error-msg");

  const emailOk = validateEmail();
  const passwordOk = validatePassword();
  if (!emailOk || !passwordOk) {
    (!emailOk ? emailInput : passwordInput).focus();
    return;
  }

  // Simpan / hapus email sesuai "Remember me"
  try {
    if (rememberInput.checked) localStorage.setItem("rememberedEmail", emailInput.value.trim());
    else localStorage.removeItem("rememberedEmail");
  } catch (e) {}

  // Simulasi proses login (ganti bagian ini dengan fetch ke server/backend)
  submitBtn.disabled = true;
  submitBtn.textContent = "Loading...";

  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.textContent = "Log In";
    statusEl.textContent = "Login berhasil! Selamat datang.";
  }, 1200);
});