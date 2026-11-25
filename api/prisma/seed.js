const prisma = require('../src/data/prisma')
const { criarHash } = require('../src/middleware/auth');

async function main() {
    await prisma.$transaction(async (transaction) => {
        await transaction.agendamento.deleteMany()
        await transaction.dentista.deleteMany()
        await transaction.paciente.deleteMany()
        await transaction.usuario.deleteMany()

        const usuarios = await Promise.all([
            transaction.usuario.create({ data: { nome: "Ana Silva", login: "ana", senha: await criarHash("senha123") } }),
            transaction.usuario.create({ data: { nome: "Maria Silva", login: "maria", senha: await criarHash("senha123") } }),
            transaction.usuario.create({ data: { nome: "Bruno Oliveira", login: "bruno", senha: await criarHash("senha123") } }),
        ])
        console.log("Usuarios de teste cadastrados.")
        const pacientes = await Promise.all([
            transaction.paciente.create({ data: { nome: "Jair Silva", cpf: await criarHash("517.790.267-65") } }),
            transaction.paciente.create({ data: { nome: "Mariana Campos", cpf: await criarHash("196.740.112-85") } }),
            transaction.paciente.create({ data: { nome: "Carolina Machado", cpf: await criarHash("705.163.621-94") } }),
        ])
        console.log("pacientees de teste cadastrados.")
        const dentistas = await Promise.all([
            transaction.dentista.create({ data: { nome: "Maximiliano Silva", especialidade: "Cirurgia", cro: "CRO-SP 123456" } }),
            transaction.dentista.create({ data: { nome: "Mariana Gimenes", especialidade: "Ortodontia", cro: "CRO-MG 123000" } }),
            transaction.dentista.create({ data: { nome: "Tadeu Oliveira", especialidade: "Clínica Geral", cro: "CRO-SP 123006" } }),
        ])
        console.log("dentistas de teste cadastrados.")
        const agendamentos = await Promise.all([
            transaction.agendamento.create({ data: { usuarioId: 1, pacienteId: 1, dentistaId: 3 } }),
            transaction.agendamento.create({ data: { usuarioId: 1, pacienteId: 2, dentistaId: 2 } }),
            transaction.agendamento.create({ data: { usuarioId: 2, pacienteId: 3, dentistaId: 1 } }),
        ])
        console.log("Agendamentos de teste cadastrados.")
    })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })