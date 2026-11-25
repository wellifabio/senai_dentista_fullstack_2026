const prisma = require("../data/prisma");
const { criarHash } = require("../middleware/auth");

const cadastrar = async (req, res) => {
    const data = req.body;
    data.cpf = await criarHash(req.body.cpf);
    const item = await prisma.paciente.create({
        data
    });

    res.json(item).status(201).end();
};

const listar = async (req, res) => {
    const lista = await prisma.paciente.findMany();
    res.json(lista).status(200).end();
};

const buscar = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.paciente.findUnique({
        where: { id: Number(id) }
    });

    res.json(item).status(200).end();
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const dados = req.body;
    if (dados.cpf != undefined) dados.cpf = await criarHash(req.body.cpf);
    const item = await prisma.paciente.update({
        where: { id: Number(id) },
        data: dados
    });
    res.json(item).status(200).end();
};

const excluir = async (req, res) => {
    const { id } = req.params;
    const item = await prisma.paciente.delete({
        where: { id: Number(id) }
    });
    res.json(item).status(200).end();
};

module.exports = {
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
}
