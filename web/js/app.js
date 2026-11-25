const session = requireAuth();
if (!session) {
  throw new Error("Sessão inválida.");
}

const state = {
  pacientes: [],
  dentistas: [],
  agendamentos: []
};

const el = {
  usuarioNome: document.getElementById("usuario-nome"),
  usuarioLogin: document.getElementById("usuario-login"),
  appFeedback: document.getElementById("app-feedback"),
  agendamentosBody: document.getElementById("agendamentos-tbody"),
  agendamentosEmpty: document.getElementById("agendamentos-empty"),
  agendamentoFormWrap: document.getElementById("agendamento-form-wrap"),
  agendamentoForm: document.getElementById("agendamento-form"),
  agendamentoFormTitle: document.getElementById("agendamento-form-title"),
  agendamentoId: document.getElementById("agendamento-id"),
  agendamentoData: document.getElementById("agendamento-data"),
  agendamentoPaciente: document.getElementById("agendamento-paciente"),
  agendamentoDentista: document.getElementById("agendamento-dentista"),
  agendamentoUsuario: document.getElementById("agendamento-usuario"),
  pacienteFeedback: document.getElementById("paciente-feedback"),
  pacientesBody: document.getElementById("pacientes-tbody"),
  pacientesEmpty: document.getElementById("pacientes-empty"),
  pacienteForm: document.getElementById("paciente-form"),
  pacienteFormTitle: document.getElementById("paciente-form-title"),
  pacienteId: document.getElementById("paciente-id"),
  pacienteNome: document.getElementById("paciente-nome"),
  pacienteCpf: document.getElementById("paciente-cpf"),
  pacienteBusca: document.getElementById("paciente-busca"),
  dentistaFeedback: document.getElementById("dentista-feedback"),
  dentistasBody: document.getElementById("dentistas-tbody"),
  dentistasEmpty: document.getElementById("dentistas-empty"),
  dentistaForm: document.getElementById("dentista-form"),
  dentistaFormTitle: document.getElementById("dentista-form-title"),
  dentistaId: document.getElementById("dentista-id"),
  dentistaNome: document.getElementById("dentista-nome"),
  dentistaCro: document.getElementById("dentista-cro"),
  dentistaEspecialidade: document.getElementById("dentista-especialidade")
};

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function showFeedback(target, message, type = "success") {
  target.textContent = message;
  target.className = `feedback ${type}`;
}

function clearFeedback(target) {
  target.textContent = "";
  target.className = "feedback hidden";
}

function formatDateTime(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("pt-BR", {
    dateStyle: "2-digit",
    timeStyle: "short"
  });
}

