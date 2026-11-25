const prisma = require("../data/prisma");
const { token, validarHash, criarHash } = require("../middleware/auth");

const login = async (req, res) => {
    const { login, senha } = req.body;
    try {
        const usuario = await prisma.usuario.findFirst({
            where: {
                login: login,
            }
        });

        if (!usuario) {
            return res.status(401).json({ message: 'Credenciais inválidas!' });
        } else {
            const senhaValidada = await validarHash(senha, usuario.senha);
            if (!senhaValidada) {
                return res.status(401).json({ message: 'Credenciais inválidas!' }).end();
            }
            const bearer = token(usuario.id, usuario.nome, usuario.login);
            res.status(200).json({ "Bearer Token": bearer, usuario });
        }
    } catch (err) {
        res.status(500).json({ message: 'Erro interno do servidor', error: err.message });
    }
}

const cadastrar = async (req, res) => {
    const data = req.body;
    data.senha = await criarHash(req.body.senha);
    const item = await prisma.usuario.create({
        data
    });

    res.json(item).status(201).end();
};

const listar = async (req, res) => {
    const lista = await prisma.usuario.findMany();

    res.json(lista).status(200).end();
};

const buscar = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.usuario.findUnique({
        where: { id: Number(id) }
    });

    res.json(item).status(200).end();
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    const dados = req.body;
    if (dados.senha != undefined) dados.senha = await criarHash(req.body.senha);
    const item = await prisma.usuario.update({
        where: { id: Number(id) },
        data: dados
    });

    res.json(item).status(200).end();
};

const excluir = async (req, res) => {
    const { id } = req.params;

    const item = await prisma.usuario.delete({
        where: { id: Number(id) }
    });

    res.json(item).status(200).end();
};

module.exports = {
    login,
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir
}
