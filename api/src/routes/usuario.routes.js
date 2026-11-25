const express = require("express");
const router = express.Router();
const {
    login,
    cadastrar,
    listar,
    buscar,
    atualizar,
    excluir } = require("../controllers/usuario.controller");
const { valida } = require("../middleware/auth");

router.post("/login", login);
router.post("/cadastrar", cadastrar);
router.get("/listar", valida, listar);
router.get("/buscar/:id", valida, buscar);
router.put("/atualizar/:id", valida, atualizar);
router.delete("/excluir/:id", valida, excluir);

module.exports = router;
