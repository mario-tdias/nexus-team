import "dotenv/config";
import express from "express";
import session from "express-session";
import path from "node:path";
import { fileURLToPath } from "node:url";

import MySQLSessionStore from "./config/MySQLSessionStore.js";
import pool from "./config/db.js";
import BlogController from "./controllers/BlogController.js";
import MembrosController from "./controllers/MembrosController.js";
import UsuariosController from "./controllers/UsuariosController.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.SESSION_SECRET) {
    throw new Error("Defina SESSION_SECRET no arquivo .env e nas variáveis da Vercel.");
}

// A Vercel termina HTTPS no proxy; trust proxy permite reconhecer o protocolo original.
app.set("trust proxy", 1);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname, "public")));

app.use(session({
    name: "nexus.sid",
    secret: process.env.SESSION_SECRET,
    store: new MySQLSessionStore(),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL),
        sameSite: "lax",
        maxAge: 60 * 60 * 1000
    }
}));

app.use((req, res, next) => {
    res.locals.usuario = req.session?.user || null;
    next();
});

// Rota simples para testar se a aplicação e a conexão com o banco estão disponíveis.
app.get("/health", async (req, res, next) => {
    try {
        await pool.query("SELECT 1");
        return res.status(200).json({ status: "ok", database: "connected" });
    } catch (error) {
        return next(error);
    }
});

app.use("/", BlogController);
app.use("/", MembrosController);
app.use("/", UsuariosController);

app.use((req, res) => {
    res.status(404).send("Página não encontrada.");
});

app.use((error, req, res, next) => {
    console.error("Erro na aplicação Nexus:", error);

    if (res.headersSent) return next(error);

    return res.status(500).send(
        "Ocorreu um erro interno. Verifique a configuração da aplicação e do banco de dados."
    );
});

// Local: inicia o servidor HTTP. Vercel: utiliza o export default app.
if (!process.env.VERCEL) {
    const port = Number(process.env.PORT || 8080);
    app.listen(port, () => {
        console.log(`Nexus disponível em http://localhost:${port}`);
    });
}

export default app;