function toDateTimeLocal(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

function cpfDisplay(cpf) {
  if (!cpf) return "-";
  return `<span class="badge" title="CPF armazenado criptografado no banco de dados">Protegido</span>`;
}

function openModal(id) {
  const modal = document.getElementById(id);
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}

function closeModal(id) {
  const modal = document.getElementById(id);
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}

function setUserInfo() {
  el.usuarioNome.textContent = session.usuario.nome || "Usuário";
  el.usuarioLogin.textContent = session.usuario.login ? `Login: ${session.usuario.login}` : "";
  el.agendamentoUsuario.value = `${session.usuario.nome} (${session.usuario.login})`;
}

function fillSelect(select, items, placeholder, labelFn) {
  const current = select.value;
  select.innerHTML = `<option value="">${placeholder}</option>`;
  for (const item of items) {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = labelFn(item);
    select.appendChild(option);
  }
  if (current) select.value = current;
}

function renderPacientes() {
  const query = el.pacienteBusca.value.trim().toLowerCase();
  const filtered = state.pacientes.filter((p) => {
    if (!query) return true;
    return [p.id, p.nome, p.cpf].some((v) => String(v ?? "").toLowerCase().includes(query));
  });

  el.pacientesBody.innerHTML = filtered.map((p) => `
    <tr>
      <td>${p.id}</td>
      <td>${escapeHtml(p.nome)}</td>
      <td>${cpfDisplay(p.cpf)}</td>
      <td class="actions-cell">
        <button class="btn btn-secondary btn-sm" data-edit-paciente="${p.id}">Editar</button>
        <button class="btn btn-danger btn-sm" data-delete-paciente="${p.id}">Excluir</button>
      </td>
    </tr>
  `).join("");

  el.pacientesEmpty.hidden = filtered.length > 0;
}

function renderDentistas() {
  el.dentistasBody.innerHTML = state.dentistas.map((d) => `
    <tr>
      <td>${d.id}</td>
      <td>${escapeHtml(d.nome)}</td>
      <td>${escapeHtml(d.cro)}</td>
      <td>${escapeHtml(d.especialidade)}</td>
      <td class="actions-cell">
        <button class="btn btn-secondary btn-sm" data-edit-dentista="${d.id}">Editar</button>
        <button class="btn btn-danger btn-sm" data-delete-dentista="${d.id}">Excluir</button>
      </td>
    </tr>
  `).join("");

  el.dentistasEmpty.hidden = state.dentistas.length > 0;
}

function getPacienteById(id) {
  return state.pacientes.find((p) => Number(p.id) === Number(id));
}

function getDentistaById(id) {
  return state.dentistas.find((d) => Number(d.id) === Number(id));
}

function renderAgendamentos() {
  const agendamentos = [...state.agendamentos].sort((a, b) => new Date(a.data) - new Date(b.data));

  el.agendamentosBody.innerHTML = agendamentos.map((a) => {
    const paciente = a.paciente || getPacienteById(a.pacienteId);
    const dentista = a.dentista || getDentistaById(a.dentistaId);
    return `
      <tr>
        <td>${escapeHtml(formatDateTime(a.data))}</td>
        <td>${escapeHtml(paciente?.nome || "Paciente não encontrado")}</td>
        <td>${cpfDisplay(paciente?.cpf)}</td>
        <td>${escapeHtml(dentista?.nome || "Dentista não encontrado")}</td>
        <td>${escapeHtml(dentista?.cro || "-")}</td>
        <td>${escapeHtml(dentista?.especialidade || "-")}</td>
        <td class="actions-cell">
          <button class="btn btn-secondary btn-sm" data-edit-agendamento="${a.id}">Editar data</button>
          <button class="btn btn-danger btn-sm" data-delete-agendamento="${a.id}">Excluir</button>
        </td>
      </tr>
    `;
  }).join("");

  el.agendamentosEmpty.hidden = agendamentos.length > 0;
}

function garantirArray(valor) {
  return Array.isArray(valor) ? valor : [];
}

async function loadPacientes() {
  state.pacientes = garantirArray(await api.listarPacientes());
  renderPacientes();
  fillSelect(el.agendamentoPaciente, state.pacientes, "Selecione um paciente", (p) => `${p.nome} (#${p.id})`);
}

async function loadDentistas() {
  state.dentistas = garantirArray(await api.listarDentistas());
  renderDentistas();
  fillSelect(el.agendamentoDentista, state.dentistas, "Selecione um dentista", (d) => `${d.nome} - ${d.cro}`);
}

async function loadAgendamentos() {
  state.agendamentos = garantirArray(await api.listarAgendamentos());
  renderAgendamentos();
}

async function loadAll() {
  const resultados = await Promise.allSettled([loadPacientes(), loadDentistas()]);
  const erros = resultados.filter((r) => r.status === "rejected").map((r) => r.reason?.message || "Erro ao carregar dados.");

  try {
    await loadAgendamentos();
  } catch (error) {
    erros.push(error.message || "Erro ao carregar agendamentos.");
  }

  if (erros.length) {
    throw new Error(erros.join(" | "));
  }
}

function resetPacienteForm() {
  el.pacienteId.value = "";
  el.pacienteNome.value = "";
  el.pacienteCpf.value = "";
  el.pacienteFormTitle.textContent = "Adicionar paciente";
}

function resetDentistaForm() {
  el.dentistaId.value = "";
  el.dentistaNome.value = "";
  el.dentistaCro.value = "";
  el.dentistaEspecialidade.value = "";
  el.dentistaFormTitle.textContent = "Adicionar dentista";
}

function resetAgendamentoForm() {
  el.agendamentoId.value = "";
  el.agendamentoData.value = "";
  el.agendamentoPaciente.value = "";
  el.agendamentoDentista.value = "";
  el.agendamentoFormTitle.textContent = "Novo agendamento";
  el.agendamentoFormWrap.hidden = true;
}

function openAgendamentoForm(agendamento) {
  el.agendamentoFormWrap.hidden = false;
  fillSelect(el.agendamentoPaciente, state.pacientes, "Selecione um paciente", (p) => `${p.nome} (#${p.id})`);
  fillSelect(el.agendamentoDentista, state.dentistas, "Selecione um dentista", (d) => `${d.nome} - ${d.cro}`);
  if (agendamento) {
    el.agendamentoId.value = agendamento.id;
    el.agendamentoData.value = toDateTimeLocal(agendamento.data);
    el.agendamentoPaciente.value = agendamento.pacienteId || "";
    el.agendamentoDentista.value = agendamento.dentistaId || "";
    el.agendamentoFormTitle.textContent = `Editar agendamento #${agendamento.id}`;
  } else {
    el.agendamentoId.value = "";
    el.agendamentoData.value = "";
    el.agendamentoPaciente.value = "";
    el.agendamentoDentista.value = "";
    el.agendamentoFormTitle.textContent = "Novo agendamento";
  }
  el.agendamentoFormWrap.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

document.querySelectorAll("[data-close-modal]").forEach((btn) => {
  btn.addEventListener("click", () => closeModal(btn.dataset.closeModal));
});

document.querySelectorAll(".modal-overlay").forEach((overlay) => {
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) closeModal(overlay.id);
  });
});

