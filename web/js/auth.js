function getSession() {
  const token = localStorage.getItem("token");
  const usuarioRaw = localStorage.getItem("usuario");
  if (!token || !usuarioRaw) return null;
  try {
    return { token, usuario: JSON.parse(usuarioRaw) };
  } catch {
    return null;
  }
}

function setSession(token, usuario) {
  localStorage.setItem("token", token);
  localStorage.setItem("usuario", JSON.stringify(usuario));
}

function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");
}

function requireAuth() {
  const session = getSession();
  if (!session) {
    window.location.href = "login.html";
    return null;
  }
  return session;
}

function redirectIfAuthenticated() {
  if (getSession()) {
    window.location.href = "index.html";
  }
}
