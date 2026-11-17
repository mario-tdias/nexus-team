import express from "express";
import pool from "../config/db.js";
import { listarPosts } from "./BlogController.js";
import Auth from "../middlewares/Auth.js";
import Admin from "../middlewares/Admin.js";

const route = express.Router();

// Página principal: carrega membros e publicações diretamente do banco.
route.get("/", async (req, res, next) => {
    try {
        const [membros] = await pool.execute(
            `SELECT id, nome, iniciais, cargo, descricao, imagem,
                    github, linkedin, portfolio
             FROM membros
             ORDER BY id ASC`
        );

        const posts = await listarPosts();

        return res.render("index", {
            title: "Nexus | Equipe",
            membros,
            posts
        });
    } catch (error) {
        return next(error);
    }
});

// A estrutura enviada não contém uma view membros.ejs; direciona para a seção da equipe.
route.get("/membros", (req, res) => res.redirect("/#equipe"));

// Formulário de cadastro de integrante.
route.get("/membros/cadastrar", Auth, Admin, (req, res) => {
    res.render("MembrosCadastrar");
});

// Insere um integrante.
route.post("/membros/cadastrar", Auth, Admin, async (req, res, next) => {
    try {
        const {
            nome,
            iniciais,
            cargo,
            descricao,
            imagem,
            github,
            linkedin,
            portfolio
        } = req.body;

        if (!nome?.trim() || !iniciais?.trim() || !cargo?.trim()) {
            return res.status(400).send("Preencha nome, iniciais e cargo.");
        }

        await pool.execute(
            `INSERT INTO membros
                (nome, iniciais, cargo, descricao, imagem, github, linkedin, portfolio)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nome.trim(),
                iniciais.trim(),
                cargo.trim(),
                descricao?.trim() || null,
                imagem?.trim() || null,
                github?.trim() || null,
                linkedin?.trim() || null,
                portfolio?.trim() || null
            ]
        );

        return res.redirect("/#equipe");
    } catch (error) {
        return next(error);
    }
});

// Abre o formulário de edição.
route.get("/membros/editar/:id", Auth, Admin, async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).send("Identificador de integrante inválido.");
        }

        const [rows] = await pool.execute(
            "SELECT * FROM membros WHERE id = ? LIMIT 1",
            [id]
        );

        if (!rows.length) {
            return res.status(404).send("Integrante não encontrado.");
        }

        return res.render("MembrosEditar", { membro: rows[0] });
    } catch (error) {
        return next(error);
    }
});

// Atualiza um integrante.
route.post("/membros/alterar", Auth, Admin, async (req, res, next) => {
    try {
        const {
            id,
            nome,
            iniciais,
            cargo,
            descricao,
            imagem,
            github,
            linkedin,
            portfolio
        } = req.body;

        const membroId = Number(id);
        if (!Number.isInteger(membroId) || membroId <= 0) {
            return res.status(400).send("Identificador de integrante inválido.");
        }

        if (!nome?.trim() || !iniciais?.trim() || !cargo?.trim()) {
            return res.status(400).send("Preencha nome, iniciais e cargo.");
        }

        const [result] = await pool.execute(
            `UPDATE membros
             SET nome = ?, iniciais = ?, cargo = ?, descricao = ?, imagem = ?,
                 github = ?, linkedin = ?, portfolio = ?, updatedAt = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
                nome.trim(),
                iniciais.trim(),
                cargo.trim(),
                descricao?.trim() || null,
                imagem?.trim() || null,
                github?.trim() || null,
                linkedin?.trim() || null,
                portfolio?.trim() || null,
                membroId
            ]
        );

        if (!result.affectedRows) {
            return res.status(404).send("Integrante não encontrado.");
        }

        return res.redirect("/#equipe");
    } catch (error) {
        return next(error);
    }
});

// Mantida como GET para ser compatível com os links já existentes em MembrosEditar.ejs.
// Em uma evolução futura, o ideal é trocar a exclusão para POST ou DELETE.
route.get("/membros/excluir/:id", Auth, Admin, async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).send("Identificador de integrante inválido.");
        }

        const [result] = await pool.execute(
            "DELETE FROM membros WHERE id = ?",
            [id]
        );

        if (!result.affectedRows) {
            return res.status(404).send("Integrante não encontrado.");
        }

        return res.redirect("/#equipe");
    } catch (error) {
        return next(error);
    }
});

export default route;
