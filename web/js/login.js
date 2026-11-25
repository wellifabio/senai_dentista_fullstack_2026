redirectIfAuthenticated();

const form = document.getElementById("login-form");
const feedback = document.getElementById("login-feedback");

function showError(message) {
  feedback.textContent = message;
  feedback.classList.remove("hidden");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  feedback.classList.add("hidden");

  const login = document.getElementById("login").value.trim();
  const senha = document.getElementById("senha").value;

  if (!login || !senha) {
    showError("Preencha login e senha para continuar.");
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]');
  submitButton.disabled = true;
  submitButton.textContent = "Entrando...";

  try {
    const data = await api.login({ login, senha });
    const token = data["Bearer Token"] || data.token || data.bearer;
    const usuario = data.usuario;

    if (!token || !usuario) {
      throw new Error("Resposta de autenticação inválida.");
    }

    const usuarioSeguro = {
      id: usuario.id,
      nome: usuario.nome,
      login: usuario.login
    };
    setSession(token, usuarioSeguro);
    window.location.href = "index.html";
  } catch (error) {
    showError(error.message || "Não foi possível realizar o login.");
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Entrar";
  }
});
