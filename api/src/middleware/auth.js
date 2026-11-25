const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require('bcrypt');

// Criar um token
const token = (id, nome, login) => {
    const bearer = jsonwebtoken.sign(
        {
            id: id,
            nome: nome,
            login: login
        },
        process.env.JWT_SECRET,
        { expiresIn: "30min" }
    );
    return bearer
}

// Middleware para validar o token recebendo o token no cabeçalho
const valida = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).send({ message: "Acesso negado. Nenhum token válido." });
    }
    try {
        const payload = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        req.headers['user'] = payload;
        next();
    } catch (err) {
        return res.status(401).send({ message: "Token inválido ou expirado." });
    }
}

//Criar um hash da senha Usado na criação de usuário e no login
const criarHash = async (senha) => {
    if (!senha) return null;
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(senha, salt);
        return hash;
    } catch (error) {
        console.error('Erro ao criar hash:', error);
        throw new Error('Erro ao criar hash');
    }
}

//Validar a senha do usuário Usado no login
const validarHash = async (frase, hash) => {
    if (!frase || !hash) return false;
    try {
        return await bcrypt.compare(frase, hash);
    } catch (error) {
        console.error('Erro ao validar frase:', error);
        throw new Error('Erro ao validar frase');
    }
}

module.exports = {
    token,
    valida,
    criarHash,
    validarHash
};
