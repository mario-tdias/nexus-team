import express from "express";
import bcrypt from "bcrypt";
import pool from "../config/db.js";

const router = express.Router();

// Formulário de login.
router.get("/login", (req, res) => {
    res.render("login");
});

// Encerra a sessão.
router.get("/logout", (req, res, next) => {
    if (!req.session) return res.redirect("/");

    req.session.destroy(error => {
        if (error) return next(error);
        res.clearCookie("nexus.sid", { path: "/" });
        return res.redirect("/");
    });
});

// Autenticação por e-mail e senha.
router.post("/autenticar", async (req, res, next) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const password = req.body.password || "";

        if (!email || !password) {
            return res.status(400).render("loginInvalido");
        }

        const [rows] = await pool.execute(
            "SELECT id, email, password, ADM FROM usuarios WHERE email = ? LIMIT 1",
            [email]
        );

        if (!rows.length) {
            return res.status(401).send(
                'Usuário não encontrado. Verifique os dados e tente novamente. <a href="/login">Voltar</a>'
            );
        }

        const usuario = rows[0];
        const senhaCorreta = await bcrypt.compare(password, usuario.password);

        if (!senhaCorreta) {
            return res.status(401).render("loginInvalido");
        }

        // Regenera o ID da sessão após o login para reduzir risco de session fixation.
        return req.session.regenerate(error => {
            if (error) return next(error);

            req.session.user = {
                id: usuario.id,
                email: usuario.email,
                ADM: Number(usuario.ADM)
            };

            return req.session.save(saveError => {
                if (saveError) return next(saveError);
                return res.redirect("/");
            });
        });
    } catch (error) {
        return next(error);
    }
});

// Formulário de cadastro. Novas contas começam sem permissão administrativa.
router.get("/cadastro", (req, res) => {
    res.render("cadastro", { loggedOut: true });
});

router.post("/cadastro/novo", async (req, res, next) => {
    try {
        const email = req.body.email?.trim().toLowerCase();
        const password = req.body.password || "";

        if (!email || !password) {
            return res.status(400).send("Informe e-mail e senha.");
        }

        if (password.length < 8) {
            return res.status(400).send("A senha deve possuir pelo menos 8 caracteres.");
        }

        const [existing] = await pool.execute(
            "SELECT id FROM usuarios WHERE email = ? LIMIT 1",
            [email]
        );

        if (existing.length) {
            return res.status(409).send(
                'Usuário já cadastrado. <a href="/login">Voltar ao login</a>'
            );
        }

        const hash = await bcrypt.hash(password, 10);

        await pool.execute(
            "INSERT INTO usuarios (email, password, ADM) VALUES (?, ?, 0)",
            [email, hash]
        );

        return res.redirect("/login");
    } catch (error) {
        // Também trata uma tentativa simultânea de cadastrar o mesmo e-mail.
        if (error.code === "ER_DUP_ENTRY") {
            return res.status(409).send(
                'Este e-mail já está cadastrado. <a href="/login">Voltar ao login</a>'
            );
        }
        return next(error);
    }
});

export default router;
