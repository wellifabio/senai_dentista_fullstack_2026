require('dotenv').config();
const express = require('express');
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const agendamentoRoutes = require('./src/routes/agendamento.routes');
app.use('/agendamento', agendamentoRoutes);

const dentistaRoutes = require('./src/routes/dentista.routes');
app.use('/dentista', dentistaRoutes);

const pacienteRoutes = require('./src/routes/paciente.routes');
app.use('/paciente', pacienteRoutes);

const usuarioRoutes = require('./src/routes/usuario.routes');
app.use('/usuario', usuarioRoutes);


app.use('/', (req, res) => {
  res.json({
    msg: "API Clínica dentária XPTO respondendo",
    rotas: [{
      usuario: [
        { verbo: "post", rota: "usuario/login" },
        { verbo: "post", rota: "usuario/cadastrar" },
        { verbo: "get", rota: "usuario/listar", jwt: true },
        { verbo: "get", rota: "usuario/buscar/:id", jwt: true },
        { verbo: "put", rota: "usuario/atualizar/:id", jwt: true },
        { verbo: "delete", rota: "usuario/excluir/:id", jwt: true },
      ]
    },
    {
      paciente: [
        { verbo: "post", rota: "paciente/cadastrar", jwt: true },
        { verbo: "get", rota: "paciente/listar", jwt: true },
        { verbo: "get", rota: "paciente/buscar/:id", jwt: true },
        { verbo: "put", rota: "paciente/atualizar/:id", jwt: true },
        { verbo: "delete", rota: "paciente/excluir/:id", jwt: true },
      ]
    },
    {
      dentista: [
        { verbo: "post", rota: "dentista/cadastrar" },
        { verbo: "get", rota: "dentista/listar" },
        { verbo: "get", rota: "dentista/buscar/:id" },
        { verbo: "put", rota: "dentista/atualizar/:id" },
        { verbo: "delete", rota: "dentista/excluir/:id" },
      ]
    },
    {
      agendamento: [
        { verbo: "post", rota: "agendamento/cadastrar" },
        { verbo: "get", rota: "agendamento/listar" },
        { verbo: "get", rota: "agendamento/buscar/:id" },
        { verbo: "put", rota: "agendamento/atualizar/:id" },
        { verbo: "delete", rota: "agendamento/excluir/:id" },
      ]
    }]
  })
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor em http://localhost:${PORT}`);
});
