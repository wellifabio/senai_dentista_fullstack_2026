const API_BASE = "http://localhost:3000";

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (response.status === 401 && path !== "/usuario/login") {
    clearSession();
    window.location.href = "login.html";
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json") ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof data === "string" ? data : data?.message || data?.error || "Erro na requisição.";
    throw new Error(message);
  }

  return data;
}

const api = {
  login: (payload) => apiRequest("/usuario/login", { method: "POST", body: JSON.stringify(payload) }),
  listarPacientes: () => apiRequest("/paciente/listar"),
  cadastrarPaciente: (payload) => apiRequest("/paciente/cadastrar", { method: "POST", body: JSON.stringify(payload) }),
  atualizarPaciente: (id, payload) => apiRequest(`/paciente/atualizar/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  excluirPaciente: (id) => apiRequest(`/paciente/excluir/${id}`, { method: "DELETE" }),
  listarDentistas: () => apiRequest("/dentista/listar"),
  cadastrarDentista: (payload) => apiRequest("/dentista/cadastrar", { method: "POST", body: JSON.stringify(payload) }),
  atualizarDentista: (id, payload) => apiRequest(`/dentista/atualizar/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  excluirDentista: (id) => apiRequest(`/dentista/excluir/${id}`, { method: "DELETE" }),
  listarAgendamentos: () => apiRequest("/agendamento/listar"),
  cadastrarAgendamento: (payload) => apiRequest("/agendamento/cadastrar", { method: "POST", body: JSON.stringify(payload) }),
  atualizarAgendamento: (id, payload) => apiRequest(`/agendamento/atualizar/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  excluirAgendamento: (id) => apiRequest(`/agendamento/excluir/${id}`, { method: "DELETE" })
};