document.querySelectorAll(".menu-btn").forEach((button) => {
  button.addEventListener("click", async () => {
    const action = button.dataset.action;
    if (action === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    if (action === "pacientes") {
      clearFeedback(el.pacienteFeedback);
      openModal("modal-pacientes");
      await loadPacientes();
    }
    if (action === "dentistas") {
      clearFeedback(el.dentistaFeedback);
      openModal("modal-dentistas");
      await loadDentistas();
    }
    if (action === "sair") {
      clearSession();
      window.location.href = "login.html";
    }
  });
});

document.getElementById("btn-refresh-agendamentos").addEventListener("click", async () => {
  clearFeedback(el.appFeedback);
  try {
    await loadAll();
    showFeedback(el.appFeedback, "Agendamentos atualizados com sucesso.");
  } catch (error) {
    showFeedback(el.appFeedback, error.message, "error");
  }
});

document.getElementById("btn-novo-agendamento").addEventListener("click", async () => {
  clearFeedback(el.appFeedback);
  try {
    await Promise.all([loadPacientes(), loadDentistas()]);
    openAgendamentoForm(null);
  } catch (error) {
    showFeedback(el.appFeedback, error.message, "error");
  }
});

document.getElementById("btn-cancelar-agendamento").addEventListener("click", resetAgendamentoForm);

el.agendamentoForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearFeedback(el.appFeedback);

  const id = el.agendamentoId.value;
  const payload = {
    data: new Date(el.agendamentoData.value).toISOString(),
    usuarioId: Number(session.usuario.id),
    pacienteId: Number(el.agendamentoPaciente.value),
    dentistaId: Number(el.agendamentoDentista.value)
  };

  if (!el.agendamentoData.value || !payload.pacienteId || !payload.dentistaId) {
    showFeedback(el.appFeedback, "Preencha data, paciente e dentista.", "error");
    return;
  }

  try {
    if (id) {
      await api.atualizarAgendamento(id, payload);
      showFeedback(el.appFeedback, "Agendamento atualizado com sucesso.");
    } else {
      await api.cadastrarAgendamento(payload);
      showFeedback(el.appFeedback, "Agendamento cadastrado com sucesso.");
    }
    resetAgendamentoForm();
    await loadAgendamentos();
  } catch (error) {
    showFeedback(el.appFeedback, error.message, "error");
  }
});

el.agendamentosBody.addEventListener("click", async (event) => {
  const editBtn = event.target.closest("[data-edit-agendamento]");
  const deleteBtn = event.target.closest("[data-delete-agendamento]");

  if (editBtn) {
    clearFeedback(el.appFeedback);
    const agendamento = state.agendamentos.find((a) => Number(a.id) === Number(editBtn.dataset.editAgendamento));
    if (agendamento) openAgendamentoForm(agendamento);
  }

  if (deleteBtn) {
    const id = deleteBtn.dataset.deleteAgendamento;
    if (!confirm("Deseja excluir este agendamento?")) return;
    clearFeedback(el.appFeedback);
    try {
      await api.excluirAgendamento(id);
      showFeedback(el.appFeedback, "Agendamento excluído com sucesso.");
      await loadAgendamentos();
    } catch (error) {
      showFeedback(el.appFeedback, error.message, "error");
    }
  }
});

el.pacienteBusca.addEventListener("input", renderPacientes);
document.getElementById("btn-limpar-busca-paciente").addEventListener("click", () => {
  el.pacienteBusca.value = "";
  renderPacientes();
});

document.getElementById("btn-cancelar-paciente").addEventListener("click", () => {
  resetPacienteForm();
  clearFeedback(el.pacienteFeedback);
});

el.pacienteForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearFeedback(el.pacienteFeedback);

  const id = el.pacienteId.value;
  const payload = {
    nome: el.pacienteNome.value.trim(),
    cpf: el.pacienteCpf.value.trim()
  };

  if (!payload.nome || !payload.cpf) {
    showFeedback(el.pacienteFeedback, "Preencha nome e CPF do paciente.", "error");
    return;
  }

  try {
    if (id) {
      await api.atualizarPaciente(id, payload);
      showFeedback(el.pacienteFeedback, "Paciente atualizado com sucesso.");
    } else {
      await api.cadastrarPaciente(payload);
      showFeedback(el.pacienteFeedback, "Paciente cadastrado com sucesso.");
    }
    resetPacienteForm();
    await loadPacientes();
    await loadAgendamentos();
  } catch (error) {
    showFeedback(el.pacienteFeedback, error.message, "error");
  }
});

el.pacientesBody.addEventListener("click", async (event) => {
  const editBtn = event.target.closest("[data-edit-paciente]");
  const deleteBtn = event.target.closest("[data-delete-paciente]");

  if (editBtn) {
    const paciente = state.pacientes.find((p) => Number(p.id) === Number(editBtn.dataset.editPaciente));
    if (!paciente) return;
    el.pacienteId.value = paciente.id;
    el.pacienteNome.value = paciente.nome || "";
    el.pacienteCpf.value = "";
    el.pacienteCpf.placeholder = "Informe o CPF novamente para salvar";
    el.pacienteFormTitle.textContent = `Editar paciente #${paciente.id}`;
    clearFeedback(el.pacienteFeedback);
    showFeedback(el.pacienteFeedback, "Por segurança, o CPF criptografado não é exibido. Informe o CPF para salvar alterações.", "success");
  }

  if (deleteBtn) {
    const id = deleteBtn.dataset.deletePaciente;
    if (!confirm("Deseja excluir este paciente?")) return;
    clearFeedback(el.pacienteFeedback);
    try {
      await api.excluirPaciente(id);
      showFeedback(el.pacienteFeedback, "Paciente excluído com sucesso.");
      await loadPacientes();
      await loadAgendamentos();
    } catch (error) {
      showFeedback(el.pacienteFeedback, error.message, "error");
    }
  }
});

document.getElementById("btn-cancelar-dentista").addEventListener("click", () => {
  resetDentistaForm();
  clearFeedback(el.dentistaFeedback);
});

el.dentistaForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearFeedback(el.dentistaFeedback);

  const id = el.dentistaId.value;
  const payload = {
    nome: el.dentistaNome.value.trim(),
    cro: el.dentistaCro.value.trim(),
    especialidade: el.dentistaEspecialidade.value.trim()
  };

  if (!payload.nome || !payload.cro || !payload.especialidade) {
    showFeedback(el.dentistaFeedback, "Preencha nome, CRO e especialidade.", "error");
    return;
  }

  try {
    if (id) {
      await api.atualizarDentista(id, payload);
      showFeedback(el.dentistaFeedback, "Dentista atualizado com sucesso.");
    } else {
      await api.cadastrarDentista(payload);
      showFeedback(el.dentistaFeedback, "Dentista cadastrado com sucesso.");
    }
    resetDentistaForm();
    await loadDentistas();
    await loadAgendamentos();
  } catch (error) {
    showFeedback(el.dentistaFeedback, error.message, "error");
  }
});

el.dentistasBody.addEventListener("click", async (event) => {
  const editBtn = event.target.closest("[data-edit-dentista]");
  const deleteBtn = event.target.closest("[data-delete-dentista]");

  if (editBtn) {
    const dentista = state.dentistas.find((d) => Number(d.id) === Number(editBtn.dataset.editDentista));
    if (!dentista) return;
    el.dentistaId.value = dentista.id;
    el.dentistaNome.value = dentista.nome || "";
    el.dentistaCro.value = dentista.cro || "";
    el.dentistaEspecialidade.value = dentista.especialidade || "";
    el.dentistaFormTitle.textContent = `Editar dentista #${dentista.id}`;
    clearFeedback(el.dentistaFeedback);
  }

  if (deleteBtn) {
    const id = deleteBtn.dataset.deleteDentista;
    if (!confirm("Deseja excluir este dentista?")) return;
    clearFeedback(el.dentistaFeedback);
    try {
      await api.excluirDentista(id);
      showFeedback(el.dentistaFeedback, "Dentista excluído com sucesso.");
      await loadDentistas();
      await loadAgendamentos();
    } catch (error) {
      showFeedback(el.dentistaFeedback, error.message, "error");
    }
  }
});

async function init() {
  setUserInfo();
  try {
    await loadAll();
  } catch (error) {
    showFeedback(el.appFeedback, error.message, "error");
  }
}

init();
