import express from "express";
import pool from "../config/db.js";

const route = express.Router();

// Recupera as publicações para a página inicial.
export async function listarPosts() {
    const [rows] = await pool.execute(
        `SELECT id, titulo, autor, data, categoria, resumo, conteudo
         FROM posts
         ORDER BY id ASC`
    );

    return rows;
}

// Mantém a navegação atual do menu para a seção do blog na landing page.
route.get("/blog", (req, res) => {
    res.redirect("/#blog");
});

export default route;
